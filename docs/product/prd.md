---
title: PRD — Wiro (working name)
status: draft v0.2 (decisions of 2026-11-10 integrated) (BMAD PM phase) — items tagged [ASSUMPTION] to validate
created: 2026-11-10
inputs: docs/research/competitive-audit.md, docs/product/market-offer-study.md, _bmad-output/planning-artifacts/briefs/brief-wiro-2026-11-10/
---

# PRD

## 1. Vision
An open-source (MIT) workspace where African teams **write, draw, plan and decide together** — docs and infinite canvas in one place, fast on modest hardware, usable offline, deployable on sovereign infrastructure.

## 2. Personas
| ID | Persona | Context | Job to be done |
|---|---|---|---|
| P1 | **Aïcha, product lead** — startup, Dakar, 12 ppl | Notion + Miro in USD, flaky 4G, MacBook Air | "Turn a messy idea into a spec my devs can build, with the diagram next to the text." |
| P2 | **Kwame, CTO / admin** — scale-up, Accra/Lagos | Pays tools by card, worries about data | "Give the team one tool, control access, never lose data." |
| P3 | **Mme Diallo, DSI** — ministry, Abidjan | Must host in-country, tender rules, mixed hardware | "Deploy a sovereign collaboration tool my agents actually use, auditable." |
| P4 | **Joseph, facilitator / project officer** — agency or NGO, Nairobi | Runs workshops with 30 people, some on phones | "Run a workshop where everyone contributes, even guests without accounts." |
| P5 | **Fatou, contributor / guest** | Low-end Android or shared PC, expensive data | "Join from a link, add my ideas, don't burn my data." |
| P6 | **Partner integrator** | Local SI answering a tender | "Install, brand, integrate SSO, train — and get paid for it." |

## 3. Launch use cases (all must be excellent) — decided
- **UC1 Workshops / retros** (P4, P5): stickies, clusters, vote, timer, private mode, follow presenter, templates, guest link.
- **UC2 Product spec + diagram** (P1): doc with embedded live canvas frames, flowcharts, wireframe kit, comments, decisions.
- **UC3 Planning / steering** (P3, P1): databases with table / kanban / timeline views, meeting notes with action items, roadmap canvas.
- **UC4 Knowledge base** (all): page tree, backlinks, templates, global offline search, permissions, verified pages.

## 4. Functional requirements (by epic)

### E1 Workspace & navigation
- FR1.1 Workspaces with spaces (team areas) and nested pages; a page is a **doc** or a **board**, switchable (doc ↔ canvas view of the same content).
- FR1.2 Sidebar: favourites, recent, spaces tree, trash; drag to reorder; keyboard navigation.
- FR1.3 Command palette (Ctrl/Cmd+K): navigate, create, run actions, search.
- FR1.4 Home: recent, assigned to me, mentions, templates, sync status.
- FR1.5 Multi-workspace switcher; offline-available workspaces flagged.

### E2 Docs editor (blocks)
- FR2.1 Blocks: text, H1–H3, lists, to-do, toggle, quote, callout, divider, code, table (simple), image, file, embed (local-only by default), math, mermaid.
- FR2.2 Slash menu, markdown shortcuts, drag handles, multi-block selection.
- FR2.3 **Live canvas frame block**: embed a frame of any board, editable in place.
- FR2.4 Mentions (@people, @pages, @dates), backlinks panel, page properties.
- FR2.5 Find & replace, word count, outline (TOC), focus mode.
- FR2.6 Templates: spec, meeting notes, decision record, wiki page, project brief.

### E3 Canvas (board)
- FR3.1 Infinite canvas: pan/zoom (wheel, trackpad, touch), minimap, zoom-to-fit, frames.
- FR3.2 Objects: sticky, text, shape (rect, ellipse, diamond, triangle, …), connector/arrow (bound, labelled, orthogonal/curved), pen/highlighter, image, frame, table, mind-map node, embedded doc card, comment pin.
- FR3.3 Selection, multi-select, group, align/distribute, snapping & smart guides, lock, z-order, layers panel.
- FR3.4 Inspector panel: fill (canvas palette), stroke, text style, size, position; quick toolbar on selection.
- FR3.5 Diagram kits: flowchart, wireframe (desktop/mobile UI kit), org chart, swimlane.
- FR3.6 Mind map mode with auto-layout.
- FR3.7 Presentation: frames as slides, presenter follow, laser pointer.
- FR3.8 Keyboard-complete canvas (tab objects, arrows move, Enter edit) + screen-reader object list.

### E4 Facilitation (workshops)
- FR4.1 Timer (shared), voting (dots, per-person budget, anonymous option), private mode (hide others' stickies until reveal), follow/summon, "raise hand", reactions.
- FR4.2 Cluster & summarize stickies (manual; AI optional per E10).
- FR4.3 Workshop templates: retro (4L, start/stop/continue), brainstorm, SWOT, impact/effort, user journey, lean canvas.
- FR4.4 Facilitation available on **every tier** (audit P16).

### E5 Databases & planning
- FR5.1 Database block / page: typed properties (text, number, select, multi-select, date, person, relation, checkbox, URL, file).
- FR5.2 Views: table, kanban, list, timeline (Gantt-lite), calendar; filters, sorts, group-by; saved views.
- FR5.3 Meeting notes: agenda, attendees, decisions, action items → tasks in a database.
- FR5.4 Roadmap board: timeline lanes on canvas linked to database items.

### E6 Collaboration
- FR6.1 Real-time multiplayer: cursors, selections, presence avatars, follow user.
- FR6.2 Comments (threaded, on blocks and canvas objects), resolve, mentions, notifications inbox.
- FR6.3 Sharing: roles (owner, editor, commenter, viewer), page/space/workspace inheritance, **guest link without account** (name only), link expiry, password, QR code.
- FR6.4 Version history: timeline, named versions, restore, diff for docs.

### E7 Local-first, offline & low bandwidth
- FR7.1 All workspaces marked offline are fully usable without network (read, write, search); default ON for desktop.
- FR7.2 Every change persisted locally before sync; crash-safe (no data loss on kill -9).
- FR7.3 Sync status indicator (synced / syncing / offline / conflict-free merge done); per-workspace data-usage meter.
- FR7.4 **Low-bandwidth mode**: images downscaled, media on demand, compressed delta sync, presence throttled.
- FR7.5 Peer discovery on LAN (desktop) to sync without internet [ASSUMPTION — later phase].

### E8 Import / export & interoperability
- FR8.1 Export page/workspace: Markdown + assets, open JSON format, PDF (real text), **Word (.docx), Excel (.xlsx) and CSV from databases, PowerPoint (.pptx) from frames**, PNG/SVG for boards. Delivered as mandatory plugins (FR8.4).
- FR8.2 Import: Markdown, Notion export, Miro (CSV/backup where available), Excalidraw (.excalidraw), **Word (.docx), Excel/CSV (.xlsx to database), Figma (REST API export or SVG/PNG)**, images/PDF to board. Delivered as mandatory plugins (FR8.4).
- FR8.3 Public API + webhooks; MCP server for AI agents [ASSUMPTION].
- FR8.4 **Extension system** (ADR-0010): sandboxed plugins with declared permissions; first-party **mandatory plugins** (all importers and exporters above) are signed, bundled in every release including the air-gapped bundle, and work offline on local files.
- FR8.5 **Certification & trust tiers**: Core, Verified, Community, Private; signed packages, SBOM and licence shown, revocation/kill switch; sovereign admins can allow-list or mirror the marketplace.
- FR8.6 **Open contribution**: public SDKs (TypeScript for UI plugins, Rust/WASM components for server plugins, any language for MCP connectors), CLI and developer portal.

### E9 Identity, admin & security
- FR9.1 Auth: email magic link, password + passkeys, OIDC/SAML SSO (Keycloak, Azure AD, Google), LDAP via IdP.
- FR9.2 Workspace admin: members, groups, roles, invitations, domain capture, guest policy.
- FR9.3 Audit log (who/what/when), export; retention policies.
- FR9.4 Encryption at rest (server + local), customer-managed keys for sovereign.
- FR9.5 Billing page with fair rules (admins add seats only, guests free, no silent upgrades) — **payments integration later**, invoices for S2.

### E10 AI (optional, off by default)
- FR10.1 Bring-your-own model (OpenAI-compatible endpoint, local Ollama/vLLM); no data leaves the server unless configured.
- FR10.2 Inline actions: summarize, cluster stickies, draft from outline, diagram from text, translate (FR/EN/+), meeting minutes.

### E11 Server & sovereign operations
- FR11.1 Single binary + docker compose + Helm chart; air-gapped bundle; runs on 1 vCPU / 2 GB for ≤ 50 users [ASSUMPTION].
- FR11.2 Server admin console: health, users, storage, backups/restore, updates, licence/subscription, SMTP, SSO, telemetry off switch.
- FR11.3 Multi-tenant mode for partners (hosting several organisations).
- FR11.4 White-label: logo, colours, domain (partners/governments).

### E12 Localisation
- FR12.1 UI FR + EN at launch, Fluent-based; **Swahili first community locale** after v1, then wo, ha, yo, ln, ar (RTL support built in from v1).
- FR12.2 Locale-aware dates, numbers, currencies (XOF, NGN, KES, …).

## 5. Non-functional requirements
| ID | Requirement | Target |
|---|---|---|
| NFR-P1 | Canvas pan/zoom | 60 fps with 10 000 objects on 4 GB RAM / integrated GPU laptop |
| NFR-P2 | Input latency (type, move) | < 50 ms p95 |
| NFR-P3 | Cold start desktop / web | < 2 s / < 3 s on 3G-fast for app shell (web bundle ≤ 1.5 MB gz initial) [ASSUMPTION] |
| NFR-P4 | Memory | < 600 MB RSS for a 10k-object board |
| NFR-R1 | Data durability | zero loss on crash; restore tests in CI |
| NFR-R2 | Sync convergence | CRDT, no manual conflict resolution for text/canvas |
| NFR-O1 | Offline | 100 % features except sharing/permissions changes & AI |
| NFR-B1 | Bandwidth | edit session ≤ 1 MB/h idle presence; low-bandwidth mode halves media traffic |
| NFR-S1 | Security | OWASP ASVS L2; SBOM; signed releases; dependency licence gate |
| NFR-A1 | Accessibility | WCAG 2.2 AA (docs, chrome, canvas object list) |
| NFR-I1 | i18n | all strings externalised; +30 % text expansion tolerant; RTL-ready |
| NFR-L1 | Licence | MIT OR Apache-2.0 (dual, ADR-0016) for all code; deps MIT/Apache/BSD/ISC/Zlib (MPL flagged) |
| NFR-D1 | Deploy | install < 15 min on a fresh VPS; air-gapped install documented |

## 6. Release definition — "MVP commercialisable" (first sellable release, ~3 months)
Scope stays AFFiNE + Collaboard (not reduced). What gates the **first sale**:
- **Delivery targets: desktop (Windows, macOS) + web, mandatory.** Mobile/tablet = responsive web; no native iOS/Android apps (decision 2026-11-11, ADR-0015; supersedes 2026-11-10).
- UC1–UC4 excellent end-to-end (E1–E7 complete, E8 export + Markdown/Notion/Excalidraw import, E9 SSO + audit, E11 compose/Helm + admin console, E12 FR/EN).
- Then continuous releases: E10 AI, Miro import, LAN sync, multi-tenant partner mode, mobile apps, mobile money billing.
[ASSUMPTION: ordering to be validated in sprint planning]

## 7. Success metrics
- S1: 20 paying teams across ≥ 3 countries in 6 months; activation (first board + first invite) < 10 min; D30 team retention ≥ 40 % [ASSUMPTION].
- S2: 3 sovereign pilots signed (≥ 2 countries), 1 converted to annual subscription.
- Community: GitHub stars, contributors from ≥ 5 African countries, X demo reach.
- Quality: crash-free sessions ≥ 99.5 %; zero data-loss incidents.

## 8. Open questions
Name (candidate Ubao); pricing grid NGN/KES (XOF decided ~2 000/editor); partner programme terms;  which countries host Team Cloud first; trademark filings (OAPI/ARIPO).
