---
id: "2.2"
slug: stickies-text-shapes
title: "Stickies, text, shapes"
epic: EP2
sprint: S2
depends_on: ["2.1"]
size: L
status: ready-for-dev
branch: feat/2-2-stickies-text-shapes
---

# Story 2.2 — Stickies, text, shapes

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Le facilitateur capture ses idées en posant des post-its, du texte et des formes en quelques secondes.

## Dépendances (doivent être mergées dans `main` avant de commencer)
2.1 (caméra, scène Loro, rendu, boucle). Dépend aussi du chemin de texte (shaping) choisi dans l'ADR-0004 (`parley` recommandé).

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 2.2: Stickies, text, shapes
>
> As a facilitator (P4),
> I want to add and edit stickies, text and basic shapes (S-05.2),
> So that I capture ideas.
>
> **Acceptance Criteria:**
>
> - [ ] 8 canvas tints; text edit latency < 50 ms
> - [ ] double-click empty canvas creates text

#### PRD — FR3.2 (objets) et NFR-P2

> - FR3.2 Objects: sticky, text, shape (rect, ellipse, diamond, triangle, …), connector/arrow (bound, labelled, orthogonal/curved), pen/highlighter, image, frame, table, mind-map node, embedded doc card, comment pin.
> | NFR-P2 | Input latency (type, move) | < 50 ms p95 |

#### UX — S-05.2 Barre d'outils principale

> ## S-05.2 Main toolbar (8 default tools + More)
> Select (V) · Hand (H) · Sticky (S, long-press = colour) · Text (T) · Shapes (R, flyout: rect, ellipse, diamond, triangle, star, cylinder, cloud) · Connector (L, flyout: straight, elbow, curved) · Pen (P, flyout: pen, highlighter, eraser) · Frame (F) · **More** (Image, Table, Mind map, Comment pin, Templates, Diagram kits, Embed doc card).
> - Tool states: hover tooltip with shortcut; active = malachite fill; locked tool (double-click) shows lock dot.
> - Width 44, buttons 36, gap 4, radius 10, shadow 2.

#### UX — S-05.1 : état vide et double-clic

> ## S-05.1 Board page
> - Full bleed under topbar; floating UI only:
>   - **Main toolbar** left-centre vertical (desktop) / bottom-centre horizontal (tablet): see S-05.2.
>   - **Quick toolbar** above selection (S-05.3).
>   - **Zoom & minimap** bottom-right (S-05.6).
>   - **Workshop bar** top-centre when workshop active (S-06.1).
>   - Inspector right panel on demand (S-05.4).
> - Board empty state: centred card "Tableau vide" + buttons: Ajouter un post-it · Choisir un modèle · Importer une image/PDF; hint "Double-cliquez n'importe où pour écrire".
> - Perf HUD (dev flag): fps, objects, memory.

#### UX — critères canvas

> ### Canvas acceptance criteria
> - 60 fps pan/zoom at 10k objects (NFR-P1); text editing latency < 50 ms.
> - All tools reachable by keyboard; selection announced via live region.
> - Offline: everything except sharing works.

#### Teintes de stickies

> Les 8 teintes de stickies (tokens `canvas-note.*` du fichier `design/tokens/tokens.json`) : sand, ochre, clay, stone, mint, aqua, sky, lilac ; chaque teinte a `bg` et `text` pour clair et sombre.

#### ADR-0004 — texte et LOD

> ## Recommendation (to be validated by the bench below)
> Layered **renderer trait** in `wiro-render` with backends chosen at runtime by capability probe:
> 1. **Primary: B (`vello_gpu`)** on WebGL2/WebGPU.
> 2. **Fallback: C (`vello_cpu`)** with tile/dirty-rect upload when no usable GPU (blocklisted drivers, software GL).
> 3. **Escape hatch: D** only if B fails go/no-go on P1 hardware (decision gate in S0).
> Always do culling/LOD (`rstar`), cached object layers (rasterised stickies/images at zoom bands), and text LOD (below ~6 px → placeholder bars). Never ship A as only path. E is kept as a baseline in the bench, not as a product path.

#### Architecture — texte (parley) et i18n (§15)

> | Canvas | `wiro-canvas` + `wiro-render` (Rust→WASM, wgpu: WebGPU / WebGL2) drawing into `<canvas>` | scene graph, hit-test (`rstar`), culling/LOD, input, text (`parley`) |
>
> ## 15. i18n / RTL
> UI languages v1: FR, EN, then AR (RTL), and Wolof/Hausa/Yoruba/Swahili as community-driven. Strings externalised (ICU MessageFormat; `i18next`-style on TS, `fluent-rs` (Apache-2.0 OR MIT) / ICU4X (Unicode-3.0, see ADR-0007 licence gate) on Rust side), +30 % expansion tolerance (NFR-I1), logical CSS properties, mirrored layout & icons for RTL, bidi-aware text in editor and canvas (`parley` + ICU4X, MIT-style Unicode licence verified), fonts bundled/subset per script (Noto, OFL — fonts only, not code) with lazy load, IME composition safe in docs and canvas text, locale-aware dates/numbers/currency (XOF/NGN/KES), search normalisation (ADR-0007).

#### ADR-0003 — canvas dans Loro

> ## Consequences
> - Docs editor binding via `loro-prosemirror` — younger than y-prosemirror: budget a hardening spike in S1 (IME, undo, cursor mapping).
> - Canvas elements modelled as Loro maps in a movable tree; z-order via fractional indices.
> - Snapshots + shallow snapshots for fast cold start; GC policy documented.

#### Raccourcis (§5)

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

- `crates/ubao-model/src/board.rs` (`Sticky{text, tint}`, `TextBox{text, size}`, `Shape{kind, fill, stroke}`)
- `crates/ubao-crdt/src/board_doc.rs` (texte = `LoroText`)
- `crates/ubao-canvas/src/{tools.rs,text_layout.rs,hit.rs}` (outils, mise en page via `parley` si décidé)
- `crates/ubao-render/` (dessin sticky/texte/formes)
- `apps/web/src/board/{Toolbar.tsx,TextEditorOverlay.tsx,StickyTintMenu.tsx}`
- `locales/{fr,en}/app.ftl`
- `tests/e2e/board-objects.spec.ts`

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/2-2-stickies-text-shapes` depuis `main` à jour.

1. Porte ADR-0004 vérifiée comme en 2.1.
2. Modèle : `Sticky` (≥ 1 teinte parmi les 8 `canvas-note.*`, taille par défaut 200×200 monde, texte `LoroText`), `TextBox` (largeur auto ou fixe, taille 12–48 px), `Shape` : rect, ellipse, losange (diamond), triangle avec remplissage/contour/épaisseur (jetons). `ubao-crdt::BoardDoc::insert/delete/set_tint/set_text`.
3. Barre d'outils principale (S-05.2) : colonne gauche 44 px (boutons 36 → **cibles ≥ 32**, ici 36), outils **Sélection (V)**, **Main (H)**, **Post-it (S, appui long = menu de teintes)**, **Texte (T)**, **Formes (R, volet : rect, ellipse, losange, triangle)** ; les autres entrées (Connecteur, Stylo, Cadre, Plus) sont **affichées désactivées « Disponible bientôt »**. Info-bulle avec raccourci ; outil actif = remplissage accent ; double-clic sur un outil = verrouillé (point de verrouillage).
4. Création : avec l'outil Post-it, clic = pose un sticky à la teinte courante (par défaut la 1re) et **entre immédiatement en édition** ; glisser = pose à la taille tracée. Texte : clic crée un `TextBox` et passe en édition. **Double-clic sur le canvas vide crée un texte** (critère d'acceptation). Formes : glisser pour tracer.
5. Édition de texte : **overlay DOM** `contenteditable`/`textarea` positionné et mis à l'échelle sur l'objet (zoom compris) — nécessaire pour l'IME, le RTL et l'accessibilité ; la composition IME ne doit jamais être interrompue par un rendu ; au `blur`/Échap la valeur est validée dans `LoroText` (diff minimal, pas de remplacement complet) ; pendant la frappe le canvas affiche le texte provisoire. Latence d'entrée (touche → pixel) mesurée avec `performance.now()` : **p95 < 50 ms** avec 10 000 objets chargés.
6. Rendu du texte : shaping bidirectionnel (`parley`, ou chemin choisi par l'ADR-0004), césure automatique dans le sticky, alignement logique (début/fin) pour le RTL, polices : Inter (UI/sticky) ; **polices embarquées sous licence OFL uniquement** (fichiers de police ≠ code ; vérifie la licence dans `THIRD_PARTY_NOTICES.md`) ; si la police manque un glyphe, repli sans « tofu » invisible : affiche le glyphe de repli ; sous ~6 px de hauteur de texte → barres de LOD (2.1).
7. Teintes : 8 teintes via `ubao-tokens` (couleur de fond + couleur de texte **tokenisée** pour le contraste), menu de teintes accessible (rôle `radiogroup`, noms FR « Sable », « Ocre », « Argile », « Pierre », « Menthe », « Aqua », « Ciel », « Lilas » ; couleur + libellé, jamais couleur seule).
8. Suppression : Suppr/Retour arrière supprime l'objet sélectionné **seulement s'il existe déjà une sélection simple** (la sélection complète est 2.3) ; pour 2.2, un clic sélectionne un seul objet avec cadre simple.
9. Persistance et undo : chaque création/édition = ops Loro écrites via le WAL ; `Ctrl/Cmd+Z` annule la dernière création/édition de l'utilisateur local (`UndoManager` Loro).
10. i18n : toutes les chaînes par clés (`canvas.toolbar.sticky` …).

## Critères d'acceptation

**AC1 — Teintes**
- **Given** la barre d'outils
- **When** j'ouvre le menu de teintes du Post-it
- **Then** 8 teintes sont proposées, chacune avec un nom accessible ; la teinte choisie est appliquée aux nouveaux post-its et rendue avec la couleur de texte tokenisée

**AC2 — Création par double-clic**
- **Given** un tableau vide
- **When** je double-clique sur le canvas vide
- **Then** un objet Texte est créé à cet endroit et passe en édition ; Échap valide

**AC3 — Latence de frappe**
- **Given** un tableau de 10 000 objets chargé
- **When** je tape 200 caractères dans un sticky
- **Then** la latence touche→pixel p95 est < 50 ms

**AC4 — IME**
- **Given** un sticky en édition
- **When** je compose « é », « ŋ », « ẹ̀ » et un mot arabe via composition IME simulée (CDP)
- **Then** le texte final est exact, la composition n'est pas interrompue, le RTL s'affiche de droite à gauche

**AC5 — Persistance**
- **Given** un post-it avec texte
- **When** je recharge la page
- **Then** le post-it, sa teinte et son texte sont restaurés

**AC6 — Undo**
- **Given** une création de post-it
- **When** j'appuie sur Ctrl/Cmd+Z puis Ctrl/Cmd+Shift+Z
- **Then** il disparaît puis revient, au même endroit

## Tests à écrire
- Unitaire Rust : mise en page (césure, RTL, graphèmes combinants), hit-test des formes (rect, ellipse, losange, triangle), modèle.
- Propriété (`proptest`) : pour tout texte Unicode, `layout` ne panique pas, les indices de curseur restent sur des frontières de graphèmes ; `LoroText` après diff-commit == texte saisi.
- Vitest : menu de teintes (ARIA), outils (états, raccourcis), overlay (composition simulée).
- Playwright e2e : AC1 à AC6, mesure de latence.
- Visuel : captures de référence des 8 teintes clair/sombre (contraste vérifié via tokens).
- A11y : snapshot ARIA barre d'outils.

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-canvas -p ubao-render -p ubao-crdt -p ubao-model
pnpm --filter @ubao/web test
pnpm i18n:check
pnpm --filter @ubao/web exec playwright test board-objects
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
- Aucun code ni modèle de données d'éditeur de texte de tldraw/Excalidraw/Miro/AFFiNE ; l'overlay DOM est écrit à partir de la spec ci-dessus.
- Pas de polices sous licence non libre ; pas de police chargée depuis un CDN.
- Pas de hex en dur : teintes depuis `ubao-tokens`.
- Pas de tiret cadratin dans la copy affichée.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Chemin de texte retenu par l'ADR-0004 (parley + glyphes) : confirmé ? Sinon fournir la décision.
- Polices à embarquer (Inter, Noto pour Arabe/Éthiopien… OFL) : liste et sous-ensembles validés ?
- Taille et teinte par défaut d'un post-it : 200×200, 1re teinte (Sable) : OK ?
