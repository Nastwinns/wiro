# Project structure

Monorepo, Cargo workspace for Rust crates (+ JS workspace only if ADR-0002 picks a web UI).
Rule: **apps are thin, crates hold the logic**, so desktop, web and server share one core.

```
wiro/
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
├── packages/        ui kit + design tokens (web layer)
├── locales/         translations
├── design/          Penpot exports, tokens
├── deploy/          docker · compose · helm · airgap
├── tools/           bench (perf budget) · xtask
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
| P7 capped self-host | apps/server, deploy/* (MIT OR Apache-2.0, no caps) |
| P12 lock-in | wiro-format |
| P14 hard self-host | deploy/compose, deploy/airgap |
| A2 data cost | wiro-sync (low-bandwidth mode) |
| A4 sovereignty | wiro-auth (CMK, audit), deploy/helm, deploy/airgap |

## Pending decisions (need Jean's call)
- ADR-0002 UI shell · ADR-0003 CRDT · ADR-0004 rendering · ADR-0005 server storage
