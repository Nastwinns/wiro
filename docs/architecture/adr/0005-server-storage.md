# ADR-0005 — Server storage

- Status: **accepted** (Jean Balin, 2026-11-10)
- Date: 2026-11-10

## Context
See docs/architecture/project-structure.md and docs/research/competitive-audit.md (perf P1, data-loss P2, offline P3).

## Options
1. PostgreSQL + S3-compatible object store
2. SQLite (single binary) + optional Postgres for scale

## Decision
**PostgreSQL only** (metadata, permissions, audit, CRDT snapshots/updates) + S3-compatible object storage (MinIO/Ceph/SeaweedFS or disk adapter) for blobs.

## Consequences
- docker compose ships Postgres; minimal footprint target: 1 vCPU / 2 GB RAM for ≤ 50 users.
- HA via standard Postgres tooling (CloudNativePG operator in Helm chart).
- Air-gapped bundle includes Postgres image.
- Desktop client local store remains SQLite (client-side, not server) — unaffected.
