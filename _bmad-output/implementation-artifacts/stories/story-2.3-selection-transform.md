---
id: "2.3"
slug: selection-transform
title: "Selection & transform"
epic: EP2
sprint: S2
depends_on: ["2.2"]
size: L
status: ready-for-dev
branch: feat/2-3-selection-transform
---

# Story 2.3 — Selection & transform

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Les utilisateurs organisent leur tableau : sélectionner, déplacer, redimensionner, pivoter, aligner, grouper et verrouiller avec un annuler/refaire fiable.

## Dépendances (doivent être mergées dans `main` avant de commencer)
2.2 (objets, texte, outils).

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 2.3: Selection & transform
>
> As a user,
> I want to select, multi-select, move, resize, rotate, align, group, lock,
> So that I arrange content.
>
> **Acceptance Criteria:**
>
> - [ ] snapping & smart guides
> - [ ] undo/redo across all transforms

#### PRD — FR3.3 et FR3.8

> - FR3.3 Selection, multi-select, group, align/distribute, snapping & smart guides, lock, z-order, layers panel.
> - FR3.8 Keyboard-complete canvas (tab objects, arrows move, Enter edit) + screen-reader object list.

#### UX — S-05.3 Quick toolbar : actions ⋯

> ## S-05.3 Quick toolbar (on selection)
> Contextual, ≤ 7 controls: fill colour (8 canvas tints + custom) · stroke · text size/style · alignment · connector style/arrowheads · lock · comment · ⋯ (group, z-order, duplicate, copy style, create frame from selection, convert to mind map, export selection).
> Multi-select shows count + align/distribute.

#### UX — S-05.2 : outil Sélection (V)

> ## S-05.2 Main toolbar (8 default tools + More)
> Select (V) · Hand (H) · Sticky (S, long-press = colour) · Text (T) · Shapes (R, flyout: rect, ellipse, diamond, triangle, star, cylinder, cloud) · Connector (L, flyout: straight, elbow, curved) · Pen (P, flyout: pen, highlighter, eraser) · Frame (F) · **More** (Image, Table, Mind map, Comment pin, Templates, Diagram kits, Embed doc card).
> - Tool states: hover tooltip with shortcut; active = malachite fill; locked tool (double-click) shows lock dot.
> - Width 44, buttons 36, gap 4, radius 10, shadow 2.

#### UX — critères canvas

> ### Canvas acceptance criteria
> - 60 fps pan/zoom at 10k objects (NFR-P1); text editing latency < 50 ms.
> - All tools reachable by keyboard; selection announced via live region.
> - Offline: everything except sharing works.

#### UX — undo/redo (§3)

> | Undo/redo | Ctrl/Cmd+Z / Shift+Z, per user, across doc & canvas |

#### UX — accessibilité du canvas (§7)

> ## 7. Accessibility
> WCAG 2.2 AA. Canvas exposes an **object list** (layers panel = accessible tree) and live region announcing selection/moves. All colour-coded meaning duplicated with icon/label. Minimum text 13 px UI, 16 px docs. Reduced motion respected.

#### ADR-0003 — z-order par indices fractionnaires

> ## Consequences
> - Docs editor binding via `loro-prosemirror` — younger than y-prosemirror: budget a hardening spike in S1 (IME, undo, cursor mapping).
> - Canvas elements modelled as Loro maps in a movable tree; z-order via fractional indices.
> - Snapshots + shallow snapshots for fast cold start; GC policy documented.

#### Jeton de guide

> Les guides d'alignement intelligents utilisent le jeton `guide` de `design/tokens/tokens.json` (couleur dédiée, clair et sombre).

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

- `crates/ubao-canvas/src/{selection.rs,transform.rs,snap.rs,align.rs,group.rs,hit.rs}`
- `crates/ubao-model/src/board.rs` (`locked`, `group_id`, `Transform.rotation`)
- `crates/ubao-crdt/src/board_doc.rs` (groupes = nœuds parents dans l'arbre ; `UndoManager`)
- `apps/web/src/board/{SelectionOverlay.tsx,Handles.tsx,Guides.tsx}`
- `tests/e2e/board-transform.spec.ts`

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/2-3-selection-transform` depuis `main` à jour.

1. `ubao-canvas::selection` : ensemble ordonné d'`ObjectId` ; clic simple, **Maj+clic** (ajout/retrait), **sélection au lasso rectangulaire** (marquee) via `rstar`, Ctrl/Cmd+A (tout), Échap (vide), clic sur le vide désélectionne. Hit-test précis (rect tourné, ellipse, losange, triangle) ; objets verrouillés non sélectionnables au lasso, sélectionnables au clic (pour déverrouiller) mais sans poignées.
2. Transformations : déplacement (souris + **flèches : 1 px monde, Maj = 10 px**), redimensionnement par 8 poignées (Maj = conserver le ratio, Alt = depuis le centre), rotation par poignée (Maj = pas de 15°), sur sélection multiple = boîte englobante commune ; mise à jour **par ops Loro regroupées en une transaction** par geste (un geste = une étape d'annulation).
3. Aimantation et **guides intelligents** : bords et centres des autres objets visibles, seuil **6 px écran** (indépendant du zoom), guides dessinés avec le jeton `guide`, aimantation désactivable (Ctrl/Cmd maintenu ou réglage inspecteur 2.4) ; calcul via l'index spatial local (pas de balayage de 10 000 objets : requête sur la zone proche).
4. Aligner (gauche, centre, droite, haut, milieu, bas) et distribuer (horizontal, vertical, ≥ 3 objets) : fonctions pures `align(objects, mode)`. Grouper/dégrouper (Ctrl/Cmd+G / Ctrl/Cmd+Shift+G) : un groupe se transforme comme un seul objet ; verrouiller/déverrouiller (Ctrl/Cmd+Maj+L) ; ordre Z (mettre devant/derrière : Ctrl/Cmd+]/[) via indices fractionnaires sans réécrire les autres objets ; dupliquer (Ctrl/Cmd+D) décalé de 16 px.
5. Annuler/refaire : `UndoManager` Loro **par utilisateur** (Ctrl/Cmd+Z / Ctrl/Cmd+Maj+Z) couvrant création, texte, déplacement, redimensionnement, rotation, alignement, groupement, verrouillage, z-order, suppression ; un geste continu (drag) = 1 étape.
6. Clavier complet (FR3.8) : Tab / Maj+Tab parcourt les objets dans l'ordre Z puis spatial, Entrée entre en édition de texte, Échap sort, flèches déplacent, F2 renomme le libellé accessible ; annonce `aria-live="polite"` « <type>, <libellé>, sélectionné » et « déplacé » (détaillée en 2.5).
7. Performance : sélection/déplacement de 100 objets parmi 10 000 à ≥ 60 fps (frame ≤ 16 ms p50) ; mesurer avec le harnais 0.4b (scénario 3 « drag de 100 objets »).
8. Cas limites : sélection vide, objets supprimés par un pair pendant le drag (le geste continue sur les survivants, aucune panique), rotation + redimensionnement combinés (matrice), objets de taille nulle (taille minimale 8 px monde).

## Critères d'acceptation

**AC1 — Multi-sélection**
- **Given** un tableau avec plusieurs objets
- **When** je fais Maj+clic puis un lasso
- **Then** la sélection contient exactement les objets attendus ; la boîte englobante est affichée avec poignées

**AC2 — Aimantation**
- **Given** un objet déplacé près du bord d'un autre
- **When** il passe à moins de 6 px écran
- **Then** il s'aimante, un guide `guide` apparaît ; à 7 px aucune aimantation (test à zoom 50 % et 200 %)

**AC3 — Annuler/refaire global**
- **Given** une séquence : créer, déplacer, redimensionner, pivoter, aligner, grouper, verrouiller, supprimer
- **When** j'annule 8 fois puis je refais 8 fois
- **Then** l'état après chaque étape correspond exactement à l'état d'origine (comparaison de snapshots)

**AC4 — Groupe**
- **Given** 3 objets groupés
- **When** je déplace le groupe puis je dégroupe
- **Then** les 3 objets ont gardé leurs positions relatives ; après dégroupement ils sont indépendants

**AC5 — Verrouillage**
- **Given** un objet verrouillé
- **When** je tente de le déplacer au clavier et à la souris
- **Then** il ne bouge pas, un message d'état explique pourquoi ; il reste sélectionnable

**AC6 — Parcours clavier**
- **Given** un tableau de 20 objets
- **When** Tab 20 fois puis Entrée sur un sticky
- **Then** le focus parcourt tous les objets une fois ; Entrée ouvre l'édition ; chaque étape est annoncée

**AC7 — Perf du drag**
- **Given** 10 000 objets, 100 sélectionnés
- **When** je les déplace
- **Then** frame time p50 ≤ 16,7 ms, p95 ≤ 33 ms

## Tests à écrire
- Unitaire Rust : hit-test (rotation), transformations (matrices), `align`/`distribute`, aimantation (seuil exact 6 px à plusieurs zooms), groupes, indices fractionnaires.
- Propriété (`proptest`) : (1) pour toute séquence aléatoire d'actions + annulations complètes, l'état revient à l'état initial ; (2) redimensionner puis revenir à la taille initiale redonne la transformation initiale (ε) ; (3) `align` est idempotent ; (4) distribution : écarts égaux ± ε ; (5) convergence de deux répliques appliquant des transformations concurrentes.
- Intégration : annulation par utilisateur avec 2 répliques (l'annulation de A ne défait pas B).
- Playwright e2e : AC1 à AC7 (souris + clavier synthétiques).
- Perf : scénario « drag 100 objets » du harnais 0.4b.
- A11y : annonces live testées par lecture du contenu de la région.

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-canvas -p ubao-crdt -p ubao-model
cargo test --release -p ubao-canvas --test perf
pnpm --filter @ubao/web test
pnpm --filter @ubao/web exec playwright test board-transform
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
- Aucun algorithme de poignées, d'aimantation ou de groupage copié de tldraw/Excalidraw/Miro/AFFiNE : écris-les à partir des règles de la story.
- Pas de bibliothèque de transformation tierce sans vérification de licence.
- Pas de tiret cadratin dans la copy affichée.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Seuil d'aimantation 6 px et pas des flèches (1 px / 10 px) : valider.
- Les groupes imbriqués sont-ils attendus ? (défaut : oui, profondeur illimitée)
- Que se passe-t-il à l'annulation d'une action dont l'objet a été supprimé par un pair ? (défaut : no-op silencieux + annonce)
