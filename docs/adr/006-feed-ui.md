# ADR-006: Feed + UI — newest-first auto-now, session-only filter, Dutch chrome, Niveau hidden

Date: 2026-10-11
Status: Accepted (grill-with-docs round 2+4)

## Context
Open: feed order, timestamp editability, filter persistence, UI language, Niveau 1-4 display, brutalist constraints (AGENT.md).

## Decision
- **Feed: newest-first, `created_at = now()` auto-set.** No backdate/date picker in MVP. No oldest-first diary mode.
- **Filter state: in-memory only (session).** Reset to empty (show all) on each launch. No DB/settings persistence.
- **UI chrome in Dutch** (composer placeholder = PDE-tone "Waar ben je mee bezig?" equivalent, buttons/filters NL). LEF labels already NL.
- **Niveau 1-4: hardcoded in code per AGENT.md, but NOT shown in MVP UI.** No tooltip, no overview page, no link-out yet. Data ready for later.
- Brutalist 2000s per AGENT.md (mono, brackets, square, plain CSS) unchanged.

## Consequences
- Proof entity needs `created_at` set server-side (Rust) at insert, not user-editable.
- Filter component is uncontrolled-persistent: `useState`, no localStorage/DB write.
- i18n: no framework; hardcoded Dutch strings.
- Niveau data still must be hardcoded (NL names + descriptions + Niveau 1-4) even though unrendered — keeps source-of-truth rule.

## Open follow-ups
- Backdate feature → backlog (diary use-case: "what you did today" vs "when you posted").
- Niveau tooltip + Competenties overview + lef.hu.nl link → backlog.
- Pagination/virtualization: undecided; revisit when feed grows (no-caps images make this load-bearing).
