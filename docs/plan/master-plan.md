---
title: Master plan — Ubao / Wiro
status: v0.1 — 2026-11-10
owner: Jean Balin (solo + AI agents, 20 h+/week)
---

# Master plan

## 0. Capacity reality check (honest)
- Budget: ~20–25 h/week × 12 weeks ≈ **240–300 h** of founder time; code produced by agents, founder time = specs, review, testing, decisions, sales.
- v1 scope (UC1–UC4 + desktop + web + **responsive web for phones/tablets (no native mobile apps)** + SSO/audit + Helm/air-gap) is **very aggressive** for this budget. Scope is not reduced (decided); the levers are: strict sprint order, agent parallelism, automated testing, and accepting that the **date may move** rather than the scope.
- Watch item: CDI trial period until end Jan 2027 → avoid public conflict-of-interest (no Wyll clients, see memory constraint) and keep evenings/weekends.

## 1. Workstreams
| WS | Owner | Output |
|---|---|---|
| WS1 Product & BMAD | Jean + BMAD agents | brief ✔, PRD v0.2 ✔, readiness check, stories |
| WS2 Design (Penpot via OpenCode) | Jean + OpenCode | DS (A vs B), all S-xx screens, prototypes |
| WS3 Engineering | agents (Claude Code / OpenCode), Jean reviews | crates + apps per sprint plan |
| WS4 Build in public | Jean | X demos + LinkedIn decision-maker content |
| WS5 Pilots | Jean (network) | 2–3 startup pilots + 1 administration |
| WS6 Hosting & partners | Jean | DC partners SN / CI / KE, integrator programme |
| WS7 Legal & entity | Jean + counsel | entity (Africa / Mauritius), CGV/DPA, trademark |
| WS8 Brand & name (A/B test: 5 founders/CTOs, 1–2 DSI/decision-makers, public X/LinkedIn poll) | Jean + designer (optional later) | Ubao validation, logo, A/B direction choice |

## 2. Timeline (weeks from Mon 16 Nov 2026)
| Weeks | WS1–2 Product/Design | WS3 Engineering | WS4–8 Business |
|---|---|---|---|
| **W1–2** (16–29 Nov) | Penpot A0 (A vs B) + A1–A4 design system; BMAD readiness check; epics → stories | S0: repo scaffold (Cargo workspace, Tauri 2 desktop shell, CI, licence gate `cargo deny`, tokens pipeline), Loro + loro-prosemirror spike | Make repo public (README, CONTRIBUTING, roadmap); first X/LinkedIn posts ("building in public"); list 10 pilot targets; Swahili native check on "Ubao"; book counsel call (entity) |
| **W3–4** (30 Nov–13 Dec) | B1–B5 screens (shell → board); user test A/B with 5–8 people | S1: model/CRDT/storage WAL, chrome skeleton, offline doc CRUD, crash tests | 5 Mom-Test interviews; contact Orange Business SN, Raxio CI, IXAfrica/ADC KE |
| **W5–6** (14–27 Dec) | B6–B9 (workshop, DB, wiki, collab) | S2: canvas engine v1 + perf bench CI (10k @60 fps) | weekly demo videos; pilot LOIs (startups) |
| **W7–8** (28 Dec–10 Jan) | B10–B13 (settings, server admin, states, responsive web) | S3: docs editor + doc↔board + live frame; sync server v1 (Postgres) | entity decision; tender/compliance pack draft |
| **W9–10** (11–24 Jan) | B14 prototypes; C1–C3 marketing | S4: connectors/frames/pen/images/inspector, comments, share + guest links; **responsive web pass (S4b)** | administration pilot proposal; partner programme v0 |
| **W11–12** (25 Jan–7 Feb) | design QA (impeccable + ux-designer) | S5: workshop mode, templates, databases (table/kanban) | beta to pilot startups |
| **W13–14** (8–21 Feb) | — | S6: timeline/calendar, meeting notes, wiki, offline search | pricing page live (XOF/KES); Team Cloud infra in 1st DC |
| **W15–16** (22 Feb–7 Mar) | — | S7: SSO/audit/admin, import/export, FR/EN; S8: server admin console, Helm, air-gap, a11y audit, desktop installer signing | **v1.0 target** (≈ 16 weeks real; "3 months" = 13 weeks → date risk flagged) |

## 2bis. Extensions, certification & migration (EP14, added 2026-11-11)
Mandatory first-party plugins ship with v1: importers (Notion, Miro, Word, Excel/CSV, Figma, Markdown, Excalidraw, PDF/images) and exporters (PDF, Word, Excel/CSV, PowerPoint, Markdown, PNG/SVG, JSON). Plugin host S4, SDK/CLI S5, importers/exporters S7, marketplace + certification + air-gapped mirror + developer portal S8. **Capacity risk:** EP14 adds ~8 stories to an already over-committed plan; the date moves before the scope does (see §0). Parsing libraries must pass the licence gate (docx/xlsx/pptx/PDF crates, MIT/Apache only).

## 3. Engineering sprint plan (2-week sprints) — updated (responsive web, no native mobile)
S0 scaffold · S1 core/local-first · S2 canvas · S3 editor + sync · S4 canvas tools + collab (+ S4b responsive web, touch input) · S5 workshops + DB · S6 planning + wiki + search · S7 identity/admin/import-export/i18n · S8 sovereign ops + hardening + stores + landing → v1.0.

## 4. Build-in-public routine (WS4)
| Day | X | LinkedIn |
|---|---|---|
| Mon | progress thread (what shipped, 1 GIF) | — |
| Wed | 20–40 s demo (canvas perf, offline mode, low-bandwidth meter) | article/post for DSI & founders (sovereignty, data cost, open source policy in Africa) |
| Fri | "decision of the week" (ADR summary) + ask for feedback | case/learning from pilot interviews |
Assets: screen recordings from Penpot prototypes first, then real app. Metrics: followers, GitHub stars, waitlist sign-ups, pilot leads.

## 5. Pilot plan (WS5)
- Startups (2–3 from network): onboarding call, weekly feedback, success = team uses it for 1 workshop + 1 spec/week for 4 weeks; LOI → paid at v1 with founder discount.
- Administration (1 via decision-maker) — **country: Senegal** (sovereign cloud project, Orange Business/Sonatel hosting partner): discovery (use cases, hosting constraints, procurement path), proposal = 60–90-day pilot on their infra or in-country DC, delivered with a local integrator; success criteria signed upfront.

## 6. Hosting & partners (WS6)
Team Cloud first in Senegal (Orange Business/Sonatel), Côte d'Ivoire (Raxio Abidjan), Kenya (IXAfrica / Africa Data Centres). Partner programme v0: Registered → Certified → Premier; partners keep services, 20–30 % margin on subscriptions; certification = deploy + admin + facilitator.

## 7. Legal (WS7) — ADR-0009 to write
Options to compare with counsel: Senegal (SAS/SARL, OHADA, access to UEMOA public procurement), Côte d'Ivoire, Mauritius holding + operating subsidiaries; trademark "Ubao" at OAPI (17 states) + ARIPO + EUIPO; CGV, DPA (data processing), SLA templates, contributor policy (DCO for MIT).

## 8. Risk register
| Risk | Prob. | Impact | Mitigation |
|---|---|---|---|
| Solo capacity vs v1 scope (responsive web included) | High | High | strict order, agents in parallel, date moves not scope, weekly burn-down |
| loro-prosemirror maturity | Med | High | S0 spike; fallback: own binding on Loro text |
| Canvas perf in WebKit webviews (macOS) and on low-end Android browsers | Med | High | perf bench CI on WKWebView + low-end Android from S2; native wgpu surface fallback |
| ~~Tauri mobile maturity / store review~~ | — | — | removed 2026-11-11 (no native mobile apps) |
| Name rejected (meaning / trademark) | Med | Med | keep Ndaje/Lisanga as backups; Wiro placeholder in code |
| Conflict with employment (CDI) | Low | High | separate entity, no Wyll clients, own time & hardware |
| Gov sales cycle > 6 months | High | Med | partner-led bids, start discovery W3 |
| Clean-room contamination | Low | High | clean-room-guard agent on every PR |

## 9. Next 10 actions (this week)
1. Review brief + PRD v0.2 (30 min).
2. Penpot: install MCP locally, import tokens/fonts, run A0 (A vs B).
3. Swahili native-speaker check on "Ubao" (+ GitHub org `ubaohq` / domain check).
4. Create GitHub org **`ubaohq`**; README/ROADMAP/CONTRIBUTING/THIRD_PARTY_NOTICES ready; secrets scan clean; **resolve vendored-skills licences (see THIRD_PARTY_NOTICES TODO)** before the first public push.
5. Run `bmad-check-implementation-readiness`, then `bmad-create-epics-and-stories`.
6. Write ADR-0004 (renderer) after S0 spike; ADR-0015 (responsive web, no native mobile; supersedes 0008); ADR-0009 (entity).
7. List 10 pilot targets (5 startups, 3 administrations, 2 integrators).
8. First X + LinkedIn posts (announcement, why sovereign open-source docs+canvas for Africa).
9. Email Orange Business SN / Raxio CI / IXAfrica-ADC KE for hosting partnership.
10. Counsel call on entity (Senegal vs CI vs Mauritius).
