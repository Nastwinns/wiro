---
id: "2.4"
slug: quick-toolbar-inspector
title: "Quick toolbar & inspector"
epic: EP2
sprint: S2
depends_on: ["2.3"]
size: M
status: ready-for-dev
branch: feat/2-4-quick-toolbar-inspector
---

# Story 2.4 — Quick toolbar & inspector

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Styliser un objet doit se faire à portée de souris, sans chercher dans des menus.

## Dépendances (doivent être mergées dans `main` avant de commencer)
2.3 (sélection, transformations, groupes, verrouillage, z-order).

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 2.4: Quick toolbar & inspector
>
> As a user,
> I want contextual quick toolbar and inspector panel (S-05.3/5.4),
> So that I style without hunting menus.
>
> **Acceptance Criteria:**
>
> - [ ] ≤ 7 controls; inspector reflects multi-selection
> - [ ] keyboard reachable

#### PRD — FR3.4

> - FR3.4 Inspector panel: fill (canvas palette), stroke, text style, size, position; quick toolbar on selection.

#### UX — S-05.3 Quick toolbar

> ## S-05.3 Quick toolbar (on selection)
> Contextual, ≤ 7 controls: fill colour (8 canvas tints + custom) · stroke · text size/style · alignment · connector style/arrowheads · lock · comment · ⋯ (group, z-order, duplicate, copy style, create frame from selection, convert to mind map, export selection).
> Multi-select shows count + align/distribute.

#### UX — S-05.4 Inspector

> ## S-05.4 Inspector (right panel)
> Sections: Position & size (x, y, w, h, rotation, lock ratio) · Fill · Stroke · Text · Connector · Frame (name, background, slide order) · Data (linked database item) · Accessibility (alt text, label). Empty selection → board settings (background, grid, snapping, default sticky colour).

#### UX — motifs globaux : quick toolbar, inspecteur (§3)

> | Quick toolbar | Appears above selection (doc text or canvas objects); ≤ 7 actions + ⋯ |
> | Inspector | Context-dependent right panel; never modal |

#### UX — layout : panneau droit 300 px et raccourcis

> ## 2. Layout model (desktop / web)
> ```
> ┌──────────────────────────────────────────────────────────────────────────┐
> │ Topbar 48px: breadcrumb · page title · view toggle Doc|Board · presence · Share · ⋯ │
> ├────────────┬───────────────────────────────────────────────┬─────────────┤
> │ Sidebar    │ Main surface                                  │ Inspector / │
> │ 264px      │  Doc: centred column 720px (wide: 1040px)     │ Right panel │
> │ collapsible│  Board: full bleed canvas + floating toolbars │ 300px       │
> │ (Ctrl+\)   │                                               │ (comments,  │
> │            │                                               │ props, history)│
> ├────────────┴───────────────────────────────────────────────┴─────────────┤
> │ Status strip (optional, 24px): sync · data usage · offline · zoom        │
> └──────────────────────────────────────────────────────────────────────────┘
> ```
> Breakpoints: ≥1440 comfortable · 1366×768 **reference** (everything must fit, sidebar + inspector both open) · 1024 tablet (sidebar overlays) · ≤ 600 mobile (bottom bar, sheets).
>
> ## 5. Keyboard map (core)
> | Action | Shortcut |
> |---|---|
> | Command palette | Ctrl/Cmd+K |
> | New page | Ctrl/Cmd+N |
> | Toggle Doc/Board | Ctrl/Cmd+E |
> | Search | Ctrl/Cmd+Shift+F |
> | Toggle sidebar / inspector | Ctrl/Cmd+\ / Ctrl/Cmd+. |
> | Canvas tools | V select · H hand · S sticky · T text · R rect · O ellipse · L connector · P pen · F frame · C comment |
> | Zoom | Ctrl/Cmd+= / − / 0 (100 %) / 1 (fit) / 2 (selection) |
> | Workshop | Alt+T timer · Alt+V vote · Alt+P private mode · Alt+F follow me |

#### UX — critères canvas

> ### Canvas acceptance criteria
> - 60 fps pan/zoom at 10k objects (NFR-P1); text editing latency < 50 ms.
> - All tools reachable by keyboard; selection announced via live region.
> - Offline: everything except sharing works.

#### Teintes

> Les 8 teintes de stickies (tokens `canvas-note.*` du fichier `design/tokens/tokens.json`) : sand, ochre, clay, stone, mint, aqua, sky, lilac ; chaque teinte a `bg` et `text` pour clair et sombre.

#### DESIGN.md

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

#### Pile UI

> Stack UI (ADR-0002) : React + TypeScript + Tailwind mappé sur les variables `--ubao-*` de `@ubao/tokens`, primitives Radix (MIT) dans `packages/ui` (créées en story 1.1), icônes `lucide-react`. Zéro hex en dur (DESIGN.md règle 1). Libellés par clés i18n (`t('canvas.toolbar.sticky')`) ; pas de tiret cadratin dans la copy affichée (DESIGN.md règle 7).

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. Préfixe de crates : **`ubao-*`** (voir story 0.1 : les dossiers `crates/wiro-*` sont renommés en `crates/ubao-*`).

- `apps/web/src/board/{QuickToolbar.tsx,Inspector/*.tsx}` (sections : Position & taille, Remplissage, Contour, Texte, Accessibilité ; Réglages du tableau)
- `crates/ubao-canvas/src/style.rs` (lecture/écriture groupée de propriétés, valeur « mixte »)
- `crates/ubao-model/src/board.rs` (`Style{fill, stroke, stroke_width, text_size, text_align, alt_text, label}`, `BoardSettings{background, grid, snapping, default_tint}`)
- `packages/ui/` (`ColorSwatchGroup`, `NumberField`, `Segmented`, `Toolbar`)
- `locales/{fr,en}/app.ftl`
- `tests/e2e/board-inspector.spec.ts`

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/2-4-quick-toolbar-inspector` depuis `main` à jour.

1. Modèle de style : propriétés optionnelles ; `ubao-canvas::style::read(selection) -> Mixed<T>` (`Same(v)` | `Mixed`) et `apply(selection, patch)` en **une transaction Loro** (= une étape d'annulation).
2. **Quick toolbar** (S-05.3) flottante au-dessus de la sélection (suit le déplacement/zoom, se repositionne pour rester dans la fenêtre, masquée pendant un drag) avec **7 contrôles maximum** + « ⋯ » : (1) remplissage (8 teintes + personnalisé), (2) contour, (3) taille/style de texte, (4) alignement du texte, (5) verrouillage, (6) aligner/distribuer (si ≥ 2 objets, affiche le nombre sélectionné), (7) plus, ⋯ = grouper/dégrouper, ordre Z, dupliquer, copier le style / coller le style. **Retire les contrôles non pertinents** au lieu de les griser ; **Connecteur/commentaire/cadre/conversion mind map/export de sélection** : non affichés (stories 4.3, 5.x). Couleur personnalisée : champ hexadécimal + sélecteur natif ; refuse une valeur illisible (contraste texte/fond < 4,5 : message et suggestion).
3. **Inspecteur** (panneau droit 300 px, **jamais modal**, Ctrl/Cmd+. l'ouvre/ferme) : sections Position & taille (x, y, l, h, rotation, verrouiller le ratio), Remplissage, Contour, Texte, **Accessibilité (texte alternatif, libellé)**. Les valeurs divergentes d'une multi-sélection affichent « Mixte » ; modifier un champ l'applique à tous. Sans sélection → **Réglages du tableau** (fond, grille Points/Lignes/Aucune, aimantation, teinte par défaut des post-its). Section Données/Connecteur/Cadre : absentes.
4. Champs numériques : saisie clavier, flèches ± 1 (Maj ± 10), Entrée valide, Échap annule, validation (bornes, unité px monde), annonce d'erreur liée.
5. Accès clavier : la quick toolbar est un `role="toolbar"` à tabindex itinérant (flèches entre contrôles) ; **F6** cycle entre régions (canvas → quick toolbar → inspecteur → barre latérale) ; Échap ramène au canvas.
6. Cohérence : changer la teinte dans la quick toolbar met à jour l'inspecteur et inversement (une seule source : le modèle).
7. Performance : appliquer un style à 1 000 objets sélectionnés en < 100 ms (hors rendu) ; pas de ré-rendu React de la liste complète.

## Critères d'acceptation

**AC1 — Au plus 7 contrôles**
- **Given** un sticky sélectionné puis 3 formes sélectionnées
- **When** j'affiche la quick toolbar
- **Then** elle contient ≤ 7 contrôles + ⋯ dans chaque cas, uniquement des actions pertinentes

**AC2 — Multi-sélection mixte**
- **Given** un sticky sable et un sticky menthe sélectionnés
- **When** j'ouvre l'inspecteur
- **Then** le remplissage affiche « Mixte » ; choisir « Ciel » applique la teinte aux deux en une seule étape d'annulation

**AC3 — Réglages sans sélection**
- **Given** aucune sélection
- **When** j'ouvre l'inspecteur
- **Then** les réglages du tableau (fond, grille, aimantation, teinte par défaut) s'affichent et sont appliqués

**AC4 — Clavier**
- **Given** un objet sélectionné
- **When** j'utilise F6 puis les flèches et Entrée dans la quick toolbar, puis Tab dans l'inspecteur
- **Then** tous les contrôles sont atteignables et activables sans souris ; le focus est visible (2 px + décalage 2 px)

**AC5 — Contraste personnalisé**
- **Given** une couleur personnalisée de contraste insuffisant avec le texte
- **When** je valide
- **Then** la valeur est refusée avec un message et une suggestion ; une valeur correcte est acceptée

**AC6 — Annulation**
- **Given** une modification de style
- **When** j'appuie sur Ctrl/Cmd+Z
- **Then** l'état précédent revient en un seul pas

## Tests à écrire
- Unitaire Rust : `Mixed` (identique/mixte), `apply` atomique, validation des bornes.
- Propriété (`proptest`) : `apply(read(selection))` est un no-op ; appliquer puis annuler restitue l'état ; une multi-sélection de valeurs aléatoires donne `Mixed` ssi les valeurs diffèrent.
- Vitest : quick toolbar (nombre de contrôles selon la sélection), inspecteur (Mixte, bornes, clavier), repositionnement.
- Playwright e2e : AC1 à AC6.
- A11y : snapshot ARIA des deux composants ; navigation F6.
- Perf : style sur 1 000 objets < 100 ms.

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-canvas -p ubao-model
pnpm --filter @ubao/ui test && pnpm --filter @ubao/web test
pnpm i18n:check
pnpm --filter @ubao/web exec playwright test board-inspector
cargo deny check && pnpm licenses:check
cargo fmt --all -- --check && cargo clippy --workspace --all-targets --all-features -- -D warnings
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
- Pas de sélecteur de couleur tiers non vérifié (utiliser `<input type="color">` natif + champ hex).
- Pas de contrôles pour des fonctions inexistantes (connecteurs, commentaires, cadres).
- Aucun hex en dur ; pas de tiret cadratin dans la copy affichée.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Faut-il persister « copier le style » dans le presse-papiers système ou seulement en mémoire de session ? (défaut : mémoire de session)
- Palette de couleurs personnalisées : autorisée hors jetons ? (DESIGN.md : un accent par vue ; ici la couleur appartient au contenu utilisateur : défaut oui)
