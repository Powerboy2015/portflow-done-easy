# ADR-002: Tags optional, OR filter, explicit 'zonder tag'

Date: 2026-10-11
Status: Accepted (grill-with-docs round 1+3)

## Context
AGENT.md: 1..n of 10 LEF competencies per proof, OR filter. Open: mandatory vs optional, where untagged proofs appear when filtering.

## Decision
- **Zero tags allowed.** Tags fully optional. Composer can post with 0 tags.
- No block on tagless post; UX may nudge but never require.
- Feed filter = **OR**: proof matches if it contains ANY selected tag.
- Untagged proofs: **hidden when any tag filter is active**, visible when filter empty — PLUS an explicit **`zonder tag` toggle** to show only untagged proofs when desired.
- Tag slugs stable (AGENT.md list), NL labels in UI.

## Consequences
- Filter row needs 10 tag chips + `zonder tag` chip + clear-all.
- Empty filter = show all (tagged + untagged), newest-first.
- `zonder tag` is mutually combinable? MVP: selecting it shows untagged; combining with tags = (tagged-match OR untagged). Keep simple: OR across all selected including the pseudo-tag.
- Alternatives rejected: require ≥1 tag (friction, user chose zero-allowed).

## Open follow-ups
- Decide exact chip interaction for `zonder tag` + tags combo in UI build.
