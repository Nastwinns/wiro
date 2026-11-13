---
id: "0.3"
slug: design-tokens-pipeline
title: "Design tokens pipeline"
epic: EP0
sprint: S0
depends_on: ["0.1", "0.2"]
size: M
status: ready-for-dev
branch: feat/0-3-design-tokens-pipeline
---

# Story 0.3 — Design tokens pipeline

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Penpot et le code partagent une seule source de vérité de design (`design/tokens/tokens.json`) compilée en CSS, TypeScript et constantes Rust.

## Dépendances (doivent être mergées dans `main` avant de commencer)
Story 0.1 (workspace pnpm/Cargo, `packages/tokens`). 0.2 recommandée (licences) mais non bloquante pour le code.

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 0.3: Design tokens pipeline
>
> As a designer,
> I want tokens.json (DTCG) compiled to CSS vars, TS and Rust consts in packages/tokens,
> So that Penpot and code share one source of truth.
>
> **Acceptance Criteria:**
>
> - [ ] changing a token and running the build updates CSS/TS/Rust outputs
> - [ ] light/dark themes switch via a data attribute

#### DESIGN.md — règles pour agents (copie)

> ## Règles pour les agents
> 1. Jetons uniquement : aucun hex brut dans les composants.
> 2. Un seul accent (malachite) par vue. **Or** : ornement et édition Souverain uniquement ; jamais une action, un état, un favori ni un statut.
> 3. Champs, cases, radios, segments : `border.control` (≥ 3:1). `border.default`/`strong` = séparation décorative.
> 4. Texte d'avertissement : `text.warning` ; texte sur fond teinté : `text.secondary` (pas `text.muted`). Texte sur accent clair en sombre : `text.on-accent` (noir).
> 5. Cibles ≥ 32 px (44 px tactile) ; densité par l'espacement, pas par des cibles de 28 px.
> 6. Inter pour l'UI, JetBrains Mono pour le code. Fraunces : une fois par écran en app. Exception marketing (titres de page) : **à décider par le mainteneur**, non tranchée.
> 7. Pas de tiret cadratin (—) ni demi-cadratin décoratif dans la copy ; utiliser deux-points, virgule ou point.
> 8. Mots d'interface en français : Tableau (pas Board), Page, Partager.
> 9. Logo officiel : `design/exports/logo/ubao/final` (symbole Escalier). Ne jamais le redessiner ni le retaper. Wordmark : SVG, jamais du texte composé.
> 10. Sentence case, pas de majuscules d'étiquette, pas de dégradés, pas de verre, pas de cartes imbriquées.
> 11. WCAG 2.2 AA, focus visible (2 px + 2 px de décalage), `prefers-reduced-motion`.
> 12. Conçu pour 1366×768, 4 Go de RAM et réseaux lents ; tester FR + EN (+30 %).
> 13. Chaque écran livre ses états vide, chargement, hors ligne, erreur, lecture seule ; états « verrouillé » et « hors ligne » en neutre + icône.
> 14. Présence, stylo, guides, confettis : jetons `presence`, `pen`, `guide`, `celebration` ; guide jamais en rouge.

#### Format du fichier source `design/tokens/tokens.json` (W3C DTCG)

> Clés racine : `$description`, `primitive`, `light`, `dark`, `shadow`, `component`. Chaque token : `{ "$type": "color|dimension|shadow…", "$value": … }`. Les alias s'écrivent `{primitive.color.malachite.700}`. Exemples réels :
> - `light.bg.app` = `{primitive.color.neutral.25}` (`#FAFAF7`) ; `light.accent.default` = `{primitive.color.malachite.700}` (`#0B5D49`) ; `light.border.focus` = `{primitive.color.malachite.700}`
> - `dark.bg.app` = `{primitive.color.neutral.950}` (`#0D0F0E`) ; `dark.accent.default` = `{primitive.color.malachite.300}` (`#3FBF95`) ; `dark.border.default` = `#2A302D` (valeur littérale)
> - `shadow.1` = objet `{color:#0F12110F, offsetX:0px, offsetY:1px, blur:2px, spread:0px}`
> - `component.sidebar-width` = `264px`, `component.topbar-height` = `48px`, `component.inspector-width` = `300px`, `component.doc-max-width` = `720px`, `component.control-height.{sm,md,lg,touch}`, `component.focus-ring.{width 2px, offset 2px}`
> - groupes thématiques (light ET dark) au-delà de bg/text/border/accent/status : `bg.{subtle,inverse,scrim}`, `border.{strong,control}`, `text.warning`, `accent.{subtle,strong,text}`, `state.{info,success,warning,danger,locked,offline}.{bg,text,border}`, `guide`, `pen.1..5`, `presence.1..8.{bg,text}`, `canvas-note.{sand,ochre,clay,stone,mint,aqua,sky,lilac}.{bg,text}` (les 8 teintes de stickies, story 2.2), `celebration.1..5`
> - primitives : `color`, `font`, `space`, `radius`, `duration`, `easing` (types `fontFamily`, `dimension`, `duration`, `cubicBezier` possibles : le générateur doit les gérer ou échouer explicitement sur un `$type` inconnu)
> - un alias peut viser un autre groupe, y compris un token thématique (`light.state.locked.bg` = `{light.bg.subtle}`) : le résolveur travaille sur l'arbre complet.
> Lire le fichier réel pour la liste complète : c'est la source de vérité.

#### Architecture — chrome UI

> | Chrome UI | TypeScript + React + shadcn/ui, tokens | sidebar, panels, dialogs, settings, command palette |

#### UX — accessibilité (ux-spec §7)

> ## 7. Accessibility
> WCAG 2.2 AA. Canvas exposes an **object list** (layers panel = accessible tree) and live region announcing selection/moves. All colour-coded meaning duplicated with icon/label. Minimum text 13 px UI, 16 px docs. Reduced motion respected.

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. Préfixe de crates : **`ubao-*`** (voir story 0.1 : les dossiers `crates/wiro-*` sont renommés en `crates/ubao-*`).

- `design/tokens/tokens.json` (source, **lecture seule**, ne pas modifier sauf correction de syntaxe signalée au mainteneur)
- `packages/tokens/` : `package.json`, `scripts/build.mjs`, `src/` (sorties générées commitées), `test/`
- `packages/tokens/dist/tokens.css`, `tokens.ts`, `tokens.rs` (sorties) — le `.rs` est aussi copié vers `crates/ubao-model/src/tokens.rs`? **Non** : crate dédié `crates/ubao-tokens` (nouveau, `no_std`-friendly, 0 dépendance) pour ne pas polluer `ubao-model`
- `crates/ubao-tokens/` (nouveau crate : `src/lib.rs` inclut `generated.rs`) — **ajoute-le à `docs/architecture/project-structure.md`** (ligne `ubao-tokens   design tokens consts`)
- `.github/workflows/ci.yml` : étape `pnpm --filter @ubao/tokens build && git diff --exit-code` (sorties à jour)

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/0-3-design-tokens-pipeline` depuis `main` à jour.

1. Lis `design/tokens/tokens.json` en entier (rien d'autre).
2. Écris `packages/tokens/scripts/build.mjs` en **Node pur, sans dépendance** (pas de Style Dictionary) : (a) charge le JSON ; (b) résout les alias `{a.b.c}` récursivement avec détection de cycle et d'alias cassé (erreur explicite avec le chemin) ; (c) génère `dist/tokens.css` : `:root, [data-theme="light"] { --ubao-<chemin-avec-tirets>: valeur; }` pour `primitive`/`light`/`shadow`/`component`, et `[data-theme="dark"] { … }` pour `dark` (mêmes noms de variables que `light`, ex. `--ubao-bg-app`) ; ajoute `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { …dark } }` ; (d) `dist/tokens.ts` : objet `tokens` typé `as const` avec `light`, `dark`, `primitive`, `component` + type `ThemeName` ; (e) `crates/ubao-tokens/src/generated.rs` : `pub const LIGHT_BG_APP: &str = "#FAFAF7";` etc., plus `pub struct Rgba(pub u8,pub u8,pub u8,pub u8)` et `pub const LIGHT_BG_APP_RGBA: Rgba` pour les couleurs (utile au renderer) ; noms `SCREAMING_SNAKE`.
3. Les ombres DTCG (objets) sont émises en CSS comme `box-shadow` valide (`0px 1px 2px 0px #0F12110F`).
4. Thème par attribut : `document.documentElement.dataset.theme = 'dark'|'light'` ; fournis `packages/tokens/src/theme.ts` avec `setTheme(theme)` et `getInitialTheme()` (lit `localStorage['ubao.theme']` puis `prefers-color-scheme`) ; SSR-safe (`typeof document`).
5. Script `pnpm --filter @ubao/tokens build` ; sorties commitées ; ajoute le contrôle de fraîcheur en CI.
6. Branche `apps/web` : importe `@ubao/tokens/dist/tokens.css` et affiche une page de démonstration `/tokens` (dev-only) listant swatches clairs/sombres + bouton de bascule de thème (utilise **uniquement** les variables CSS ; aucune couleur hex dans les composants).
7. Test de contraste : script `packages/tokens/test/contrast.test.ts` calcule le ratio WCAG des paires `text.primary/bg.app`, `text.secondary/bg.app`, `text.muted/bg.app`, `text.on-accent/accent.default`, `accent.default/bg.app`, `border.focus/bg.app`, `border.control/bg.surface`, `text.warning/bg.app`, `state.*.text/state.*.bg` pour light et dark ; seuils : texte ≥ 4.5, focus et `border.control` ≥ 3 (DESIGN.md règle 3). **Si une paire échoue : ne corrige pas le token, signale-la dans la PR et au mainteneur.**

## Critères d'acceptation

**AC1 — Propagation d'un token**
- **Given** `design/tokens/tokens.json` avec `light.accent.default` modifié (dans un test, fichier de fixture copié)
- **When** je lance `node packages/tokens/scripts/build.mjs --input <fixture> --out <tmp>`
- **Then** `tokens.css`, `tokens.ts` et `generated.rs` contiennent la nouvelle valeur

**AC2 — Thème par attribut**
- **Given** la page de démo ouverte avec `data-theme="light"`
- **When** je règle `data-theme="dark"`
- **Then** `getComputedStyle(root).getPropertyValue('--ubao-bg-app')` vaut `#0D0F0E` (test jsdom/Playwright)

**AC3 — Alias cassé**
- **Given** un alias `{primitive.color.nope}`
- **When** le build s'exécute
- **Then** il échoue avec un message citant le token source et l'alias introuvable, code ≠ 0

**AC4 — Sorties à jour**
- **Given** une PR modifiant `tokens.json` sans régénérer
- **When** la CI exécute le contrôle de fraîcheur
- **Then** le job échoue avec `git diff` non vide

**AC5 — Constantes Rust**
- **Given** `crates/ubao-tokens`
- **When** `cargo test -p ubao-tokens`
- **Then** `LIGHT_BG_APP == "#FAFAF7"` et `LIGHT_BG_APP_RGBA == Rgba(0xFA,0xFA,0xF7,0xFF)`

## Tests à écrire
- Unitaire Vitest : résolveur d'alias (simple, chaîné, cycle, cassé), formateur d'ombre, conversion hex→RGBA (6 et 8 chiffres).
- Propriété (`fast-check`, MIT) : pour tout hex valide `#RRGGBB[AA]` la conversion hex→RGBA→hex est identité (normalisée en majuscules).
- Snapshot : `dist/tokens.css` généré depuis la fixture minimale.
- Unitaire Rust : constantes générées ; test que `generated.rs` compile en `no_std` (`#![no_std]` dans le crate).
- Contraste WCAG (voir tâche 7) ; échec non corrigé = signalé.

## Commandes de vérification (exactes)
```bash
pnpm --filter @ubao/tokens build
git diff --exit-code -- packages/tokens crates/ubao-tokens
pnpm --filter @ubao/tokens test
cargo test -p ubao-tokens
pnpm typecheck && pnpm lint && pnpm build
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
- N'importe pas Style Dictionary, Tailwind presets, Radix themes : script maison uniquement.
- Pas de valeurs hex dans `apps/web` hors fichiers générés.
- Ne modifie pas la direction visuelle (« Malachite ») ni les valeurs de tokens.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Une paire de tokens échoue-t-elle au contraste WCAG ? Faut-il corriger `tokens.json` (décision design du mainteneur) ?
- Nom du préfixe des variables CSS : `--ubao-*` (défaut) ou autre ?
- Valider l'ajout du crate `ubao-tokens` à la structure du projet.
