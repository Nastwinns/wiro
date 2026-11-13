# Security Policy

## Supported versions
Ubao is **pre-alpha**: there is no release yet and no version receives security fixes. From v1.0, the latest minor release and the previous LTS line (policy to be defined) will be supported; the table below will be kept up to date.

| Version | Supported |
|---|---|
| `main` (pre-alpha) | best effort |
| v1.x | planned |

## Reporting a vulnerability
Report privately through **GitHub Security Advisories** ("Report a vulnerability" on the repository's Security tab). Do not open public issues, discussions or pull requests for security problems. A dedicated security contact address will be added before v1.0.

Please include: affected component and version/commit, reproduction steps, impact, and any proof of concept. Do not access data that is not yours, and do not run denial-of-service tests against shared infrastructure.

## Our process (targets, pre-alpha, solo maintainer)
| Step | Target |
|---|---|
| Acknowledgement | 3 working days |
| Triage and severity (CVSS) | 7 days |
| Fix or mitigation for critical/high | 30 days |
| Coordinated disclosure | after the fix is released, typically within 90 days; credit given unless you prefer otherwise |
We publish advisories (GHSA, CVE when applicable). Good-faith research is welcome; a formal safe-harbour statement will be added with the legal entity.

## Supply chain
- **Dependencies**: allow-list MIT / Apache-2.0 / BSD / ISC / Zlib; `cargo deny` (advisories, licences, bans, sources) and JS licence/audit checks in CI (see docs/plan/ci-proposals.md); Dependabot enabled; lockfiles committed, versions pinned.
- **Builds**: planned reproducible release builds, signed OCI images and artefacts (Sigstore/cosign), CycloneDX SBOM per release.
- **Plugins**: signed packages with SBOM, declared permissions, sandbox (iframe / WASM), revocation and kill switch, tiers Core / Verified / Community / Private (ADR-0010).
- **Repository**: PR review required, secret scanning, no secrets in git, clean-room guard against copied code.
- **Agent tooling** vendored under `_bmad/` and `.claude/` is not shipped (see THIRD_PARTY_NOTICES.md).

Architecture-level security: [docs/architecture/architecture.md](docs/architecture/architecture.md).
