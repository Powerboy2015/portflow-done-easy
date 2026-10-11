# ADR-005: Minimal soft-delete as safety valve (amends "no edit/delete")

Date: 2026-10-11
Status: Accepted (grill-with-docs round 2+3)
Amends: AGENT.md "MVP scope = composer + feed + filter only. No edit/delete"

## Context
AGENT.md MVP excluded edit/delete. Grill surfaced mistake recovery: wrong text/tags/images with no mutation = permanent pollution.

## Decision
- **Scope change: add minimal DELETE, no edit in MVP.** Correction-post-only rejected as insufficient.
- **Soft-delete**: `proofs.deleted_at` (or `is_deleted`) flag; hidden from feed; row + image files retained on disk.
- No undo toast in MVP. Delete requires confirm dialog. No restore UI in MVP (recoverable later via DB flag).
- No edit. Follow-up corrections are new proofs.

## Consequences
- All feed queries filter `WHERE deleted_at IS NULL`.
- Hard-delete (row + files) explicitly rejected for MVP — safer against accidental loss.
- AGENT.md line "No edit/delete" must be updated to "No edit; minimal soft-delete only".
- Alternatives rejected: hard+confirm (data loss), hard+undo window (extra complexity).

## Open follow-ups
- Restore/undelete UI → backlog.
- Purge (hard-delete) job → backlog.

## Implementation status (2026-10-11)
- Live: `delete_entry` command sets `deleted_at`; feed hides soft-deleted rows; each card has an [x] button behind a confirm dialog. No restore UI, as decided.
