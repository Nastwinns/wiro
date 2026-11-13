---
title: System architecture
status: draft v0.3 (BMAD Architect phase) — ADR-0001/0002/0003/0005/0006 accepted; ADR-0004/0007/0008/0009/0010/0011/0012/0013/0014 written as proposed, awaiting measurements/decision by Jean Balin (see §23 and decisions-needed.md)
created: 2026-11-10
updated: 2026-11-11
changes_v0_3: added §17 Deployment, §18 Extensions and plugins, §19 AI and MCP, §20 Multi-organisations, §21 Licensing, §22 Import/export; ADR table (§23) now covers 0001-0014; §7 aligned with ADR-0011
---

# Architecture

## 1. Context (C4 level 1)
```
 Users (desktop app · browser incl. responsive phone/tablet web)          Admins / Partners
          │  local-first edits, sync when online            │
          ▼                                                 ▼
 ┌─────────────────────┐   WebSocket (delta ops)   ┌────────────────────────┐
 │ Client (Tauri / Web)│ ◀───────────────────────▶ │ Wiro Server (Rust)     │──▶ IdP (OIDC/SAML)
 │ TS chrome + Rust/WASM│        HTTPS API          │ sync · API · auth ·     │──▶ SMTP
 │ engines              │                           │ storage · admin         │──▶ Object storage (S3-compatible)
 └─────────────────────┘                           └────────────────────────┘──▶ DB (ADR-0005)
                                                              │ optional ▶ AI endpoint (BYO model)
```

## 2. Client (C4 level 2)
| Layer | Tech | Responsibility |
|---|---|---|
| Shell | Tauri 2 (desktop) / browser (web) | windows, menus, FS, updates, deep links |
| Chrome UI | TypeScript + React + shadcn/ui, tokens | sidebar, panels, dialogs, settings, command palette |
| Docs editor | ProseMirror (ADR-0006) + loro-prosemirror | blocks, rich text, IME, a11y |
| Canvas | `wiro-canvas` + `wiro-render` (Rust→WASM, wgpu: WebGPU / WebGL2) drawing into `<canvas>` | scene graph, hit-test (`rstar`), culling/LOD, input, text (`parley`) |
| Core | `wiro-model`, `wiro-crdt`, `wiro-storage`, `wiro-sync`, `wiro-search`, `wiro-format` (WASM; native in Tauri side where useful) | data model, merge, persistence, sync, search, import/export |
| Bridge | `wasm-bindgen` + `tsify` (typed) | events/commands between chrome and engines; no JSON blobs on hot paths |

Data flow: user input → command → CRDT op → **local WAL write (IndexedDB/OPFS on web, SQLite on desktop)** → render → sync queue → server → broadcast → merge on peers.

## 3. Server
Single Rust binary (`axum` + `tokio`): WebSocket sync relay with per-document rooms, REST/JSON API (+ OpenAPI), auth (OIDC/SAML/magic link/passkeys), permissions, snapshotting & compaction of CRDT history, blob service (S3-compatible), search index (`tantivy`), audit log (append-only, hash-chained), admin API, webhooks, metrics (OpenTelemetry). Storage = PostgreSQL + S3-compatible blobs (ADR-0005). Stateless except storage → horizontal scale behind sticky WS routing.

## 4. Data model (simplified)
`Workspace → Space → Page{kind: doc|board|database, crdt_doc_id}`; Doc = block tree; Board = elements (sticky, shape, connector, text, frame, image, pen, table, embed) with transforms; Database = schema + rows (each row a page). Comments, presence, permissions are separate collections. IDs: UUIDv7.

## 5. Sync & offline
CRDT = **Loro** (ADR-0003): rich text, movable tree, maps, compact encoding, Rust + WASM, MIT. Delta compression; checkpoints; resumable upload; low-bandwidth mode drops presence frequency and media prefetch. Server is authority for permissions only, not for content merge.

## 6. Security
TLS everywhere; encryption at rest (server: envelope encryption with KMS/CMK; client: OS keychain-protected key on desktop); RBAC enforced server-side + signed capability tokens for guest links; audit log; SBOM + signed releases (Sigstore); `cargo deny` licence/advisory gate; CSP strict on web.

## 7. Deployment
| Target | Artefact |
|---|---|
| Dev / small | `docker compose up` (server + Postgres + S3-compatible store or local-disk adapter; see §17 for the object-store licence note) |
| Production / gov | Helm chart (RKE2/K3s), HA, backups, OTel |
| Air-gapped | offline bundle (images, chart, signatures, docs) |
| Managed (Team Cloud) | partner DCs in-country; per-country tenancy (model in §20, ADR-0014) |

Details, tiers and open questions: §17 and ADR-0011.

## 8. Quality attributes → tactics
| NFR | Tactic |
|---|---|
| P1 60 fps @10k | GPU renderer, spatial index, culling, LOD for text/images, dirty-rect, worker threads where available |
| R1 no data loss | WAL before ack, fsync on desktop, crash-recovery replay, chaos tests |
| O1 offline | everything local; server optional |
| B1 bandwidth | binary deltas, zstd, media transcoding server-side, lazy media |
| A1 a11y | DOM chrome; canvas object tree mirrored to accessible DOM list |

## 9. API
- REST/JSON over HTTPS, **OpenAPI 3.1** generated from Rust types (`utoipa`, MIT/Apache) and published with the server; typed TS client generated from it. Realtime = WebSocket (§11), not REST.
- Versioning: path prefix `/v1`; additive changes only within a major; deprecation header + 12-month window; webhooks versioned by payload `version` field.
- Resources: workspaces, spaces, pages, blobs, comments, members, permissions, audit, search, webhooks, plugins (§18), AI/MCP tokens (§19), tenants (§20, partner mode only). Cursor pagination (`?cursor=&limit=`), `If-Match`/ETag on metadata, idempotency keys on POST.
- Errors: RFC 9457 `application/problem+json` (`type`, `title`, `status`, `detail`, `code`, `request_id`); stable machine codes; no internal details.
- Rate limits per token/IP with `Retry-After`; payload caps; all inputs validated at the edge.

## 10. Permissions model
- **RBAC**: roles `owner · admin · editor · commenter · viewer · guest` assigned at workspace, space or page level.
- **Inheritance**: workspace → space → page; most specific grant wins, explicit `deny`/restricted page breaks inheritance; effective permission computed server-side and cached.
- **Capability tokens** (guest/share links): signed (Ed25519), scoped to `{resource, actions, expiry, optional password}`, revocable via server deny-list; never grant above the issuer's rights.
- Enforcement: server filters sync rooms and API; clients receive only readable documents (per-doc rooms). Admin actions are audit-logged (hash-chained).
- Note: CRDT docs are not field-level secured; confidentiality unit = document (page). E2EE for selected pages is out of scope of this version (open question).

```mermaid
flowchart LR
  A[Request / WS join] --> B{Token valid?}
  B -- no --> X[401]
  B -- yes --> C[Resolve principal + capability]
  C --> D[Walk page → space → workspace grants]
  D --> E{Allowed action?}
  E -- no --> Y[403 + audit]
  E -- yes --> F[Serve / join room]
```

## 11. Sync protocol
Transport: WebSocket (binary frames, zstd-compressed batches), one multiplexed connection, room per document.
1. **Handshake**: `hello{protocol_version, client_id, auth, capabilities}` → server `welcome{server_version, limits}`; version mismatch → `426`-style close with upgrade hint.
2. **Join doc**: client sends Loro **version vector** of its local state; server replies with the missing updates (or a snapshot + updates if the gap is large) and its own vector; client pushes ops the server lacks. Peers then exchange incremental updates.
3. **Resume**: on reconnect repeat step 2 per open doc (idempotent, vector-based; no server session state required); exponential backoff + jitter.
4. **Backpressure**: per-room credit windows (server grants N bytes in flight); coalescing of updates (≤ 100 ms batches, longer in low-bandwidth mode); presence/cursors droppable and rate-limited; server can reply `slow_down`; oversized updates rejected with chunked upload path.
5. **Durability**: server ack only after WAL/DB commit; client keeps ops in local WAL until acked (R1).
6. **Compaction**: server snapshots + trims history by policy; shallow snapshots keep recent history for undo/version history.
Open (spike, Story 0.5/S1): Loro update encoding stability across versions → pin versions and test cross-version compatibility.

## 12. Observability
- OpenTelemetry (traces, metrics, logs) via `tracing` + `opentelemetry-otlp` (Apache-2.0); OTLP export optional, off by default (air-gapped friendly); `request_id`/`trace_id` in all logs and error bodies.
- Logs: structured JSON, no document content or PII; levels configurable.
- Key metrics: WS connections/rooms, sync apply latency p50/p95/p99, update size, queue depth/backpressure events, convergence lag, snapshot/compaction duration, DB/S3 latency, API latency/error rate by route, auth failures, storage growth, WAL replay count (client), crash-free sessions.
- Client telemetry is **opt-in**, anonymised, with local-only diagnostics export. Health: `/healthz`, `/readyz`; dashboards + alert rules shipped in the Helm chart.

## 13. Test strategy
| Level | Approach |
|---|---|
| Unit | per-crate `cargo test`, Vitest for TS chrome; coverage tracked, not gated blindly |
| Property-based | `proptest` on model invariants, permission resolution, normalisation (ADR-0007), codecs |
| CRDT convergence / fuzz | random concurrent op sequences across N replicas incl. offline/partition → assert identical state; `cargo-fuzz` on decoders (import formats, sync frames); cross-version update compatibility |
| Integration | server + Postgres + MinIO via testcontainers; sync protocol conformance suite |
| E2E | Playwright (web + Tauri WebDriver), multi-client collaboration, offline/online flips, IME/diacritics (Story 0.5) |
| Performance | canvas bench (ADR-0004), sync load tests (k6/own harness), budgets in §16 enforced in CI on reference machines |
| Chaos / durability | kill -9 mid-write, disk-full, network partition/latency injection (toxiproxy), restore-from-backup drills (R1) |
| Accessibility / i18n | axe + keyboard scripts; pseudo-localisation, RTL snapshots |
All licences of test tooling checked under the same allow-list.

## 14. Supply-chain security
`cargo deny` (licence allow-list + advisories) and JS licence-checker in CI (Story 0.2); `cargo audit`/OSV scan; lockfiles committed, pinned & reviewed updates (Renovate/Dependabot); `cargo vet` or equivalent for critical crates (loro, wgpu, axum); reproducible builds where feasible; SBOM (CycloneDX) per release; artefacts signed with Sigstore + provenance attestations (SLSA ≥ L2 target); GitHub Actions pinned by SHA, least-privilege tokens; secret scanning; WASM/engines built in CI only; clean-room guard report on PRs (AGENTS.md).

## 15. i18n / RTL
UI languages v1: FR, EN, then AR (RTL), and Wolof/Hausa/Yoruba/Swahili as community-driven. Strings externalised (ICU MessageFormat; `i18next`-style on TS, `fluent-rs` (Apache-2.0 OR MIT) / ICU4X (Unicode-3.0, see ADR-0007 licence gate) on Rust side), +30 % expansion tolerance (NFR-I1), logical CSS properties, mirrored layout & icons for RTL, bidi-aware text in editor and canvas (`parley` + ICU4X, MIT-style Unicode licence verified), fonts bundled/subset per script (Noto, OFL — fonts only, not code) with lazy load, IME composition safe in docs and canvas text, locale-aware dates/numbers/currency (XOF/NGN/KES), search normalisation (ADR-0007).

## 16. Performance budget (numbers; owned by NFR)
| Area | Budget |
|---|---|
| Canvas pan/zoom, 10k objects (NFR-P1) | 60 fps p50, ≥ 30 fps p95, on 4 GB/iGPU |
| Input latency (NFR-P2) | < 50 ms p95 |
| Cold start desktop / web shell (NFR-P3) | < 2 s / < 3 s on 3G-fast; initial web JS+WASM ≤ 1.5 MB gz |
| Renderer WASM / search WASM / CRDT WASM | < 600 KB / < 150 KB / < 400 KB gz [ASSUMPTION] |
| Memory 10k-object board (NFR-P4) | < 600 MB RSS desktop; < 400 MB @ 5k mobile |
| Sync | idle ≤ 1 MB/h (NFR-B1); op apply < 5 ms p95; reconnect-to-synced < 2 s on 3G for a 1 MB doc diff |
| Server | 1 vCPU/2 GB handles ≥ 200 concurrent editors [ASSUMPTION, to measure] |
| Search | < 50 ms p95 desktop (ADR-0007) |
Budgets are checked by the bench jobs (§13); regressions > 10 % fail CI.

## 17. Deployment (ADR-0011, proposed)
Three supported tiers, one artefact family (signed OCI images, CycloneDX SBOM, pinned versions, `.env.example`, sizing page):
| Tier | Target | Components |
|---|---|---|
| S | compose, ≤ 50 users, 1 vCPU / 2 GB [ASSUMPTION] | server + PostgreSQL ≥ 15 + blob store (S3-compatible or local-disk adapter) + Caddy; `ubao init` wizard |
| P | Helm, HA | server Deployment (N replicas, sticky WebSocket routing), PostgreSQL via CloudNativePG or customer-provided, customer S3, Ingress, NetworkPolicies, PDB, dashboards/alerts, optional OTLP |
| A | air-gapped bundle | images, charts, signatures, SBOM, docs; offline update by signed file; no outbound traffic by default |
No Redis, Elasticsearch or message broker; no custom Kubernetes operator in v1. Mandatory: server, PostgreSQL, blob storage, TLS proxy (production). Optional: SMTP (needed for magic link), IdP, AI endpoint (§19), OTLP collector.

```mermaid
flowchart TB
  subgraph S["Tier S: compose (small)"]
    S1[Caddy] --> S2[Ubao server]
    S2 --> S3[(PostgreSQL)]
    S2 --> S4[(Blobs: disk or S3)]
  end
  subgraph P["Tier P: Helm (HA)"]
    P1[Ingress + TLS] --> P2[Ubao server x N]
    P2 --> P3[(PostgreSQL via CloudNativePG)]
    P2 --> P4[(Customer S3)]
    P2 -.optional.-> P5[OTLP collector]
    P2 -.optional.-> P6[AI endpoint BYO]
  end
  subgraph A["Tier A: air-gapped bundle"]
    A1[Signed bundle: images + charts + SBOM] --> A2[Isolated cluster]
    A2 --> A3[Private plugin mirror]
    A2 --> A4[Local model optional]
  end
```
Notes: the object store must respect the dependency licence rule for what we **ship** in the bundle; MinIO is AGPL-3.0, so the default shipped store is a permissively licensed one (e.g. SeaweedFS, Apache-2.0) or the disk adapter, pending maintainer decision (decisions-needed.md D-5). Several server replicas each hold a `tantivy` index; the index is rebuilt from storage and kept per node or shared through snapshotting — to settle in the sync/search spike (decisions-needed.md C-7).

## 18. Extensions and plugins (ADR-0010, proposed)
- **Client**: sandboxed iframes (`sandbox="allow-scripts"`, no same-origin, strict CSP) with a typed postMessage SDK for UI plugins, doc blocks and canvas widgets. **Server**: WASM components (WASI 0.2) in `wasmtime`, capability-based, for importers/exporters, jobs and webhooks. **Connectors / AI tools**: MCP (§19). Templates and themes are data-only packages.
- One manifest (`ubao-plugin.toml`/JSON), declared permissions and network allow-list, permission broker, rate limits, kill switch, audit events. Package `.ubx` = manifest + payload + SBOM + Sigstore signature bound to the publisher identity; permission increase on update requires re-consent.
- **Certification and trust tiers**: Core (project, bundled), Verified (identity checked + automated pipeline + human review), Community (signed, automated only), Private (organisation allow-list). Pipeline: manifest/permission lint, CycloneDX SBOM, licence allow-list, advisories, sandbox/escape tests, size/perf budget. Revocation list and kill switch synced and enforced offline. Sovereign mode: allow-list, pinned versions, mirrored registry (static, mirrorable index).
- SDKs MIT; semver with a 12-month API compatibility window (§9).

```mermaid
sequenceDiagram
  participant Dev as Publisher
  participant CI as Certification pipeline
  participant Reg as Registry / mirror
  participant Adm as Workspace admin
  participant Host as Plugin host (client iframe / server WASM)
  Dev->>CI: submit .ubx (manifest, payload, SBOM)
  CI->>CI: lint, licence, advisories, sandbox tests
  CI->>Reg: sign (Sigstore) and list tier (Community / Verified)
  Adm->>Reg: browse or mirror (air-gapped import)
  Adm->>Host: install + consent to permissions and scope
  Host->>Host: verify signature + revocation list
  Host->>Host: run sandboxed, broker enforces permissions
  Host-->>Adm: audit events, kill switch
```

## 19. AI and MCP (ADR-0013, proposed)
AI is **off by default**; when enabled it is routed through a server-side gateway (`ubao-ai`) to an admin-configured provider (Ollama, vLLM, OpenAI-compatible). Context is built server-side from what the requesting user may read; the data-boundary class (`local` / `in-country` / `external`) is enforced at config and connect time. Suggestions (ghost text, inline blocks, ghost objects, N variants) are client-local overlay state, not in the CRDT and not synced until accepted; acceptance writes ordinary Loro ops as the human with an `ai_origin` mark. Autonomy L0–L3, approval gates outside the current page, hash-chained audit with actor + sponsor. **MCP server** (streamable HTTP, thin adapter over the public API): `search`, `get_page`, `list_board_objects`, `create_page`, `append_blocks`, `create_stickies`, `create_tasks`, `add_comment`; per-space scoped tokens, always intersected with the sponsor's rights; external-agent writes are proposals by default. MCP client is allow-list only in sovereign mode. Plugins reach AI only via the host capability `ai.complete`.

```mermaid
sequenceDiagram
  participant Ag as Agent (Claude Desktop / OpenCode / assistant panel)
  participant M as MCP server / AI gateway
  participant P as Permission engine
  participant Pr as Proposal store
  participant U as Sponsor (human)
  participant A as Audit log
  Ag->>M: tool call + scoped token
  M->>P: token scope AND sponsor permissions
  P-->>M: allowed / denied
  alt read tool
    M-->>Ag: permission-filtered result (marked untrusted)
  else write tool
    M->>Pr: store proposal (not in CRDT)
    M-->>U: ghost preview + approval gate
    U->>Pr: accept / modify / reject
    Pr->>M: apply as user-attributed batch (ai_origin mark)
  end
  M->>A: actor, sponsor, tool, targets, decision, batch_id
```

## 20. Multi-organisations (ADR-0014, proposed)
Tenant abstraction with a control plane (`ubao_control`: tenants, domains, quotas, branding, operators) and a data plane per tenant: **schema-per-tenant by default, database-per-tenant for dedicated tenants**; single-tenant installs have one implicit `default` tenant (same code path). Host → tenant routing, per-tenant blobs, search index, audit chain and data key. Quotas (users, storage, rate, AI, plugins) with soft/hard limits that never delete data. White-label via runtime theme tokens (contrast-checked accent, logo, domain, emails). Support impersonation: separate operator principal, reason required, read-only by default, time-boxed, banner shown, audited in both the tenant and operator chains, denied by default for sovereign tenants. Per-tenant export for offboarding. The partner control plane is a separable module so ADR-0012 can place it either way.

## 21. Licensing (ADR-0012, proposed)
Current rule remains MIT for all code until the maintainer decides (ADR-0001, AGENTS.md rule 1, PRD NFR-L1). ADR-0012 recommends (proposed, with counsel) option B: everything an organisation needs to host Ubao for itself stays MIT; only third-party hosting features (multi-tenant partner control plane, fleet admin, metering, large-scale white-label) could be commercial; plus a trademark policy and a CLA-vs-DCO choice before the first external contribution. Architectural consequences already adopted so that any outcome stays cheap: (1) the tenancy seam of §20 and plugin/AI modules are separate crates with per-package SPDX headers; (2) the dependency allow-list (MIT/Apache-2.0/BSD/ISC/Zlib; Unicode-3.0 pending ADR-0007) applies to every option; (3) no feature lock in Community builds beyond that boundary (UX S-11.5). Nothing here is legal advice.

## 22. Import / export (mandatory plugins)
All importers and exporters are first-party **mandatory plugins** (FR8.4): signed, bundled in every release including the air-gapped bundle, work offline on local files, cannot be uninstalled (an admin may hide them from menus). Server side they are WASM components; the desktop app performs the same conversions locally.
| Direction | Formats |
|---|---|
| Import | Notion (zip), Miro (backup/CSV where available), **Word (.docx)**, **Excel/CSV (.xlsx → database)**, Figma (REST API with user token, or SVG/PNG; no reverse-engineered `.fig`), Markdown folder, Excalidraw, PDF/images to board |
| Export | PDF (real text), **Word (.docx)**, **Excel (.xlsx) and CSV** (databases), **PowerPoint (.pptx)** (frames as slides), Markdown + assets, PNG/SVG, open JSON |
Rules: parsing/writing libraries must be MIT/Apache/BSD (candidates to verify with `cargo deny`: `calamine`, `rust_xlsxwriter`, `docx-rs`, `krilla`, `zip`; a `.pptx` writer is still to be identified, possibly a thin own writer over `zip` + OOXML templates); decoders are fuzzed (§13); imports are resumable, previewed and undoable as one batch; each format documents its fidelity limits (e.g. comments are not exported to Word). Clean-room applies: formats are implemented from public specifications (ECMA-376, ISO 32000), never from copied code.

## 23. ADR status
Full index with dependencies: `docs/architecture/adr/README.md`. Pending maintainer decisions: `docs/architecture/decisions-needed.md`.
| ADR | Topic | Status |
|---|---|---|
| 0001 | Rust core, MIT licence (licence part under review by 0012) | accepted |
| 0002 | UI shell (Tauri 2 + TS chrome + Rust/WASM engines) | accepted |
| 0003 | CRDT engine (Loro) | accepted |
| 0004 | Canvas rendering (vello_gpu/vello_cpu vs custom wgpu) + bench protocol | proposed — awaiting bench (S0, Story 0.4) |
| 0005 | Server storage (PostgreSQL + S3-compatible) | accepted |
| 0006 | Docs editor (ProseMirror + loro-prosemirror) | accepted |
| 0007 | Client search (own index + shared normaliser; tantivy server) | proposed — awaiting spike |
| 0008 | Mobile shell (PWA first, Tauri 2 mobile, TWA fallback) | proposed — awaiting Story 0.4 measures |
| 0009 | Legal/billing entity | proposed — skeleton, business decision by Jean Balin |
| 0010 | Plugin & extension system (+ certification, mandatory plugins) | proposed — decision by Jean Balin |
| 0011 | Deployment & operations (3 tiers) | proposed — decision by Jean Balin |
| 0012 | Licensing strategy | proposed — with counsel, before the repository goes public |
| 0013 | AI and agents (BYO model, MCP server and client) | proposed — decision by Jean Balin |
| 0014 | Multi-organisations (partner mode) and tenant model | proposed — decision by Jean Balin |
