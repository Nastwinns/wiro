# Project structure

Monorepo, Cargo workspace for Rust crates (+ JS workspace only if ADR-0002 picks a web UI).
Rule: **apps are thin, crates hold the logic**, so desktop, web and server share one core.

```
<repo>/        (codename Wiro; product Ubao, see "Naming" below)
├── AGENTS.md  CLAUDE.md  PRODUCT.md  DESIGN.md  llms.txt  .mcp.json
├── apps/
│   ├── desktop/     Windows/macOS client            (ADR-0002)
│   ├── web/         self-hosted web client           (ADR-0002)
│   ├── server/      single-binary sync/API server    (ADR-0005)
│   ├── admin/       admin console (teams, sovereign)
│   └── landing/     marketing site
├── crates/
│   ├── wiro-model      document model (no I/O)
│   ├── wiro-crdt       CRDT layer                    (ADR-0003)
│   ├── wiro-storage    local-first WAL, crash-safe
│   ├── wiro-sync       delta sync, low-bandwidth
│   ├── wiro-canvas     scene graph, culling, LOD
│   ├── wiro-render     renderer abstraction          (ADR-0004)
│   ├── wiro-editor     block / rich-text core
│   ├── wiro-search     offline full-text search
│   ├── wiro-format     open format, import/export
│   ├── wiro-auth       OIDC/SSO, RBAC, audit, guest links
│   ├── wiro-i18n       FR/EN + community locales
│   ├── wiro-ai         optional BYO-model AI
│   └── wiro-telemetry  opt-in metrics
│   ├── wiro-text-norm  shared client/server text normaliser (ADR-0007)
│   ├── ubao-plugin-host  server WASM plugin host, wasmtime, permission broker (ADR-0010)
│   ├── ubao-plugin-sdk   Rust SDK + WIT interfaces for server plugins (ADR-0010)
│   └── ubao-cli          `ubao` ops CLI (init wizard) and `ubao-plugin` dev CLI (ADR-0010/0011)
├── plugins/         mandatory first-party plugins (Core tier, EP14)
│   ├── importers/   notion, miro, docx, xlsx-csv, figma, markdown, excalidraw, pdf-images
│   └── exporters/   pdf, docx, xlsx-csv, pptx, markdown, png-svg, json
├── packages/
│   ├── tokens/      design tokens
│   ├── ui/          UI kit (shadcn/ui based)
│   └── plugin-sdk/  @ubao/plugin-sdk (TypeScript, generated from manifest/OpenAPI schema)
├── locales/         translations
├── design/          Penpot exports, tokens
├── deploy/          compose (Tier S) · helm/ubao (Tier P) · airgap (Tier A) · docker (image)
│                    detailed layout owned by the deployment work (ADR-0011): Caddyfile, compose.yaml,
│                    Helm chart + values, air-gap build scripts, .env.example, SBOM/signing scripts
├── tools/           bench (perf budget, 10k objects @ 60 fps) · xtask · contrast-check
├── tests/           e2e · fixtures
├── docs/            product · research · ux · architecture(+adr) · plan
├── _bmad/ _bmad-output/   BMAD method & artefacts
└── .claude/ .github/      agents, skills, CI
```

## Dependency direction
`apps/*` → `wiro-auth, wiro-sync, wiro-storage, wiro-canvas, wiro-editor, wiro-format, wiro-search` → `wiro-crdt` → `wiro-model`.
`wiro-model` depends on nothing internal. No crate depends on an app.

## Mapping to audit pain points
| Pain point | Owner |
|---|---|
| P1 big-board lag | wiro-canvas, wiro-render, tools/bench |
| P2 data loss | wiro-storage |
| P3 offline bolted on | wiro-storage, wiro-sync |
| P7 capped self-host | apps/server, deploy/* (MIT, no caps) |
| P12 lock-in | wiro-format |
| P14 hard self-host | deploy/compose, deploy/airgap |
| A2 data cost | wiro-sync (low-bandwidth mode) |
| A4 sovereignty | wiro-auth (CMK, audit), deploy/helm, deploy/airgap |

Plugin dependency rule: `plugins/*` depend only on `ubao-plugin-sdk` (and `wiro-format` types), never on `apps/*`. `ubao-plugin-host` depends on `wiro-auth` (permissions, audit) and `wiro-model`.

## Naming: wiro-* vs ubao-* (rename plan, NOT applied)
State: the codename is Wiro (existing crates and docs); the product is Ubao (ADR-0010 already uses `ubao-*` for new crates). Mixing both is acceptable short term but must be resolved before the first public release.
Proposal:
1. **Until name validation (Swahili check, trademark search)**: keep `wiro-*` for existing crates. Name new *plugin and ecosystem* crates and packages `ubao-*` / `@ubao/*` (public API surface that third parties see). Internal-only crates stay `wiro-*`.
2. **After validation**: one dedicated story "Rename wiro-* to ubao-*" in a quiet window, done in a single PR: `cargo` package names, `use` paths, directory names, `pnpm` scope, Helm chart and image names, docs. Mechanical (`git mv`, sed, `cargo check`), with a redirect note in the changelog. Do not interleave with feature PRs.
3. `wiro-text-norm` becomes `ubao-text-norm` in that rename. Do not publish any `wiro-*` crate to crates.io; reserve `ubao-*` names early once the name is accepted.
4. If the name is rejected (backups Ndaje/Lisanga): the same procedure applies with the new name, which is why public APIs should avoid hard-coding the product name beyond the plugin SDK identifiers.

## Pending decisions (need Jean's call)
- ADR-0002 UI shell · ADR-0003 CRDT · ADR-0004 rendering · ADR-0005 server storage · ADR-0010 plugins · ADR-0011 deployment · ADR-0012 licensing
- Final product name and crate prefix (see above)
