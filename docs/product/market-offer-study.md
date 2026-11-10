---
title: Market & offer study — what we sell, to whom, at what price
status: draft (figures tagged [ASSUMPTION] must be validated with pilots)
created: 2026-11-10
method: Exa research + skills pricing / hundred-million-offers / crossing-the-chasm. Builds on docs/research/competitive-audit.md.
---

# Market & offer study

## 1. Price benchmarks (Nov 2026)

| Vendor | Entry | Team / Pro | Enterprise / Gov | Sovereign |
|---|---|---|---|---|
| Miro | $8/member/mo (yr) | $20 | custom, ≥30 seats; data residency EU/US/AU/JP only | none (no on-prem, no air-gap) |
| Collaboard | $6 | $11.50 | custom | on-prem, private cloud, air-gapped |
| Conceptboard | €5 | from €10 | from €14, 24-month contract ≥100 users | on-prem Data Center Edition, regional DC |
| Boardmix | $5 (yr) | AI tiers $10–20 | private deployment | — |
| Notion (used by African startups) | free–$10 | — | — | — |
| Rocket.Chat (OSS, gov model) | Starter free ≤50 users self-host | Commercial | Government / Defense plans, sovereign/air-gap | partners: resellers, MSPs, SIs |
| Nextcloud (OSS, gov model) | Community free | Enterprise subscription | — | channel partners (Silver/Gold/Platinum by ARR) |

Signals on the buy side:
- Dakar pre-seed startups (5–12 ppl) budget **150–400 USD/month for the whole stack**; Notion Plus $10 and Linear $8 are the reference prices (Kolonell 2026).
- Seed fintechs across emerging markets spend **< $5k/month** on all tools; Notion rated only "average value" (Accion 2025).
- Card penetration < 4 % in 28 African countries; FX volatility; teams prefer **local currency, round prices, flexible periods** (Spotflow, Ultraner, ITWeb).
- Governments: Kenya Cloud Policy 2025 & Nigeria NITDA 2026 push in-country hosting and **indigenous providers / aggregated procurement** (Galaxy Backbone, GBB sovereign-cloud PPP talks Nov 2026). Senegal sovereign cloud (Alibaba), Gabon Tier III sovereign DC (Jul 2026).
- Local DC / cloud partners: Orange Business Sénégal (AWS Wavelength Dakar), Raxio (CI, UG, ET, MZ, AO, DRC), Africa Data Centres (Liquid), Galaxy Backbone, Wingu, IXAfrica, national DCs (Rwanda, Ghana, Togo, Benin).
- **African competitor to watch:** Cynoia ("designed in Africa", all-in-one collaboration). To profile in detail.

## 2. Who buys (beachheads — Crossing the Chasm)

| Segment | Trigger to buy | Decision maker | Cycle | Channel |
|---|---|---|---|---|
| **S1 Tech startups / SMEs** (5–50 ppl) | Notion+Miro bill in USD, slow on poor links, card issues | Founder / CTO | days–weeks | Self-serve + X demos + community |
| **S2 Public administrations** (ministries, agencies, regulators) | Data-residency rules, Microsoft/Miro dependency, donor-funded digital programmes | DSI / CIO + procurement | 3–12 months, tender | Direct + **local integrator / CSP partner** |
| S3 (later) NGOs, universities, banks/telcos | Sovereign + workshops | IT / programme lead | 1–6 months | Partners |

Beachhead logic: S1 gives usage, feedback, references and X content fast; S2 gives revenue per deal and the sovereign moat. Both are served by the same product with different packaging.

## 3. Business-model tension to resolve (needs Jean's call)

Whole stack is MIT (audit P7: "no capped self-host"). With MIT code, an administration can legally self-host for free. What do they pay for?

| Model | What is paid | Pros | Cons | Examples |
|---|---|---|---|---|
| **A. Pure MIT + subscription** | Certified/LTS builds, security patches & advisories, SLA, support, indemnity, compliance pack (docs for tenders), managed hosting | Keeps the GitHub/trust promise, simplest story | Weaker lock on large self-hosters | Red Hat-style, Nextcloud Enterprise |
| **B. Open core** | Enterprise modules (SSO/SCIM, audit, retention, air-gap tooling, admin) under commercial licence | Clear upsell, proven in collaboration OSS | Contradicts "100 % MIT", risks the AFFiNE criticism | Mattermost, Rocket.Chat |
| **C. Hybrid** | Core + SSO/audit MIT; only **sovereign ops tooling** (air-gap installer, HA operator, compliance reports, fleet admin) commercial | Basics free (no "SSO tax"), sovereign value captured | Boundary to maintain | GitLab-like split |

Recommendation: **A, with C kept as fallback** — sell trust, operations and compliance, not features. [DECISION PENDING]

## 4. Proposed offer ladder (prices [ASSUMPTION], XOF shown because pegged to EUR: 1 € = 655.957 XOF)

| Tier | For | Includes | Price idea |
|---|---|---|---|
| **Community** | Everyone | Full app, unlimited boards & docs, self-host unlimited users, community support | Free (MIT) |
| **Personal Cloud** | Individuals | Hosted sync, N GB | Free |
| **Team Cloud** | S1 | Hosted in Africa (partner DC), unlimited guests/viewers free, facilitation, backups | ~€3/editor/mo ≈ **2 000 XOF**; team pack 10 editors **20 000 XOF/mo**; monthly or **quarterly**; local currency |
| **Business Cloud** | S1 growing | + SSO/OIDC, audit log, admin, priority support, data-residency country choice | ~€6/editor/mo ≈ **4 000 XOF** |
| **Sovereign** | S2 | Annual subscription: certified LTS builds, air-gap bundle, Helm/HA, security advisories, SLA (business hours / 24×7), compliance & tender pack, named support | floor ~**€12k/yr** up to 250 users, then per-user band; multi-year; via partner or direct |
| **Services** | S1/S2 | Deployment pack (fixed price), SSO/AD integration, migration from Miro/Notion/Excalidraw, training & facilitator certification, managed instance (MSP) | fixed packs + day rates |
| **Partner programme** | CSPs, integrators | Resell/host Sovereign & Team Cloud, margins, certification, co-marketing | revenue share |

Billing rules (from audit P4): only admins add paid seats; guests/viewers never billed; no silent upgrades; pro-rata down as well as up; mobile money later (architecture ready).

## 5. Offer framing ($100M Offers lens)
- **Dream outcome:** "Run your workshops, specs, plans and wiki in one place your team owns — even when the network drops."
- **Perceived likelihood:** live demo offline; references; open code auditable by the DSI.
- **Time delay:** S1 onboarding < 10 min, import from Miro/Notion; S2 pilot deployed in 1 week (Helm/compose).
- **Effort:** guests without accounts, FR/EN UI, templates per use case.
- Bonuses for S2: tender/compliance pack, facilitator training, migration included in year 1.
- Guarantee idea: pilot of 60–90 days; data export guaranteed (open format).

## 6. Validation plan (Mom Test)
- 10 founder/CTO interviews (S1) across ≥3 countries; 5 DSI interviews (S2) — ask about past behaviour (tools paid, incidents, tenders), never "would you buy".
- Price test: Van Westendorp on S1 after demo; S2 = budget lines of last collaboration-tool purchase.
- Profile Cynoia, Collaboard Africa presence, Microsoft Whiteboard/Loop bundling in gov tenders.

## Sources
Miro pricing page; Collaboard vs Miro (Sep 2026) & OMR Collaboard pricing; Conceptboard pricing; Boardmix pricing (Rework 2026); Rocket.Chat plans & partners; Nextcloud channel partner programme; Mattermost partners & open-core interview; Kolonell Dakar stack 2026; Accion Venture Lab tools survey 2025; LaunchPad.ng 2026; Cynoia blog; TechCabal Dec 2025; Galaxy Backbone sovereign cloud (Techpoint, Nov 2026); NITDA 2026; Kenya Cloud Policy 2025; Orange Business Sénégal AWS Wavelength; Raxio marketplace; ADC marketplace; Africa DCA "Data Centres in Africa 2026"; Seneweb Aug 2026.
