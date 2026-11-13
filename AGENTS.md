# AGENTS.md : Ubao (nom de code : Wiro)

Fichier d'instructions commun à tous les agents (Claude Code, Codex, Cursor, OpenCode…). `CLAUDE.md` pointe ici.

## Produit
Workspace collaboratif open source : **docs type Notion + canvas infini type Miro** (périmètre AFFiNE + Collaboard, offre entreprise/souveraine).
Marché cible : Afrique. Licence : **MIT OR Apache-2.0** (double licence au choix ; ADR-0016 ; pas de module commercial adopté, ADR-0012 option B non retenue). Client lourd Windows/macOS + web self-hosted. Cœur en **Rust**.

## Nommage
- **Nom produit : Ubao** (candidat retenu, validation swahili/marque en cours). **Nom de code : Wiro** : dépôt, crates `wiro-*`, dossiers. Dans toute doc publique, écrire « Ubao ». Ne renommer ni crates ni dossiers sans story dédiée (plan : `docs/architecture/project-structure.md`).
- Vocabulaire : l'espace de dessin s'appelle **Tableau** (et non « Board ») dans l'UI FR, les docs FR et les clés de traduction ; « canvas » reste le terme technique du moteur.

## Règles non négociables
1. **Clean-room** : on étudie Miro/AFFiNE/Collaboard/Excalidraw via leurs docs publiques, démos et usages — **jamais** en copiant leur code. Aucun fichier, snippet ou asset provenant d'un projet non permissif (hors MIT / Apache-2.0 / BSD / ISC / Zlib ; tldraw = licence propriétaire, AFFiNE/BlockSuite = MPL/autres : lecture conceptuelle uniquement). Toute inspiration est notée dans `docs/research/` sous forme de fonctionnalité, pas de code.
1bis. **Licence du projet (acceptée, ADR-0016)** : tout le code est sous **MIT OR Apache-2.0** (`LICENSE-MIT`, `LICENSE-APACHE`, `NOTICE`) ; en-têtes SPDX `MIT OR Apache-2.0`. Aucun module commercial n'est adopté (ADR-0012 option B non retenue ; CLA vs DCO reste ouvert, ne pas introduire de CLA sans décision). Le nom et le logo Ubao ne sont pas couverts par la licence de code (`NOTICE`, `docs/legal/trademark-policy.md`). Scénarios historiques : `LICENSING.md`.
2. **Licences des dépendances** : MIT / Apache-2.0 / BSD / ISC / Zlib uniquement. Interdits : GPL/AGPL, Commons Clause (React Bits, Animate UI), licences propriétaires (tldraw, Aceternity). Vérifier avant tout ajout (`cargo deny`, `license-checker`).
3. **Plugins** : les extensions passent par le système de plugins (ADR-0010, proposed) : iframes TS côté client, composants WASM côté serveur, MCP pour l'IA. Pas de bibliothèque native chargée dynamiquement, pas de code tiers exécuté hors sandbox. Un plugin déclare ses permissions dans le manifeste ; toute fonctionnalité de plugin passe par le SDK (`@ubao/plugin-sdk`, `ubao-plugin-sdk`).
3bis. **Plugins obligatoires** : imports (Notion, Miro, Word, Excel/CSV, Figma, Markdown, Excalidraw, PDF/images) et exports (PDF, Word, Excel/CSV, PowerPoint, Markdown, PNG/SVG, JSON) sont livrés dans chaque release, signés, fonctionnels hors ligne, non désinstallables (EP14). Ne jamais les déplacer dans le marketplace ni les rendre optionnels.
3ter. **Typographie** : tirets cadratins (—) et demi-cadratins (–) interdits dans les textes et le code produits (utiliser « : », virgule, parenthèses ou « - »). Les fichiers existants sont à nettoyer au fil des modifications.
3quater. **Scope** : ne pas proposer de réduire le périmètre produit.
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
