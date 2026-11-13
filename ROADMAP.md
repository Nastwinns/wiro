# Roadmap

Status: **pre-alpha**, planning in public. Sprints are 2 weeks; S0 starts 16 Nov 2026 (development kickoff 13 Nov, see [docs/plan/dev-kickoff.md](docs/plan/dev-kickoff.md)).

| Sprint | Window (target) | Content |
|---|---|---|
| S0 | 16-29 Nov 2026 | Scaffold (Cargo + pnpm workspaces), licence and clean-room gate, design tokens, Tauri 2 shells, Loro + ProseMirror spike (EP0) |
| S1 | 30 Nov-13 Dec | Core, CRDT, WAL storage, chrome skeleton, offline doc CRUD (EP1) |
| S2 | 14-27 Dec | Canvas engine v1, perf bench 10 000 objects at 60 fps (EP2) |
| S3 | 28 Dec-10 Jan | Docs editor, doc/canvas link, sync server v1 (EP3, EP4) |
| S4 | 11-24 Jan | Canvas tools, comments, sharing, guest links, responsive web; **plugin host** (EP14) |
| S5 | 25 Jan-7 Feb | Workshop mode, templates, databases; **plugin SDK and CLI** (EP14) |
| S6 | 8-21 Feb | Timeline, meeting notes, wiki, offline search |
| S7 | 22 Feb-7 Mar | SSO, audit, admin, FR/EN, **mandatory importers and exporters** (EP14) |
| S8 | 8-21 Mar | Server admin console, Helm, air-gapped bundle, a11y audit, store submission, **marketplace, certification, offline mirror, developer portal** (EP14) |
| Next | 2027 | AI with your own model, Swahili and other community locales, LAN sync, partner multi-tenant |

**EP14 (extensions, certification, migration)** adds about 8 stories to an already full plan: the date moves before the scope does. Dates are targets. Detail: [master plan](docs/plan/master-plan.md), [epics](_bmad-output/planning-artifacts/epics.md), [sprint status](_bmad-output/implementation-artifacts/sprint-status.yaml).
