---
status: draft
stepsCompleted: [1,2,3]
inputDocuments: [docs/product/prd.md, docs/architecture/architecture.md, docs/ux/ux-spec.md, docs/ux/screens/, _bmad-output/planning-artifacts/briefs/brief-wiro-2026-11-10/brief.md]
note: generated in fast mode on Jean's 'go' — collaborative review (step 3D/4) still to do
---

# Ubao — Epic Breakdown

## Overview
Decomposition of PRD v0.2 (E1–E12 FR groups), NFRs, architecture (ADR-0002/0003/0005/0006) and UX specs (S-01…S-14) into stories sized for one dev-agent session each.

## Requirements Inventory
- Functional: PRD §4 FR1.x–FR12.x.
- Non-functional: PRD §5 (P1–P4, R1–R2, O1, B1, S1, A1, I1, L1, D1).
- Additional: clean-room & licence gate (AGENTS.md); MIT for all code.
- UX: docs/ux/ux-spec.md + screens; tokens DTCG; WCAG 2.2 AA.

### FR Coverage Map
| PRD group | Epics |
|---|---|
| E1 Workspace | EP1 |
| E2 Docs | EP3 |
| E3 Canvas | EP2, EP5 |
| E4 Facilitation | EP6 |
| E5 Databases | EP7 |
| E6 Collaboration | EP4 |
| E7 Local-first | EP1, EP4 |
| E8 Import/export | EP10 |
| E9 Identity/admin | EP9 |
| E10 AI | post-v1 (not in this breakdown) |
| E11 Server/sovereign | EP4, EP11 |
| E12 Localisation | EP10 |
| Mobile (decided v1) | EP12 |
| GTM | EP13 |

## Epic List
| Epic | Title | Sprint |
|---|---|---|
| EP0 | Foundations (enabler) | S0 |
| EP1 | Local-first workspace | S1 |
| EP2 | Canvas essentials | S2 |
| EP3 | Docs editor & doc↔board | S3 |
| EP4 | Real-time collaboration & sharing | S3–S4 |
| EP5 | Canvas pro tools | S4 |
| EP6 | Workshops & facilitation | S5 |
| EP7 | Databases & planning | S5–S6 |
| EP8 | Knowledge base & search | S6 |
| EP9 | Identity, admin & security | S7 |
| EP10 | Import/export & localisation | S7 |
| EP11 | Sovereign server & operations | S8 |
| EP12 | Mobile apps (Tauri iOS/Android) | S4b–S8 |
| EP13 | Landing & go-to-market | S8 (content from W1) |

## EP0: Foundations (enabler)

Agents can build, test and ship on a safe, licence-clean base. *(sprint S0)*

### Story 0.1: Monorepo scaffold

As a maintainer,
I want a Cargo workspace + pnpm workspace matching project-structure.md,
So that agents add crates/apps in the right place.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** `cargo build` and `pnpm build` succeed on a fresh clone
- **Given** the feature is implemented **When** tested **Then** each crate/app README states its responsibility
- **Given** the feature is implemented **When** tested **Then** CI runs fmt, clippy, tests, typecheck on PR

### Story 0.2: Licence & clean-room gate

As a maintainer,
I want `cargo deny` + JS licence-checker in CI with the allow-list from AGENTS.md,
So that no GPL/Commons-Clause/proprietary dep is merged.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** a PR adding a GPL crate fails CI with the offending crate named
- **Given** the feature is implemented **When** tested **Then** the clean-room-guard agent report is attached to PRs

### Story 0.3: Design tokens pipeline

As a designer,
I want tokens.json (DTCG) compiled to CSS vars, TS and Rust consts in packages/tokens,
So that Penpot and code share one source of truth.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** changing a token and running the build updates CSS/TS/Rust outputs
- **Given** the feature is implemented **When** tested **Then** light/dark themes switch via a data attribute

### Story 0.4: Tauri 2 shells desktop + mobile

As a user,
I want the app to launch on Windows, macOS, iOS and Android with an empty shell,
So that we validate packaging early.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** signed dev builds exist for the 4 targets
- **Given** the feature is implemented **When** tested **Then** WASM engine loads inside each webview and reports GPU backend (WebGPU/WebGL2)

### Story 0.5: Loro + ProseMirror spike

As a architect,
I want a spike proving loro-prosemirror for IME, undo and cursor mapping,
So that we de-risk ADR-0003/0006.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** two editors converge after concurrent edits incl. offline
- **Given** the feature is implemented **When** tested **Then** FR accents and Wolof/Yoruba diacritics typed via IME are preserved
- **Given** the feature is implemented **When** tested **Then** spike report with go/no-go and fallback written as ADR addendum

## EP1: Local-first workspace

Users create and organise work that is always saved on their device, online or not. *(sprint S1)*

### Story 1.1: Workspace & spaces

As a founder (P1),
I want to create a workspace with spaces,
So that my team's work is organised.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** created workspace persists after app restart offline
- **Given** the feature is implemented **When** tested **Then** a space has a name, icon and members list (local until sync)

### Story 1.2: Page tree & sidebar

As a user,
I want to create, nest, rename, reorder and trash pages in the sidebar (S-01.2),
So that I find my work fast.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** keyboard ↑↓←→ Enter F2 Del work
- **Given** the feature is implemented **When** tested **Then** moving a subtree keeps children (Loro movable tree)
- **Given** the feature is implemented **When** tested **Then** trash restores within retention

### Story 1.3: Crash-safe local storage

As a user,
I want every change written locally before anything else,
So that I never lose work.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** kill -9 during typing loses 0 committed ops on replay
- **Given** the feature is implemented **When** tested **Then** restore test runs in CI on desktop and web (OPFS)

### Story 1.4: Sync status & offline UX

As a user in low connectivity (P5),
I want to see sync state and keep working offline (S-01.6, S-12.1),
So that I trust the app without network.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** airplane mode: all editing works, badge shows offline
- **Given** the feature is implemented **When** tested **Then** pending ops count visible; returns to synced after reconnect

### Story 1.5: Command palette

As a user,
I want Ctrl/Cmd+K to navigate, create and run actions (S-01.4),
So that I move fast.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** fuzzy results < 50 ms on 5k pages locally
- **Given** the feature is implemented **When** tested **Then** offline shows local results with badge

### Story 1.6: Home

As a user,
I want a Home with recent, for-me and templates (S-03.1),
So that I resume work instantly.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** loads from local store < 300 ms
- **Given** the feature is implemented **When** tested **Then** offline greys pages not available offline

## EP2: Canvas essentials

Users think visually on a fast infinite board. *(sprint S2)*

### Story 2.1: Render & navigate

As a user,
I want to pan/zoom smoothly on an infinite canvas with minimap (S-05.6),
So that large boards stay usable.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** 60 fps at 10k objects on reference laptop (perf bench in CI)
- **Given** the feature is implemented **When** tested **Then** wheel/trackpad/pinch/space-drag all work

### Story 2.2: Stickies, text, shapes

As a facilitator (P4),
I want to add and edit stickies, text and basic shapes (S-05.2),
So that I capture ideas.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** 8 canvas tints; text edit latency < 50 ms
- **Given** the feature is implemented **When** tested **Then** double-click empty canvas creates text

### Story 2.3: Selection & transform

As a user,
I want to select, multi-select, move, resize, rotate, align, group, lock,
So that I arrange content.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** snapping & smart guides
- **Given** the feature is implemented **When** tested **Then** undo/redo across all transforms

### Story 2.4: Quick toolbar & inspector

As a user,
I want contextual quick toolbar and inspector panel (S-05.3/5.4),
So that I style without hunting menus.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** ≤ 7 controls; inspector reflects multi-selection
- **Given** the feature is implemented **When** tested **Then** keyboard reachable

### Story 2.5: Accessible object list

As a screen-reader user,
I want a layers/object list mirroring the canvas (S-05.5),
So that the board is accessible.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** tab/arrow navigation announces object type and label
- **Given** the feature is implemented **When** tested **Then** WCAG 2.2 AA checks pass on the panel

## EP3: Docs editor & doc↔board

Users write structured docs that live next to their diagrams. *(sprint S3)*

### Story 3.1: Block editor

As a product lead (P1),
I want a block editor with slash menu and markdown shortcuts (S-04.1/4.2),
So that I write specs fast.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** all FR2.1 blocks available
- **Given** the feature is implemented **When** tested **Then** IME and copy/paste from Word/Google Docs keep structure

### Story 3.2: Doc ↔ Board toggle

As a user,
I want to switch the same page between doc and board views (Ctrl/Cmd+E),
So that I move between writing and drawing.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** blocks appear as cards on board and back without loss
- **Given** the feature is implemented **When** tested **Then** undo spans both views

### Story 3.3: Live canvas frame block

As a product lead,
I want to embed and edit a board frame inside a doc (S-04.4),
So that the diagram stays next to the text.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** edits in the doc frame appear on the board in real time
- **Given** the feature is implemented **When** tested **Then** deleted frame shows restore placeholder

### Story 3.4: Mentions, backlinks, properties

As a user,
I want @mentions, backlinks and page properties (S-04.5, S-08.2),
So that knowledge stays connected.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** backlinks update offline
- **Given** the feature is implemented **When** tested **Then** property types shared with databases

### Story 3.5: Find & replace, outline, focus

As a writer,
I want find/replace, outline and focus mode (S-04.6),
So that long docs are manageable.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** replace all is a single undo step
- **Given** the feature is implemented **When** tested **Then** outline follows H1–H3

## EP4: Real-time collaboration & sharing

Teams work together live or async, including guests. *(sprint S3–S4)*

### Story 4.1: Sync server v1

As a team,
I want a Rust sync server with rooms over WebSocket persisting to Postgres (ADR-0005),
So that edits reach everyone.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** 2+ clients converge; offline client merges on reconnect
- **Given** the feature is implemented **When** tested **Then** server restart loses no acknowledged ops

### Story 4.2: Presence

As a collaborator,
I want cursors, selections and avatars (S-09.3),
So that I see who does what.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** follow user works
- **Given** the feature is implemented **When** tested **Then** low-bandwidth mode throttles to 4 Hz

### Story 4.3: Comments & inbox

As a collaborator,
I want threaded comments on blocks/objects and an inbox (S-09.2, S-01.5),
So that feedback is tracked.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** mentions notify; resolve/reopen
- **Given** the feature is implemented **When** tested **Then** comments work offline and sync

### Story 4.4: Share & guest links

As a facilitator,
I want share dialog with roles, guest link without account, QR (S-09.1, S-02.4),
So that anyone can join a workshop.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** guest joins with name only, permissions enforced server-side
- **Given** the feature is implemented **When** tested **Then** link expiry and password work; guests never billed

### Story 4.5: Version history

As a user,
I want history timeline, named versions and restore (S-09.4),
So that mistakes are reversible.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** restore page or single frame/block
- **Given** the feature is implemented **When** tested **Then** diff highlight for docs

## EP5: Canvas pro tools

Users diagram precisely and present. *(sprint S4)*

### Story 5.1: Connectors

As a user,
I want bound, labelled straight/elbow/curved connectors,
So that flowcharts stay connected.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** connectors follow moved shapes
- **Given** the feature is implemented **When** tested **Then** labels editable

### Story 5.2: Frames & presentation

As a presenter,
I want frames as slides, presenter follow, laser (S-05.7),
So that I present from the board.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** slide order = frame order
- **Given** the feature is implemented **When** tested **Then** follow mode for all participants

### Story 5.3: Pen, images, tables

As a user,
I want pen/highlighter/eraser, images (downscaled), simple tables,
So that boards are expressive.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** images downscaled per low-bandwidth setting
- **Given** the feature is implemented **When** tested **Then** pen pressure on stylus

### Story 5.4: Diagram kits & mind map

As a user,
I want flowchart, wireframe, org chart, swimlane kits and mind map (S-05.8/5.9),
So that I diagram faster.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** kits drag from library; ports snap
- **Given** the feature is implemented **When** tested **Then** mind map Tab/Enter, auto-layout, convert to outline

## EP6: Workshops & facilitation

Facilitators run engaging workshops with 30+ people incl. guests. *(sprint S5)*

### Story 6.1: Workshop session & bar

As a facilitator,
I want to start a session with a workshop bar (S-06.1),
So that everyone sees the session state.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** participants count live
- **Given** the feature is implemented **When** tested **Then** available on every tier

### Story 6.2: Timer

As a facilitator,
I want a shared timer (S-06.2),
So that we keep time.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** drift < 1 s across 30 clients on 3G
- **Given** the feature is implemented **When** tested **Then** end toast for all

### Story 6.3: Voting

As a facilitator,
I want dot voting with budget, anonymous option and results (S-06.3),
So that we prioritise.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** votes consistent after reconnect
- **Given** the feature is implemented **When** tested **Then** results sortable into a new frame

### Story 6.4: Private mode & reveal

As a facilitator,
I want private mode then reveal (S-06.4),
So that ideas aren't biased.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** others see blurred cards until reveal

### Story 6.5: Follow, summon, raise hand, reactions

As a facilitator,
I want to guide attention (S-06.5),
So that the group stays together.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** summon teleports all viewports
- **Given** the feature is implemented **When** tested **Then** reactions throttled in low-bandwidth

### Story 6.6: Workshop templates

As a facilitator,
I want a gallery of workshop templates with guides (S-06.6),
So that I start in minutes.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** ≥ 9 templates incl. public-sector comité de pilotage

## EP7: Databases & planning

Teams plan and steer work with structured data. *(sprint S5–S6)*

### Story 7.1: Database & properties

As a project officer,
I want databases with typed properties (S-07.1),
So that work is structured.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** 100k rows virtualised
- **Given** the feature is implemented **When** tested **Then** property types FR5.1

### Story 7.2: Table & kanban views

As a team,
I want table and kanban views with filters/sorts/groups,
So that we track work.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** drag between columns updates status
- **Given** the feature is implemented **When** tested **Then** saved views per user/workspace

### Story 7.3: Timeline & calendar

As a manager,
I want timeline (Gantt-lite) and calendar views (S-07.3/7.4),
So that we see schedules.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** drag to reschedule; dependencies drawn

### Story 7.4: Meeting notes → actions

As a DSI (P3),
I want meeting notes template turning actions into tasks (S-07.6),
So that decisions are followed up.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** action line creates task with assignee/due
- **Given** the feature is implemented **When** tested **Then** assignee sees it in Home

### Story 7.5: Roadmap board

As a manager,
I want timeline lanes on a board linked to DB items,
So that roadmaps stay in sync.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** moving a card updates item dates

## EP8: Knowledge base & search

Teams keep a reliable wiki and find anything offline. *(sprint S6)*

### Story 8.1: Wiki pages & verification

As a knowledge owner,
I want wiki pages with verified badge and review reminders (S-08.1),
So that knowledge stays trustworthy.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** expiry triggers reminder to owner

### Story 8.2: Global offline search

As a user,
I want search across docs, boards and databases offline (S-08.3),
So that I find anything anywhere.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** sticky text matches jump to object
- **Given** the feature is implemented **When** tested **Then** results < 200 ms on 10k pages locally

### Story 8.3: Templates gallery

As a admin,
I want workspace templates and gallery (S-08.4),
So that teams reuse best practices.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** admins publish templates to the workspace

## EP9: Identity, admin & security

Admins control access and prove compliance. *(sprint S7)*

### Story 9.1: Sign-in methods

As a user,
I want magic link/OTP, password + passkeys (S-02.1/2.3),
So that I sign in securely.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** passkey registration and login
- **Given** the feature is implemented **When** tested **Then** OTP fallback for slow email

### Story 9.2: SSO & provisioning

As a admin (P2),
I want OIDC/SAML SSO, enforce SSO, SCIM, group→role mapping (S-10.6),
So that access follows our IdP.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** test login in wizard
- **Given** the feature is implemented **When** tested **Then** Keycloak & Azure AD validated

### Story 9.3: Members, roles, guests policy

As a admin,
I want members table with billed column, roles and guest policy (S-10.4/10.5),
So that access is under control.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** billed column always visible
- **Given** the feature is implemented **When** tested **Then** guest max role enforced

### Story 9.4: Audit log

As a DSI,
I want tamper-evident audit log with export (S-10.7),
So that we pass audits.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** hash-chained entries verify
- **Given** the feature is implemented **When** tested **Then** CSV/JSON export

### Story 9.5: Fair billing page

As a owner,
I want billing page with exact cost preview, no auto-upgrade (S-10.8),
So that billing is never a surprise.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** adding seats shows cost before confirm
- **Given** the feature is implemented **When** tested **Then** guests/viewers never billed
- **Given** the feature is implemented **When** tested **Then** invoice in XOF/KES

### Story 9.6: Encryption & CMK

As a DSI,
I want encryption at rest with customer-managed keys,
So that data stays under our control.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** key rotation documented and tested

## EP10: Import/export & localisation

Teams migrate in and out freely, in their language. *(sprint S7)*

### Story 10.1: Export

As a user,
I want export to Markdown, open JSON, real-text PDF, PNG/SVG (S-09.5),
So that there is no lock-in.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** round-trip JSON export/import preserves page

### Story 10.2: Import Notion, Markdown, Excalidraw

As a founder,
I want to import from Notion, Markdown and Excalidraw (S-02.6),
So that switching is painless.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** import report lists warnings
- **Given** the feature is implemented **When** tested **Then** assets preserved

### Story 10.3: FR/EN Fluent i18n

As a user,
I want the UI in French or English with locale formatting (FR12),
So that I work in my language.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** all strings externalised; +30 % layouts pass
- **Given** the feature is implemented **When** tested **Then** RTL layout toggle works in dev (ready for ar)

## EP11: Sovereign server & operations

Administrations and partners deploy and run it on their infrastructure. *(sprint S8)*

### Story 11.1: Compose & Helm

As a partner (P6),
I want docker compose and a Helm chart (CloudNativePG),
So that install takes < 15 min.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** fresh VPS install < 15 min doc-tested
- **Given** the feature is implemented **When** tested **Then** Helm HA install on RKE2/K3s

### Story 11.2: Air-gapped bundle

As a DSI,
I want an offline install bundle with signatures,
So that we deploy without internet.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** install in isolated network passes smoke tests
- **Given** the feature is implemented **When** tested **Then** signatures verified (Sigstore)

### Story 11.3: Server admin console

As a server admin,
I want overview, backups/restore, updates, subscription, integrations (S-11.x),
So that we operate it confidently.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** point-in-time restore dry-run
- **Given** the feature is implemented **When** tested **Then** telemetry off by default in sovereign

### Story 11.4: White-label

As a partner,
I want branding: logo, accent (contrast-checked), domain, emails (S-10.9),
So that we deliver under the client's identity.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** invalid contrast accent is rejected

### Story 11.5: Security hardening & a11y audit

As a maintainer,
I want ASVS L2 review, SBOM, WCAG audit before v1,
So that v1 is tender-ready.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** SBOM published per release
- **Given** the feature is implemented **When** tested **Then** a11y audit report with zero blockers

## EP12: Mobile apps (Tauri iOS/Android)

Users contribute from phones and tablets. *(sprint S4b–S8)*

### Story 12.1: Mobile navigation & docs

As a mobile user,
I want bottom bar, page tree and full doc editing (S-13.1–13.3),
So that I work from my phone.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** works on 360 px low-end Android
- **Given** the feature is implemented **When** tested **Then** offline per workspace

### Story 12.2: Mobile board & workshop participant

As a guest on phone (P5),
I want to add stickies, vote and follow on mobile (S-13.4/13.5),
So that I take part in workshops.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** 30-participant workshop includes mobile users smoothly

### Story 12.3: Tablet canvas

As a designer,
I want pencil/stylus canvas with palm rejection (S-13.7),
So that tablets are first-class.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** pressure pen; finger pans

### Story 12.4: Store releases

As a maintainer,
I want App Store and Play releases with CI signing,
So that users install officially.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** TestFlight & Play internal track by S6; public at v1

## EP13: Landing & go-to-market

Prospects understand, trust and try the product. *(sprint S8 (content from W1))*

### Story 13.1: Landing home

As a prospect,
I want a landing page per S-14.1 with live mini-canvas,
So that I get it in 10 seconds.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** Lighthouse perf ≥ 90 on 3G profile
- **Given** the feature is implemented **When** tested **Then** no fake logos/testimonials

### Story 13.2: Pricing with local currencies

As a prospect,
I want pricing page with XOF/NGN/KES/EUR switch (S-14.2),
So that price is clear in my currency.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** round local prices; 'who is billed' block

### Story 13.3: Sovereign & partners pages

As a DSI / integrator,
I want sovereign page, tender pack download, partner directory (S-14.3/14.5),
So that I can start procurement.

**Acceptance Criteria:**

- **Given** the feature is implemented **When** tested **Then** tender pack PDF downloadable

_Total: 14 epics, 65 stories._
