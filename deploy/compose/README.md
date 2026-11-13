# deploy/compose — Tier S (small installs)

Server + PostgreSQL + (MinIO **or** disk) + Caddy (automatic TLS). Specified by ADR-0011.
Target: install in **< 15 minutes** (NFR-D1), ≤ 50 users.

> Status: the server image is not published yet; `UBAO_VERSION=0.0.0-placeholder` must be replaced by a real release tag.

## Prerequisites
- Linux host (x86_64 or arm64), Docker Engine ≥ 24 with the Compose plugin v2.
- DNS A/AAAA record for `PUBLIC_HOST`; ports 80/443 (TCP+UDP) reachable for ACME.
- Sizing **[ASSUMPTION — to be measured by sync load tests]**: 1 vCPU / 2 GB RAM / 20 GB disk for ≤ 50 users.

## Install
```sh
cp .env.example .env
# fill PUBLIC_URL, PUBLIC_HOST, secrets (openssl rand -base64 32), SMTP or OIDC
docker compose --profile minio up -d      # S3 (bundled MinIO)
# or: STORAGE=disk in .env, then
docker compose up -d                      # blobs on a local volume
docker compose exec ubao ubao-server init # wizard: admin account, DB/S3/SMTP/SSO checks (planned CLI)
```
Validate the file: `docker compose --env-file .env config -q`.

Storage choice: disk mode is simplest but has no versioning and no off-host redundancy; see ADR-0011 open question 1.

## Upgrade
Pin the new `UBAO_VERSION`, then `docker compose pull && docker compose up -d`. Back up first; see
[`docs/ops/upgrade-and-rollback.md`](../../docs/ops/upgrade-and-rollback.md).

## Backup
Nightly `pg_dump` plus bucket/volume copy; full procedure and restore drill in
[`docs/ops/backup-restore.md`](../../docs/ops/backup-restore.md).
```sh
docker compose exec -T postgres pg_dump -U ubao -Fc ubao > ubao-$(date +%F).dump
```

## Licences of the images used
Caddy (Apache-2.0), PostgreSQL (PostgreSQL licence), MinIO (**AGPL-3.0**, separate optional process, never linked or modified; use disk mode or customer S3 if AGPL services are forbidden).

## Security notes
Postgres/MinIO are on an `internal` network with no published ports. Secrets live only in `.env` (mode 600, git-ignored).
