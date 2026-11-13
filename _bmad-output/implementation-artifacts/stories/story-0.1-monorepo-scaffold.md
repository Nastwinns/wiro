---
id: "0.1"
slug: monorepo-scaffold
title: "Monorepo scaffold"
epic: EP0
sprint: S0
depends_on: []
size: L
status: ready-for-dev
branch: feat/0-1-monorepo-scaffold
---

# Story 0.1 — Monorepo scaffold

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Les agents doivent pouvoir ajouter crates et apps au bon endroit sur une base qui compile, se teste et passe la CI dès le premier jour.

## Dépendances (doivent être mergées dans `main` avant de commencer)
Aucune. Première story ; tout le reste en dépend.

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 0.1: Monorepo scaffold
>
> As a maintainer,
> I want a Cargo workspace + pnpm workspace matching project-structure.md,
> So that agents add crates/apps in the right place.
>
> **Acceptance Criteria:**
>
> - [ ] `cargo build` and `pnpm build` succeed on a fresh clone
> - [ ] each crate/app README states its responsibility
> - [ ] CI runs fmt, clippy, tests, typecheck on PR

#### Structure cible (project-structure.md, à lire avec `wiro-` → `ubao-`)

> # Project structure
>
> Monorepo, Cargo workspace for Rust crates (+ JS workspace only if ADR-0002 picks a web UI).
> Rule: **apps are thin, crates hold the logic**, so desktop, web and server share one core.
>
> ```
> <repo>/        (codename Wiro; product Ubao, see "Naming" below)
> ├── AGENTS.md  CLAUDE.md  PRODUCT.md  DESIGN.md  llms.txt  .mcp.json
> ├── apps/
> │   ├── desktop/     Windows/macOS client            (ADR-0002)
> │   ├── web/         self-hosted web client           (ADR-0002)
> │   ├── server/      single-binary sync/API server    (ADR-0005)
> │   ├── admin/       admin console (teams, sovereign)
> │   └── landing/     marketing site
> ├── crates/
> │   ├── wiro-model      document model (no I/O)
> │   ├── wiro-crdt       CRDT layer                    (ADR-0003)
> │   ├── wiro-storage    local-first WAL, crash-safe
> │   ├── wiro-sync       delta sync, low-bandwidth
> │   ├── wiro-canvas     scene graph, culling, LOD
> │   ├── wiro-render     renderer abstraction          (ADR-0004)
> │   ├── wiro-editor     block / rich-text core
> │   ├── wiro-search     offline full-text search
> │   ├── wiro-format     open format, import/export
> │   ├── wiro-auth       OIDC/SSO, RBAC, audit, guest links
> │   ├── wiro-i18n       FR/EN + community locales
> │   ├── wiro-ai         optional BYO-model AI
> │   └── wiro-telemetry  opt-in metrics
> │   ├── wiro-text-norm  shared client/server text normaliser (ADR-0007)
> │   ├── ubao-plugin-host  server WASM plugin host, wasmtime, permission broker (ADR-0010)
> │   ├── ubao-plugin-sdk   Rust SDK + WIT interfaces for server plugins (ADR-0010)
> │   └── ubao-cli          `ubao` ops CLI (init wizard) and `ubao-plugin` dev CLI (ADR-0010/0011)
> ├── plugins/         mandatory first-party plugins (Core tier, EP14)
> │   ├── importers/   notion, miro, docx, xlsx-csv, figma, markdown, excalidraw, pdf-images
> │   └── exporters/   pdf, docx, xlsx-csv, pptx, markdown, png-svg, json
> ├── packages/
> │   ├── tokens/      design tokens
> │   ├── ui/          UI kit (shadcn/ui based)
> │   └── plugin-sdk/  @ubao/plugin-sdk (TypeScript, generated from manifest/OpenAPI schema)
> ├── locales/         translations
> ├── design/          Penpot exports, tokens
> ├── deploy/          compose (Tier S) · helm/ubao (Tier P) · airgap (Tier A) · docker (image)
> │                    detailed layout owned by the deployment work (ADR-0011): Caddyfile, compose.yaml,
> │                    Helm chart + values, air-gap build scripts, .env.example, SBOM/signing scripts
> ├── tools/           bench (perf budget, 10k objects @ 60 fps) · xtask · contrast-check
> ├── tests/           e2e · fixtures
> ├── docs/            product · research · ux · architecture(+adr) · plan
> ├── _bmad/ _bmad-output/   BMAD method & artefacts
> └── .claude/ .github/      agents, skills, CI
> ```
>
> ## Dependency direction
> `apps/*` → `wiro-auth, wiro-sync, wiro-storage, wiro-canvas, wiro-editor, wiro-format, wiro-search` → `wiro-crdt` → `wiro-model`.
> `wiro-model` depends on nothing internal. No crate depends on an app.

#### Règle de dépendances (copie)

> `apps/*` → `ubao-auth, ubao-sync, ubao-storage, ubao-canvas, ubao-editor, ubao-format, ubao-search` → `ubao-crdt` → `ubao-model`.
> `ubao-model` ne dépend d'aucun crate interne. Aucun crate ne dépend d'une app.

#### ADR-0002 — décision

> ## Decision
> "Figma model" accepted: Tauri 2 shell + thin TS chrome (shadcn/ui) + Rust→WASM engines (canvas, CRDT, storage, sync). Same frontend for desktop and self-hosted web.

#### Test strategy (architecture §13)

> ## 13. Test strategy
> | Level | Approach |
> |---|---|
> | Unit | per-crate `cargo test`, Vitest for TS chrome; coverage tracked, not gated blindly |
> | Property-based | `proptest` on model invariants, permission resolution, normalisation (ADR-0007), codecs |
> | CRDT convergence / fuzz | random concurrent op sequences across N replicas incl. offline/partition → assert identical state; `cargo-fuzz` on decoders (import formats, sync frames); cross-version update compatibility |
> | Integration | server + Postgres + MinIO via testcontainers; sync protocol conformance suite |
> | E2E | Playwright (web + Tauri WebDriver), multi-client collaboration, offline/online flips, IME/diacritics (Story 0.5) |
> | Performance | canvas bench (ADR-0004), sync load tests (k6/own harness), budgets in §16 enforced in CI on reference machines |
> | Chaos / durability | kill -9 mid-write, disk-full, network partition/latency injection (toxiproxy), restore-from-backup drills (R1) |
> | Accessibility / i18n | axe + keyboard scripts; pseudo-localisation, RTL snapshots |
> All licences of test tooling checked under the same allow-list.

#### Règles non négociables (AGENTS.md)

> ## Règles non négociables
> 1. **Clean-room** : on étudie Miro/AFFiNE/Collaboard/Excalidraw via leurs docs publiques, démos et usages — **jamais** en copiant leur code. Aucun fichier, snippet ou asset provenant d'un projet non-MIT (tldraw = licence propriétaire, AFFiNE/BlockSuite = MPL/autres : lecture conceptuelle uniquement). Toute inspiration est notée dans `docs/research/` sous forme de fonctionnalité, pas de code.
> 1bis. **Licence du projet (décision en cours, ADR-0012, statut proposed)** : tant que l'ADR n'est pas accepté, tout le code reste sous MIT et aucun module commercial n'existe. Ne pas écrire « 100 % MIT » comme garantie définitive dans une nouvelle doc, ne pas ajouter d'en-tête de licence autre que MIT, ne pas introduire de CLA. Scénarios : `LICENSING.md`. Le nom et le logo Ubao ne sont pas couverts par la licence de code (`docs/legal/trademark-policy.md`, brouillon).
> 2. **Licences des dépendances** : MIT / Apache-2.0 / BSD / ISC / Zlib uniquement. Interdits : GPL/AGPL, Commons Clause (React Bits, Animate UI), licences propriétaires (tldraw, Aceternity). Vérifier avant tout ajout (`cargo deny`, `license-checker`).
> 3. **Plugins** : les extensions passent par le système de plugins (ADR-0010, proposed) : iframes TS côté client, composants WASM côté serveur, MCP pour l'IA. Pas de bibliothèque native chargée dynamiquement, pas de code tiers exécuté hors sandbox. Un plugin déclare ses permissions dans le manifeste ; toute fonctionnalité de plugin passe par le SDK (`@ubao/plugin-sdk`, `ubao-plugin-sdk`).
> 3bis. **Plugins obligatoires** : imports (Notion, Miro, Word, Excel/CSV, Figma, Markdown, Excalidraw, PDF/images) et exports (PDF, Word, Excel/CSV, PowerPoint, Markdown, PNG/SVG, JSON) sont livrés dans chaque release, signés, fonctionnels hors ligne, non désinstallables (EP14). Ne jamais les déplacer dans le marketplace ni les rendre optionnels.
> 3ter. **Typographie** : tirets cadratins (—) et demi-cadratins (–) interdits dans les textes et le code produits (utiliser « : », virgule, parenthèses ou « - »). Les fichiers existants sont à nettoyer au fil des modifications.
> 3quater. **Scope** : ne pas proposer de réduire le périmètre produit.
> 4. **Décisions** : les choix d'outils/stack/archi sont validés par le mainteneur (ADR dans `docs/architecture/adr/`).

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. **Décision de nommage à appliquer ici** : le produit s'appelle Ubao (nom de code Wiro) ; ADR-0010 et epics.md utilisent déjà `ubao-*`. Cette story renomme les 13 dossiers `crates/wiro-*` en `crates/ubao-*` (`git mv`) et corrige `docs/architecture/project-structure.md` et les README. **Si le mainteneur n'a pas confirmé ce préfixe, demande-le avant la tâche 2 (point « À demander » n°1).**

- `Cargo.toml` (workspace racine), `rust-toolchain.toml`, `Cargo.lock` (commité), `.gitignore`
- `crates/ubao-model`, `ubao-crdt`, `ubao-storage`, `ubao-sync`, `ubao-canvas`, `ubao-render`, `ubao-editor`, `ubao-search`, `ubao-format`, `ubao-auth`, `ubao-i18n`, `ubao-ai`, `ubao-telemetry` (chacun : `Cargo.toml`, `src/lib.rs`, `README.md`)
- `apps/server` (crate binaire `ubao-server`), `apps/desktop` (placeholder, shell Tauri créé en 0.4), `apps/web` (Vite + React + TS), `apps/admin`, `apps/landing` (paquets TS minimaux)
- `packages/tokens`, `packages/ui` (paquets TS minimaux ; le contenu de `tokens` vient de 0.3)
- `tools/xtask` (crate binaire `xtask`, alias `cargo xtask` via `.cargo/config.toml`)
- `pnpm-workspace.yaml`, `package.json` racine, `tsconfig.base.json`, `biome.json`, `.nvmrc`
- `.github/workflows/ci.yml` (étendre le job `docs` existant, ne pas le supprimer)

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/0-1-monorepo-scaffold` depuis `main` à jour.

1. Vérifie `cargo --version`, `rustc --version`, `node --version` (≥ 20 LTS), `pnpm --version` (≥ 9). Si un outil manque : arrête et demande.
2. Renomme `crates/wiro-*` en `crates/ubao-*` (`git mv`) ; remplace `wiro-` par `ubao-` dans `docs/architecture/project-structure.md`, dans chaque README de crate et dans `AGENTS.md` **uniquement si** le mainteneur l'a confirmé. Ne touche pas aux ADR.
3. Crée `rust-toolchain.toml` (`channel = "stable"`, composants `rustfmt`, `clippy`) et `Cargo.toml` racine : `[workspace] resolver = "2"`, `members = ["crates/*", "apps/server", "tools/xtask"]`, `[workspace.package] edition = "2021"`, `license = "MIT"`, `rust-version` = version du toolchain installé, `[workspace.lints.rust] unsafe_code = "forbid"`, `[workspace.lints.clippy] unwrap_used = "deny", expect_used = "deny"` (les tests peuvent `#![allow]`).
4. Dans chaque crate : `Cargo.toml` (`license.workspace = true`, `[lints] workspace = true`, **aucune dépendance externe**, dépendances internes selon la règle de dépendances ci-dessus : `ubao-crdt` → `ubao-model` ; `ubao-storage`, `ubao-sync`, `ubao-canvas`, `ubao-editor`, `ubao-format`, `ubao-search` → `ubao-crdt` (+`ubao-model`) ; `ubao-render` → `ubao-model` ; `ubao-auth`, `ubao-i18n`, `ubao-ai`, `ubao-telemetry` → `ubao-model`), `src/lib.rs` avec un commentaire `//!` de responsabilité (1 phrase tirée du README) et une fonction publique `pub const CRATE_NAME: &str` + un test unitaire qui l'asserte. README : garder la responsabilité, remplacer « planned — no code yet » par l'état réel.
5. `apps/server` : crate binaire `ubao-server`, `main()` qui affiche `ubao-server <version>` et sort 0 ; dépend de `ubao-auth, ubao-sync, ubao-storage` seulement.
6. `tools/xtask` : binaire avec sous-commande `check-deps` : lit `cargo metadata --format-version 1 --no-deps` (via `std::process::Command`, parse avec `serde_json` — MIT/Apache) et vérifie (a) `ubao-model` n'a aucune dépendance interne, (b) aucun crate `ubao-*` ne dépend de `ubao-server`/d'une app, (c) pas de cycle. Code retour ≠ 0 et message nommant l'arête fautive. Ajoute `.cargo/config.toml` avec `[alias] xtask = "run -p xtask --"`.
7. JS : `pnpm-workspace.yaml` (`apps/web`, `apps/admin`, `apps/landing`, `packages/*`), `package.json` racine privé avec scripts `typecheck`, `lint`, `test`, `build` (tous `pnpm -r …` sauf `lint` = `biome check .`) ; `tsconfig.base.json` (`strict: true`, `noUncheckedIndexedAccess: true`) ; `biome.json` ; chaque paquet a `typecheck` (`tsc --noEmit`), `test` (`vitest run --passWithNoTests`), `build`. Dépendances dev autorisées : `typescript`, `vitest`, `@biomejs/biome`, `vite`, `@vitejs/plugin-react`, `react`, `react-dom`, `@types/*` (toutes MIT/Apache-2.0).
8. `apps/web` : Vite + React 18+ + TS ; page unique affichant « Ubao » dans un `<main>` ; un test Vitest + `@testing-library/react` (MIT) qui rend la page et vérifie le texte. `apps/admin`, `apps/landing`, `packages/tokens`, `packages/ui` : `src/index.ts` exportant un nom de paquet + 1 test trivial.
9. `apps/desktop` : seulement un README mis à jour (« shell Tauri 2 créé par la story 0.4 ») ; ne pas ajouter Tauri ici.
10. CI : dans `.github/workflows/ci.yml` ajoute `rust` (checkout, `dtolnay/rust-toolchain`-équivalent : `rustup show`, cache `~/.cargo` + `target`, `cargo fmt --all -- --check`, `cargo clippy …`, `cargo test --workspace`, `cargo xtask check-deps`) et `js` (setup pnpm + node, `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`) en parallèle du job `docs`. Matrice : `ubuntu-latest` pour tout ; ajoute `windows-latest` et `macos-latest` pour `cargo build --workspace` + `cargo test --workspace` seulement. Permissions `contents: read`.
11. Lance toutes les commandes de vérification localement ; colle les sorties (résumées) dans la PR.

## Critères d'acceptation

**AC1 — Build d'un clone neuf**
- **Given** un clone neuf du repo sur la branche de la story
- **When** j'exécute `cargo build --workspace` puis `pnpm install --frozen-lockfile && pnpm build`
- **Then** les deux commandes se terminent avec le code 0, sans modification du working tree (`git status --porcelain` vide, hors `target/` et `node_modules/` ignorés)

**AC2 — README de responsabilité**
- **Given** les 13 crates et 5 apps/packages JS
- **When** je liste `crates/*/README.md`, `apps/*/README.md`, `packages/*/README.md`
- **Then** chacun existe et commence par une phrase de responsabilité ; aucun ne contient « no code yet » s'il contient du code

**AC3 — CI sur PR**
- **Given** la PR ouverte
- **When** la CI s'exécute
- **Then** les jobs `docs`, `rust`, `js` passent ; fmt, clippy (`-D warnings`), tests et typecheck sont réellement exécutés (visibles dans les logs)

**AC4 — Direction des dépendances**
- **Given** un crate où `ubao-model` dépend de `ubao-crdt` (modification volontaire sur une branche jetable)
- **When** j'exécute `cargo xtask check-deps`
- **Then** la commande échoue avec un message nommant `ubao-model -> ubao-crdt`

**AC5 — Préfixe de crates**
- **Given** le renommage appliqué
- **When** je lance `grep -rn "wiro-" crates apps tools Cargo.toml package.json pnpm-workspace.yaml`
- **Then** aucune occurrence (hors historique git) ; `ls crates` ne montre que des `ubao-*`

## Tests à écrire
- Unitaire Rust : un test par crate (`CRATE_NAME`).
- Unitaire Rust (xtask) : `check_deps` sur des graphes JSON de fixture (`tools/xtask/tests/fixtures/*.json`) : cas valide, arête interdite, cycle.
- Unitaire TS : `apps/web` rend « Ubao » ; chaque paquet a un test de fumée.
- Intégration CI : job rust/js verts sur Linux, build+test sur Windows et macOS.

## Commandes de vérification (exactes)
```bash
cargo build --workspace
cargo test --workspace
cargo xtask check-deps
cargo fmt --all -- --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
pnpm install --frozen-lockfile
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

## Portes de qualité (toutes obligatoires ; **arrêt immédiat si l'une est rouge**, ne contourne jamais)
**Rust**
```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace
cargo deny check
```

**JS/TS**
```bash
pnpm install --frozen-lockfile
pnpm typecheck      # = pnpm -r typecheck
pnpm lint           # Biome
pnpm test           # = pnpm -r test (Vitest)
pnpm build          # = pnpm -r build
pnpm licenses:check # allow-list JS (créé par la story 0.2)
```

Rapport clean-room joint à la PR (voir story 0.2 une fois mergée) ; avant, relis la section « Interdits ».

## Interdits
- **Clean-room** : aucun code, snippet, asset, nom d'API interne ou structure de données copié de tldraw, AFFiNE, BlockSuite, Excalidraw, Miro, Collaboard, Notion ou Figma. Tu écris à partir de la spécification de cette story et de la documentation publique des crates/paquets MIT/Apache autorisés. Si tu as un doute sur l'origine d'un morceau de code : ne le garde pas, écris-le autrement et signale-le dans la PR.
- **Licences** : aucune dépendance GPL/AGPL/LGPL, Commons Clause, propriétaire (tldraw, Aceternity, React Bits, Animate UI, Slint…). Autorisées : MIT, Apache-2.0, BSD-2/3-Clause, ISC, Zlib (+ exceptions listées dans `deny.toml` après la story 0.2). Toute nouvelle dépendance : vérifier sa licence **avant** de l'ajouter (`cargo deny check licenses` / `pnpm licenses:check`) et la lister dans la PR.
- Ne pas modifier `docs/architecture/adr/**`, `AGENTS.md`, `docs/product/**` : si une décision manque, **arrête-toi et demande** (point « À demander » ci-dessous).
- Ne pas élargir ni réduire le périmètre de la story. Pas de TODO sans ticket ; tout ce qui est reporté est écrit dans la PR sous « Reporté ».
- Aucun secret dans le repo ; pas de `unwrap()`/`expect()` hors tests ; pas de `unsafe` sans commentaire `// SAFETY:` et accord du mainteneur.
- Ne crée aucun code métier (pas de modèle, pas de CRDT) : seulement l'ossature.
- Pas de framework UI autre que React + Vite ; pas de Tailwind/shadcn ici (story 1.x).
- `cargo deny` n'existe pas encore comme job CI (story 0.2) ; ne l'ajoute pas ici, mais `cargo deny check` local doit déjà passer si `deny.toml` est présent sinon saute-le et note-le.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).
- [ ] `ls crates` = 13 dossiers `ubao-*` ; `cargo xtask check-deps` vert en CI.

## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Le préfixe `ubao-*` est-il confirmé pour les crates (et `@ubao/*` pour les paquets npm) ? Valeur par défaut proposée : oui.
- Biome est-il accepté comme linter/formateur JS (alternative : ESLint + Prettier) ?
- Version minimale de Node/pnpm à épingler dans `.nvmrc` / `packageManager` ?
