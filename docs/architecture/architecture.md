---
title: System architecture
status: draft v0.1 (BMAD Architect phase) — ADR-0002/0003/0005/0006 accepted; ADR-0004/0007 pending
created: 2026-11-10
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
| Dev / small | `docker compose up` (server + Postgres + MinIO) |
| Production / gov | Helm chart (RKE2/K3s), HA, backups, OTel |
| Air-gapped | offline bundle (images, chart, signatures, docs) |
| Managed (Team Cloud) | partner DCs in-country; per-country tenancy |

## 8. Quality attributes → tactics
| NFR | Tactic |
|---|---|
| P1 60 fps @10k | GPU renderer, spatial index, culling, LOD for text/images, dirty-rect, worker threads where available |
| R1 no data loss | WAL before ack, fsync on desktop, crash-recovery replay, chaos tests |
| O1 offline | everything local; server optional |
| B1 bandwidth | binary deltas, zstd, media transcoding server-side, lazy media |
| A1 a11y | DOM chrome; canvas object tree mirrored to accessible DOM list |

## 9. Pending ADRs
ADR-0004 canvas rendering details (vello_gpu vs custom wgpu) · ADR-0007 search on WASM · ADR-0015 responsive web instead of native mobile apps (decided 2026-11-11, supersedes ADR-0008 mobile shell) · ADR-0009 legal/billing entity.
