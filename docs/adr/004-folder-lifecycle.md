# ADR-004: Folder lifecycle — block+retry first run, prompt re-link when missing

Date: 2026-10-11
Status: Accepted (grill-with-docs round 2+3)

## Context
DB in app-data points at chosen folder (ADR-003). Folder can be cancelled at first run, or moved/renamed/deleted later.

## Decision
- **First run, dialog cancelled/closed: block + retry.** Empty state forces folder pick; no feed access, no temp/ephemeral mode, app does not quit by itself.
- **Folder missing on later launch (moved/renamed/deleted): prompt re-link.** Repair dialog to pick folder again (or same path recreated). DB rows preserved; new posts blocked until re-linked.
- No auto-recreate at old path (rejected — hides user intent). No read-only feed fallback in MVP (rejected — confusing half-state).

## Consequences
- Need startup check: `settings.chosen_folder` exists + writable? If not → blocking modal.
- Re-link must validate new folder, keep UUID image refs working (images are under old folder — if user picks a *different* folder, existing image paths break; MVP: re-link expects same/restored folder, else images show broken. Document this).
- Alternatives deferred: auto-recreate, temp mode.

## Open follow-ups
- What if user picks an entirely new empty folder on re-link — migrate old images or show broken? Needs decision before build.
