# portflow-done-easy (PDE)

Facebook "what's on your mind"-style daily log for study proofs. Desktop app built with Tauri v2 + React 19 + TypeScript + Vite. UI chrome in Dutch; code and docs in English.

## Status

Working: composer (text + competency tags), newest-first feed persisted in SQLite, soft-delete with confirm, custom frameless titlebar. Not yet built: image proofs, chosen-folder flow, tag filter row, settings page content.

## Commands

- `npm install` — install frontend deps
- `npm run dev` — vite only (session-only mode, no backend)
- `npm run build` — `tsc && vite build`
- `npm run tauri dev` — full desktop dev (SQLite backend active)
- `npm run tauri build` — bundle
- `cargo check` (in `src-tauri/`) — quick Rust check
- `cargo test` (in `src-tauri/`) — Rust unit tests
- `cargo clippy --all-targets --locked -- -D warnings` (in `src-tauri/`) — lint

## Structure

- `src/` — React frontend: `components/` (view), `hooks/` (state), `api/` (Tauri `invoke` wrappers + session fallback)
- `src-tauri/` — Rust backend: entry store (`store` trait + `sqlite_store`), Tauri commands, SQL migrations
- `docs/` — domain glossary + architecture decision records (ADRs)
- `AGENT.md` — binding project rules for agents (read before coding)
