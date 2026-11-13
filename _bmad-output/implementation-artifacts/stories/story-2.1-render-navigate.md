---
id: "2.1"
slug: render-navigate
title: "Render & navigate"
epic: EP2
sprint: S2
depends_on: ["0.4b", "1.2", "1.3"]
size: L
status: ready-for-dev
branch: feat/2-1-render-navigate
---

# Story 2.1 — Render & navigate

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Les tableaux doivent rester fluides à 10 000 objets : c'est l'exigence n°1 du produit (NFR-P1) et la base de tout le canvas.

## Dépendances (doivent être mergées dans `main` avant de commencer)
**0.4b (+ décision ADR-0004 du mainteneur)** pour le moteur de rendu ; 1.2 (page de type Tableau) ; 1.3 (persistance). 0.4c n'est pas bloquante.

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 2.1: Render & navigate
>
> As a user,
> I want to pan/zoom smoothly on an infinite canvas with minimap (S-05.6),
> So that large boards stay usable.
>
> **Acceptance Criteria:**
>
> - [ ] 60 fps at 10k objects on reference laptop (perf bench in CI)
> - [ ] wheel/trackpad/pinch/space-drag all work

#### Porte de décision

> **Porte ADR-0004 (bloquante)** : cette story implémente le moteur de rendu **retenu par le mainteneur**. Avant de commencer, vérifie que `docs/architecture/adr/0004-canvas-rendering.md` contient une section `## Decision` dont le texte n'est plus « _pending_ » **et** que `docs/research/bench-canvas-results.md` existe. Sinon : **ARRÊTE-TOI** et demande la décision (voir « À demander »). Utilise uniquement l'interface `Renderer` de `ubao-render` ; ne code pas en dur un backend.

#### ADR-0004 — recommandation

> ## Recommendation (to be validated by the bench below)
> Layered **renderer trait** in `wiro-render` with backends chosen at runtime by capability probe:
> 1. **Primary: B (`vello_gpu`)** on WebGL2/WebGPU.
> 2. **Fallback: C (`vello_cpu`)** with tile/dirty-rect upload when no usable GPU (blocklisted drivers, software GL).
> 3. **Escape hatch: D** only if B fails go/no-go on P1 hardware (decision gate in S0).
> Always do culling/LOD (`rstar`), cached object layers (rasterised stickies/images at zoom bands), and text LOD (below ~6 px → placeholder bars). Never ship A as only path. E is kept as a baseline in the bench, not as a product path.

#### ADR-0004 — conséquences

> ## Consequences
> - `wiro-render` exposes a backend-agnostic trait; capability probe selects backend and reports it (Story 0.4 AC).
> - Bench harness and results committed under `bench/canvas/` and summarised as an ADR addendum.
> - Licence check (`cargo deny`) on `vello_*`, `wgpu`, `parley`, `glifo`, `tiny-skia`: all Apache-2.0/MIT/BSD — compliant.

#### ADR-0003 — canvas dans Loro

> ## Consequences
> - Docs editor binding via `loro-prosemirror` — younger than y-prosemirror: budget a hardening spike in S1 (IME, undo, cursor mapping).
> - Canvas elements modelled as Loro maps in a movable tree; z-order via fractional indices.
> - Snapshots + shallow snapshots for fast cold start; GC policy documented.

#### Architecture — client (§2) et tactiques (§8)

> ## 2. Client (C4 level 2)
> | Layer | Tech | Responsibility |
> |---|---|---|
> | Shell | Tauri 2 (desktop) / browser (web) | windows, menus, FS, updates, deep links |
> | Chrome UI | TypeScript + React + shadcn/ui, tokens | sidebar, panels, dialogs, settings, command palette |
> | Docs editor | ProseMirror (ADR-0006) + loro-prosemirror | blocks, rich text, IME, a11y |
> | Canvas | `wiro-canvas` + `wiro-render` (Rust→WASM, wgpu: WebGPU / WebGL2) drawing into `<canvas>` | scene graph, hit-test (`rstar`), culling/LOD, input, text (`parley`) |
> | Core | `wiro-model`, `wiro-crdt`, `wiro-storage`, `wiro-sync`, `wiro-search`, `wiro-format` (WASM; native in Tauri side where useful) | data model, merge, persistence, sync, search, import/export |
> | Bridge | `wasm-bindgen` + `tsify` (typed) | events/commands between chrome and engines; no JSON blobs on hot paths |
>
> Data flow: user input → command → CRDT op → **local WAL write (IndexedDB/OPFS on web, SQLite on desktop)** → render → sync queue → server → broadcast → merge on peers.
>
> ## 8. Quality attributes → tactics
> | NFR | Tactic |
> |---|---|
> | P1 60 fps @10k | GPU renderer, spatial index, culling, LOD for text/images, dirty-rect, worker threads where available |
> | R1 no data loss | WAL before ack, fsync on desktop, crash-recovery replay, chaos tests |
> | O1 offline | everything local; server optional |
> | B1 bandwidth | binary deltas, zstd, media transcoding server-side, lazy media |
> | A1 a11y | DOM chrome; canvas object tree mirrored to accessible DOM list |

#### Budgets de performance (§16)

> ## 16. Performance budget (numbers; owned by NFR)
> | Area | Budget |
> |---|---|
> | Canvas pan/zoom, 10k objects (NFR-P1) | 60 fps p50, ≥ 30 fps p95, on 4 GB/iGPU |
> | Input latency (NFR-P2) | < 50 ms p95 |
> | Cold start desktop / web shell (NFR-P3) | < 2 s / < 3 s on 3G-fast; initial web JS+WASM ≤ 1.5 MB gz |
> | Renderer WASM / search WASM / CRDT WASM | < 600 KB / < 150 KB / < 400 KB gz [ASSUMPTION] |
> | Memory 10k-object board (NFR-P4) | < 600 MB RSS desktop; < 400 MB @ 5k mobile |
> | Sync | idle ≤ 1 MB/h (NFR-B1); op apply < 5 ms p95; reconnect-to-synced < 2 s on 3G for a 1 MB doc diff |
> | Server | 1 vCPU/2 GB handles ≥ 200 concurrent editors [ASSUMPTION, to measure] |
> | Search | < 50 ms p95 desktop (ADR-0007) |
> Budgets are checked by the bench jobs (§13); regressions > 10 % fail CI.

#### PRD — FR3.1, FR3.8 et NFR

> ### E3 Canvas (board)
> - FR3.1 Infinite canvas: pan/zoom (wheel, trackpad, touch), minimap, zoom-to-fit, frames.
> - FR3.8 Keyboard-complete canvas (tab objects, arrows move, Enter edit) + screen-reader object list.
> | NFR-P1 | Canvas pan/zoom | 60 fps with 10 000 objects on 4 GB RAM / integrated GPU laptop |
> | NFR-P2 | Input latency (type, move) | < 50 ms p95 |
> | NFR-P4 | Memory | < 600 MB RSS for a 10k-object board |

#### UX — canvas : introduction

> # 05 — Canvas (board)
>
> Canvas surface = `bg.canvas`; dot grid 24 px at 4 % opacity (toggle: dots / lines / none). Rendering by Rust/WASM engine; chrome in TS.

#### UX — S-05.1 Board page

> ## S-05.1 Board page
> - Full bleed under topbar; floating UI only:
>   - **Main toolbar** left-centre vertical (desktop) / bottom-centre horizontal (tablet): see S-05.2.
>   - **Quick toolbar** above selection (S-05.3).
>   - **Zoom & minimap** bottom-right (S-05.6).
>   - **Workshop bar** top-centre when workshop active (S-06.1).
>   - Inspector right panel on demand (S-05.4).
> - Board empty state: centred card "Tableau vide" + buttons: Ajouter un post-it · Choisir un modèle · Importer une image/PDF; hint "Double-cliquez n'importe où pour écrire".
> - Perf HUD (dev flag): fps, objects, memory.

#### UX — S-05.6 Zoom, minimap, navigation

> ## S-05.6 Zoom, minimap, navigation
> Bottom-right cluster: zoom % (click → menu: 50/100/200, fit, selection), − / +, minimap toggle (180×120 with viewport rectangle draggable). Navigation: wheel = pan (trackpad) / zoom with Ctrl; space+drag = pan; pinch on touch.

#### UX — critères canvas

> ### Canvas acceptance criteria
> - 60 fps pan/zoom at 10k objects (NFR-P1); text editing latency < 50 ms.
> - All tools reachable by keyboard; selection announced via live region.
> - Offline: everything except sharing works.

#### UX — raccourcis (§5)

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

- `crates/ubao-canvas/src/{camera.rs,scene.rs,index.rs,culling.rs,input.rs,minimap.rs}`
- `crates/ubao-render/src/{renderer.rs,backends/*}` (backend retenu par l'ADR ; capacité probe de 0.4)
- `crates/ubao-model/src/board.rs` (`ObjectId`, `Element`, `ElementKind`, `Transform`, `Rect`)
- `crates/ubao-crdt/src/board_doc.rs` (éléments = maps Loro dans un **arbre déplaçable** ; z-order = indices fractionnaires)
- `crates/ubao-wasm/` (`CanvasEngine` : `attach(canvas)`, `resize`, `pointer`, `wheel`, `key`, `render`)
- `apps/web/src/board/{BoardPage.tsx,ZoomCluster.tsx,Minimap.tsx,EmptyBoard.tsx}`
- `tools/bench/` (job CI `bench-regression`)
- `tests/e2e/board-nav.spec.ts`

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/2-1-render-navigate` depuis `main` à jour.

1. Vérifie la **porte ADR-0004** (voir extrait). Si bloqué : arrête.
2. `ubao-model::board` : `Element{id, kind, transform{x,y,w,h,rotation}, z: FractionalIndex}` ; `ElementKind` (Sticky, Text, Shape(kind), …) — seules les variantes nécessaires à 2.1/2.2. `ubao-crdt::BoardDoc` : `elements()`, `insert(element)`, `update_transform`, `subscribe`. Chaque op passe par `StorageAdapter.append` avant rendu.
3. `ubao-canvas::camera` (pur, testable) : `Camera{x,y,zoom}` (zoom borné **5 % à 400 %**), `screen_to_world`, `world_to_screen`, `pan_by(dx,dy)`, `zoom_at(anchor_screen, factor)` (**le point monde sous l'ancre reste fixe**), `fit(bounds, viewport, padding)`, `viewport_world_rect()`.
4. `ubao-canvas::index` : `rstar` (MIT/Apache) pour la requête de visibilité ; `ubao-canvas::culling` : renvoie les objets du rectangle visible + LOD par zone de zoom (texte < ~6 px → barres ; images : niveaux mipmap/zoom-bands) comme décrit dans ADR-0004 ; cache de couches pour les stickies rasterisés ; **dirty rect** quand seule une région change.
5. Boucle de rendu : `CanvasEngine.render()` appelé par `requestAnimationFrame` **seulement si l'état est sale** (caméra/scène) ; mesure `frame_ms` ; si 3 frames consécutives > 33 ms, baisse le LOD (réglage documenté) ; backend choisi via `select_backend` (0.4) + ADR ; hôte DOM `<canvas>` géré par `BoardPage`.
6. Entrées (S-05.6) : **molette** = pan (trackpad) et **Ctrl+molette / pincement trackpad (`ctrlKey` wheel)** = zoom ancré ; **Espace + glisser** et outil **Main (H)** = pan ; **pincement tactile** à 2 pointeurs (Pointer Events, `touch-action:none`) = zoom + pan ; clavier : Ctrl/Cmd + `=` / `-` zoom, `0` = 100 %, `1` = ajuster au contenu, `2` = ajuster à la sélection (sans sélection : message bref). Aucune de ces actions ne bloque le fil principal > 16 ms.
7. UI flottante (S-05.1/S-05.6) : grille de points 24 px à 4 % d'opacité (réglage Points/Lignes/Aucune ; défaut points), cluster en bas à droite : pourcentage de zoom (clic → menu 50 / 100 / 200 / Ajuster / Sélection), boutons − / +, bascule minimap ; minimap 180×120 avec rectangle de vue **déplaçable** (pointer + clavier : flèches déplacent la vue) ; HUD de perf (fps, objets, mémoire) derrière le drapeau `?perf=1` ; état vide « Tableau vide » (boutons « Ajouter un post-it » désactivé « Disponible bientôt » tant que 2.2 n'est pas mergée, « Choisir un modèle » désactivé, « Importer… » désactivé) et l'astuce « Double-cliquez n'importe où pour écrire ».
8. Rendu minimal des objets : stickies = rectangles teintés (tokens `canvas-note.*`) + ombre `shadow.1`, formes basiques, sélection non gérée ici (2.3). Les couleurs viennent de `ubao-tokens` (0.3) : **aucun hex dans le moteur**. Thème sombre : `bg.canvas` du thème courant.
9. Mémoire/Perf : génère via `tools/bench` la scène 10 000 objets (seed 42, 0.4b) et vérifie la boucle de rendu avec le backend retenu ; objectif 60 fps p50 / 30 fps p95 sur la machine de référence M1, mémoire < 600 Mo ; **CI** : job `bench-regression` exécute la scène 10k en navigateur sans GPU (backend CPU) et compare à `tools/bench/canvas/results/ci-baseline.json` : échec si régression > 10 % (architecture §16) ; le 60 fps absolu est vérifié manuellement sur M1 (runbook 0.4b) et noté dans la PR.
10. Accessibilité minimale : le `<canvas>` a `role="img"` + `aria-label` « Tableau : N objets » et un lien « Aller à la liste des objets » (la liste est la story 2.5) ; focus clavier sur le canvas affiche l'anneau de focus (2 px).

## Critères d'acceptation

**AC1 — 60 fps à 10 000 objets**
- **Given** la scène seed 42 de 10 000 objets sur la machine de référence M1 (4 Go, iGPU)
- **When** je rejoue la trace de pan/zoom du bench pendant 60 s
- **Then** fps p50 ≥ 60 et p95 ≥ 30, RSS < 600 Mo ; le résultat JSON est joint à la PR

**AC2 — Régression en CI**
- **Given** la CI exécute `bench-regression`
- **When** la médiane de frame time se dégrade de plus de 10 % par rapport à la baseline
- **Then** le job échoue et affiche les deux valeurs

**AC3 — Zoom ancré**
- **Given** un objet sous le curseur
- **When** je zoome avec Ctrl+molette autour de lui
- **Then** l'objet reste sous le curseur (écart ≤ 1 px) ; zoom borné entre 5 % et 400 %

**AC4 — Toutes les entrées de navigation**
- **Given** un tableau ouvert
- **When** je fais : molette, Ctrl+molette, Espace+glisser, outil H+glisser, pincement tactile à 2 doigts, Ctrl/Cmd+0/1
- **Then** chaque geste produit le pan/zoom attendu (tests sur événements synthétiques Playwright)

**AC5 — Minimap**
- **Given** un tableau de 10 000 objets
- **When** je glisse le rectangle de vue de la minimap
- **Then** la caméra suit en temps réel ; clavier : flèches déplacent la vue

**AC6 — Persistance de la caméra**
- **Given** une vue zoomée
- **When** je recharge la page
- **Then** la dernière caméra par tableau est restaurée (préférence locale, non synchronisée)

## Tests à écrire
- Unitaire Rust : `Camera` (aller-retour écran↔monde, zoom ancré, bornes, `fit`), culling (objets partiellement visibles inclus).
- Propriété (`proptest`) : `world_to_screen(screen_to_world(p)) ≈ p` (ε < 1e-6) ; `zoom_at` conserve le point monde ancré ; `fit` contient toujours les bornes ; `rstar` : résultat de requête == filtrage brut sur le même jeu.
- Unitaire : LOD (seuil texte), cache de couches invalidé sur changement de scène.
- Perf/bench : scène 10k (job `bench-regression`) ; mesure manuelle M1.
- Playwright e2e : AC3 à AC6 avec événements synthétiques (wheel/pointer/keyboard).
- Vérifie que `unsafe_code = forbid` tient (pas d'`unsafe` dans canvas/render hors dépendances).

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-canvas -p ubao-render -p ubao-crdt
cargo test --release -p ubao-canvas --test perf
cargo xtask bench-canvas --objects 10000 --duration 60 --backend selected --auto
cargo xtask bench-report tools/bench/canvas/results
pnpm --filter @ubao/web test
pnpm --filter @ubao/web exec playwright test board-nav
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
- Aucun code de rendu, de caméra, de minimap ni de structure de scène de tldraw, Excalidraw, Miro, AFFiNE/BlockSuite : lecture conceptuelle interdite pendant l'écriture ; écris à partir des formules de cette story.
- Pas de moteur de rendu autre que celui décidé dans l'ADR-0004.
- Ne fixe pas l'ADR-0004 toi-même.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).
- [ ] Résultat bench 10k (JSON) joint à la PR ; `ci-baseline.json` commité.

## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- L'ADR-0004 est-il décidé (`## Decision`) ? Quel backend (vello_gpu + repli vello_cpu, wgpu maison…) ?
- Résultat M1 : s'il est < 60 fps p50, valider la stratégie (LOD plus agressif) avant de continuer ; le périmètre ne se réduit pas (AGENTS.md).
- Où persister la dernière caméra : local seulement (défaut) ?
