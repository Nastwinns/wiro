---
title: Competitive audit — pain points & anti-patterns
status: draft
created: 2026-11-10
method: Exa web research (G2, Capterra, Trustpilot syntheses, GitHub issues, Product Hunt, press, Reddit/X digests). Clean-room: functional observations only, no code.
---

# Competitive audit — pain points & how Wiro avoids them

## 1. Landscape

| Product | Model | License | Sovereign / self-host | Docs + canvas | Price signal |
|---|---|---|---|---|---|
| Miro | SaaS | Proprietary | Data residency only on Enterprise (30-seat min) | Canvas + bolted-on Docs/Tables | Free 3 boards · $8 / $20 / custom |
| AFFiNE | Local-first + cloud | Client MIT, server separate licence | Self-host via Docker, reported user caps on local instances | Yes (page ↔ edgeless) | Free 3 members / 3 devices |
| Collaboard | SaaS + on-prem | Proprietary | Yes (on-prem, air-gapped, K8s) — Swiss public sector refs | Canvas only | Enterprise quote |
| Conceptboard | SaaS + Data Center Ed. | Proprietary | Yes (EU hosting, air-gapped) | Canvas + review workflows | €5/user + long contracts |
| Notion | SaaS | Proprietary | No | Docs (no real canvas) | Per-seat + AI bundling |
| FigJam | SaaS | Proprietary | No | Canvas only | Tied to Figma seat |
| Excalidraw | OSS + Excalidraw+ | MIT | Editor yes; persistent collab = extra service / paid | Canvas only | Free / $6–7 |
| tldraw | SDK | Source-available, prod licence key | — | Canvas SDK | ~$6k/yr reported |
| Boardmix | SaaS | Proprietary | "Enterprise private deployment" | Canvas + light docs | $5 / lifetime deals |
| Whimsical, Mural, Lucidspark, Klaxoon | SaaS | Proprietary | No | Canvas-centric | $9–25/seat |

## 2. Pain points observed (and the Wiro answer)

| # | Pain point | Seen in | Evidence | Wiro rule (anti-pattern to avoid) |
|---|---|---|---|---|
| P1 | **Big boards lag / freeze**; perf degrades from ~1k objects, Miro advises < 5k | Miro, AFFiNE, FigJam, Mural | Miro Help Center; G2/Capterra; AFFiNE issue #14006 (32 GB RAM leak → crash) | Perf budget is a **product requirement**: 60 fps at 10k objects on a mid-range laptop, memory ceiling, viewport culling, LOD. Bench in CI. |
| P2 | **Data loss on crash before sync** | AFFiNE (#14006), Notion offline (template blocks lost) | GitHub issue, community reports | Local-first: every op persisted locally (WAL) **before** network. Crash-safe by design; restore tests in CI. |
| P3 | **Offline bolted on** (per-page opt-in, 50-row DB cap, embeds/AI off) | Notion | Notion help + engineering blog | Offline is the default state, not a mode. Whole workspace usable offline; sync is opportunistic. |
| P4 | **Hostile billing**: seats auto-added, view links trigger paid licences, opaque renewals | Miro (Trustpilot 2.2/5) | Stacko, ReviewCost, Toarn | Billing rules: only admins add paid seats; viewers/guests always free; no silent upgrades; monthly + quarterly options; transparent price page. |
| P5 | **Free tier cripples** (3 editable boards, older boards lock) | Miro, Mural, FigJam, Boardmix | Reviews | Individuals free & unlimited boards (personal use). Monetise teams/admin/sovereignty, not board count. |
| P6 | **SSO / audit / residency behind Enterprise + 30-seat min** | Miro | Toarn, SaaSFlags | Security basics (SSO/OIDC, audit log) available on the team tier; sovereignty sold as deployment, not ransom. |
| P7 | **"Open source" but server not free / caps on self-host** | AFFiNE, Excalidraw (persistent collab paid), tldraw | XDA, OpenTechHub, freealternatives | **Whole stack MIT**, client + server. No user caps in self-host. Revenue = support, managed hosting, certified builds, SLA. |
| P8 | **Clutter / navigation** on large canvases | Miro, Mural | G2 | Structure-first: frames, outline/minimap, search across canvas+docs, "focus mode", doc↔canvas linking. |
| P9 | **Feature sprawl** makes core UX heavier | Miro (Docs/Tables/Agile/AI), Notion | Reviews | Strict information architecture; progressive disclosure; extensions instead of core bloat. |
| P10 | **Mobile = view-only / cramped** | AFFiNE edgeless, Miro | XDA, G2 | Mobile/tablet editing in scope for canvas basics (sticky, draw, comment) — critical in mobile-first markets. |
| P11 | **Clunky AI UX**, AI credits gating, opaque overage | AFFiNE, Miro | Product Hunt, Techpresso | AI optional, BYO model (incl. local/self-hosted LLM), no credit system on self-host. Inline, not side-panel round-trips. |
| P12 | **Weak export / lock-in** (PDF = screenshot, bulk export hard) | AFFiNE, Miro, Notion | Reviews | Open file format (documented), full workspace export (MD + JSON + SVG/PDF real text), import from Miro/Excalidraw/Notion. |
| P13 | **Basic doc gaps** (find & replace, search, backlinks) | AFFiNE | Product Hunt, OpenTechHub | Doc editor baseline checklist must be met before "wow" features. |
| P14 | **Self-host is hard** for non-devs | AFFiNE, Excalidraw collab | Tooliverse | One-command install (single binary / compose / Helm), works on a $5 VPS, air-gapped bundle. |
| P15 | **Guests need accounts** | Whimsical, FigJam, Mural | Reviews | Link-based guest editing with optional name, no account. |
| P16 | **Facilitation tools paywalled** (timer, voting) | Miro, Mural | G2 | Basic facilitation included for everyone. |

## 3. Africa-specific pain points (not addressed by any incumbent)

| # | Pain point | Evidence | Wiro rule |
|---|---|---|---|
| A1 | **Card-only, USD pricing** — card penetration < 4% (credit) in 28 countries; trials die at paywall | Spotflow, Ultraner, sh0 | Local-currency prices, mobile money + bank transfer, quarterly/flexible billing. *(Payments not in MVP scope per decision; plan billing architecture for it.)* |
| A2 | **Data is expensive (~$5/GB)**, unstable connectivity, power cuts | A4AI via Breedj, Today Africa | Low-bandwidth mode: delta sync, compressed ops, lazy media, image downscaling, data-usage meter. |
| A3 | **Modest devices** | Today Africa, Miro help (older devices lag) | Perf targets on entry-level hardware (4 GB RAM, integrated GPU); Rust native client advantage. |
| A4 | **Sovereignty is now law/policy**: Kenya Cloud Policy 2025 (restricted data in-country), Nigeria NITDA 2026 guideline (Level 2+ data hosted in Nigeria, preference for indigenous CSPs), Kenya DPA serving-copy rule | ict.go.ke, nitda.gov.ng, Chambers | Deployable on local/indigenous clouds & gov data centres; customer-managed keys; audit log; partner model with local CSPs/integrators. |
| A5 | **Dollar cost squeeze** on local software firms (margins 45–55%) | ITWeb Africa | Lean infra (single binary, low RAM) → cheap to host for local partners. |
| A6 | **Language**: FR/EN at minimum, local languages | — | i18n + RTL-ready from day 1; FR/EN shipped; community translations (Wolof, Swahili, Hausa, Arabic…). |

## 4. Opportunity statement (draft)

No product today combines **(1)** docs + canvas, **(2)** a fully MIT stack including the server, **(3)** true local-first/offline and low-bandwidth operation, and **(4)** sovereign deployment that fits African cloud policies. Collaboard/Conceptboard prove governments buy sovereign whiteboards; AFFiNE proves demand for docs+canvas OSS but leaves self-host capped and stability weak; Miro leaves a trust gap on billing and performance.

## 5. Open questions for the brief
- Which 3 "must-win" workflows define the MVP (e.g. workshop/retro, product spec + diagram, gov planning session)?
- Target perf numbers and reference hardware.
- Pricing per seat in XOF/NGN/KES and sovereign deal structure (licence + support vs. managed).
- Go-to-market for governments: direct vs. via local CSP/integrator partners (Nigeria indigenous-CSP preference).

## Sources
- Miro: G2 reviews, Capterra reviews, Miro Help Center "Board performance", ReviewCost 2026, Stacko 2026, Toarn Q2 2026, Techpresso 2026, SaaSFlags.
- AFFiNE: GitHub issues (#14006 and Nov 2026 list), Product Hunt reviews, XDA (Jun 2026), OpenTechHub (Mar 2026), Tooliverse, Better Stack, freealternatives.to.
- Collaboard: Canton of Bern case study, public-sector & self-hosting pages. Conceptboard: public sector & Data Center Edition pages, IT.NRW whitepaper.
- Notion: Notion engineering blog (offline), Notion help, XDA (Aug & Nov 2026), latenode community.
- FigJam/Whimsical/Excalidraw/Boardmix: SelectHub, Mockflow, Rework, Boardmix blog, shouldiuse.io; tldraw licence: tldraw README, Quickdraw, meetrix.
- Africa: ict.go.ke Kenya Cloud Policy guidelines (Jun 2026), NITDA National Guideline for Cloud Computing 2026, FMCIDE Nigeria cloud policy (Aug 2026), Chambers Kenya 2026, ITWeb Africa (Oct 2026), Spotflow, Ultraner, sh0 blog, Breedj, Today Africa.

## Appendix — AFFiNE key figures (Exa, 11 Nov 2026)
| Item | Value | Source / confidence |
|---|---|---|
| Company | TOEVERYTHING PTE. LTD., Singapore, founded 2020 (repo Jul 2022) | affine.pro/about |
| Funding | $10M over 3 rounds incl. $8M Pre-A (Oct 2023; Redpoint China, Sinovation, CGC, MiraclePlus); data providers list up to $16M | PR Newswire 2023 (vendor) |
| Team | ~13 employees on LinkedIn (−19 % YoY); ~261 GitHub contributors | LinkedIn data provider (estimate) |
| Revenue | ~$1.3M/yr | data provider estimate, unverified |
| Leadership | Founder JiaChen He left May 2026 (AI-agent product "Bridge"); Vincent Chen CEO | AFFiNE blog via dalao.ai |
| GitHub | ~74k stars, ~5.4k forks, ~800 open issues/PRs; stable v0.27.4 (Aug 2026) | GitHub API |
| Users | "200K+ Pro users", "7M+ downloads" (vendor claims); US App Store 36 ratings | vendor / App Store |
| Pricing | Free local; Pro $6.75/mo; Team $10/seat/mo; AI add-on $8.9/mo; Believer $499.99 lifetime | pricing page, Oct 2026 |
| Licence | Editor MIT; backend = Enterprise Edition licence (MPL-2.0 CE mentioned); Apache-2.0 move announced May 2026, not done by Oct 2026 | repo LICENSE, dalao.ai |
| Self-host limits | 10 seats/workspace free; more seats need Team sub with **online licence check** or "Installable License" for intranet | pricing page |
| Traffic | ~300–400k visits/month; top countries US, India, Bangladesh, S. Korea, Netherlands, China, Germany — **no African country in top 5** | Similarweb / Semrush Sep 2026 |

### Blockers & pain points (2025–2026)
- Silent sync failure → data loss, no UI warning (issue #14846, Apr 2026; maintainer blames Safari IndexedDB).
- Android app "unusable": typed text deleted, keyboard covers content, self-hosted login broken (Play Store reviews 2025–2026; issue #15257 OTP/OIDC break in 0.27).
- Self-host slow loading (~1 min, #14026); sync stuck at 89 % (#13272); memory leak → crash (#14006).
- Licence ambiguity ("open source" but server not MIT) recurring on Reddit; online licence check incompatible with air-gapped government deployments.

### Implication for Ubao
AFFiNE validates demand for docs+canvas OSS but, after 4 years and ~$10M+, still ships v0.x with sync data-loss and weak mobile. Its gaps (server licence, seat caps, online licence check, mobile editing, sync reliability, no Africa focus/partners) are exactly Ubao's thesis — and also show how hard the engineering scope is.
