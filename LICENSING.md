# Licensing

> **UPDATE 2026-11-11 — decided: [ADR-0016](docs/architecture/adr/0016-dual-licence-mit-apache.md).** All code is MIT OR Apache-2.0 (dual, at the user's option); scenario A (no commercial modules) is retained, scenario B is **not adopted** (history below). CLA vs DCO is still open in ADR-0012. Nothing here has been reviewed by a lawyer and this is not legal advice.
>
> **Everything in this repository is under [MIT](LICENSE-MIT) OR [Apache-2.0](LICENSE-APACHE), at your option.** No commercial module exists. This file describes the two scenarios under consideration so that the decision, the pricing page and the contribution policy stay consistent.

## The two scenarios

### Scenario A: everything MIT
All code (client, server, plugins SDKs, deploy artefacts) stays MIT. Revenue comes from subscriptions, hosting, support, certified partners and the trademark. Anyone, including a hosting company, may resell Ubao as a service.

### Scenario B: MIT core plus commercial modules reserved for hosters
Everything an organisation needs to run Ubao **for itself** stays MIT. Only features whose purpose is **operating Ubao as a service for third parties** are under a commercial licence. The product promise becomes: "no cap, no paywall for your own organisation".

## Precise boundary (scenario B)

The test: *does this feature exist so that one operator can serve several unrelated customers (tenants), bill them, or resell the product under another brand?* If yes, it is a candidate commercial module. If it serves the users, admins or IT of a single organisation, it is MIT.

| Area | Scenario B status |
|---|---|
| Docs editor, canvas (Tableau), databases, wiki, offline, sync, comments, sharing, guest links | MIT |
| Local-first storage, CRDT, open format, search | MIT |
| Single-organisation server, admin console for one organisation, SSO (OIDC/SAML), RBAC, audit log, retention, CMK | MIT |
| Self-hosting without user, board or storage caps (compose, Helm, air-gapped bundle) | MIT |
| Mandatory plugins (imports and exports), plugin host, plugin SDKs, CLI, manifest format | MIT |
| Public API, webhooks, MCP, BYO-model AI | MIT |
| Multi-tenant partner mode (FR11.3): several isolated customer organisations on one deployment | Commercial candidate |
| Fleet administration across tenants, orchestrated upgrades, partner operator tooling | Commercial candidate |
| Usage metering and billing hooks per tenant | Commercial candidate |
| Large-scale white-label (custom brand on many tenants, FR11.4) | Commercial candidate |
| Name "Ubao", logo, "Certified" badges | Not licensed by MIT or by the commercial licence; see [trademark policy](docs/legal/trademark-policy.md) |

A single organisation with several internal workspaces or subsidiaries under one legal entity is **not** a reseller and stays on MIT features.

## What is MIT and what is not

| Item | Scenario A | Scenario B |
|---|---|---|
| Client apps (desktop, web, mobile) | MIT | MIT |
| Server, sync, storage, auth | MIT | MIT |
| Mandatory plugins and SDKs | MIT | MIT |
| Hoster modules (list above) | MIT | Commercial licence, source available to licensees |
| Documentation, tokens, design system | MIT | MIT |
| Name and logo | Trademark policy | Trademark policy |
| Third-party dependencies | Their own licence (allow-list: MIT, Apache-2.0, BSD, ISC, Zlib) | same |

## FAQ

**Can I self-host Ubao for my company or ministry?** Yes in both scenarios, with no caps.

**Can a local hosting company offer Ubao to its customers?** Scenario A: yes, freely. Scenario B: yes with the MIT features (one deployment per customer); multi-tenant and white-label tooling needs a partner agreement. This is also the intended certified-partner channel.

**Will the open part ever become closed?** Anything released under MIT stays MIT for that version, forever. A licence change can only apply to future versions and to new code.

**Why decide now?** Nothing is public and there are no external contributors, so the choice is free today. After the first external contribution under the DCO, relicensing needs every contributor's consent.

**Does the AGPL or a source-available licence appear here?** They are options C and D of the ADR (AGPL with dual licence, or FSL/BSL). They are not part of this draft; see the ADR.

**Do forks need permission?** Not for the code (MIT). A fork must not use the Ubao name or logo; see the trademark policy.

**Does this change the dependency rule?** No. Dependencies stay MIT / Apache-2.0 / BSD / ISC / Zlib only.

## Process
1. Maintainer decides in ADR-0012 (with counsel).
2. Then: update AGENTS.md rule 1bis, README, PRD NFR-L1, pricing copy, add SPDX headers.
3. Choose DCO or CLA **before the first external contribution** ([comparison](docs/legal/cla-vs-dco.md)).
