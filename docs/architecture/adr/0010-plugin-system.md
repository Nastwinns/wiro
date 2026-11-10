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
