<div align="center">

# Ubao *(working name)*

**Write, draw, plan and decide — together.**
Open-source docs + infinite canvas, local-first, built in Rust, self-hostable. Designed for African teams first.

`pre-alpha · planning in public` · MIT OR Apache-2.0

</div>

---

## Why
Teams across Africa juggle Notion, Miro and Slack — billed in dollars by card, slow on expensive data, and hosted far from where data is allowed to live. Ubao brings **Notion-style docs and a Miro-style canvas into one workspace** that:

- **works offline** and syncs when the network returns (local-first, CRDT)
- **stays fast** on modest laptops and phones (target: 60 fps with 10 000 objects)
- **saves data** with a low-bandwidth mode and a data-usage meter
- **runs where you need it**: your server, a national cloud, or fully air-gapped
- aims at **no capped self-hosting**: everything you need to run Ubao for your own organisation (client and server) is MIT OR Apache-2.0 (your choice; [ADR-0016](docs/architecture/adr/0016-dual-licence-mit-apache.md))

## Launch use cases
1. **Workshops & retros** — stickies, voting, timer, private mode, guests without accounts
2. **Product specs + diagrams** — docs with live canvas frames
3. **Planning & steering** — databases, kanban, timeline, meeting notes
4. **Knowledge base** — wiki, backlinks, offline search

## Stack (decided so far)
| Layer | Choice | ADR |
|---|---|---|
| Shell | Tauri 2 — desktop (Windows, macOS) + responsive web (no native mobile apps) | [0002](docs/architecture/adr/0002-ui-shell.md) |
| UI chrome | TypeScript + shadcn/ui, design tokens | 0002 |
| Canvas | Rust → WASM, GPU rendering (wgpu: WebGPU / WebGL2) | 0004 (pending) |
| Sync | Loro CRDT | [0003](docs/architecture/adr/0003-crdt-engine.md) |
| Docs editor | ProseMirror | [0006](docs/architecture/adr/0006-docs-editor.md) |
| Server | Rust single binary + PostgreSQL + S3-compatible storage | [0005](docs/architecture/adr/0005-server-storage.md) |

## Project status
**Pre-alpha. There is no installable release yet.** Planning is public; development starts with Sprint S0 (repo scaffold, licence gate, Tauri shells, Loro + ProseMirror spike). Everything described above is a **target**, not a shipped feature. Many ADRs are still *proposed*.
- Codename in the repository: *Wiro* (crates `wiro-*`); product name: **Ubao** (candidate, validation pending).
- Product: [PRD](docs/product/prd.md) · [competitive audit](docs/research/competitive-audit.md)
- Architecture: [overview](docs/architecture/architecture.md) · [repo structure](docs/architecture/project-structure.md)
- UX: [foundations](docs/ux/ux-spec.md) · [screens](docs/ux/screens/) · [brand](docs/ux/brand-charter.md)
- [Roadmap](ROADMAP.md) · [Licensing draft](LICENSING.md) · [Security](SECURITY.md)

## Mandatory plugins (planned, EP14)
Shipped in every release, signed, working offline, not removable. **Import:** Notion, Miro, Word, Excel/CSV, Figma, Markdown, Excalidraw, PDF/images. **Export:** PDF, Word, Excel/CSV, PowerPoint, Markdown, PNG/SVG, open JSON. A plugin SDK and certification levels (Core / Verified / Community / Private) are designed in [ADR-0010](docs/architecture/adr/0010-plugin-system.md); see [CONTRIBUTING-PLUGINS.md](CONTRIBUTING-PLUGINS.md).

## Planned installation
Three tiers, designed in [ADR-0011](docs/architecture/adr/0011-deployment-operations.md) (not implemented yet; `deploy/` holds placeholders):
- **Compose**: small teams, server + PostgreSQL + S3-compatible or disk storage + reverse proxy
- **Helm**: production, HA on Kubernetes
- **Air-gapped bundle**: images, charts, signatures and SBOM, no outbound traffic

## Principles
- **Clean-room**: we study other products' public features, never their code. See [AGENTS.md](AGENTS.md).
- **Dependency licences**: MIT / Apache-2.0 / BSD / ISC / Zlib only.
- **Trademark**: the name and logo are not covered by the code licence (policy in draft).
- **Honest product**: no dark patterns in billing, guests and viewers are never billed.

## Contributing
Contributions, plugins, translations (Swahili first!) and feedback are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License
Dual-licensed under [MIT](LICENSE-MIT) or [Apache-2.0](LICENSE-APACHE), at your option ([ADR-0016](docs/architecture/adr/0016-dual-licence-mit-apache.md)); the Ubao name and logos are not covered ([NOTICE](NOTICE)) (current; may evolve per [LICENSING.md](LICENSING.md), decision pending) · Third-party notices: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
