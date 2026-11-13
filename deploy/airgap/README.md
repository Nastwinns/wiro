# deploy/airgap — Tier A (sovereign, offline)

Offline install/update bundle per ADR-0011 and UX S-11.3. No outbound traffic by default. Scripts are **skeletons** (image names, `cosign`/`syft`/`skopeo` flags provisional until the first release); `cosign` was not available when written, so only shellcheck was run.

## Bundle format (`ubao-airgap-<version>.tar`)
```
ubao-airgap-<version>/
  manifest.json            format version, app version, schema-migration range, protocol versions
  SHA256SUMS               checksum of every file
  images/*.tar             OCI archives: ubao-server, postgres, caddy (+ CloudNativePG operator & image for Helm, + minio optional)
  chart/ubao-<version>.tgz Helm chart
  sbom/*.cdx.json          CycloneDX SBOM per image and for the chart
  plugins/*.ubx            mandatory first-party plugins (import/export), signed (ADR-0010)
  plugin-registry/         static mirror of the plugin registry index (signed JSON/OCI) for the private marketplace
  docs/                    offline copy of install, upgrade and security docs
  scripts/                 verify.sh, load-images.sh
ubao-airgap-<version>.tar.cosign.bundle   detached signature (Sigstore bundle / pinned key)
```

## Build (connected host)
`./scripts/bundle.sh 1.0.0 dist` → tar + signature. Requires docker, helm, skopeo, cosign, syft (all Apache-2.0).

## Install (disconnected host)
1. Transfer tar + `.cosign.bundle` (USB/diode). Public key `ubao-release.pub` is delivered separately and pinned.
2. `./scripts/verify.sh ubao-airgap-X.tar ubao-release.pub` — **abort on failure**.
3. Extract; `./scripts/load-images.sh ubao-airgap-X registry.local:5000` (or no registry arg to `docker load`).
4. Compose: set `UBAO_IMAGE`/`UBAO_VERSION`. Helm: `helm install ubao chart/ubao-X.tgz --set image.repository=registry.local:5000/ubao/ubao-server --set image.digest=sha256:...`.
5. Point the server plugin registry setting to the mirror; install the bundled plugins from `plugins/`; set `OTEL_ENABLED=false`, `AI_ENABLED=false` unless an internal endpoint exists.

## Update by signed file
Admin console S-11.3 → upload the new tar: server verifies signature (pinned key), checksums and `manifest.json` compatibility (current version within the supported upgrade path, protocol window), then shows a rollout plan. Operators may do the same via CLI/Helm. Always take a backup first ([`backup-restore`](../../docs/ops/backup-restore.md)).

## Rollback
Keep the previous bundle. Rollback = redeploy previous images/chart; if migrations ran, restore the pre-upgrade database backup (schema rollback policy: [`upgrade-and-rollback`](../../docs/ops/upgrade-and-rollback.md)).

## Licences
skopeo, cosign, syft: Apache-2.0. MinIO (AGPL-3.0) is optional and shipped separately flagged.
