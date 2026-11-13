# AGENTS.md — Wiro (nom de travail)

Fichier d'instructions commun à tous les agents (Claude Code, Codex, Cursor, OpenCode…). `CLAUDE.md` pointe ici.

## Produit
Workspace collaboratif open source : **docs type Notion + canvas infini type Miro** (périmètre AFFiNE + Collaboard, offre entreprise/souveraine).
Marché cible : Afrique. Licence : **MIT OR Apache-2.0** (double licence au choix, comme GridCraft/ArtCraft ; ADR-0016). Client lourd Windows/macOS + web self-hosted. Cœur en **Rust**.

## Règles non négociables
1. **Clean-room** : on étudie Miro/AFFiNE/Collaboard/Excalidraw via leurs docs publiques, démos et usages — **jamais** en copiant leur code. Aucun fichier, snippet ou asset provenant d'un projet non permissif (hors MIT / Apache-2.0 / BSD / ISC / Zlib ; tldraw = licence propriétaire, AFFiNE/BlockSuite = MPL/autres : lecture conceptuelle uniquement). Toute inspiration est notée dans `docs/research/` sous forme de fonctionnalité, pas de code.
2. **Licences des dépendances** : MIT / Apache-2.0 / BSD / ISC / Zlib uniquement. Interdits : GPL/AGPL, Commons Clause (React Bits, Animate UI), licences propriétaires (tldraw, Aceternity). Vérifier avant tout ajout (`cargo deny`, `license-checker`).
3. **Scope** : ne pas proposer de réduire le périmètre produit.
4. **Décisions** : les choix d'outils/stack/archi sont validés par le mainteneur (ADR dans `docs/architecture/adr/`).

## Méthode
- Planification : **BMAD Method v6** (`_bmad/`, skills `bmad-*`). Artefacts → `_bmad-output/` puis consolidés dans `docs/`.
- Flux : brief → PRD → UX spec → architecture (+ADR) → epics/stories → readiness check → sprints.
- Design : Penpot (MCP) → tokens dans `design/tokens/` → `DESIGN.md`.
- Revue UI : skill `impeccable` (critique/audit/polish). Motion : principes Emil Kowalski.

## Structure
```
docs/product/        brief, PRD, positionnement
docs/research/       veille concurrentielle, inventaire fonctionnel (clean-room)
docs/ux/             UX spec, parcours, wireframes
docs/architecture/   architecture + adr/
docs/plan/           roadmap, epics, sprints
design/              tokens, exports Penpot
_bmad/ _bmad-output/ BMAD
.claude/             skills, agents, settings
```

## Conventions
- Commits : Conventional Commits. Branches : `feat/…`, `fix/…`. PR obligatoires, CI verte.
- Docs en français pour la réflexion interne ; README/doc publique en anglais.
- Pas de secrets dans le repo : variables d'env (`.env.example`).
