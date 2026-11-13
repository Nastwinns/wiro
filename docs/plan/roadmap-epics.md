---
title: Roadmap & epics
status: draft v0.1 (BMAD — to be split into stories with bmad-create-epics-and-stories after ADR-0003/5)
created: 2026-11-10
---

# Roadmap — see docs/plan/master-plan.md for dated timeline (target ≈ 16 weeks real vs 13 planned; date risk flagged)

| Sprint (2 wk) | Focus | Exit criteria |
|---|---|---|
| S0 (now) | Planning: brief, PRD, UX spec, brand, Penpot design system, ADR-0003/5 | Penpot DS + key screens approved |
| S1 | Core: wiro-model, wiro-crdt, wiro-storage (WAL), Tauri shell, chrome skeleton, tokens package | offline doc CRUD, crash test green |
| S2 | Canvas engine v1 (render, hit-test, select, stickies, shapes, text, pan/zoom) + perf bench in CI | 10k objects @60 fps on ref laptop |
| S3 | Docs editor + doc↔board + live frame block; sync server v1 (WS, rooms) | 2 users real-time + offline merge |
| S4 | Connectors, frames, pen, images, layers, inspector; comments; share + guest links; **S4b responsive web (touch input, phone/tablet browsers)** | UC2 demo end-to-end + mobile internal builds |
| S5 | Workshop mode (timer, vote, private, follow), templates; databases (table, kanban) | UC1 demo with 30 users |
| S6 | Timeline/calendar, meeting notes, wiki (backlinks, verified), search offline | UC3 + UC4 demos |
| S7 | Auth (OIDC/SAML), admin, audit, export/import (MD, Notion, Excalidraw), FR/EN | admin & sovereign checklist |
| S8 | Server admin console, Helm, air-gapped bundle, backups, hardening, a11y audit, landing site, **desktop installers signing** | **Release 1.0 (first sellable)** |

Continuous after 1.0: AI (BYO model), Swahili locale, Miro import, LAN sync, multi-tenant partner mode, mobile money billing, community locales.

# Epics (from PRD)
E1 Workspace & navigation · E2 Docs editor · E3 Canvas · E4 Facilitation · E5 Databases & planning · E6 Collaboration · E7 Local-first/offline/low-bandwidth · E8 Import/export · E9 Identity/admin/security · E10 AI · E11 Server & sovereign ops · E12 Localisation · E13 Marketing site & GTM (landing, X demo routine, partner kit, tender pack).

Next BMAD steps: `bmad-check-implementation-readiness` → `bmad-create-epics-and-stories` → `bmad-sprint-planning`.
