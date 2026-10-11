# Glossary — portflow-done-easy (living doc, grill-with-docs)

Updated: 2026-10-11. Source of truth for LEF set: https://lef.hu.nl/ (AGENT.md).

## Core domain
- **Proof (bewijs)**: one daily-log entry. Target shape per ADR-001: optional text + 1..N copied images, ≥1 of the two required. Currently text-only and text-required (images not built yet); persisted entries are called **entries** in the backend. Has `created_at` (auto now, set by Rust), 0..n tags, soft-delete flag.
- **Composer**: top-of-feed input. Text area + competency hover-dropdown + [Toevoegen] button. Submit disabled while text is blank or a save is in flight; backend failures show an inline error. (No image picker yet — see ADR-001.)
- **Feed**: chronological list, newest-first. Shows all proofs (filtered view when tags selected). Hides soft-deleted. Each card has a delete ([x]) button behind a confirm dialog.
- **Filter**: OR-matching tag row + `zonder tag` pseudo-chip + clear. Session-only (in-memory, resets on launch). Empty = show all. Not built yet — see ADR-002.
- **Competency (competentie)**: one of 10 LEF skills. Stored as stable slug, displayed as NL label.
- **Tag**: link proof ↔ competency slug. 0..n per proof. Slugs: `overzicht-creeren`, `kritisch-oordelen`, `juiste-kennis-ontwikkelen`, `kwalitatief-product-maken`, `plannen`, `boodschap-delen`, `samenwerken`, `flexibel-opstellen`, `pro-actief-handelen`, `reflecteren`.
- **Zonder tag**: pseudo-filter for untagged proofs. Not a real LEF tag.
- **Niveau 1-4**: per-competency level descriptions. Hardcoded, hidden in MVP UI.

## Storage
- **Entry**: the persisted form of a proof (backend `Entry`: id, trimmed text, tag slugs, `created_at` epoch millis). Commands: `create_entry` / `list_entries` / `delete_entry`.
- **EntryStore**: backend trait behind the Tauri commands; `SqliteStore` is the SQLite implementation. Lets storage be swapped without touching commands.
- **PostBackend**: frontend seam (`TauriBackend` / `SessionBackend`, selected once). Browser dev runs session-only.
- **Chosen folder (gekozen map)**: user-picked directory on first run. Will contain `proofs/<uuid>.<ext>` copies once images land. Not implemented yet.
- **App-data**: Tauri app-data dir holding SQLite DB. Survives folder moves (pointer goes stale → re-link).
- **Copy-in**: import semantics — picked images are copied into chosen folder, never linked to original path.
- **Soft-delete**: `deleted_at IS NOT NULL` → hidden, files kept. No MVP restore UI.
- **Re-link**: repair flow when chosen folder is missing: ask user to pick folder again.

## UI / product
- **Brutalist 2000s**: mono-first, square corners, visible borders, `[brackets]`, stamps like `TS.AI.0S1`, Tailwind v4 utilities. Inspired by typesafe.ai.
- **Titlebar**: custom frameless window bar (`decorations: false`) replacing the native Windows titlebar. Drag-to-move (native region + `startDragging` fallback), double-click toggles maximize, min/max/close buttons.
- **Dutch chrome**: all buttons/placeholders/filters in NL.
- **PDE tone**: "What's on your mind" equivalent in PDE voice (exact string TBD — e.g. "Waar heb je vandaag aan gewerkt?").

## Explicit non-goals (MVP)
- No edit, no auth, no sync, no mobile, no thumbnails, no backdate, no filter persistence, no Niveau UI. Minimal soft-delete is the sole exception (ADR-005).
- Not yet built (decided, pending): image proofs, chosen-folder pick + re-link, tag filter row, settings content.
