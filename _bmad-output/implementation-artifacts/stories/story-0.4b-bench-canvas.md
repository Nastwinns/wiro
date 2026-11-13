---
id: "0.4b"
slug: bench-canvas
title: "Bench canvas (ADR-0004) : générateur de scène, harnais, rapport go/no-go"
epic: EP0
sprint: S0
depends_on: ["0.4"]
size: L
status: ready-for-dev
branch: feat/0-4b-bench-canvas
---

# Story 0.4b — Bench canvas (ADR-0004) : générateur de scène, harnais, rapport go/no-go

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Choisir le moteur de rendu (vello_gpu, vello_cpu ou wgpu maison) avec des mesures reproductibles plutôt que des opinions, car le 60 fps à 10 000 objets est l'exigence n°1 du produit.

## Dépendances (doivent être mergées dans `main` avant de commencer)
0.4 (shell web + sonde de backend + `window.__ubaoBoot`).

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 0.4: Tauri 2 shells desktop + mobile
>
> As a user,
> I want the app to launch on Windows, macOS, iOS and Android with an empty shell,
> So that we validate packaging early.
>
> **Acceptance Criteria:**
>
> - [ ] signed dev builds exist for the 4 targets
> - [ ] WASM engine loads inside each webview and reports GPU backend (WebGPU/WebGL2)

#### ADR-0004 — contexte et options

> ## Context
> Target NFR-P1: 60 fps pan/zoom with 10 000 objects on a 4 GB RAM / integrated-GPU laptop; NFR-P4 < 600 MB RSS; NFR-P3 initial web bundle ≤ 1.5 MB gz. Renderer runs as Rust→WASM inside the webview (ADR-0002), so it must work on WKWebView (macOS/iOS), WebView2 (Windows) and Android System WebView (often old, low-end GPU). WebGPU is not guaranteed there; **WebGL2 is the realistic floor**. See `docs/research/competitive-audit.md` (P1, P2, P3).
>
> State of the ecosystem (checked Nov 2026, [linebender/vello README](https://github.com/linebender/vello)): the Vello repo now ships three renderers — `vello_cpu` (most mature, SIMD + multithread), `vello_gpu` (CPU path prep + GPU raster/composite, **native WebGL2 backend** and a wgpu backend **without compute shaders**; the former `vello_hybrid`), and the original compute-centric `vello` (moved to `research/`, **experimental**, needs compute-capable GPU). Text/glyph runs via `glifo`; shaping via `parley`.
>
> ## Options
> | # | Option | Licence | Maturity | WebGL2 / low-end WebView | Text cost | Risk |
> |---|---|---|---|---|---|---|
> | A | `vello` compute (wgpu) | Apache-2.0/MIT | experimental | **No** (compute → WebGPU only) | parley + glifo | WebGPU absent on most target WebViews; unusable as sole path |
> | B | `vello_gpu` (WebGL2 or wgpu-no-compute) | Apache-2.0/MIT | young, stated future primary | **Yes** (native WebGL2) | parley + glifo, glyph cache | API churn; perf on weak iGPU unmeasured; bundle size of WASM |
> | C | `vello_cpu` → `ImageData`/texture upload | Apache-2.0/MIT | most mature in family | Works anywhere (no GPU) | parley + glifo | CPU-bound at 10k objects full-frame; needs dirty rects/tiles; WASM threads/SIMD availability |
> | D | Custom `wgpu` instanced renderer (WebGPU + WebGL2 backends) | wgpu MIT/Apache-2.0 | wgpu mature; renderer is ours | Yes (wgpu GL backend) | SDF/atlas glyphs via parley + own atlas, or Canvas2D text overlay | Most dev effort; AA quality of arbitrary paths; maintenance |
> | E | Canvas2D / WebGL via webview (TS or thin WASM) | n/a (browser) | very mature | Yes everywhere | Browser text (free, good i18n/RTL) | Ceiling ~ thousands of objects without culling; JS↔WASM overhead; less control |
> | F | `tiny-skia` (CPU) | BSD-3-Clause | mature, no text | Anywhere (CPU) | needs separate text path | Single-threaded, slower than vello_cpu; no GPU |
>
> `skia-safe` excluded: Skia bindings are BSD but build/bundle weight (multi-MB WASM) is incompatible with NFR-P3.

#### ADR-0004 — recommandation

> ## Recommendation (to be validated by the bench below)
> Layered **renderer trait** in `wiro-render` with backends chosen at runtime by capability probe:
> 1. **Primary: B (`vello_gpu`)** on WebGL2/WebGPU.
> 2. **Fallback: C (`vello_cpu`)** with tile/dirty-rect upload when no usable GPU (blocklisted drivers, software GL).
> 3. **Escape hatch: D** only if B fails go/no-go on P1 hardware (decision gate in S0).
> Always do culling/LOD (`rstar`), cached object layers (rasterised stickies/images at zoom bands), and text LOD (below ~6 px → placeholder bars). Never ship A as only path. E is kept as a baseline in the bench, not as a product path.

#### ADR-0004 — protocole de bench (intégral, à suivre à la lettre)

> ## Bench protocol (Story 0.4 — shells + GPU backend report; extends to a perf spike "0.4b")
> **Goal:** pick between B/C/D with data; reproducible by anyone from `bench/canvas/` (cargo + pnpm, one command `just bench-canvas`).
>
> **Scene generator** (seeded, deterministic, `seed=42`, same file for all backends): 10 000 objects on a 20 000 × 20 000 px world.
> | Type | Share | Detail |
> |---|---|---|
> | Sticky notes | 40 % | rect + shadow + 20–60 chars text (FR/Wolof/Arabic mixed, 10 % RTL) |
> | Text boxes | 15 % | 1–5 lines, 2 fonts, 12–48 px |
> | Shapes | 15 % | rect/ellipse/polygon, fill + stroke |
> | Connectors | 20 % | bezier/orthogonal with arrowheads, attached to objects |
> | Images | 10 % | 256–1024 px JPEG/WebP (≈ 400 MB decoded if naïve → forces mipmaps/LOD) |
> Variants: 1k / 10k / 25k objects; clustered vs uniform layout.
>
> **Scripted interactions** (identical input trace replayed, 60 s each): (1) continuous pan, (2) zoom 5 %↔400 % sweep, (3) pan+zoom while dragging 100 selected objects, (4) typing in a sticky with 10k objects loaded, (5) 5-min soak.
>
> **Machines (min. matrix):**
> | Id | Device | Role |
> |---|---|---|
> | M1 | 4 GB RAM Windows laptop, Intel UHD iGPU (≈ 2018–2020 Celeron/i3), WebView2 | NFR-P1 reference |
> | M2 | MacBook Air M1/Intel 2017, WKWebView | macOS |
> | M3 | Android ≤ 4 GB, Mali-G52/Adreno 610 class, Android 10–13 System WebView | mobile floor (ADR-0008) |
> | M4 | iPhone SE 2/3 or iPad 9 | iOS floor |
> | M5 | Browser web: Chrome + Firefox + Safari on M1 | web |
> Also record WebGPU availability per machine; force WebGL2 and CPU paths explicitly.
>
> **Metrics** (median of 5 runs, release build, power plugged, thermal warm-up 2 min, record device/driver/WebView version): frame time p50/p95/p99 and fps (from `requestAnimationFrame` deltas), input-to-photon latency (typing/drag, p95), time to first rendered frame from app start and from scene load (cold + warm), peak and steady RSS / WASM linear memory / GPU memory where exposed, WASM size gz, dropped-frame ratio, 5-min soak memory slope (leak check), pixel diff vs reference screenshots (AA/text quality, SSIM ≥ 0.98 vs vello_cpu reference).
>
> **Go / no-go thresholds (aligned on NFR)**
> | Metric | Go | Acceptable (fallback tier) | No-go |
> |---|---|---|---|
> | fps p50 pan/zoom 10k, M1/M2 | ≥ 60 | ≥ 45 | < 45 |
> | fps p95 (frame ≤ 33 ms) | ≥ 30 | ≥ 24 | < 24 |
> | fps p50 10k, M3/M4 | ≥ 40 | ≥ 30 | < 30 |
> | input latency p95 (NFR-P2) | < 50 ms | < 80 ms | ≥ 80 ms |
> | First frame, 10k scene, M1 | < 1.5 s | < 3 s | ≥ 3 s |
> | RSS, 10k (NFR-P4) | < 600 MB | < 800 MB | ≥ 800 MB |
> | Renderer WASM, gz | < 600 KB | < 900 KB | > 900 KB (NFR-P3 bundle ≤ 1.5 MB) |
> | Soak 5 min memory growth | < 5 % | < 10 % | ≥ 10 % |
> Decision rule: B passes "Go" on M1+M2+M5 and "Acceptable" on M3/M4 → adopt B (+C fallback). B fails but D passes → adopt D. Both fail P1 only via LOD → keep and tighten LOD; report the achievable object count honestly to Jean Balin (scope is not reduced; strategy changes).

#### ADR-0004 — conséquences

> ## Consequences
> - `wiro-render` exposes a backend-agnostic trait; capability probe selects backend and reports it (Story 0.4 AC).
> - Bench harness and results committed under `bench/canvas/` and summarised as an ADR addendum.
> - Licence check (`cargo deny`) on `vello_*`, `wgpu`, `parley`, `glifo`, `tiny-skia`: all Apache-2.0/MIT/BSD — compliant.

#### Budgets (architecture §16)

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

#### NFR (PRD §5)

> ## 5. Non-functional requirements
> | ID | Requirement | Target |
> |---|---|---|
> | NFR-P1 | Canvas pan/zoom | 60 fps with 10 000 objects on 4 GB RAM / integrated GPU laptop |
> | NFR-P2 | Input latency (type, move) | < 50 ms p95 |
> | NFR-P3 | Cold start desktop / web | < 2 s / < 3 s on 3G-fast for app shell (web bundle ≤ 1.5 MB gz initial) [ASSUMPTION] |
> | NFR-P4 | Memory | < 600 MB RSS for a 10k-object board |
> | NFR-R1 | Data durability | zero loss on crash; restore tests in CI |
> | NFR-R2 | Sync convergence | CRDT, no manual conflict resolution for text/canvas |
> | NFR-O1 | Offline | 100 % features except sharing/permissions changes & AI |
> | NFR-B1 | Bandwidth | edit session ≤ 1 MB/h idle presence; low-bandwidth mode halves media traffic |
> | NFR-S1 | Security | OWASP ASVS L2; SBOM; signed releases; dependency licence gate |
> | NFR-A1 | Accessibility | WCAG 2.2 AA (docs, chrome, canvas object list) |
> | NFR-I1 | i18n | all strings externalised; +30 % text expansion tolerant; RTL-ready |
> | NFR-L1 | Licence | MIT for all code; deps MIT/Apache/BSD/ISC/Zlib (MPL flagged) |
> | NFR-D1 | Deploy | install < 15 min on a fresh VPS; air-gapped install documented |

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. Crates : `tools/bench` (nouveau crate binaire `ubao-bench` + paquet TS `tools/bench/canvas-web`), `ubao-render` (trait `Renderer`, adaptateurs), `ubao-canvas` (scène minimale pour le bench). ADR-0004 mentionne `bench/canvas/` et `just bench-canvas` : on utilise l'emplacement de la structure du projet **`tools/bench/canvas/`** et la commande **`cargo xtask bench-canvas`** (écart à signaler dans la PR).

- `tools/bench/Cargo.toml` (crate `ubao-bench`, membre du workspace), `tools/bench/src/scene.rs` (générateur), `tools/bench/src/results.rs` (schéma + agrégation)
- `tools/bench/canvas/web/` (page de bench TS : lecteur de scène, rejeu d'interactions, collecte de métriques, adaptateurs)
- `tools/bench/canvas/scenes/` (scènes générées, **non commitées** sauf `seed42-1k.json` de test < 500 Ko)
- `tools/bench/canvas/results/` (JSON de résultats par machine, commités par le mainteneur)
- `crates/ubao-render/src/{lib.rs,renderer.rs}` (trait `Renderer`) et `crates/ubao-render/src/backends/{canvas2d_baseline,vello_gpu,vello_cpu}.rs` (derrière features Cargo `bench-vello-gpu`, `bench-vello-cpu`)
- `tools/xtask` : sous-commandes `bench-canvas` (génère scènes, build, lance Playwright) et `bench-report` (agrège les JSON → `docs/research/bench-canvas-results.md`)
- `docs/research/bench-canvas-runbook.md` (procédure manuelle M1 à M5)

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/0-4b-bench-canvas` depuis `main` à jour.

1. **Partie A : générateur de scène (Rust, déterministe).** `ubao-bench scene --seed 42 --objects 10000 --layout uniform|clustered --out <file>` produit un JSON `{ "version":1, "seed":42, "world":{"w":20000,"h":20000}, "objects":[…] }` : types et parts exacts du protocole (sticky 40 %, text 15 %, shape 15 %, connector 20 % attachés à des ids existants, image 10 %). Textes : corpus embarqué de ≥ 200 phrases FR / Wolof / Arabe (10 % RTL) **écrites par toi à la main ou génériques**, pas copiées d'un site. Images : descripteurs `{w,h,format}` 256-1024 px (le harnais génère les pixels par un motif procédural, pas de fichiers). RNG : `rand_chacha` (`ChaCha8Rng::seed_from_u64`). Variantes 1k/10k/25k. Deux exécutions avec la même graine donnent un fichier **octet à octet identique**.
2. **Partie B : trait et baseline.** Dans `ubao-render` : `trait Renderer { fn load(&mut self, scene:&Scene); fn set_viewport(&mut self, v:Viewport); fn render_frame(&mut self)->FrameStats; fn name(&self)->&'static str; }`. Implémente le baseline **E (Canvas2D)** côté TS dans la page de bench (pas dans le produit) avec culling par `rbush` ou index maison (**vérifier la licence ; sinon écris un index grille**). Un adaptateur par option : B `vello_gpu`, C `vello_cpu`, D `wgpu` custom = **hors de cette story** (voir tâche 6).
3. **Partie C : harnais web.** Page `tools/bench/canvas/web` : charge une scène, applique `?backend=baseline|vello_gpu|vello_cpu|wgpu&force=webgl2|cpu`, rejoue **la même trace d'entrée** (fichier `traces/*.json` : événements horodatés générés par le script `ubao-bench trace`) pour les 5 scénarios (pan continu 60 s, balayage zoom 5 %↔400 %, pan+zoom pendant drag de 100 objets sélectionnés, frappe dans un sticky avec 10k objets, soak 5 min). Collecte par `requestAnimationFrame` : frame time p50/p95/p99, fps, ratio de frames perdues ; latence d'entrée p95 (timestamp `event.timeStamp` → frame suivante) ; temps jusqu'à la 1re frame (froid/chaud) ; mémoire (`performance.memory` si dispo, taille mémoire linéaire WASM, pente mémoire sur le soak) ; taille WASM gz ; backend et chaîne `renderer` réels. Mode `?auto=1` pour exécution sans intervention, médiane de 5 runs, échauffement 2 min, résultats écrits en JSON conforme au schéma `results.rs` (`machine_id`, `device`, `os`, `webview`, `driver`, `backend`, `scene`, `metrics{…}`, `timestamp`).
4. **Partie D : adaptateurs B et C.** `cargo info vello_gpu` et `cargo info vello_cpu` (ou `cargo search`) : **si un des crates n'existe pas sous ce nom ou n'a pas de licence MIT/Apache-2.0, arrête-toi et demande** (ADR-0004 date de nov. 2026 ; le nom exact doit être vérifié). Sinon, implémente `Renderer` pour `vello_cpu` (rendu CPU → `ImageData`, mises à jour par tuiles/dirty-rects) puis pour `vello_gpu` (WebGL2) derrière les features `bench-vello-*`, en dessinant : rect+ombre (stickies), texte via `parley`/`glifo` (si indisponible, rectangles-placeholders avec LOD ci-dessous), formes, béziers, images placeholder. LOD obligatoire : en dessous de ~6 px de hauteur de texte → barres placeholder ; culling par `rstar` (MIT/Apache). Vérifie `cargo deny check` après chaque ajout ; consigne la taille WASM gz.
5. **Option D (wgpu maison)** : **non implémentée ici** ; elle n'est ouverte (story 0.4c-bis) que si B échoue le go/no-go. Écris cette règle de décision dans le runbook.
6. **Partie E : agrégation.** `cargo xtask bench-report <dossier results/>` lit les JSON, applique les seuils **Go / Acceptable / No-go** du protocole (tableau de l'ADR copié plus haut ; fonction pure `verdict(metric, value, machine_class) -> Go|Acceptable|NoGo`) et écrit `docs/research/bench-canvas-results.md` : tableau machine × backend × métrique + verdict par option et la **règle de décision** (B passe Go sur M1+M2+M5 et Acceptable sur M3/M4 → adopter B + C ; sinon D ; si les deux échouent seulement sur P1 → resserrer le LOD et rapporter honnêtement le nombre d'objets atteignable ; **le périmètre n'est pas réduit**). Le document est un brouillon d'addendum : **le mainteneur seul tranche l'ADR-0004**.
7. **Partie F : exécution locale.** Lance le bench complet 1k et 10k sur la machine de développement pour baseline E et, si dispo, B/C ; enregistre `results/dev-<machine>.json`. Les machines M1 à M5 sont à la charge du mainteneur : écris `bench-canvas-runbook.md` (matériel, installation, commande unique `cargo xtask bench-canvas --auto`, collecte des JSON, conditions : build release, secteur branché, échauffement).
8. Ajoute au CI un job **non bloquant** `bench-smoke` : génère la scène 1k, vérifie le déterminisme (hash identique x2), exécute le baseline 10 s, vérifie que le JSON de résultat valide le schéma.

## Critères d'acceptation

**AC1 — Scène déterministe**
- **Given** la graine 42, 10 000 objets, layout uniforme
- **When** je génère deux fois la scène
- **Then** les deux fichiers sont identiques (même SHA-256) ; les parts de types sont 40/15/15/20/10 % ± 0,5 % ; 10 % des textes sont RTL ± 1 %

**AC2 — Connecteurs valides**
- **Given** une scène générée
- **When** je vérifie chaque connecteur
- **Then** ses deux extrémités référencent des ids d'objets existants de la scène

**AC3 — Trace rejouée à l'identique**
- **Given** la même trace et la même scène
- **When** je lance le baseline deux fois en `?auto=1`
- **Then** les deux JSON de résultats ont le même nombre d'événements rejoués et un schéma valide

**AC4 — Verdict de seuils**
- **Given** un résultat {fps_p50:44, machine:M1}
- **When** j'appelle `verdict(fps_p50, 44, M1)`
- **Then** `NoGo` (seuil < 45) ; 45 → `Acceptable` ; 60 → `Go`

**AC5 — Rapport**
- **Given** un dossier de résultats de fixture (M1, M2, M5 pour B ; M3 pour B)
- **When** `cargo xtask bench-report`
- **Then** `docs/research/bench-canvas-results.md` contient le tableau, un verdict par option et la phrase de décision correspondante à la règle de l'ADR

**AC6 — Licences**
- **Given** les adaptateurs vello/parley/rstar ajoutés
- **When** `cargo deny check`
- **Then** vert ; sinon arrêt et question au mainteneur

## Tests à écrire
- Unitaire Rust : générateur (parts, bornes monde, connecteurs valides, RTL), déterminisme (hash).
- Propriété (`proptest`) : pour toute graine u64 et tout n ∈ [100, 5000], toutes les positions sont dans le monde, ids uniques, connecteurs référencent des ids existants.
- Unitaire : `verdict()` table de tous les seuils (bornes incluses/exclues).
- Unitaire TS : calcul des percentiles (p50/p95/p99) sur séquences connues ; détection du soak leak (pente).
- Intégration : `bench-smoke` (CI).
- Manuel mainteneur : exécution M1-M5 (runbook).

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-bench
cargo run -p ubao-bench -- scene --seed 42 --objects 10000 --layout uniform --out /tmp/a.json && cargo run -p ubao-bench -- scene --seed 42 --objects 10000 --layout uniform --out /tmp/b.json && cmp /tmp/a.json /tmp/b.json
cargo xtask bench-canvas --objects 1000 --duration 10 --backend baseline --auto
cargo xtask bench-report tools/bench/canvas/results
cargo deny check
pnpm --filter @ubao/bench-canvas test
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
- Ne copie aucun code de bench de tldraw, Excalidraw, Miro, AFFiNE ni leurs jeux de données ; scène 100 % générée.
- Pas de polices ou d'images avec licence incompatible ; le corpus de texte est écrit par toi.
- N'écris pas « Décision » dans l'ADR-0004 : produis seulement le rapport de mesures.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).
- [ ] `docs/research/bench-canvas-results.md` généré (même partiellement rempli avec la machine de dev) et runbook M1-M5 prêt à l'emploi.

## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Les crates `vello_gpu` / `vello_cpu` existent-ils sous ces noms et versions à la date d'aujourd'hui ? Lesquels épingler ?
- Quelles machines M1 à M5 sont disponibles vendredi et qui lance le runbook ?
- Autoriser `rbush`/`rstar` et `parley`/`glifo` après vérification de licence ?
- Valider `tools/bench/canvas` + `cargo xtask bench-canvas` à la place de `bench/canvas` + `just`.
