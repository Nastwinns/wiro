# Backup and restore

Applies to all tiers (ADR-0011, NFR-R1). Open question 4 of ADR-0011 (who orchestrates, drill cadence) is not decided: the defaults below are proposals **[ASSUMPTION]**.

## What to back up
| Data | Where | Method |
|---|---|---|
| PostgreSQL (metadata, permissions, audit, CRDT snapshots/updates) | compose: `pgdata`; Helm: CNPG or external | `pg_dump -Fc` nightly + WAL archiving/PITR where available (CNPG `barmanObjectStore`) |
| Blobs | S3 bucket / `blobs` volume | bucket versioning + replication, or `rclone`/`mc mirror`; disk mode: filesystem snapshot or `rsync` |
| Secrets & keys (`TOKEN_SIGNING_KEY`, `ENCRYPTION_KEY`) | `.env` / Secret / KMS | offline escrow, separate from data backups. **Without the encryption key, restored data is unreadable.** |
| Configuration | `.env`, `values.yaml` | version in the customer's own private repo (no secrets) |
The search index (tantivy) is derived data and rebuilt after restore.

## Consistency
Take the DB dump first, then the blobs (blobs are append-only/content-addressed, so extra blobs are harmless; missing blobs are not). For a stricter guarantee, stop writes (maintenance mode) during the snapshot.

## Compose
```sh
docker compose exec -T postgres pg_dump -U ubao -Fc ubao > backup/ubao-$(date +%F).dump
docker compose --profile minio run --rm minio-init mc mirror local/ubao /backup/blobs   # or copy the volume
```
Restore:
```sh
docker compose stop ubao
docker compose exec -T postgres dropdb -U ubao --if-exists ubao && docker compose exec -T postgres createdb -U ubao ubao
docker compose exec -T postgres pg_restore -U ubao -d ubao --no-owner < backup/ubao-YYYY-MM-DD.dump
# restore blobs, then:
docker compose up -d ubao
```

## Kubernetes (CNPG)
Enable `cnpg.backup`; create a `Backup`/`ScheduledBackup`; restore by bootstrapping a new `Cluster` with `recovery` from the object store (PITR via `targetTime`). Restore into a **new** cluster, validate, then switch `DATABASE_URL`.

## Retention (proposal)
Daily 30 days, weekly 12 weeks, monthly 12 months; encrypt backups at rest; keep one copy off-site/off-cluster.

## Restore drill (release gate, proposed cadence: quarterly + before each major release)
1. Restore the latest backup into an isolated environment.
2. Start the same server version; check `/healthz`, log in, open a sample doc and canvas, download an attachment.
3. Record RPO/RTO measured and produce the restore-test report (shown in admin S-11.2).
Targets: RPO ≤ 24 h (≤ 5 min with WAL archiving), RTO ≤ 2 h **[ASSUMPTION]**.
