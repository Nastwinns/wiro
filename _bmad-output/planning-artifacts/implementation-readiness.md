---
title: Implementation readiness check
date: 2026-11-11
supersedes: 2026-11-10 check
verdict: CONCERNS (GO for Story 0.1 to 0.3 on Friday 13 Nov; 0.4/0.5 and anything after S0 gated on decisions)
---

# Implementation readiness, verdict: **CONCERNS, conditional GO for S0 start**

Honest reading: planning is broad and consistent, but **no ADR beyond the first four is accepted**, the design is not produced in Penpot, and the per-story files depend on another agent's output. Friday can start with the scaffold and gates, not with product code.

| Domain | Status | Evidence and gap |
|---|---|---|
| Brief | OK | Complete (coaching round 1). Still says "100 % MIT"; to be revised after ADR-0012. |
| PRD | OK with assumptions | v0.2, FR/NFR set. Open: `[ASSUMPTION]` tags (pricing, sizing), NFR-L1 wording depends on licence decision, naming Wiro/Ubao mixed in title and inputs. |
| UX | Partial | UX spec and screens exist (incl. 15 AI, 16 plugins). No Penpot output (A vs B design system not run), so no visual source of truth for UI stories. |
| Architecture | Concerns | 4 ADRs accepted. Proposed: 0004 renderer, 0005..0012 mix. Real blockers are measurements (S0 spikes), not writing. architecture.md v0.2 covers API, sync, permissions, supply chain. |
| Epics | OK / refine | 15 epics (EP0..EP14), about 73 stories, FR coverage map complete. ACs are checklists, no estimates. EP14 adds capacity risk. |
| Stories (per-file) | Not verified | `_bmad-output/implementation-artifacts/stories/` did not exist when this check was run; being produced by another agent. Friday needs at least 0.1 to 0.3 as individual files. Only `sprint-status.yaml` exists. |
| Design | Partial | Tokens, contrast report, brand charter and logo exports exist; Penpot DS and screens not produced; tokens pipeline (Story 0.3) not built. |
| Plugins | Design only | ADR-0010 proposed, mandatory plugin list and tiers defined, EP14 stories present. No SDK/host. Open: Figma/Miro API terms, library licences (calamine, docx-rs, krilla ...), non-Rust language support. Not needed before S4. |
| Licences | Concerns | Code is MIT now. ADR-0012 proposed (A MIT / B MIT plus hoster modules / C AGPL / D source-available). Drafts now exist: LICENSING.md, trademark policy, CLA vs DCO, contributor agreement (all unreviewed by counsel). Dependency policy is clear. `Unicode-3.0` not in allow-list. Vendored agent skills licences listed but marked TODO before public push. |
| Deployment | Design only | ADR-0011 proposed; `deploy/` has compose, Helm chart skeleton and air-gap scripts written by parallel work, none tested. Not needed before S8 except for local dev compose. |
| CI | Minimal | Only markdown lint. No Rust/JS jobs, no cargo deny, no clean-room guard (see docs/plan/ci-proposals.md). Delivered by Story 0.1/0.2. |
| Dev tooling | Unverified | Local Qwen model on ws300 (192.168.31.99:8000/8001) was not reachable from the session that wrote this; must be tested from the dev machine (dev-kickoff.md §1). |

## Blocks Friday 13 Nov (must be done Thursday)
1. Individual story files for 0.1, 0.2 (and 0.3) in `implementation-artifacts/stories/` with explicit commands and ACs.
2. Local model reachable and tested from the dev machine, or fallback chosen (dev-kickoff.md §9).
3. Maintainer merges or rebases the pre-dev closure branch; CI on `main` green.
4. Decision on whether Story 0.2 ships a `deny.toml` allowing `Unicode-3.0` (can be deferred: 0.2 can ship without it and add it with 0.5).

## Blocks before S1 (by 29 Nov)
5. Story 0.5 spike result Loro + ProseMirror: go/no-go.
6. ~~ADR-0008 mobile shell~~ — superseded by ADR-0015 (responsive web, no native mobile); no longer a decision.
7. `Unicode-3.0` decision (ADR-0007).
8. ADR-0002 and ADR-0005 confirmed accepted for crates layout.

## Blocks before S2 (by 13 Dec)
9. ADR-0004 renderer from the perf bench protocol.

## Must be decided before the first external contribution or public push
10. ADR-0012 licence model, then DCO or CLA; trademark filing plan; resolve vendored-skills licence TODO; name validation (Ubao).

## Can wait
Penpot design system A/B and screens (needed from S1 chrome, tokens suffice for S0), ADR-0009 entity, ADR-0010 and 0011 details (S4 and S8), partner terms, pricing, Figma/Miro API terms, plugin language support beyond Rust, estimates per story.

## Risks (unchanged and confirmed)
Solo capacity versus scope incl. mobile and EP14; loro-prosemirror maturity; WKWebView canvas performance; review throughput as the real bottleneck with local models.

Next: confirm Friday prerequisites, run Story 0.1 with one agent, calibrate the local model, then continue per docs/plan/dev-kickoff.md.
