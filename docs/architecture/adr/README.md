# ADR index

Status as of 2026-11-11. "Blocks" = what cannot start (or cannot be finalised) before the ADR is accepted. All "proposed" ADRs need a decision by Jean Balin; nothing is marked accepted without it. Pending decisions with deadlines: `../decisions-needed.md`.

| # | Title | Status | Depends on | Blocks |
|---|---|---|---|---|
| 0000 | Template | — | — | — |
| 0001 | Rust core, MIT licence | accepted (licence clause under review by 0012) | — | 0012 may amend it |
| 0002 | UI shell: Tauri 2 + TS chrome + Rust/WASM engines | accepted | 0001 | 0004, 0015 |
| 0003 | CRDT engine: Loro | accepted | 0001 | 0006, sync (S3), 0013 (suggestion model) |
| 0004 | Canvas rendering (vello_gpu / vello_cpu / wgpu) + bench | proposed | 0002 | S2 canvas engine (before S2) |
| 0005 | Server storage: PostgreSQL + S3-compatible | accepted | 0001 | 0011, 0014 |
| 0006 | Docs editor: ProseMirror + loro-prosemirror | accepted | 0003 | S1/S3 editor (spike Story 0.5 validates) |
| 0007 | Client search (own index, tantivy server) | proposed | 0003, 0005 | S6 offline search; licence gate `Unicode-3.0` |
| 0008 | Mobile shell (PWA first, Tauri 2 mobile, TWA) | superseded by 0015 | 0002, 0004 | — |
| 0009 | Legal / billing entity | proposed (questions only) | — | paid tiers, store publishing, public contracts, trademark filing |
| 0010 | Plugin & extension system, certification, mandatory plugins | proposed | 0002, 0012 (contribution policy) | EP14 (Story 14.1 in S4), 0013 §10 |
| 0011 | Deployment & operations (3 tiers) | proposed | 0005 | Stories 11.1/11.2 (S8), `deploy/*`, 0014 placement |
| 0012 | Licensing strategy | proposed | 0001, 0009 | making the repo public, external contributions, partner tier, 0014 module boundary |
| 0013 | AI and agents (BYO model, MCP server/client) | proposed | 0010, 0011, 0003 | post-v1 EP15 AI stories; FR8.3 MCP |
| 0014 | Multi-organisations (partner mode), tenant model | proposed | 0005, 0011, 0012 | post-v1 partner tooling; migrations layout awareness in S1 |
| 0015 | Responsive web, no native mobile apps | accepted (2026-11-11) | 0002 | EP12 = responsive web; stories 0.4 (desktop only), 0.4c dropped |
| 0016 | Licence du code : MIT OR Apache-2.0 | accepted (2026-11-11) | 0001, 0012 | amends 0001; CLA vs DCO still open (0012) |

## Reading order for a new contributor
0001 → 0002 → 0003 → 0005 → 0006 → 0004 → 0011 → 0010 → 0012 → 0013 → 0014.

## Conventions
- New ADR from `0000-template.md`; status `proposed` until the maintainer records a decision and date in the file and in this table.
- A superseded ADR stays in place with status `superseded by NNNN`.
