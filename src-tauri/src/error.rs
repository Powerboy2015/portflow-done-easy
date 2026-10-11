//! Crate-level error type for the entry store.
//!
//! Carries structured failures from SQLite up to the Tauri command
//! boundary, where they are flattened to strings for the frontend.

/// Failures from the entry store.
///
/// Rendered with `to_string()` at the Tauri command boundary, so each
/// variant message must make sense on its own in the UI logs.
#[derive(Debug, thiserror::Error)]
pub enum DbError {
    /// The embedded migrations could not be applied at startup.
    #[error("failed to apply database migrations: {0}")]
    Migrate(#[from] sqlx::migrate::MigrateError),
    /// Any SQLite failure (connect, query, constraint violation).
    #[error("database error: {0}")]
    Sqlx(#[from] sqlx::Error),
    /// The app-data directory could not be created.
    #[error("failed to prepare database directory: {0}")]
    Io(#[from] std::io::Error),
    /// Entry text was blank after trimming.
    #[error("entry text must not be empty")]
    EmptyText,
}
