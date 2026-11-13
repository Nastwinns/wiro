---
id: "0.2"
slug: licence-clean-room-gate
title: "Licence & clean-room gate"
epic: EP0
sprint: S0
depends_on: ["0.1"]
size: M
status: ready-for-dev
branch: feat/0-2-licence-clean-room-gate
---

# Story 0.2 — Licence & clean-room gate

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Aucune dépendance GPL, Commons Clause ou propriétaire, ni code copié d'un concurrent, ne doit pouvoir entrer dans `main` sans faire échouer la CI.

## Dépendances (doivent être mergées dans `main` avant de commencer)
Story 0.1 (workspaces Cargo + pnpm, CI de base, `tools/xtask`).

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 0.2: Licence & clean-room gate
>
> As a maintainer,
> I want `cargo deny` + JS licence-checker in CI with the allow-list from AGENTS.md,
> So that no GPL/Commons-Clause/proprietary dep is merged.
>
> **Acceptance Criteria:**
>
> - [ ] a PR adding a GPL crate fails CI with the offending crate named
> - [ ] the clean-room-guard agent report is attached to PRs

#### AGENTS.md — règles 1 et 2 (copie)

> ## Règles non négociables
> 1. **Clean-room** : on étudie Miro/AFFiNE/Collaboard/Excalidraw via leurs docs publiques, démos et usages — **jamais** en copiant leur code. Aucun fichier, snippet ou asset provenant d'un projet non-MIT (tldraw = licence propriétaire, AFFiNE/BlockSuite = MPL/autres : lecture conceptuelle uniquement). Toute inspiration est notée dans `docs/research/` sous forme de fonctionnalité, pas de code.
> 1bis. **Licence du projet (décision en cours, ADR-0012, statut proposed)** : tant que l'ADR n'est pas accepté, tout le code reste sous MIT et aucun module commercial n'existe. Ne pas écrire « 100 % MIT » comme garantie définitive dans une nouvelle doc, ne pas ajouter d'en-tête de licence autre que MIT, ne pas introduire de CLA. Scénarios : `LICENSING.md`. Le nom et le logo Ubao ne sont pas couverts par la licence de code (`docs/legal/trademark-policy.md`, brouillon).
> 2. **Licences des dépendances** : MIT / Apache-2.0 / BSD / ISC / Zlib uniquement. Interdits : GPL/AGPL, Commons Clause (React Bits, Animate UI), licences propriétaires (tldraw, Aceternity). Vérifier avant tout ajout (`cargo deny`, `license-checker`).
> 3. **Plugins** : les extensions passent par le système de plugins (ADR-0010, proposed) : iframes TS côté client, composants WASM côté serveur, MCP pour l'IA. Pas de bibliothèque native chargée dynamiquement, pas de code tiers exécuté hors sandbox. Un plugin déclare ses permissions dans le manifeste ; toute fonctionnalité de plugin passe par le SDK (`@ubao/plugin-sdk`, `ubao-plugin-sdk`).
> 3bis. **Plugins obligatoires** : imports (Notion, Miro, Word, Excel/CSV, Figma, Markdown, Excalidraw, PDF/images) et exports (PDF, Word, Excel/CSV, PowerPoint, Markdown, PNG/SVG, JSON) sont livrés dans chaque release, signés, fonctionnels hors ligne, non désinstallables (EP14). Ne jamais les déplacer dans le marketplace ni les rendre optionnels.
> 3ter. **Typographie** : tirets cadratins (—) et demi-cadratins (–) interdits dans les textes et le code produits (utiliser « : », virgule, parenthèses ou « - »). Les fichiers existants sont à nettoyer au fil des modifications.
> 3quater. **Scope** : ne pas proposer de réduire le périmètre produit.
> 4. **Décisions** : les choix d'outils/stack/archi sont validés par le mainteneur (ADR dans `docs/architecture/adr/`).

#### NFR-L1 / S1 (PRD §5)

> | NFR-S1 | Security | OWASP ASVS L2; SBOM; signed releases; dependency licence gate |
> | NFR-L1 | Licence | MIT for all code; deps MIT/Apache/BSD/ISC/Zlib (MPL flagged) |

#### Supply-chain (architecture §14)

> ## 14. Supply-chain security
> `cargo deny` (licence allow-list + advisories) and JS licence-checker in CI (Story 0.2); `cargo audit`/OSV scan; lockfiles committed, pinned & reviewed updates (Renovate/Dependabot); `cargo vet` or equivalent for critical crates (loro, wgpu, axum); reproducible builds where feasible; SBOM (CycloneDX) per release; artefacts signed with Sigstore + provenance attestations (SLSA ≥ L2 target); GitHub Actions pinned by SHA, least-privilege tokens; secret scanning; WASM/engines built in CI only; clean-room guard report on PRs (AGENTS.md).

#### ADR-0010 — conséquence licence

> - Licence gate: plugin SDKs MIT; marketplace shows each plugin's licence; public listing requires an OSI licence or explicit proprietary flag (filterable).

#### ADR-0004 — conformité licences

> - Licence check (`cargo deny`) on `vello_*`, `wgpu`, `parley`, `glifo`, `tiny-skia`: all Apache-2.0/MIT/BSD — compliant.

#### Agent clean-room-guard (existant)

> Voir `.claude/agents/clean-room-guard.md` : utilise ses critères comme base du script `clean-room`.

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. Préfixe de crates : **`ubao-*`** (voir story 0.1 : les dossiers `crates/wiro-*` sont renommés en `crates/ubao-*`).

- `deny.toml` (racine)
- `tools/xtask/src/` : sous-commandes `licenses-js` et `clean-room`
- `.github/workflows/ci.yml` (jobs `licences` et `clean-room`), `.github/pull_request_template.md` (case clean-room)
- `package.json` racine : script `licenses:check`
- `tests/fixtures/licence-gate/` (faux paquets/lockfiles de test)
- `docs/architecture/licence-policy.md` (nouveau, 1 page : allow-list + exceptions)

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/0-2-licence-clean-room-gate` depuis `main` à jour.

1. Crée `deny.toml` : `[licenses] allow = ["MIT","Apache-2.0","BSD-2-Clause","BSD-3-Clause","ISC","Zlib"]` + **exceptions temporaires commentées** `"Apache-2.0 WITH LLVM-exception"` (wasmtime, ADR-0010), `"Unicode-3.0"` (ICU4X, architecture §15), `"0BSD"`, `"CC0-1.0"` (outils uniquement) — chacune avec le commentaire `# À CONFIRMER par le mainteneur (story 0.2)`. `confidence-threshold = 0.9`. `[bans] multiple-versions = "warn"`, `wildcards = "deny"`. `[advisories]` : `yanked = "deny"`, vulnérabilités = deny. `[sources]` : `unknown-registry = "deny"`, `unknown-git = "deny"`.
2. Interdits explicites dans `[bans] deny` : `tldraw`, `blocksuite`, `affine` (noms de crates éventuels) ; documente pourquoi en commentaire.
3. Fais passer `cargo deny check` sur le workspace actuel (0 dépendance externe sauf `serde_json` de 0.1) ; corrige les licences de nos propres crates (`license = "MIT"`).
4. Ajoute la sous-commande `cargo xtask licenses-js` : exécute `pnpm licenses list --json --prod=false` (workspace entier), compare chaque licence SPDX à l'allow-list (même liste que `deny.toml`, lue depuis `docs/architecture/licence-policy.md` ou constante partagée), supporte les expressions `(MIT OR Apache-2.0)` (OK si au moins une option est autorisée), échoue en listant `paquet@version — licence`. Les licences inconnues (`UNKNOWN`, `SEE LICENSE IN`) échouent aussi. Script racine `licenses:check` = `cargo xtask licenses-js`. **Aucune nouvelle dépendance npm.**
5. Ajoute `cargo xtask clean-room [--base origin/main]` : (a) parcourt `git diff --name-status <base>...HEAD` ; (b) échoue si `Cargo.lock`/`pnpm-lock.yaml` ajoutent un paquet dont le nom correspond à la denylist (`tldraw`, `@tldraw/*`, `@blocksuite/*`, `@affine/*`, `excalidraw`, `@excalidraw/*`, `miro-*`, `@mirohq/*`) ; (c) échoue si un fichier ajouté contient `Commons Clause`, `GNU AFFERO`, `GNU GENERAL PUBLIC` dans son en-tête de licence ; (d) avertit (non bloquant) si un fichier ajouté de > 200 lignes contient `Copyright (c)` ou `SPDX-License-Identifier` ≠ MIT/Apache-2.0 ; (e) écrit `target/clean-room-report.md` (tableau : vérification, résultat, détails). Exception documentée : le format de fichier `.excalidraw` peut être *parsé* (JSON) sans dépendance `@excalidraw/*` (story 14.5 plus tard).
6. CI : job `licences` (`cargo deny check`, `cargo xtask licenses-js`) et job `clean-room` (`fetch-depth: 0`, `cargo xtask clean-room --base origin/${{ github.base_ref }}`, ajoute le rapport à `$GITHUB_STEP_SUMMARY` et en artefact `clean-room-report`, **même en cas d'échec**). Marque les deux jobs « required » dans `docs/architecture/licence-policy.md` (le réglage de branch protection sera fait par le mainteneur).
7. Pin des actions GitHub par SHA : tente `gh api repos/<owner>/<repo>/git/ref/tags/<tag>` pour chaque `uses:` ; si le réseau/`gh` n'est pas disponible, laisse les tags et note la liste à pinner dans la PR (point « Reporté »).
8. Ajoute dans `.github/pull_request_template.md` : « [ ] Rapport clean-room lu, aucun code copié d'un projet non-MIT » et « [ ] Dépendances ajoutées listées avec leur licence ».
9. Écris `docs/architecture/licence-policy.md` (allow-list, exceptions à confirmer, comment ajouter une exception = PR séparée approuvée par le mainteneur).
10. Démontre l'échec : sur une branche jetable locale, ajoute temporairement une dépendance GPL (fixture `tests/fixtures/licence-gate/gpl-crate`) et montre la sortie de `cargo deny check` nommant le crate ; ne commite pas cette branche.

## Critères d'acceptation

**AC1 — Crate GPL bloqué**
- **Given** une PR qui ajoute un crate sous GPL-3.0
- **When** la CI exécute `cargo deny check`
- **Then** le job `licences` échoue et le message nomme le crate fautif et sa licence

**AC2 — Paquet npm bloqué**
- **Given** un paquet npm sous AGPL-3.0 ou `UNKNOWN` dans le lockfile
- **When** `pnpm licenses:check` s'exécute
- **Then** il retourne un code ≠ 0 et affiche `paquet@version — licence`

**AC3 — Expression SPDX**
- **Given** un paquet `(MIT OR GPL-3.0)`
- **When** le contrôle JS s'exécute
- **Then** il est accepté (une option autorisée) ; `(GPL-3.0 AND MIT)` est refusé

**AC4 — Dépendance concurrente**
- **Given** une PR ajoutant `@tldraw/editor` au lockfile
- **When** `cargo xtask clean-room` s'exécute
- **Then** il échoue et le rapport liste `@tldraw/editor` comme interdit

**AC5 — Rapport attaché**
- **Given** n'importe quelle PR
- **When** la CI se termine (succès ou échec)
- **Then** l'artefact `clean-room-report` existe et son contenu apparaît dans le résumé du job

## Tests à écrire
- Unitaire Rust (xtask) : parseur d'expressions SPDX (cas `OR`, `AND`, parenthèses, `WITH`), détection denylist sur lockfiles de fixture, détection d'en-têtes GPL.
- Propriété (`proptest`, MIT/Apache) : toute expression SPDX construite uniquement avec des licences autorisées (opérateurs `OR`/`AND`) est acceptée ; dès qu'une feuille interdite est sous `AND`, elle est refusée ; sous `OR` avec au moins une feuille autorisée, elle est acceptée
- Intégration : `cargo deny check` sur le workspace réel = 0 ; sur la fixture GPL = échec attendu (test `#[ignore]` lancé par script `tests/fixtures/licence-gate/run.sh`).
- Exécution CI : voir AC1-AC5.

## Commandes de vérification (exactes)
```bash
cargo deny check
cargo xtask licenses-js
pnpm licenses:check
cargo xtask clean-room --base origin/main
cargo test -p xtask
cargo fmt --all -- --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
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


## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Confirmer les exceptions de licence : `Apache-2.0 WITH LLVM-exception` (wasmtime), `Unicode-3.0` (ICU4X), `0BSD`, `CC0-1.0` ? Hors liste AGENTS.md, donc à valider (MPL reste interdite sauf accord).
- La branch protection GitHub (jobs requis) sera-t-elle réglée par toi ?
- Faut-il autoriser `MPL-2.0` en dépendance *transitive non modifiée* (AGENTS.md : « flagged ») ? Défaut proposé : non.
