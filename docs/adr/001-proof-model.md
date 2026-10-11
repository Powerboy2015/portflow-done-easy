# ADR-001: Proof model — text and/or images, multiple images, no caps in MVP

Date: 2026-10-11
Status: Accepted (grill-with-docs round 1+3)

## Context
AGENT.md: each proof = text and/or image. Text is often description of image when image present; when no image, text itself is the proof. At least one of text/image required. Open: 1 vs N images, types/sizes, max length.

## Decision
- Proof = `text (optional) + 1..N images (optional)`, with constraint **at least one of text / ≥1 image required**.
- **Multiple images allowed** per proof (not single-image-only).
- **No caps in MVP**: no enforced max chars, image count, file size, or type whitelist. Accept what OS/Tauri dialog allows.
- Validation only: block post when both text empty/whitespace AND zero images.

## Consequences
- Composer must support multi-file pick + preview + remove-before-post.
- DB needs `proof_images` 1:N table (see ADR-003), ordering column for images.
- Risk: huge posts (e.g. 50x 50MB) can bloat folder/DB. Accepted for MVP; add caps later if painful.
- Alternatives rejected: single-image-only (too limiting, user wants multiple proofs per day); light caps (2000 chars / 4 imgs / 10MB) — deferred, no evidence of need yet.

## Open follow-ups
- If abuse/perf issues appear, introduce caps + type whitelist (png/jpg/webp/gif).
- Thumbnails deferred (see ADR-003: full-size only).

## Implementation status (2026-10-11)
- Images not built yet: composer is text-only and text-required for now. The `proof_images` table and copy-in flow land with the image feature.
