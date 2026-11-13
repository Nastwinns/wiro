# Deployment guide

Implements ADR-0011 (status: proposed). Artefacts live in `deploy/`. Sizing figures are **[ASSUMPTION]** until sync load tests (architecture §16) exist.

## 1. Tiers
| Tier | Target | Artefact | Prerequisites |
|---|---|---|---|
| S — compose | ≤ 50 users, 1 vCPU / 2 GB [ASSUMPTION] | `deploy/compose` | Docker ≥ 24 + Compose v2, DNS, ports 80/443 |
| P — Helm | production, HA | `deploy/helm/ubao` | Kubernetes ≥ 1.27, Ingress controller, PostgreSQL ≥ 15 (CloudNativePG or customer), S3 storage, optional Prometheus Operator |
| A — air-gapped | sovereign | `deploy/airgap` | private registry or Docker, signed bundle, pinned public key |

Components: server (required), PostgreSQL ≥ 15 (required), blob storage S3-compatible or disk (required), TLS proxy (production), SMTP (recommended; required for magic link), IdP, AI endpoint, OTLP collector (optional, off by default). No Redis/Elasticsearch/broker.

## 2. Variable matrix
| Variable | Tier S | Tier P | Notes |
|---|---|---|---|
| `DATABASE_URL` | `.env` | Secret / CNPG | secret |
| `STORAGE` | `s3`\|`disk` | `s3` (disk needs RWX, discouraged) | |
| `S3_ENDPOINT/REGION/BUCKET/FORCE_PATH_STYLE` | `.env` | ConfigMap | |
| `S3_ACCESS_KEY/S3_SECRET_KEY` | `.env` | Secret | secret |
| `PUBLIC_URL`, `PUBLIC_HOST` | `.env` | `publicUrl`, `ingress.host` | |
| `AUTH_MODE` | `magic_link`\|`password`\|`oidc` | same | |
| `OIDC_ISSUER_URL/CLIENT_ID/SCOPES`, `OIDC_CLIENT_SECRET` | `.env` | ConfigMap / Secret | |
| `SMTP_HOST/PORT/FROM/TLS`, `SMTP_USER/PASSWORD` | `.env` | ConfigMap / Secret | |
| `TOKEN_SIGNING_KEY` (Ed25519), `ENCRYPTION_KEY`, `ENCRYPTION_KEYRING` (`env`\|KMS ref) | `.env` | Secret | secret; CMK timing = ADR-0011 Q6 |
| `AI_ENABLED/ENDPOINT/MODEL`, `AI_API_KEY` | off by default | same | |
| `OTEL_ENABLED`, `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME` | off | off | |
| `LOW_BANDWIDTH_DEFAULT`, `GUEST_ACCESS`, `RUST_LOG` | policies | policies | |
Full documented list: `deploy/compose/.env.example`. Variable names are provisional until the server config is implemented.

## 3. Ports and flows
| From → to | Port |
|---|---|
| Client → proxy/Ingress | 443 (TCP, UDP for HTTP/3) ; 80 for ACME |
| Proxy → server | 8080 (HTTP + WebSocket) |
| Server → PostgreSQL | 5432 |
| Server → S3 | 443 / 9000 |
| Server → SMTP / IdP / AI / OTLP | 587 or 465 / 443 / 443 / 4317-4318 (only if enabled) |

## 4. Security
- TLS everywhere at the edge (Caddy automatic or Ingress + cert-manager); HSTS enabled; internal-CA option for air-gap.
- Secrets: env file mode 600 (compose) or Kubernetes Secret via External/Sealed Secrets; never in git or `values.yaml`. Back up keys separately.
- Containers: distroless, non-root (65532), read-only root fs, all caps dropped, `no-new-privileges`.
- Network: compose `internal` network for Postgres/MinIO; Helm NetworkPolicy allows ingress only from the ingress namespace and egress only to DNS, PostgreSQL, S3 and declared extras (SMTP, IdP, OTLP).
- Supply chain: cosign-signed images, CycloneDX SBOM, pinned digests, permissive licences only (MinIO is AGPL-3.0 and optional, run as a separate process).

## 5. High availability
- Server is stateless: `replicaCount ≥ 2`, PDB `minAvailable 1`, topology spread, `maxUnavailable 0` rolling updates.
- WebSocket sync needs sticky routing (cookie or source-IP affinity) so a room's clients land on one replica where possible; cross-replica fan-out strategy and per-room placement are ADR-0011 Q7 (open). Long proxy timeouts (3600 s) are configured.
- PostgreSQL HA: CloudNativePG (3 instances) or the customer's platform. Blob HA: S3 provider's durability.

## 6. Backup and restore
See [`docs/ops/backup-restore.md`](../ops/backup-restore.md). Upgrades: [`docs/ops/upgrade-and-rollback.md`](../ops/upgrade-and-rollback.md).

## 7. Supervision
`/healthz` (liveness/readiness), Prometheus `/metrics` via optional ServiceMonitor, shipped alert rules and Grafana dashboard (skeleton; metric names are **[ASSUMPTION]**), optional OTLP traces/logs. Admin console S-11.1 surfaces health, last backup, certificate expiry.

## 8. Customer acceptance checklist
- [ ] Install completed in < 15 min from prerequisites (NFR-D1); time recorded
- [ ] `PUBLIC_URL` reachable over valid TLS; HSTS present
- [ ] Admin created; login works in the chosen auth mode (magic link/OIDC)
- [ ] Two clients edit the same doc/canvas; sync works, WebSocket survives a replica restart (Tier P)
- [ ] Upload and download an attachment (blob storage verified)
- [ ] SMTP test mail received; SSO test passed if used
- [ ] Backup run executed **and** restore drill completed on an isolated environment
- [ ] Secrets stored outside the repo; encryption key escrowed
- [ ] Image signatures and SBOM verified (mandatory in Tier A)
- [ ] Mandatory plugins (import/export) present; plugin registry mirror configured (Tier A)
- [ ] Telemetry/AI off unless explicitly approved
- [ ] Monitoring and alerts wired; upgrade and rollback procedure handed over
