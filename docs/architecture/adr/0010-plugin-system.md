# ADR-0010 — Plugin & extension system

- Status: **proposed** (decision by Jean Balin)
- Date: 2026-11-10

## Context
Users and partners must extend Ubao (blocks, canvas widgets, importers, integrations, AI tools, templates, themes) without forking, while keeping the sovereign promises: data stays on the customer's server, auditable, works offline, air-gapped installs. See docs/ux/screens/16-plugins-marketplace.md and 15-ai-agents.md.

## Options
1. **Client sandboxed iframes + typed SDK (postMessage RPC)** for UI plugins, blocks and canvas widgets — the model used by Figma/Penpot plugins; mature browser isolation; works in Tauri WebView.
2. **WebAssembly components (WASI 0.2, component model) on the server** for importers/exporters, jobs, webhooks — capability-based, language-agnostic, runs in `wasmtime` (Apache-2.0 WITH LLVM-exception).
3. Native Rust dynamic libraries — fastest, but unsafe for third-party code; rejected.
4. JS on the server (Deno/QuickJS) — simpler for authors, weaker isolation story and extra runtime; possible later for "scripts".
5. MCP servers as extension points for AI tools/connectors — already planned (FR8.3).

## Recommendation (to decide)
**1 + 2 + 5** combined, one manifest format (`ubao-plugin.toml`/JSON): declared permissions, network allow-list, scopes; packages signed (Sigstore/cosign) with SBOM; marketplace = static, mirrorable index (OCI registry or signed JSON index) so air-gapped deployments can host a private mirror. Templates/themes are data-only packages.

## Consequences
- New crates: `ubao-plugin-host` (server, wasmtime), `ubao-plugin-sdk` (Rust/WIT), `@ubao/plugin-sdk` (TS, generated types from the same schema as the public API/OpenAPI).
- Security work: permission broker, CSP for plugin iframes (`sandbox="allow-scripts"`, no same-origin), rate limits, kill switch, audit events, fuzz/sandbox-escape tests.
- Licence gate: plugin SDKs MIT; marketplace shows each plugin's licence; public listing requires an OSI licence or explicit proprietary flag (filterable).
- Paid plugins / revenue share: deferred (ADR-0009 billing entity).

## Decision
_pending_

## Addendum 2026-11-11 — mandatory plugins, certification, contributors, languages, SDK

### Mandatory first-party plugins (shipped in every release, incl. air-gapped bundle)
Import: Notion, Miro, Word (.docx), Excel/CSV (.xlsx), Figma, Markdown, Excalidraw, PDF/images. Export: PDF (real text), Word, Excel/CSV, PowerPoint, Markdown, PNG/SVG, open JSON. They are signed by the project, work offline on local files, and cannot be uninstalled. Implemented as server WASM components (and as local conversions in the desktop app). Constraints: parsing/writing libraries must be MIT/Apache/BSD (candidates to verify with `cargo deny`: `calamine`, `rust_xlsxwriter`, `docx-rs`, `krilla`, `zip`); **Figma** uses the REST API (user token, network) or exported SVG/PNG, with no reverse-engineered `.fig` parsing (clean-room, ToS to review); Miro import from backup/CSV where available.

### Trust tiers and certification
| Tier | Who | Checks | Shown as |
|---|---|---|---|
| Core | project | in repo, reviewed, bundled, reproducible build | Core |
| Verified | publishers with checked identity | automated pipeline + human review (target 5 working days) + OSI licence or explicit proprietary flag | Verified |
| Community | any signed publisher | automated pipeline only | Community (unverified) |
| Private | one organisation | admin allow-list | Private |
Pipeline: manifest and permission lint, SBOM (CycloneDX), licence allow-list, dependency advisories, sandbox/escape tests, size and performance budget. Package `.ubx` = manifest + payload (WASM or JS bundle) + SBOM + Sigstore signature bound to the publisher identity. Permission increase on update requires re-consent. Revocation list and kill switch are synced and enforced offline. Sovereign mode: allow-list, pinned versions, mirrored registry.

### Who can contribute, languages, SDK
- Anyone with a verified GitHub/organisation identity can publish Community plugins; Verified needs an identity check. Core plugins follow the project contribution policy (DCO or CLA, see ADR-0012).
- **Languages**: UI plugins/blocks/canvas widgets in TypeScript/JavaScript (iframe SDK); server plugins as WASM components (Rust first-class; Go, JS, Python through the component toolchain, maturity to verify); MCP connectors in any language.
- **SDK**: `@ubao/plugin-sdk` (TS, generated from the manifest/OpenAPI schema), `ubao-plugin-sdk` (Rust + WIT), `ubao-plugin` CLI (create, dev, validate, pack, sign, publish), UI kit on the design tokens, mock host for tests, docs and examples. All SDKs MIT. Semver with a 12-month API compatibility window (architecture §9).
- Developer portal and publisher console: UX S-16.6 and S-16.7.

### Open questions
1. Human-review capacity for Verified with a solo maintainer: community reviewers or a trusted-publisher programme?
2. Which non-Rust languages are officially supported for server plugins at v1?
3. Figma and Miro API terms: confirm import is allowed for user-owned data.
4. Paid plugins and revenue share stay deferred (ADR-0009).
