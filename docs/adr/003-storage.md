# ADR-003: Storage — app-data SQLite (sqlx) + pointer, copy-in images as UUID

Date: 2026-10-11
Status: Accepted (grill-with-docs round 1+4)
Amends: AGENT.md "Storage (decided)" — clarifies DB location + access method.

## Context
AGENT.md: user chooses folder first run (Tauri dialog); SQLite refers to folder + proofs; images stay as files in/near chosen folder; no server/cloud/ORM without asking. Open: DB inside folder vs app-data, copy vs link, naming, Rust access lib, schema shape.

## Decision
- **DB lives in Tauri app-data**, stores pointer to chosen folder + all proof metadata. NOT inside chosen folder.
- **Rust access via sqlx (raw, no ORM)**, normalized schema:
  - `proofs(id, text, created_at, deleted flag — see ADR-005)`
  - `proof_images(id, proof_id, file_path, position)`
  - `proof_tags(proof_id, tag_slug)` join table
  - `settings(key, value)` — at minimum `chosen_folder`.
- **Images: COPY IN** on post into `<chosen-folder>/proofs/<uuid>.<ext>`. Keep original extension, UUID filename. No thumbnails in MVP (full-size only in feed).
- No ORM (sqlx query macros/raw only). No server DB / sync. Propose-first rule still applies for any new crate (sqlx + sqlite driver needs explicit approval before `cargo add`).

## Consequences
- Move-with-data is NOT automatic: DB stays behind if folder moves (needs re-link, see ADR-004).
- Import cost: copy time + disk duplication, but immune to original deletion/move.
- UUID names avoid collisions, no duplicate detection (hash-based dedup rejected for simplicity).
- sqlx chosen over rusqlite (user pick); over single-table+JSON (normalization keeps OR-filter queries simple).

## Open follow-ups
- Exact app-data path per OS via Tauri path API.
- Migration story if user wants portable DB later.
- Needs user approval to add `sqlx` + `tauri-plugin-sql`/`tauri-plugin-dialog`/`tauri-plugin-fs` per AGENT.md rule 2.
