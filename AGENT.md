# AGENT.md — portflow-done-easy (PDE)

## Project

PDE is a Facebook "what's on your mind"-style daily log for study proofs.

## Design specs (binding)

Detailed MVP decisions live in `docs/` — read them before coding, they override this file on conflict:
- `docs/glossary.md` — domain language (proof, composer, feed, filter, zonder tag, chosen folder, etc.)
- `docs/adr/001-proof-model.md` — text + 1..N images, no caps, at-least-one required
- `docs/adr/002-tags-filter.md` — 0..n tags, OR filter, `zonder tag` toggle
- `docs/adr/003-storage.md` — app-data SQLite via sqlx (raw, no ORM), copy-in `proofs/<uuid>.<ext>`
- `docs/adr/004-folder-lifecycle.md` — block+retry first run, prompt re-link when missing
- `docs/adr/005-delete.md` — minimal soft-delete only (amends no-edit/delete), no edit
- `docs/adr/006-feed-ui.md` — newest-first auto-now, session-only filter, Dutch chrome, Niveau hidden

Core loop (MVP):
1. Type what you did today (composer text — required if no image, optional if image present).
2. Optionally upload 1..N pictures / pieces of proof (ADR-001, no caps in MVP).
3. Tag 0..n of the 10 LEF competencies (tags optional, ADR-002).
4. Appears in a newest-first feed (auto `created_at = now()`), filterable by competency tag(s) OR + `zonder tag` (ADR-002, ADR-006).

Proof model: each proof = optional text + 1..N images, at least one of text / ≥1 image required. See ADR-001. Text is often a description of the image(s) when image(s) present; when no image, text itself is the proof.

MVP scope = composer + feed + filter + minimal soft-delete only. No edit, no auth, no sync, no mobile. See ADR-005.

## The 10 competencies (source of truth: https://lef.hu.nl/)

Hardcode the full LEF set in code (NL names + descriptions + Niveau 1-4). Do not fetch at runtime. Link out to lef.hu.nl for details.

Productvaardigheden:
1. `overzicht-creeren` — Overzicht creëren — methodisch relevante info verzamelen, onderzoeksvragen, vereisten.
2. `kritisch-oordelen` — Kritisch oordelen — keuzes onderbouwen, valide conclusies, evalueren.
3. `juiste-kennis-ontwikkelen` — Juiste kennis ontwikkelen — leerdoelen/leerplan, betrouwbare bronnen, toepassen.
4. `kwalitatief-product-maken` — Kwalitatief product maken — vereisten toepassen, ontwerpkeuzes onderbouwen, overdraagbaar.

Sociale vaardigheden:
5. `plannen` — Plannen — eigen/gezamenlijk werk plannen, bijsturen, capaciteit.
6. `boodschap-delen` — Boodschap delen — doelgericht overbrengen, afstemmen op publiek, feedback verwerken.
7. `samenwerken` — Samenwerken — rol kennen, afspraken nakomen, feedback geven/ontvangen.
8. `flexibel-opstellen` — Flexibel opstellen — aanpassen, doorzetten, meebewegen bij verandering.
9. `pro-actief-handelen` — Pro-actief handelen — zelf regie, initiatief zonder aanwijzingen, effect laten zien.
10. `reflecteren` — Reflecteren — terugkijken op handelen, feedback + actiepunten + ontwikkeldoelen.

Rules for tags (see ADR-002):
- 0..n tags per proof (tags optional, multiple allowed).
- Store tags as stable slugs above, display NL labels in UI.
- Feed filter matches proofs containing any selected tag (OR).
- Untagged proofs visible when filter empty; explicit `zonder tag` toggle shows only untagged.
- Filter state is session-only (in-memory, resets on launch).
- Niveau 1-4 text lives with the competency definition, not per post. Hardcode it but do NOT render in MVP UI (no tooltip/overview yet, ADR-006).

## Storage (decided — see ADR-003, ADR-004)

- User chooses a folder on first run (Tauri dialog). Cancel → block + retry (no temp mode, no quit).
- SQLite DB lives in Tauri app-data (not inside chosen folder), stores `chosen_folder` pointer + proofs metadata (file paths, not blobs).
- Rust access via sqlx raw, no ORM. Normalized: `proofs` / `proof_images` / `proof_tags` / `settings`.
- Images are COPIED into `<chosen-folder>/proofs/<uuid>.<ext>` (keep extension, UUID name). Full-size only, no thumbnails in MVP.
- Folder missing on launch → prompt re-link repair dialog; block new posts until re-linked.
- Do not introduce a server DB, cloud sync, or ORM without asking first.

## UI — brutalist 2000s, inspired by https://typesafe.ai/ (see ADR-006)

- Raw, high-contrast, monospace-first, visible borders, square corners, no gradients/shadows.
- Dense text layout, system/mono fonts, explicit `[brackets]`, version stamps like `TS.AI.0S1` are welcome.
- Facebook-like composer on top (Dutch PDE tone, e.g. "Waar heb je vandaag aan gewerkt?"), feed below (newest-first), tag filter row (10 chips + `zonder tag` + clear).
- UI chrome in Dutch. LEF labels already NL.
- Soft-delete needs confirm dialog; no undo toast, no restore UI in MVP (ADR-005).
- No UI framework / CSS library in MVP — plain CSS only unless permission granted.

## Stack / Languages

- Desktop app built with Tauri v2 (mobile possible later, explicitly not a prio).
- Backend: Rust in `src-tauri/` (`src/main.rs`, `src/lib.rs`, `tauri.conf.json`, `Cargo.toml`).
- Frontend: React 19 + TypeScript + Vite in `src/` (`App.tsx`, `main.tsx`, `App.css`), npm manager.
- App meta: `productName: portflow-done-easy`, `identifier: com.portflow.doneeasy`, devUrl `http://localhost:1420`, `frontendDist: ../dist`.

Commands:
- `npm install` — install frontend deps
- `npm run dev` — vite only
- `npm run build` — `tsc && vite build`
- `npm run tauri dev` — full desktop dev
- `npm run tauri build` — bundle
- `cargo check` (in `src-tauri/`) — quick Rust check

## Rules (binding for all agents)

1. DO NOT make any assumptions. When anything is unclear, ask for clarification first and wait.
2. DO NOT add tools on your own without asking for permission first. This includes Rust crates, Tauri plugins, dev tools, CLIs, and services. Propose first, implement only after explicit approval.
3. NPM packages are allowed to be added, but ask first. Same propose-then-approve flow. No silent `npm install <x>`.

When you need something new, state: what, why, alternatives considered, and what changes (files/deps/permissions). Do not proceed until the user says yes.
