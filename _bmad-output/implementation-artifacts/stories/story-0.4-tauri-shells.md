---
id: "0.4"
slug: tauri-shells
title: "Tauri 2 shell desktop (Windows, macOS)"
epic: EP0
sprint: S0
depends_on: ["0.1", "0.2", "0.3"]
size: L
status: ready-for-dev
branch: feat/0-4-tauri-shells
---

# Story 0.4 — Tauri 2 shell desktop (Windows, macOS)

> **SCOPE CHANGE 2026-11-11** — pas d'apps natives mobile (ADR-0015). Cibles = Windows + macOS uniquement ; ignorer toute exigence iOS/Android/stores ci-dessous. La cible web (navigateur, y compris mobile en responsive) est couverte par le build web.


> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Valider tôt que le même frontend + moteur WASM se package et démarre sur Windows, macOS, iOS et Android, et mesurer quel backend GPU est réellement disponible.

## Dépendances (doivent être mergées dans `main` avant de commencer)
0.1 (workspace), 0.2 (cargo deny actif : Tauri tire des dépendances transitives à vérifier), 0.3 (tokens pour la page de démarrage).

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

#### ADR-0002 — décision

> ## Decision
> "Figma model" accepted: Tauri 2 shell + thin TS chrome (shadcn/ui) + Rust→WASM engines (canvas, CRDT, storage, sync). Same frontend for desktop and self-hosted web.

#### Architecture — client (§2)

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

#### ADR-0004 — contexte et recommandation

> ## Context
> Target NFR-P1: 60 fps pan/zoom with 10 000 objects on a 4 GB RAM / integrated-GPU laptop; NFR-P4 < 600 MB RSS; NFR-P3 initial web bundle ≤ 1.5 MB gz. Renderer runs as Rust→WASM inside the webview (ADR-0002), so it must work on WKWebView (macOS/iOS), WebView2 (Windows) and Android System WebView (often old, low-end GPU). WebGPU is not guaranteed there; **WebGL2 is the realistic floor**. See `docs/research/competitive-audit.md` (P1, P2, P3).
>
> State of the ecosystem (checked Nov 2026, [linebender/vello README](https://github.com/linebender/vello)): the Vello repo now ships three renderers — `vello_cpu` (most mature, SIMD + multithread), `vello_gpu` (CPU path prep + GPU raster/composite, **native WebGL2 backend** and a wgpu backend **without compute shaders**; the former `vello_hybrid`), and the original compute-centric `vello` (moved to `research/`, **experimental**, needs compute-capable GPU). Text/glyph runs via `glifo`; shaping via `parley`.
>
> ## Recommendation (to be validated by the bench below)
> Layered **renderer trait** in `wiro-render` with backends chosen at runtime by capability probe:
> 1. **Primary: B (`vello_gpu`)** on WebGL2/WebGPU.
> 2. **Fallback: C (`vello_cpu`)** with tile/dirty-rect upload when no usable GPU (blocklisted drivers, software GL).
> 3. **Escape hatch: D** only if B fails go/no-go on P1 hardware (decision gate in S0).
> Always do culling/LOD (`rstar`), cached object layers (rasterised stickies/images at zoom bands), and text LOD (below ~6 px → placeholder bars). Never ship A as only path. E is kept as a baseline in the bench, not as a product path.

#### ADR-0008 — contexte, options et recommandation

> ## Context
> Target users include low-end Android (≤ 4 GB RAM, Mali/Adreno entry GPUs, old System WebView) and iOS. ADR-0002 selects Tauri 2 (which has iOS/Android targets); Story 0.4 requires signed dev builds on 4 targets with the WASM engine reporting the GPU backend. The canvas needs WebGL2 at minimum (ADR-0004), offline persistence (NFR-O1/R1) and sync with low bandwidth (NFR-B1).
>
> ## Recommendation
> **Phase the mobile approach:** ship **PWA (B) first** as the universal low-friction mobile/web path (same build as self-hosted web), add **Tauri 2 mobile (A)** for iOS/Android store apps once Story 0.4 measures pass; keep **C** as the Android store/APK shortcut if A's Android WebView perf is no-go. Mobile v1 scope = view, light edit, comments, offline reading (heavy canvas authoring stays desktop-first), without reducing product scope long-term. Storage: SQLite native (A) / OPFS + IndexedDB fallback (B/C) behind `wiro-storage` trait; request persistent storage (`navigator.storage.persist()`) and warn on eviction risk. Distribution for Africa: Google Play (Play Console fee), **direct signed APK** from website/self-hosted server + F-Droid-compatible build, Huawei AppGallery optional, iOS App Store/TestFlight (Apple Developer fee — see ADR-0009), plus APK size budget < 25 MB (split ABIs) and delta updates to respect data costs.

#### Budgets de performance (architecture §16)

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

#### UX — layout (ux-spec §2)

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

#### UX — statut de synchro (S-01.6)

> ## S-01.6 Sync indicator
> - Mini (sidebar footer) + detailed popover.
> - States: ✓ Synchronisé · ↻ Synchronisation (n modifications) · ⏸ Hors ligne — enregistré sur cet appareil · ⚠ Erreur (retry, diagnostic) · Low-bandwidth mode on (icon leaf).
> - Popover: last sync time, pending ops count, data used this week (MB), toggle "Mode faible débit", link "Paramètres hors ligne".

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. Crates concernés : `ubao-render` (sonde de capacités, pure Rust testable), **nouveau** `crates/ubao-wasm` (pont `wasm-bindgen`, cdylib ; à ajouter à `docs/architecture/project-structure.md`), **nouveau** `apps/desktop/src-tauri` (crate `ubao-desktop`). Préfixe `ubao-*`.

- `apps/desktop/src-tauri/` (nouveau : `Cargo.toml`, `tauri.conf.json`, `src/main.rs`, `src/lib.rs`, `capabilities/default.json`, `icons/`)
- `apps/desktop/package.json` (scripts `tauri dev|build|android|ios`) ; frontend = `apps/web` (`frontendDist: ../../web/dist`)
- `crates/ubao-render/src/probe.rs` (types `Capabilities`, `Backend`, `select_backend`) + tests
- `crates/ubao-wasm/` (cdylib `wasm-bindgen` : `probe_capabilities() -> JsValue`, `engine_version()`)
- `apps/web/src/engine/` (chargeur WASM) et `apps/web/src/shell/StatusStrip.tsx` (affiche « Moteur : WebGL2 (renderer) »)
- `.github/workflows/build-shells.yml` (déclenchement manuel `workflow_dispatch` + sur tags ; ne ralentit pas la CI de PR)
- `docs/architecture/shells-build.md` (nouveau : prérequis par OS, commandes, signature dev, limites)
- `tests/e2e/` (Playwright : fumée web)

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/0-4-tauri-shells` depuis `main` à jour.

1. Applique d'abord la sonde pure (sans Tauri) : dans `ubao-render/src/probe.rs` définis `struct Capabilities { webgpu: bool, webgl2: bool, max_texture_size: u32, renderer: Option<String>, vendor: Option<String> }`, `enum Backend { WebGpu, WebGl2, Cpu }`, `enum Override { Auto, Force(Backend) }` et `fn select_backend(c:&Capabilities, o:Override)->Backend` : `Force(b)` gagne si `b` est réalisable (WebGpu exige `webgpu`, WebGl2 exige `webgl2`, Cpu toujours) sinon retombe en auto ; auto = `Cpu` si `renderer` contient (insensible à la casse) `swiftshader`, `llvmpipe`, `software`, `basic render` ou si `max_texture_size < 4096` ; sinon `WebGpu` si `webgpu`, sinon `WebGl2` si `webgl2`, sinon `Cpu`. Ajoute `Backend::label()`.
2. `ubao-wasm` : `wasm-bindgen` + `web-sys` (features `Window`, `Navigator`, `HtmlCanvasElement`, `WebGl2RenderingContext`, `WebglDebugRendererInfo`, `Gpu`/`GpuAdapter` selon disponibilité ; si `web-sys` ne fournit pas `navigator.gpu` stable, utilise `js_sys::Reflect` sur `navigator`). Expose `probe_capabilities()` et `select_backend_label(override: Option<String>)`. Build : `cargo build -p ubao-wasm --target wasm32-unknown-unknown --release` puis `wasm-bindgen --target web --out-dir apps/web/src/engine/pkg`. Ajoute `rustup target add wasm32-unknown-unknown` à la doc. Sortie `pkg/` **non commitée** (générée par script `pnpm --filter @ubao/web build:wasm`).
3. `apps/web` : au démarrage, charge le WASM (`init()`), appelle `probe_capabilities`, calcule le backend, l'affiche dans le status strip (24 px, tokens uniquement, texte `text.secondary`) ; en cas d'échec de chargement WASM affiche « Moteur indisponible » + « Copier le diagnostic » (voir UX S-12 : message = ce qui s'est passé + quoi faire). Mesure `wasm_load_ms` via `performance.now()` et l'expose dans `window.__ubaoBoot` (objet : backend, capabilities, wasm_load_ms) pour les tests et la story 0.4c.
4. `apps/desktop/src-tauri` : projet Tauri 2 minimal chargeant `apps/web/dist`. Fenêtre 1366×768 par défaut (UX : écran de référence), titre « Ubao ». Aucune capacité (`capabilities/default.json`) au-delà de `core:default`. CSP stricte dans `tauri.conf.json` (`default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data: blob:; connect-src 'self' ipc: http://ipc.localhost`). Ajoute le crate au workspace (`members`).
5. Exécute `cargo deny check` après avoir ajouté Tauri. **Attendu : des dépendances transitives MPL-2.0 peuvent apparaître (ex. `cssparser`, `selectors`, `dtoa-short` via tauri-utils).** Si c'est le cas : n'ajoute PAS d'exception toi-même ; liste précisément crate, version, licence, chaîne de dépendance (`cargo tree -i <crate>`) dans la PR, arrête-toi sur ce point et demande au mainteneur (AGENTS.md : MPL « flagged »). Tu peux continuer le reste de la story en attendant.
6. Mobile : `pnpm --filter @ubao/desktop tauri android init` et `tauri ios init` (génère `gen/android`, `gen/apple`) ; commite les projets générés si < 5 Mo et sans secret, sinon `.gitignore` + doc. Android : build debug APK signé avec la clé debug (c'est la « signature dev » : `./gradlew assembleDebug`). iOS : build simulateur (`tauri ios build --target aarch64-sim` ou équivalent) ; la signature développeur réelle (compte Apple) est **manuelle, mainteneur** (ADR-0009 en attente). Windows : build `.msi`/`.exe` non signé ; macOS : `.app` signé ad hoc (`codesign -s -`). Écris tout cela dans `docs/architecture/shells-build.md` avec les commandes exactes **réellement exécutées** et leurs résultats ; les cibles que tu ne peux pas builder sur la machine locale (ex. iOS hors macOS, Windows hors Windows) sont produites par le workflow CI `build-shells.yml` (runners `windows-latest`, `macos-latest`, `ubuntu-latest` + Android SDK) et marquées « à valider par le mainteneur sur appareil ».
7. `build-shells.yml` : jobs `desktop-windows`, `desktop-macos`, `android-debug`, `ios-simulator`, chacun uploadant l'artefact ; permissions minimales ; aucun secret requis.
8. Tests e2e web (Playwright, Chromium) : démarre `apps/web` en preview, attend `window.__ubaoBoot`, vérifie que `backend ∈ {WebGpu,WebGl2,Cpu}` et que le status strip affiche le libellé. Tauri WebDriver : **hors périmètre** (story ultérieure) ; documente la commande manuelle `pnpm --filter @ubao/desktop tauri dev`.

## Critères d'acceptation

**AC1 — Choix de backend pur**
- **Given** des `Capabilities` {webgpu:false, webgl2:true, renderer:"ANGLE (Intel UHD 620)", max_texture:8192}
- **When** j'appelle `select_backend(..., Auto)`
- **Then** résultat `WebGl2` ; avec `renderer:"SwiftShader"` → `Cpu` ; avec `Force(WebGpu)` alors que `webgpu:false` → retombe sur le résultat auto

**AC2 — Moteur chargé dans la webview**
- **Given** l'app web servie en preview (ou l'app desktop lancée)
- **When** la page est chargée
- **Then** `window.__ubaoBoot.backend` est défini, le status strip affiche « Moteur : <backend> » et `wasm_load_ms` est un nombre

**AC3 — Échec du WASM**
- **Given** le fichier `.wasm` renvoie 404 (test e2e par interception)
- **When** la page se charge
- **Then** un message « Moteur indisponible » avec bouton « Copier le diagnostic » apparaît ; l'interface reste utilisable

**AC4 — Builds des quatre cibles**
- **Given** le workflow `build-shells.yml` lancé manuellement
- **When** les 4 jobs se terminent
- **Then** 4 artefacts existent (`.msi/.exe`, `.app/.dmg`, `.apk` debug-signé, `.app` simulateur iOS) ; les cibles non vérifiables localement sont listées « à valider sur appareil »

**AC5 — Licences après ajout de Tauri**
- **Given** la PR avec Tauri
- **When** `cargo deny check` s'exécute
- **Then** soit 0 erreur, soit la liste exacte des crates en échec figure dans la PR et la story est suspendue sur ce point (pas d'exception ajoutée par l'agent)

## Tests à écrire
- Unitaire Rust : table de cas `select_backend` (≥ 12 cas dont `Force` non réalisable, `max_texture` < 4096, renderer logiciel en majuscules).
- Propriété (`proptest`) : pour toutes `Capabilities` et tout `Override`, `select_backend` ne panique pas et ne retourne jamais `WebGpu` si `webgpu == false` ni `WebGl2` si `webgl2 == false`.
- Unitaire TS : formatage du libellé du status strip (4 états + erreur).
- E2E Playwright : AC2 et AC3 sur Chromium.
- Manuel documenté (mainteneur) : lancement sur Windows, macOS, iPhone/simulateur, Android.

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-render
cargo build -p ubao-wasm --target wasm32-unknown-unknown --release
pnpm --filter @ubao/web build:wasm && pnpm --filter @ubao/web build
pnpm --filter @ubao/web exec playwright test
cargo build -p ubao-desktop
cargo deny check
cargo fmt --all -- --check && cargo clippy --workspace --all-targets --all-features -- -D warnings
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
- Pas de `unsafe` dans `ubao-wasm` ni `ubao-render` (`unsafe_code = forbid`).
- Pas de plugin Tauri non nécessaire (`shell`, `http`, `fs` large…) : capacités minimales.
- N'implémente aucun rendu canvas ici (story 0.4b / 2.1) : seulement la sonde et le chargement du WASM.
- Ne choisis pas à la place du mainteneur entre PWA / Tauri mobile / TWA (ADR-0008 « pending ») : tu fournis les builds et mesures.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Dépendances MPL-2.0 transitives de Tauri : accepter une exception ciblée dans `deny.toml` ?
- Comptes de signature : Apple Developer, keystore Android de release, certificat Windows : qui les fournit et quand ? (ADR-0009)
- Les cibles iOS/Android sont-elles testables sur une machine/appareil disponible vendredi ?
- Valider l'ajout de `crates/ubao-wasm` et `apps/desktop/src-tauri` à la structure du projet.
