# Decisions needed from the maintainer

Owner: Jean Balin. Prepared 2026-11-11 by AR2 (architecture). Development starts **Friday 13 Nov 2026** (S0), S1 and S2 follow; the master plan counts weeks from Mon 16 Nov, so S0 effectively runs 13–29 Nov. Nothing below is decided; every ADR stays `proposed` until recorded here and in its file.

Legend — **Deadline**: latest moment without delaying work. **Wait?**: can it wait past the start of development (13 Nov) without cost.

## A. Needed before or during week 1 (13–20 Nov)

| ID | Decision | Recommendation | Blocks | Deadline | Wait? |
|---|---|---|---|---|---|
| D-1 | **Licensing model** (ADR-0012): A MIT everywhere / B MIT core + commercial reseller modules / C AGPL dual / D source-available; MIT vs Apache-2.0 | B, validated with counsel; if counsel not reachable, **keep the repository private** and keep MIT headers | making the repo public (planned W1–2), external contributions, SPDX headers in S0 scaffold, PRD NFR-L1, AGENTS.md rule 1 wording | before the first public push (target ≤ 27 Nov); the S0 scaffold can proceed with MIT/SPDX | Yes, if repo stays private |
| D-2 | **CLA vs DCO** (ADR-0012) | CLA if B or C is chosen, DCO if A | first external contribution, CONTRIBUTING.md | before the repo is public | Yes (no external contributors yet) |
| D-3 | **Project name** Ubao (vs Ndaje / Lisanga; crates currently `wiro-*`, plugin SDK `ubao-*`) — Swahili native check, trademark search, GitHub org `ubaohq`, domain | validate in W1; **decide the crate/package prefix now** (recommend `ubao-` for new crates, rename `wiro-*` in S0 before code exists) to avoid a rename later | S0 scaffold names, public repo/org, trademark filing (OAPI/ARIPO/EUIPO), landing page | before S0 scaffold is merged (~20 Nov) | Name validation can wait; the prefix cannot |
| D-4 | **Licence gate: allow `Unicode-3.0`** (ICU4X, unicode-normalization data; ADR-0007) | allow (it is permissive; add to deny.toml and AGENTS.md allow-list) | `cargo deny` config in Story 0.2 | S0 (Story 0.2) | No |
| D-5 | **Object store shipped by default**: MinIO is AGPL-3.0 (conflicts with AGENTS.md rule 2 if bundled) → SeaweedFS (Apache-2.0) or disk adapter by default; MinIO only customer-installed | SeaweedFS in compose/Helm, disk adapter for Tier S; document S3 compatibility for customer stores | `deploy/compose`, ADR-0005/0011 wording | before Story 11.1; the dev compose in S0/S1 can use any store locally | Yes (until S1 compose) |
| D-6 | **S0 date/capacity acceptance**: master plan says date moves before scope (v1.0 ≈ 16 weeks vs "3 months") | confirm: scope fixed (AGENTS.md rule 3), date floats; track by burn-down | expectations in marketing/pilots | W1 | Yes |

## B. Needed during S0–S2 (before the sprint that depends on it)

| ID | Decision | Recommendation | Blocks | Deadline | Wait? |
|---|---|---|---|---|---|
| D-7 | **Colour direction A Malachite vs B Indigo Adire** (A/B test with 5–8 users, `docs/ux/color-analysis-africa.md`) | A (default in brand-charter), B kept as comparison; decide after A0 test | tokens in `design/tokens/`, S1 chrome skeleton, landing | before S1 chrome (≈ 27 Nov); a neutral placeholder theme works until then | Yes, until S1 |
| D-8 | **ADR-0004 renderer** (vello_gpu primary + vello_cpu fallback + custom wgpu escape hatch) | accept after Story 0.4 bench | S2 canvas engine | end of S0 (≈ 29 Nov) | Yes (data-driven) |
| D-9 | ~~ADR-0008 mobile shell vs PRD native mobile~~ | **RESOLVED 2026-11-11**: no native mobile apps; responsive web (ADR-0015 supersedes 0008) | closed |
| D-10 | **Go/no-go Loro + loro-prosemirror** (Story 0.5; fallback own binding) | decide from spike | S1 editor | end of S0 | Yes (spike result) |
| D-11 | **ADR-0010 plugin system** (client iframes + server WASM + MCP; manifest; tiers). Open questions: Verified review capacity (community reviewers?), official non-Rust languages for v1, Figma/Miro API terms, paid plugins deferred | accept options 1+2+5; Rust + JS only for v1 server plugins; trusted-publisher programme for Verified; check Figma/Miro terms during S1 | Story 14.1 (S4), manifest schema, WIT, ADR-0013 §10 | end of S2 (≈ 6 Dec ... before S3 planning) | Yes, until S3 |
| D-12 | **ADR-0011 deployment**: accept 3 tiers. Open: (1) local-disk blobs supported in production? (2) Postgres customer-provided vs CloudNativePG by default, (3) multi-tenant model → see D-15, (4) backup orchestration + restore-test cadence, (5) migration rollback / protocol compatibility window, (6) CMK in v1?, (7) HA topology limits, (8) client signing/update channel | accept Option 1; (1) disk = Tier S production up to 50 users; (2) ship CloudNativePG by default, customer DB supported; (4) pg_dump + versioned S3 snapshots, restore drill monthly + release gate; (5) N-1 compatibility, forward-only migrations with tested backups; (6) CMK per-tenant later (after v1), envelope encryption with local keyring now; (7) measure in sync load tests | `deploy/*`, Stories 11.1–11.3 | before S7 (≈ 28 Dec) | Yes |
| D-13 | **Tenancy migrations seam**: write migrations tenant-aware from S1 (single `default` tenant) | accept the seam (cheap now, costly later) even if ADR-0014 is not accepted | S1 storage layout | S1 start | Partly: only the seam |

## C. Can wait (decide before the stated milestone)

| ID | Decision | Recommendation | Blocks | Deadline | Wait? |
|---|---|---|---|---|---|
| D-14 | **ADR-0007 search** (own index + shared normaliser; tantivy server). Replica question: per-node derived index (ADR-0007 says derived/rebuilt) | accept option C after spike | S6 offline search | before S6 (≈ 8 Feb) | Yes |
| D-15 | **ADR-0014 multi-tenancy**: schema-per-tenant default + database-per-tenant for dedicated; partner module placement (MIT vs commercial); white-labelled signed apps in v1.x?; support-access default (`ask`); cross-tenant identity later | accept the recommendation; module placement follows D-1 | partner programme, Story 11.4 extension, FR11.3 stories | before the partner programme (≈ Q1 2027) | Yes |
| D-16 | **ADR-0013 AI and agents**: keep E10 post-v1? pull MCP server into v1.x? retention default (0 days)? "apply directly" tokens (off by default)? provider matrix? semantic search out of scope? | post-v1, MCP server first; retention 0; no direct-apply by default; tested matrix Ollama + vLLM + one OpenAI-compatible | EP15 stories (to create), FR8.3 scope | before the post-v1 planning | Yes |
| D-17 | **ADR-0009 legal entity & billing** (country, merchant of record, currencies, mobile money rails, OSS foundation vs commercial entity, store accounts) — counsel call in W1–2 | no recommendation (business decision); Mauritius/Senegal/CI comparison with counsel | paid tiers, store publishing under an entity, public-sector contracts, trademark filing | before store submission (S8) and first paid customer | Yes (does not block S0–S2) |
| D-18 | Pricing grid NGN/KES (XOF ≈ 2 000/editor decided), partner programme terms, first Team Cloud countries, trademark filings (OAPI/ARIPO/EUIPO) (PRD §8) | follow master-plan §6 (SN, CI, KE) | pricing page (EP13), partner pages | before pricing page (≈ Feb 2027) | Yes |
| D-19 | Public marketplace opened at launch or allow-list/private mirror only | allow-list/mirror for sovereign; Community tier public from v1.x | Story 14.3/14.4 scope | before S8 | Yes |

## D. Contradictions found in the cohesion review (AR2)

Resolved by AR2 (edits made):
- R-1 Architecture §17 listed only 4 ADRs; now §23 covers 0001–0014 and states which are accepted vs proposed.
- R-2 Architecture §7 said compose ships MinIO; now "S3-compatible store or disk adapter" with the AGPL note (D-5).
- R-3 Architecture had no sections for deployment, plugins, AI/MCP, tenancy, licensing, import/export; added §17–§22.
- R-4 ADR-0011 listed MinIO as a neutral S3 example; annotated AGPL-3.0 (minor factual correction). ADR-0005 gets the same note.
- R-5 PRD NFR-O1 ("100 % features offline except sharing/permissions changes and AI") vs UX 15 (offline desktop with local model works): resolved in ADR-0013 §11 as "AI offline only with a configured local model"; wording to apply in the PRD by the product owner.

Open (need maintainer or another file owner):
| ID | Contradiction | Where | Proposed resolution | Owner |
|---|---|---|---|---|
| C-1 | **"MIT for all code"** (AGENTS.md rule 1, PRD NFR-L1, ADR-0001, UX S-11.5 "no feature lock in Community (MIT)") vs ADR-0012 option B | AGENTS.md, PRD, ADR-0001 | wait for D-1; then reword all in one pass | maintainer |
| C-2 | ~~Mobile: PRD native vs ADR-0008 PWA~~ | **RESOLVED 2026-11-11**: ADR-0015, PRD §6 updated | closed |
| C-3 | **Name**: crates `wiro-*` (architecture, ADRs, project-structure) vs product name Ubao and `ubao-*` in ADR-0010/0013/0014 and plugin SDKs | many files | see D-3; use one prefix before S0 scaffold | maintainer |
| C-4 | **AI scope**: PRD E10 and FR10.x are "optional" while FR8.3 MCP is `[ASSUMPTION]`; epics put E10 post-v1 but UX 15 specifies it in full and server admin S-11.6 shows an AI endpoint | PRD, epics, UX | ADR-0013 provides the spec; PRD removes the assumption tag once D-16 is decided; add EP15 post-v1 | PRD/stories owner |
| C-5 | **Multi-tenant**: PRD FR11.3/FR11.4 and UX S-11.4 exist but epics have only Story 11.4 (white-label); no story for tenants, quotas, impersonation | PRD, epics | add post-v1 stories (see ADR-0014 Consequences) or mark FR11.3 post-v1 explicitly in epics coverage map | stories owner |
| C-6 | **Plugin timing**: master plan puts plugin host in S4, SDK/CLI S5 while ADR-0010 is only proposed and the mandatory import/export plugins (E8 in the v1 gate) depend on it | master plan, epics EP14, PRD §6 | D-11 by end of S2; exporters (Markdown/JSON/PDF/PNG) must not be blocked if plugin host slips | maintainer |
| C-7 | **Server "stateless"** (architecture §3) vs embedded per-node `tantivy` index (ADR-0011) | architecture §3, ADR-0011 | index is derived data rebuilt from storage (ADR-0007) → still stateless in the durable sense; state it explicitly when ADR-0007 is accepted | AR2 follow-up |
| C-8 | **Dates**: "development starts Fri 13 Nov" vs master plan "weeks from Mon 16 Nov" | master plan | treat 13–15 Nov as S0 day 0 (repo prep); no change to the plan needed | maintainer |
| C-9 | **Implementation-readiness** (2026-11-10) predates ADR-0010–0014 and the EP14 stories; verdict still CONCERNS | implementation-readiness.md | refresh after D-1…D-5 | stories/gov owner |
| C-10 | **ADR-0001** consequences still say "framework and CRDT to decide in dedicated ADRs" although ADR-0002/0003 are accepted | ADR-0001 | harmless; fix wording after D-1 (the licence decision may amend ADR-0001 anyway) | AR2 follow-up |

## E. Minimum to decide before Friday 13 Nov
Nothing technical is strictly blocking S0 day 1. To avoid rework: **D-3 (crate prefix)**, **D-4 (Unicode-3.0)**, and the **decision to keep the repository private** until D-1/D-2 are settled. Everything else can wait for its stated deadline.
