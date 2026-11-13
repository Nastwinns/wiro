# 11 — Server admin console (self-hosted / sovereign)

Separate admin area (role: server admin), denser tables, same design system; banner shows edition (Community / Sovereign) and support status.

## S-11.1 Overview
Health cards: version, uptime, CPU/RAM/disk, DB & object storage status, sync throughput, active users, last backup, certificate expiry, update available. Alerts list.

## S-11.2 Backups & restore
Schedule (daily/hourly), target (local, S3-compatible, NFS), retention, encryption key status, last runs with size/duration, "Restaurer" wizard (point-in-time, dry-run), restore test report.

## S-11.3 Updates
Channel (stable/LTS), changelog, security advisories (CVE list for Sovereign subscribers), air-gapped upload of signed bundle, verify signature, rollout plan, rollback.

## S-11.4 Tenants (partner multi-tenant mode)
Organisations list, quotas (users, storage), branding per tenant, impersonate-for-support with audit, suspend.

## S-11.5 Subscription
Edition, subscription ID, support level, SLA, renewal date, offline activation file (air-gapped), contact partner. No feature lock in Community (MIT OR Apache-2.0) — only support/LTS status.

## S-11.6 Integrations & config
SMTP, SSO global, AI endpoint (BYO model: URL, model, test), telemetry (off by default in sovereign), storage, rate limits, logs export (syslog/OTel), webhooks.
