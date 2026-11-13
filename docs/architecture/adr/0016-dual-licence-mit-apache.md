# ADR-0016 — Licence du code : MIT OR Apache-2.0

- Status: accepted (2026-11-11, maintainer decision: "on sera en licence MIT et Apache, comme GridCraft d'ArtCraft")
- Amends: ADR-0001 (licence MIT seule). Resolves the "MIT vs Apache-2.0" point of ADR-0012 (option A + E). Not legal advice; counsel review still planned (ADR-0009).

## Decision
All Ubao code is **dual-licensed under MIT or Apache-2.0, at the user's option** (SPDX `MIT OR Apache-2.0`), as GridCraft / ArtCraft (storytold) do. Repository ships `LICENSE-MIT`, `LICENSE-APACHE` and a `NOTICE`.
- Why both: MIT = shortest, procurement-friendly; Apache-2.0 = explicit patent grant and contributor terms. Users pick either.
- Rust manifests: `license = "MIT OR Apache-2.0"` in `[workspace.package]`; JS packages: `"license": "(MIT OR Apache-2.0)"`.
- Contributions: inbound = outbound — contributions are licensed under both licences (stated in CONTRIBUTING; DCO sign-off retained).
- **Trademarks are not licensed**: the Ubao name, wordmark and logos (design/exports/logo/ubao) are excluded from both licences (NOTICE); forks must rename.
- Dependency rule unchanged: MIT / Apache-2.0 / BSD / ISC / Zlib (+ Unicode-3.0 after gate); GPL/AGPL/Commons Clause/proprietary forbidden. Apache-2.0-only deps are fine.
- Clean-room rule unchanged (never copy non-permissive code; GridCraft/ArtCraft themselves are permissive and may be *studied*, but no copy without attribution in NOTICE/THIRD_PARTY_NOTICES).

## Consequences
- ADR-0012 option B (commercial modules for reseller/hosting features) is **not** adopted by this decision; if ever added it must be explicitly additive (separate repo/licence) and decided separately. CLA vs DCO stays open in ADR-0012 (DCO is sufficient while no relicensing is planned).
- Docs saying "100 % MIT" become "100 % MIT OR Apache-2.0".
