//! portflow-done-easy backend: entry store behind Tauri commands.

mod error;
mod sqlite_store;
mod store;

use std::sync::Arc;

use tauri::Manager;

use sqlite_store::SqliteStore;
use store::{Entry, EntryStore};

/// Shared backend behind the commands.
///
/// Commands only see the [`EntryStore`] trait, so the storage backend can
/// be swapped without touching them.
pub struct AppState {
    store: Arc<dyn EntryStore>,
}

/// Store a new entry with 0..n competency tag slugs.
///
/// Text is trimmed; blank text is rejected. Tags are trimmed, empties
/// dropped, duplicates removed.
#[tauri::command]
async fn create_entry(
    state: tauri::State<'_, AppState>,
    text: String,
    tags: Vec<String>,
) -> Result<Entry, String> {
    state
        .store
        .create_entry(&text, &tags)
        .await
        .map_err(|err| err.to_string())
}

/// List live entries newest-first, each with its tags.
#[tauri::command]
async fn list_entries(state: tauri::State<'_, AppState>) -> Result<Vec<Entry>, String> {
    state
        .store
        .list_entries()
        .await
        .map_err(|err| err.to_string())
}

/// Soft-delete an entry. Returns `true` when a live entry was hidden.
#[tauri::command]
async fn delete_entry(state: tauri::State<'_, AppState>, id: i64) -> Result<bool, String> {
    state
        .store
        .delete_entry(id)
        .await
        .map_err(|err| err.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let db_path = app.path().app_data_dir()?.join("pde.sqlite");
            let store: Arc<dyn EntryStore> = Arc::new(tauri::async_runtime::block_on(
                SqliteStore::connect(&db_path),
            )?);
            app.manage(AppState { store });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_entry,
            list_entries,
            delete_entry
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
