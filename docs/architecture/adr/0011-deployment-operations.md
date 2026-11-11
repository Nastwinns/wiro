# ADR-0011 — Deployment & operations model

- Status: **proposed** (decision by Jean Balin)
- Date: 2026-11-11

## Context
Customers range from a 5-person startup on a $5 VPS to a ministry with an air-gapped Kubernetes cluster. Existing decisions: single Rust server binary (architecture §3), PostgreSQL + S3-compatible blobs (ADR-0005), compose / Helm / air-gapped bundle (PRD FR11.1, NFR-D1: install < 15 min), OpenTelemetry optional and off by default. `deploy/*` only contains placeholder READMEs. Sizing figures below are **[ASSUMPTION]** to be measured.

## Mandatory vs optional components
| Component | Required | Notes |
|---|---|---|
| Ubao server (stateless binary / OCI image) | yes | embeds sync relay, API, auth, search index (tantivy), admin API; several replicas behind sticky WebSocket routing |
| PostgreSQL ≥ 15 | yes | metadata, permissions, audit, CRDT snapshots/updates |
| Blob storage | yes | S3-compatible (MinIO, Ceph, SeaweedFS, cloud S3) **or** local-disk adapter for small installs |
| TLS reverse proxy | yes in production | Caddy (compose) / Ingress (Helm) |
| SMTP | recommended | required for magic-link sign-in |
| IdP (OIDC/SAML) | optional (expected for public sector) | |
| AI endpoint (BYO) | optional | off by default |
| OTLP collector | optional | off by default (air-gap friendly) |
| Redis / Elasticsearch / message broker | **no** | avoided to keep the footprint small |

## Options
1. **Three supported tiers**, one artefact family: compose (small), Helm (production), air-gapped bundle (sovereign).
2. Helm only (compose as unsupported example).
3. Kubernetes operator (custom CRDs) from v1.
4. Managed-only (no self-host support) — rejected: contradicts the product promise.

## Recommendation
Option 1.
- **Tier S — compose** (≤ 50 users, 1 vCPU / 2 GB target): server + Postgres + MinIO or disk + Caddy; `.env` driven; `ubao init` wizard (create admin, test DB/S3/SMTP/SSO).
- **Tier P — Helm** (HA): server Deployment (N replicas), Postgres via **CloudNativePG** (HA, backups) or customer-provided, S3 of customer, Ingress, NetworkPolicies, PodDisruptionBudget, dashboards/alerts shipped, optional OTLP.
- **Tier A — air-gapped bundle**: images, charts, signatures, SBOM, docs; offline update by signed file (UX S-11.3); no outbound traffic by default.
- **No custom operator in v1**: Helm + CloudNativePG cover it; an operator is deferred (multi-tenant fleet management, orchestrated upgrades) and may be part of the commercial partner tooling (see ADR-0012).
- Artefacts: signed OCI images (Sigstore), CycloneDX SBOM, pinned versions, `.env.example`, a sizing/prerequisites page.

## Minimal configuration
`DATABASE_URL`; `STORAGE=s3|disk` with `S3_ENDPOINT/BUCKET/ACCESS_KEY/SECRET_KEY` or disk path; `PUBLIC_URL`; auth mode (magic link / password / OIDC); `SMTP_*`; token-signing key (Ed25519) and encryption key (local keyring or KMS); optional `AI_*`, `OTEL_*`, low-bandwidth and guest policy. Secrets only via env or secret manager, never in the repo.

## Open questions (maintainer)
1. Is local-disk blob storage an officially supported production path, or dev/small only?
2. Postgres in production: require customer-provided, or ship CloudNativePG by default?
3. Multi-tenant partner mode: schema-per-tenant vs database-per-tenant.
4. Backups: who orchestrates (pg_dump + versioned S3 snapshots), and restore-test cadence (NFR-R1).
5. Schema-migration rollback policy and protocol-version compatibility window.
6. Customer-managed keys (CMK) in v1 or later.
7. HA topology limits: replicas, sticky routing, per-room placement.
8. Desktop/mobile client signing and update channel are separate (Tauri), not covered here.

## Decision
_pending_

## Consequences
- Fill `deploy/compose`, `deploy/helm`, `deploy/airgap`, `deploy/docker` (currently placeholder READMEs); Stories 11.1 and 11.2 depend on this ADR.
- CI builds and signs images; installation test (< 15 min) and restore drill become release gates.
- Sizing numbers must come from the sync load tests (architecture §16).
