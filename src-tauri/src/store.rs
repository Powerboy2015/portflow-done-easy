//! Entry storage abstraction.
//!
//! Tauri commands depend only on the [`EntryStore`] trait, never on a
//! concrete backend, so storage can be swapped without touching them
//! (dependency inversion). The SQLite backend lives in
//! [`crate::sqlite_store`].

use std::collections::HashSet;
use std::future::Future;
use std::pin::Pin;

use crate::error::DbError;

/// A stored journal entry with its tags.
///
/// Serialized camelCase for the TypeScript `Post` shape (`createdAt`).
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Entry {
    /// Row id, ascending with insertion order.
    pub id: i64,
    /// Entry body, stored trimmed.
    pub text: String,
    /// Competency tag slugs, deduplicated.
    pub tags: Vec<String>,
    /// Creation time as epoch millis (UTC).
    pub created_at: i64,
}

/// Boxed sendable future returned by [`EntryStore`] methods.
///
/// Native `async fn` is not object-safe, so backends box their async body
/// instead. Same effect as the `async_trait` macro without the dependency;
/// the single allocation per call is noise next to a SQLite round-trip.
pub type EntryFuture<'a, T> = Pin<Box<dyn Future<Output = T> + Send + 'a>>;

/// Storage backend contract for journal entries.
///
/// Object-safe and `Send + Sync` so backends can be shared behind
/// `Arc<dyn EntryStore>` in Tauri managed state.
pub trait EntryStore: Send + Sync {
    /// Store a new entry with its tags.
    ///
    /// # Errors
    ///
    /// Returns [`DbError::EmptyText`] when `text` is blank after trimming.
    fn create_entry<'a>(
        &'a self,
        text: &'a str,
        tags: &'a [String],
    ) -> EntryFuture<'a, Result<Entry, DbError>>;

    /// List live entries newest-first, each with its tags.
    ///
    /// # Errors
    ///
    /// Returns [`DbError::Sqlx`] on any storage failure.
    fn list_entries<'a>(&'a self) -> EntryFuture<'a, Result<Vec<Entry>, DbError>>;

    /// Soft-delete an entry. Returns `true` when a live entry was hidden.
    ///
    /// # Errors
    ///
    /// Returns [`DbError::Sqlx`] on any storage failure.
    fn delete_entry<'a>(&'a self, id: i64) -> EntryFuture<'a, Result<bool, DbError>>;
}

/// Trimmed text plus cleaned tags: tags are trimmed, empties dropped,
/// duplicates removed with first-seen order kept.
///
/// # Errors
///
/// Returns [`DbError::EmptyText`] when `text` is blank after trimming.
/// Tags are optional (0..n, see ADR-002), so an empty tag list is fine.
pub(crate) fn normalize(text: &str, tags: &[String]) -> Result<(String, Vec<String>), DbError> {
    let trimmed = text.trim();
    if trimmed.is_empty() {
        return Err(DbError::EmptyText);
    }
    let mut seen = HashSet::new();
    let cleaned: Vec<String> = tags
        .iter()
        .map(|tag| tag.trim())
        .filter(|tag| !tag.is_empty())
        .filter(|tag| seen.insert(*tag))
        .map(|tag| tag.to_owned())
        .collect();
    Ok((trimmed.to_owned(), cleaned))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn normalize_should_reject_blank_text() {
        let result = normalize("   ", &["planning".to_owned()]);
        assert!(matches!(result, Err(DbError::EmptyText)));
    }

    #[test]
    fn normalize_should_trim_text_and_clean_tags() {
        let (text, tags) = normalize(
            "  did things  ",
            &[
                " plannen ".to_owned(),
                String::new(),
                "plannen".to_owned(),
                "reflecteren".to_owned(),
            ],
        )
        .unwrap();
        assert_eq!(text, "did things");
        assert_eq!(tags, vec!["plannen".to_owned(), "reflecteren".to_owned()]);
    }

    #[test]
    fn normalize_should_allow_zero_tags() {
        let (text, tags) = normalize("untagged entry", &[]).unwrap();
        assert_eq!(text, "untagged entry");
        assert!(tags.is_empty());
    }
}
