# Contributing plugins

> Status: **design stage**. The plugin system is [ADR-0010](docs/architecture/adr/0010-plugin-system.md) (*proposed*). The SDK, CLI and marketplace do not exist yet (planned EP14, sprints S4 to S8). This page describes the intended contract so authors can follow the design.

## Extension points
| Kind | Runs in | Language |
|---|---|---|
| UI plugins, blocks, canvas widgets | sandboxed iframe in the client, typed RPC | TypeScript / JavaScript |
| Importers, exporters, jobs, webhooks | server WASM component (wasmtime, capability based) | Rust first; other languages via the component toolchain |
| AI tools and connectors | MCP server | any language |
| Templates, themes | data-only package | JSON / assets |

## SDK (planned, all MIT)
`@ubao/plugin-sdk` (TypeScript), `ubao-plugin-sdk` (Rust + WIT), `ubao-plugin` CLI (create, dev, validate, pack, sign, publish), mock host for tests, UI kit on the design tokens. Semver, 12-month API compatibility window.

## Manifest and security
One manifest (`ubao-plugin.toml` or JSON): declared permissions, network allow-list, scopes. Package `.ubx` = manifest + payload + SBOM (CycloneDX) + Sigstore signature. Permission increases require re-consent. Revocation list and kill switch work offline. Plugin iframes use `sandbox="allow-scripts"` without same-origin.

## Certification levels
| Level | Who | Checks | Shown as |
|---|---|---|---|
| **Core** | the project | in this repo, reviewed, bundled, reproducible build | Core |
| **Verified** | publishers with checked identity | automated pipeline + human review (target 5 working days) + OSI licence or explicit proprietary flag | Verified |
| **Community** | any signed publisher | automated pipeline only | Community (unverified) |
| **Private** | one organisation | admin allow-list | Private |

Pipeline: manifest and permission lint, SBOM, licence allow-list, dependency advisories, sandbox/escape tests, size and performance budget.

## Mandatory first-party plugins
Imports (Notion, Miro, Word, Excel/CSV, Figma, Markdown, Excalidraw, PDF/images) and exports (PDF, Word, Excel/CSV, PowerPoint, Markdown, PNG/SVG, JSON) are **Core** plugins: bundled in every release, signed, offline, not removable. Contributions welcome under the project rules. Parsing libraries must be MIT/Apache/BSD (`cargo deny`). Figma goes through the official API or exported SVG/PNG: no reverse-engineered `.fig` parsing. Format-specific clean-room rule: do not read the code of non-MIT converters.

## Contributing to Core plugins
Same process as [CONTRIBUTING.md](CONTRIBUTING.md): DCO sign-off (a CLA may be introduced, see ADR-0012), Conventional Commits, review by the maintainer.

## Publishing your own plugin
Choose your own licence (an OSI licence is needed for Verified, or an explicit proprietary flag). Paid plugins and revenue share are deferred (ADR-0009). Use of the Ubao name and badges follows the [trademark policy](docs/legal/trademark-policy.md) (draft).
