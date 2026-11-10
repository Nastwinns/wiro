# 16 — Plugins & marketplace

Goal: anyone can extend Ubao easily (new canvas objects, doc blocks, importers/exporters, integrations, AI tools, themes, templates) **without weakening sovereignty or security**. Architecture: ADR-0010 (proposed).

## Extension types
| Type | Examples | Runs where |
|---|---|---|
| Templates & kits | workshop templates, diagram kits, icon packs | data only (no code) |
| UI plugins | panel in sidebar/right panel, command palette actions, slash commands, quick-toolbar actions | sandboxed iframe (TS) with typed SDK |
| Blocks & canvas widgets | custom doc block (chart, map, form), canvas widget (poll, timer variant, Kanban card from Jira) | sandboxed iframe rendering inside a host frame |
| Server extensions | importers/exporters, webhooks handlers, scheduled jobs, custom auth hooks | WASM component (WASI) in the server, capability-based |
| Connectors & AI tools | MCP servers exposed to the assistant, data sources | MCP (see 15-ai-agents.md) |
| Themes | brand themes on tokens (white-label) | tokens JSON |

## Principles
- **Manifest + permissions** declared up front (read page, write page, read board, write board, network domains allow-list, storage, current user identity, AI). Shown before install; revocable; least privilege; no network unless declared.
- **Signed packages** (Sigstore) with publisher identity; verified badge for reviewed publishers; SBOM and licence shown (MIT/Apache/BSD/ISC… licence filter).
- **Sovereign mode**: admins allow-list plugins, mirror the marketplace offline (air-gapped bundle), disable public marketplace, pin versions.
- **Offline-first**: installed plugins are cached and work offline unless they declare network needs.
- Plugins never block core flows; a crashing plugin is isolated with « Désactiver » toast.

## S-16.1 Marketplace (in-app, Settings → Extensions or Ctrl K « Ajouter une extension »)
- Header search + categories (Ateliers, Diagrammes, Intégrations, Import/Export, IA & agents, Administration publique, Thèmes, Modèles), filters (Gratuit, Vérifié, Fonctionne hors ligne, Compatible souverain, Licence).
- Cards: icon, name, publisher (+ verified), one line, installs, rating, badges (Hors ligne, Souverain, Open source), Install.
- Collections: « Pour l'administration publique », « Mobile money », « Langues africaines ».

## S-16.2 Plugin detail
Screenshots, description, version & changelog, **permissions requested** (with plain-language explanation), data flow (« N'envoie aucune donnée hors de votre serveur »), publisher, licence, source repo, SBOM, reviews, compatibility (web/desktop/mobile), Install for me / for the workspace (admins).

## S-16.3 Install consent
Dialog with the permission list (icons, plain words), scope (moi / espace « Direction produit » / tout l'espace de travail), network domains, « Installer ». Admin approval request when policy requires it.

## S-16.4 Plugin running
- Sidebar section « Extensions » + right panel host with plugin header (name, permissions shield, ⋯ settings, close).
- Canvas widget example (poll widget, Jira card); doc block example (chart from database).
- Command palette actions contributed by plugins (labelled with plugin name).

## S-16.5 Manage extensions (workspace admins)
Installed list with version, scope, permissions, last update, auto-update toggle, usage; **policy**: allow public marketplace / allow-list only / disable; private registry URL; upload signed package (.ubx); audit of installs.

## S-16.6 Developer portal & SDK (docs site + in-app dev mode)
« Créer une extension » → `npm create ubao-plugin` / `cargo component new`; local dev mode (load unpacked from localhost URL), manifest validator, permission linter, publish flow (sign, submit, review status). Docs: SDK reference (typed, generated), examples, UI kit (tokens + components so plugins look native).

## S-16.7 Publisher console (marketplace web)
Publisher profile, plugins, versions, review status, installs/ratings, revenue share (later — paid plugins are post-v1, decision ADR-0009).

Acceptance: install in ≤ 3 clicks with explicit consent; uninstall removes data access instantly; sovereign admins can run with zero outbound marketplace traffic; a malicious plugin cannot read pages outside granted scope (sandbox tests).
