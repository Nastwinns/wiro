# Contributing to Ubao

Ubao is **pre-alpha** and in public planning. Thanks for your interest!

## Who can contribute
Anyone. Humans and AI agents follow the same rules. Good first areas: translations (Swahili first, after FR/EN), documentation, bug reports, accessibility and low-bandwidth testing, plugins. Until the first release, large code changes should start with an issue, because the architecture decisions (ADRs in `docs/architecture/adr/`) are still being validated by the maintainer.

## Rules (apply to everyone)
1. Read [AGENTS.md](AGENTS.md). The **clean-room** and **dependency licence** rules are not negotiable.
2. Never paste code, assets or text from projects whose licence is not compatible with MIT OR Apache-2.0 (for example tldraw SDK, proprietary tools). Inspiration is described as a feature in `docs/research/`, never as code.
3. New dependencies: MIT / Apache-2.0 / BSD / ISC / Zlib only. CI runs the licence checks (`cargo deny`, `license-checker`) once enabled.
4. Conventional Commits (`feat:`, `fix:`, `docs:` ...). Branches `feat/...`, `fix/...`, `chore/...`. One logical change per PR; CI must be green.
5. No secrets in the repo; use environment variables and `.env.example`.
6. No em dashes in text and code you write; use a colon, a comma or parentheses.
7. In the French UI and docs, the drawing surface is called **Tableau**.

## Languages
| Area | Language |
|---|---|
| UI and plugins that run in the client | TypeScript (strict) |
| Core, server, canvas engine | Rust (stable); canvas compiled to WASM |
| Server-side plugins | Rust/WASM first; other languages through the WASM component toolchain (maturity to be verified) |
| AI tools and connectors | MCP, any language |
| Translations | Fluent (`.ftl`) files in `locales/` |

## Quality gates (before a PR)
`cargo fmt --check`, `cargo clippy -- -D warnings`, `cargo deny check`, `cargo test`; for TypeScript: lint, typecheck, tests. These become mandatory in CI after Story 0.1/0.2; see [docs/plan/ci-proposals.md](docs/plan/ci-proposals.md).

## Review process
1. Open a PR with the template; link the story or issue.
2. Automated checks (CI, licence gate, clean-room guard).
3. Maintainer review. Changes to ADR-covered areas need an accepted ADR first.
4. Squash merge into `main`.

## Contribution agreement: DCO (current)
Sign off every commit with `git commit -s`. This certifies you wrote the code or have the right to submit it under the project licence ([developercertificate.org](https://developercertificate.org)).

**A CLA is under evaluation** (ADR-0012; see [docs/legal/cla-vs-dco.md](docs/legal/cla-vs-dco.md)). It would only be needed if the project adopts a model that requires relicensing rights. Any change will be announced and decided **before the first external contribution is merged**. Released versions stay under the licence they were published with. Licensing draft: [LICENSING.md](LICENSING.md).

## Plugins
See [CONTRIBUTING-PLUGINS.md](CONTRIBUTING-PLUGINS.md).

## Code of conduct
We follow the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Report issues privately to the maintainers. Security problems: see [SECURITY.md](SECURITY.md).
