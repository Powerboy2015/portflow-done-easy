//! SQLite backend for the [`EntryStore`](crate::store::EntryStore) trait.
//!
//! Raw sqlx, no ORM (see ADR-003). Timestamps are epoch millis in
//! `INTEGER` columns, so no datetime crate is needed. Connection setup
//! lives in [`SqliteStore::connect`]; entry operations implement
//! [`EntryStore`](crate::store::EntryStore).

use std::collections::HashMap;
use std::path::Path;

use sqlx::Row;
use sqlx::sqlite::{SqliteConnectOptions, SqlitePool, SqlitePoolOptions};

use crate::error::DbError;
use crate::store::{Entry, EntryFuture, EntryStore, normalize};

static MIGRATOR: sqlx::migrate::Migrator = sqlx::migrate!("./migrations");

/// SQLite implementation of [`EntryStore`](crate::store::EntryStore),
/// backed by a connection pool.
#[derive(Debug, Clone)]
pub struct SqliteStore {
    pool: SqlitePool,
}

impl SqliteStore {
    /// Open (creating if needed) the database file at `db_path` and apply
    /// pending embedded migrations.
    ///
    /// # Errors
    ///
    /// - Returns [`DbError::Io`] if the parent directory cannot be created.
    /// - Returns [`DbError::Sqlx`] if the file cannot be opened.
    /// - Returns [`DbError::Migrate`] if migrations fail.
    pub async fn connect(db_path: &Path) -> Result<Self, DbError> {
        if let Some(parent) = db_path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        // `busy_timeout` makes concurrent readers/writers wait instead of
        // failing instantly with SQLITE_BUSY.
        let options = SqliteConnectOptions::new()
            .filename(db_path)
            .create_if_missing(true)
            .busy_timeout(std::time::Duration::from_secs(5));
        let pool = SqlitePoolOptions::new().connect_with(options).await?;
        migrate(&pool).await?;
        Ok(Self { pool })
    }

    /// Wrap an existing pool without running migrations.
    ///
    /// Test-only: tests migrate an in-memory pool explicitly.
    #[cfg(test)]
    pub fn from_pool(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

impl EntryStore for SqliteStore {
    fn create_entry<'a>(
        &'a self,
        text: &'a str,
        tags: &'a [String],
    ) -> EntryFuture<'a, Result<Entry, DbError>> {
        Box::pin(async move {
            let (text, tags) = normalize(text, tags)?;
            let created_at = now_millis();
            // One transaction: a tag failure must not leave an orphan entry.
            let mut tx = self.pool.begin().await?;
            let id = sqlx::query("INSERT INTO entries (text, created_at) VALUES (?, ?)")
                .bind(&text)
                .bind(created_at)
                .execute(&mut *tx)
                .await?
                .last_insert_rowid();
            for tag in &tags {
                sqlx::query("INSERT OR IGNORE INTO entry_tags (entry_id, tag_slug) VALUES (?, ?)")
                    .bind(id)
                    .bind(tag)
                    .execute(&mut *tx)
                    .await?;
            }
            tx.commit().await?;
            Ok(Entry {
                id,
                text,
                tags,
                created_at,
            })
        })
    }

    fn list_entries<'a>(&'a self) -> EntryFuture<'a, Result<Vec<Entry>, DbError>> {
        Box::pin(async move {
            let rows = sqlx::query(
                "SELECT id, text, created_at FROM entries
             WHERE deleted_at IS NULL ORDER BY id DESC",
            )
            .fetch_all(&self.pool)
            .await?;

            // Tags ride along in one extra query (no N+1), grouped in memory.
            let tag_rows = sqlx::query(
                "SELECT entry_id, tag_slug FROM entry_tags
             WHERE entry_id IN (SELECT id FROM entries WHERE deleted_at IS NULL)",
            )
            .fetch_all(&self.pool)
            .await?;

            let mut tags_by_entry: HashMap<i64, Vec<String>> = HashMap::new();
            for tag_row in &tag_rows {
                tags_by_entry
                    .entry(tag_row.try_get("entry_id")?)
                    .or_default()
                    .push(tag_row.try_get("tag_slug")?);
            }

            rows.iter()
                .map(|row| {
                    let id: i64 = row.try_get("id")?;
                    Ok(Entry {
                        tags: tags_by_entry.remove(&id).unwrap_or_default(),
                        id,
                        text: row.try_get("text")?,
                        created_at: row.try_get("created_at")?,
                    })
                })
                .collect()
        })
    }

    fn delete_entry<'a>(&'a self, id: i64) -> EntryFuture<'a, Result<bool, DbError>> {
        Box::pin(async move {
            let affected = sqlx::query(
                "UPDATE entries SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL",
            )
            .bind(now_millis())
            .bind(id)
            .execute(&self.pool)
            .await?
            .rows_affected();
            Ok(affected > 0)
        })
    }
}

/// Apply pending embedded migrations to an open pool.
///
/// Split from [`SqliteStore::connect`] so tests can migrate an
/// in-memory pool.
async fn migrate(pool: &SqlitePool) -> Result<(), DbError> {
    MIGRATOR.run(pool).await?;
    Ok(())
}

/// Current time as epoch millis (UTC).
fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_or(0, |elapsed| {
            i64::try_from(elapsed.as_millis()).unwrap_or(i64::MAX)
        })
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;

    fn test_store() -> SqliteStore {
        tauri::async_runtime::block_on(async {
            let pool = SqlitePoolOptions::new()
                .max_connections(1)
                .connect("sqlite::memory:")
                .await
                .unwrap();
            migrate(&pool).await.unwrap();
            SqliteStore::from_pool(pool)
        })
    }

    #[test]
    fn store_should_be_usable_behind_trait_object() {
        // Commands only see `dyn EntryStore`; this locks in that seam.
        let store: Arc<dyn EntryStore> = Arc::new(test_store());
        tauri::async_runtime::block_on(async {
            let entry = store
                .create_entry("via trait", &["plannen".to_owned()])
                .await
                .unwrap();
            let entries = store.list_entries().await.unwrap();
            assert_eq!(entries.len(), 1);
            assert_eq!(entries[0], entry);
            assert!(store.delete_entry(entry.id).await.unwrap());
            assert!(store.list_entries().await.unwrap().is_empty());
        });
    }

    #[test]
    fn create_should_store_text_and_tags() {
        let store = test_store();
        let entry = tauri::async_runtime::block_on(async {
            store
                .create_entry("  first entry  ", &["plannen".to_owned()])
                .await
                .unwrap()
        });
        assert_eq!(entry.text, "first entry");
        assert_eq!(entry.tags, vec!["plannen".to_owned()]);
        assert!(entry.created_at > 0);
    }

    #[test]
    fn create_should_reject_blank_text() {
        let store = test_store();
        let result = tauri::async_runtime::block_on(async { store.create_entry("   ", &[]).await });
        assert!(matches!(result, Err(DbError::EmptyText)));
    }

    #[test]
    fn list_should_return_newest_first_with_tags() {
        let store = test_store();
        tauri::async_runtime::block_on(async {
            store.create_entry("older", &[]).await.unwrap();
            store
                .create_entry("newer", &["samenwerken".to_owned()])
                .await
                .unwrap();
            let entries = store.list_entries().await.unwrap();
            assert_eq!(entries.len(), 2);
            assert_eq!(entries[0].text, "newer");
            assert_eq!(entries[0].tags, vec!["samenwerken".to_owned()]);
            assert_eq!(entries[1].text, "older");
            assert!(entries[1].tags.is_empty());
        });
    }

    #[test]
    fn delete_should_hide_entry_from_list() {
        let store = test_store();
        tauri::async_runtime::block_on(async {
            let entry = store.create_entry("doomed", &[]).await.unwrap();
            assert!(store.delete_entry(entry.id).await.unwrap());
            assert!(!store.delete_entry(entry.id).await.unwrap());
            assert!(store.list_entries().await.unwrap().is_empty());
        });
    }

    #[test]
    fn delete_should_return_false_for_unknown_id() {
        let store = test_store();
        let deleted =
            tauri::async_runtime::block_on(async { store.delete_entry(999).await.unwrap() });
        assert!(!deleted);
    }
}
