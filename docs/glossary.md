# Glossary — portflow-done-easy (living doc, grill-with-docs)

Updated: 2026-10-11. Source of truth for LEF set: https://lef.hu.nl/ (AGENT.md).

## Core domain
- **Proof (bewijs)**: one daily-log entry = optional text + 1..N copied images, ≥1 of the two required. Unit of the feed. Has `created_at` (auto now), 0..n tags, soft-delete flag.
- **Composer**: top-of-feed input. Text area + multi-image picker + tag chips + Post button. Blocks only when text empty AND zero images.
- **Feed**: chronological list, newest-first. Shows all proofs (filtered view when tags selected). Hides soft-deleted.
- **Filter**: OR-matching tag row + `zonder tag` pseudo-chip + clear. Session-only (in-memory, resets on launch). Empty = show all.
- **Competency (competentie)**: one of 10 LEF skills. Stored as stable slug, displayed as NL label.
- **Tag**: link proof ↔ competency slug. 0..n per proof. Slugs: `overzicht-creeren`, `kritisch-oordelen`, `juiste-kennis-ontwikkelen`, `kwalitatief-product-maken`, `plannen`, `boodschap-delen`, `samenwerken`, `flexibel-opstellen`, `pro-actief-handelen`, `reflecteren`.
- **Zonder tag**: pseudo-filter for untagged proofs. Not a real LEF tag.
- **Niveau 1-4**: per-competency level descriptions. Hardcoded, hidden in MVP UI.

## Storage
- **Chosen folder (gekozen map)**: user-picked directory on first run. Contains `proofs/<uuid>.<ext>` copies. Path stored in DB settings. Blocking pick (no cancel-skip), re-link prompt if missing.
- **App-data**: Tauri app-data dir holding SQLite DB. Survives folder moves (pointer goes stale → re-link).
- **Copy-in**: import semantics — picked images are copied into chosen folder, never linked to original path.
- **Soft-delete**: `deleted_at IS NOT NULL` → hidden, files kept. No MVP restore UI.
- **Re-link**: repair flow when chosen folder is missing: ask user to pick folder again.

## UI / product
- **Brutalist 2000s**: mono-first, square corners, visible borders, `[brackets]`, stamps like `TS.AI.0S1`, plain CSS, no framework. Inspired by typesafe.ai.
- **Dutch chrome**: all buttons/placeholders/filters in NL.
- **PDE tone**: "What's on your mind" equivalent in PDE voice (exact string TBD — e.g. "Waar heb je vandaag aan gewerkt?").

## Explicit non-goals (MVP)
- No edit, no auth, no sync, no mobile, no thumbnails, no backdate, no filter persistence, no Niveau UI. Minimal soft-delete is the sole exception (ADR-005).
