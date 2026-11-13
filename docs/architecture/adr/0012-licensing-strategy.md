# ADR-0012 — Licensing strategy

- Status: **proposed** (decision by Jean Balin, with legal counsel — see ADR-0009)
- Date: 2026-11-11
- Not legal advice. No licence text has been reviewed by a lawyer.

## Context
Current position (ADR-0001, AGENTS.md rule 1, brief, README): all code MIT, server included, "no capped self-hosting". Business model A (market-offer-study): 100 % MIT + subscription + certified partners. Concern raised 2026-11-11: with MIT, any host can resell Ubao, and in the AI era "speed of execution" is a weak moat. Nothing is public yet and there are no external contributors, so changing the licence is free **now** and impossible for released versions later. Contribution policy is currently DCO (no relicensing right).

## Threat model
- Large cloud reselling Ubao: low probability in the African target markets in the short term.
- Local hoster/integrator reselling without paying: plausible, but also the intended partner channel.
- AI-assisted clone: not stopped by any licence in practice.
- Real defences available regardless of licence: trademark and naming policy, certified/signed builds, LTS and security advisories, hosting and compliance relationships, support responsibility, community.

## Options
| # | Option | Protects against hosters | OSI open source | Key costs |
|---|---|---|---|---|
| A | MIT everywhere (current) | no | yes | strongest procurement/open-source story; weak monetisation lever |
| B | MIT core + commercial modules limited to **reseller/hosting features** (multi-tenant partner mode FR11.3, fleet admin, metering, large-scale white-label FR11.4) | yes, targeted | core yes; modules no | "100 % MIT" claim must be rewritten; boundary must be precise; CLA or contributor carve-out needed |
| C | AGPL-3.0 server + commercial licence (dual) | yes (copyleft over network use) | yes | CLA required; some public buyers avoid AGPL; the dependency rule (no AGPL deps) is unaffected but must be restated for our own licence |
| D | Source-available (FSL/BSL) converting to MIT/Apache after 2 years | yes, time-limited | **no** | conflicts with open-source-first procurement signals (EU) and our positioning |
| E | Apache-2.0 instead of MIT (patent grant) | no | yes | orthogonal; may be combined with A or B |

## Recommendation (to validate with counsel)
Option **B**: everything an organisation needs to host Ubao **for itself** stays MIT (docs, canvas, sync, offline, SSO, audit, self-hosting without caps). Only features whose purpose is **operating Ubao as a service for third parties** are commercial. Fall back to **C** if a single OSI-approved licence is preferred. Reject D. Always publish a **trademark policy** ("Ubao" name and logo are not licensed by MIT) and file the mark (OAPI, ARIPO, EUIPO) before launch.

> **2026-11-11 — ADR-0016** : le mainteneur a retenu A + E pour le code ouvert (MIT OR Apache-2.0). L'option B (modules commerciaux) n'est pas adoptée par cette décision ; reste ouvert : CLA vs DCO, et tout module commercial éventuel (décision séparée).

## Decisions needed
1. Licence model (A/B/C/D, plus MIT vs Apache-2.0 for the open part).
2. Contribution agreement: **CLA** (required for B/C or later relicensing) vs **DCO** (current). Must be decided before the first external contribution.
3. Exact boundary of commercial modules, written into the repo (a `LICENSING.md`) and mirrored in the pricing page.
4. Impact on the dependency allow-list (AGENTS.md rule 2 stays; rule 1 "MIT for all code" must be rewritten).

## Decision
_pending_

## Consequences
- Update AGENTS.md, README, brief, PRD NFR-L1, market-offer-study (model A/C), ADR-0001, marketing copy (S-14.x) after the decision.
- Add `LICENSING.md`, trademark policy, and SPDX headers per file/package.
- Partner programme (master-plan §6) gains a licence/fee component under B.
- Blocks: making the repository public, accepting external contributions, paid partner tier.
