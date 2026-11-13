# Upgrade and rollback

Open question 5 of ADR-0011 (rollback policy, compatibility window) is undecided; this page states the **proposed** policy **[ASSUMPTION]**.

## Principles
- Versions are pinned (tag + digest). Never use `latest` in production.
- Always back up before upgrading ([backup-restore](backup-restore.md)).
- Upgrade path: N → N+1 minor, or to any release within the same LTS line; skipping majors is unsupported.
- Schema migrations run automatically at server start under a Postgres advisory lock (one replica migrates, others wait).

## Migrations: expand / contract
Migrations are **forward-only and backward-compatible for one minor version**: release N adds columns/tables (expand), release N+1 may remove what N no longer uses (contract). This lets N-1 binaries run on the N schema, so a rolling update and a binary rollback are safe **within one minor**. Destructive migrations are never mixed with a feature release and are called out in the changelog.

## Sync protocol compatibility
Clients and servers negotiate a protocol version in the WebSocket handshake. Proposed window: the server accepts the current and previous protocol major version; the 12-month API compatibility window of ADR-0010 applies to the plugin API. During a rolling update both server versions must speak a common version; incompatible clients get a clear "update required" message and keep working offline (CRDT updates queue locally and replay after update). Desktop clients update via their own channel (ADR-0011 item 8).

## Procedure
**Compose:** backup → change `UBAO_VERSION` → `docker compose pull && docker compose up -d` → check `docker compose ps`, `/healthz`.
**Helm:** backup → `helm diff`/`helm template` review → `helm upgrade ubao ... --set image.tag=X --atomic --timeout 10m`. Rolling strategy has `maxUnavailable: 0`; PDB keeps ≥ 1 replica.
**Air-gapped:** verify the signed bundle, load images, then as above ([deploy/airgap](../../deploy/airgap/README.md)).

## Rollback
| Situation | Action |
|---|---|
| Failure before/while migrating | `helm rollback` / redeploy previous tag; schema unchanged |
| Migrations applied, within one minor | redeploy previous binary (compatible by expand/contract) |
| Contract migration applied or data corrupted | restore the pre-upgrade backup (data written since is lost — hence maintenance mode during major upgrades) |
Document the observed rollback time in the release notes.

## Release gates (proposed)
Upgrade test from the previous release with seeded data; rolling-update test with two versions live; restore drill passing.
