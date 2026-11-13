# ADR-0014 — Multi-organisations (partner mode) and tenant model

- Status: **proposed** (decision by Jean Balin)
- Date: 2026-11-11
- Related: PRD FR11.3 (multi-tenant for partners), FR11.4 (white-label); UX S-11.4 (Tenants), S-10.9 (branding); ADR-0005 (PostgreSQL + S3), ADR-0011 (open question 3), ADR-0012 (licensing, option B); Story 11.4; master-plan §6 (partner programme)
- Not legal advice. Numbers are **[ASSUMPTION]** until measured.

## Context
Partners (persona P6: local integrators and hosters in SN / CI / KE) must host **several organisations** on one deployment, brand them, set quotas, and support them, while each organisation's data stays isolated. PRD §6 places multi-tenant mode after the first sellable release. ADR-0011 left open "schema-per-tenant vs database-per-tenant" and kept an operator/fleet tool out of v1. ADR-0012 recommends (proposed) that features whose purpose is operating Ubao **as a service for third parties** — multi-tenant partner mode, fleet admin, metering, large-scale white-label — be the commercial boundary, while everything an organisation needs to host Ubao for itself stays MIT.

Requirement: single-organisation installs (the majority, incl. sovereign) must pay **no complexity cost** and must not need a licence for the tenancy machinery they do not use.

## Isolation models compared
| # | Model | Isolation | Ops cost | Per-tenant backup/restore | Residency / keys | Scale |
|---|---|---|---|---|---|---|
| A | Shared schema, `tenant_id` column (+ Postgres RLS) | weakest (one bug = leak) | lowest | hard (row extraction) | no | thousands of tenants |
| B | **Schema per tenant** in one database | strong at SQL level (search_path / role per schema) | migrations run N times; pooling in transaction mode needs care | `pg_dump -n` per tenant — easy | same cluster only | hundreds of tenants per cluster |
| C | **Database per tenant** (same cluster or different clusters) | strongest logical isolation; cross-tenant query impossible | more connections/pools, more migrations, more monitoring | trivial (per-DB PITR if separate cluster) | per tenant cluster, key and country possible | tens to low hundreds |
| D | **Instance per tenant** (own server + DB, Helm release/namespace) | physical isolation | highest; needs fleet tooling (the deferred operator) | complete | full | tens |

## Recommendation
**A tenant abstraction with two supported storage placements: B by default, C for "dedicated" tenants** (D remains the fleet-tooling path for very large or hostile-isolation customers and reuses ADR-0011 tiers unchanged). Rationale: small African tenants (5–50 users) would be wasteful as separate databases; sovereign or public-sector tenants need per-tenant backups, keys and possibly another cluster/country, which C provides; A is rejected because a single missing filter leaks data.

### Tenant model
- **Control plane** (one small schema `ubao_control`): `tenants` (id UUIDv7, slug, status, placement, region), `domains` (host → tenant), `quotas`, `branding`, `operators`, `support_sessions`. **Data plane**: everything else (ADR-0005 tables, CRDT snapshots) lives in the tenant's schema or database.
- **Single-tenant installs have exactly one implicit tenant** `default` (no control-plane UI, no host routing). One code path; multi-tenant is configuration, not a fork.
- Request routing: host (`org.partner.tld` or custom domain) → tenant → connection with `search_path`/role locked to that tenant's schema (or the tenant's database pool). Role per tenant with `USAGE` only on its schema; the server never builds table names from user input. Sync rooms are keyed `tenant + doc`; WebSocket join re-checks tenant.
- Pooling: use session-level `SET LOCAL search_path` inside a transaction (safe with transaction pooling) or one role per tenant; decision validated by a spike (see Measures).
- **Blobs**: one bucket per tenant for C, key prefix + per-tenant IAM/credentials for B (never a shared credential in the request path without prefix enforcement). Search index (tantivy) per tenant. Audit log hash chain per tenant (plus an operator chain, below).
- **Identity**: users belong to a tenant; the same email in two tenants is two accounts (no cross-tenant identity in v1). IdP (OIDC/SAML) configured per tenant. Guest links and capability tokens carry the tenant id and are invalid elsewhere.
- **Encryption**: per-tenant data key (envelope) wrapped by the partner or tenant KMS; links to customer-managed keys (ADR-0011 question 6) — per-tenant keys make CMK a natural fit.
- **Migrations**: versioned; the control plane runs them tenant by tenant with a recorded `schema_version`, resumable, and a tenant can lag by one minor version for a rolling upgrade; failed tenants are quarantined (suspended read-only) rather than blocking others.
- **Offboarding/portability**: per-tenant full export (open JSON + blobs) and restore into a single-tenant install — a tenant can always leave to self-host.

### Quotas
Per tenant, enforced server-side with soft (warn at 80 %) and hard limits: active users and guests, storage bytes, blob size, pages/boards, concurrent WebSocket connections, API and sync rate, AI requests/tokens (ADR-0013), installed plugins and plugin CPU/memory budget (ADR-0010). Metering counters exported (OTel/Prometheus) for the partner's own billing; usage shown in S-11.4. Exceeding a hard quota blocks creation, never destroys data; suspension keeps read-only export access.

### White label
Per tenant: name shown in app and emails, logo, accent colour (contrast-checked: an invalid accent is rejected, Story 11.4), custom domain with TLS, email templates and sender, login page, help links, locale defaults, hidden marketplace categories. Implemented as **runtime theme tokens** fetched by hostname (no rebuild). Branded signed desktop/mobile binaries are a separate partner service (store accounts: ADR-0008/0009). The "Ubao" name and logo remain covered by the trademark policy of ADR-0012: white-label partners need a trademark/branding agreement; "Powered by Ubao" attribution is a contractual matter, not a code requirement. A single organisation customising its own instance (S-10.9) is MIT core and independent of partner mode.

### Impersonation with audit (support access)
- Operators (partner staff) are a separate principal type in the control plane, never members of a tenant.
- Tenant setting `support_access`: `denied` (default for sovereign/dedicated) · `ask` (tenant admin approves each session) · `allowed` (time-boxed).
- A session requires a **reason/ticket**, is **read-only by default** (write needs a second explicit elevation), expires (default 60 min), shows a permanent banner to the impersonated user (« Session de support — <operator> ») and notifies tenant admins.
- Audited twice: in the **tenant's** hash-chained audit log (actor = operator, on behalf of, reason, actions) and in an operator chain; tenant admins can export it. Operators cannot see page content of restricted spaces unless the tenant grants it, cannot create tokens, change SSO, or disable audit.
- Suspend/resume tenants is an operator action, also audited.

### Link with ADR-0012 and ADR-0011
- Code structure follows the ADR-0012 seam: `ubao-tenancy` core (tenant abstraction, `default` tenant, host routing hook, per-tenant keys, export/import) stays **MIT** because single-tenant installs use it; the **partner control plane** (tenants UI S-11.4, quotas/metering, multi-domain white-label, operator console, fleet upgrade orchestration) is a separable module/crate with its own licence header so ADR-0012 can place it as commercial (option B) or MIT (option A) without refactoring. If ADR-0012 stays at option A, everything here ships MIT.
- ADR-0011 question 3 is answered by this ADR (pending acceptance). Deployment tiers are unchanged: tenant host runs on Tier P (Helm + CloudNativePG, one cluster per placement/region) or Tier S for tiny partners. No custom Kubernetes operator in v1; fleet tooling for D is deferred with the commercial partner tooling.

## Options not retained
- Row-level shared schema (A): too risky for sovereign positioning and no per-tenant restore.
- Only database-per-tenant: wasteful for small tenants; remains the "dedicated" placement.
- Cross-tenant sharing/federation: out of scope v1; revisit with identity federation.

## Measures
1. **Isolation tests**: automated suite creates two tenants and tries cross-tenant access through API, WebSocket rooms, search, blobs, guest tokens, webhooks and plugins → 0 leaks (release gate).
2. **Migration**: 100 tenants migrate within an agreed window with failure of one tenant not affecting others.
3. **Density**: spike measures how many 20-user tenants fit on a 2 vCPU / 4 GB Postgres for schema-per-tenant vs database-per-tenant [target ≥ 100 / ≥ 25 — ASSUMPTION]; pooling strategy validated under load.
4. **Restore**: single-tenant restore from backup in < 15 min for a 1 GB tenant without touching others.
5. **Impersonation**: every support session appears in the tenant audit log; read-only enforced; banner visible (E2E test).
6. **Quota**: hard limits block as designed and never delete data.
7. Single-tenant overhead: < 3 % latency and no extra process compared with a build without tenancy.

## Consequences
- ADR-0005 stays valid (PostgreSQL + S3) but schema layout becomes `ubao_control` + per-tenant schema; migrations tooling must be tenant-aware from S1 even if only `default` exists (cheap now, costly to retrofit).
- Stories to add (post-v1, with the partner programme): tenant control plane, quotas/metering, per-tenant white-label (extends Story 11.4), operator console + impersonation, tenant export/offboarding, per-tenant migrations. Epics currently only have Story 11.4 (white-label); PRD FR11.3 has no story yet.
- Architecture §3 "stateless server" still holds; tenant state is in storage.
- Risk: schema/search_path mistakes; mitigated by the isolation suite, role-per-tenant, and code review rule "no tenant-less queries".

## Open questions (maintainer)
1. Default placement: schema-per-tenant with database-per-tenant for dedicated tenants (recommended), or database-per-tenant only?
2. Is partner mode in the MIT core or a commercial module (ADR-0012)? This ADR is compatible with both.
3. Do partners get white-labelled signed desktop/mobile apps in v1.x or only web white-label?
4. Support-access default for non-sovereign tenants: `ask` (recommended) or `allowed`?
5. Cross-tenant identity (one login, several organisations) — v1 no, later?

## Decision
_pending — to be decided by Jean Balin._
