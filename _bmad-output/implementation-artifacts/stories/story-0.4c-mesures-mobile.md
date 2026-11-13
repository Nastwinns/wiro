---
id: "0.4c"
slug: mesures-mobile
title: "Mesures mobile (ADR-0008) : page de mesure, protocole, rapport"
epic: EP0
sprint: S0
depends_on: ["0.4", "0.4b"]
size: M
status: dropped
branch: feat/0-4c-mesures-mobile
---

# Story 0.4c — Mesures mobile (ADR-0008) : page de mesure, protocole, rapport

> **DROPPED 2026-11-11** — pas d'apps natives mobile (ADR-0015 remplace ADR-0008). Ne pas implémenter. La mesure sur navigateur Android d'entrée de gamme est reprise dans la story 0.4b.


> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Décider PWA, Tauri 2 mobile ou TWA pour Android/iOS à partir de mesures sur appareils bas de gamme réels, pas d'hypothèses.

## Dépendances (doivent être mergées dans `main` avant de commencer)
0.4 (shells mobiles, sonde) et 0.4b (scènes et harnais réutilisés pour fps 1k/5k/10k, schéma de résultats).

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

#### ADR-0008 — contexte et options

> ## Context
> Target users include low-end Android (≤ 4 GB RAM, Mali/Adreno entry GPUs, old System WebView) and iOS. ADR-0002 selects Tauri 2 (which has iOS/Android targets); Story 0.4 requires signed dev builds on 4 targets with the WASM engine reporting the GPU backend. The canvas needs WebGL2 at minimum (ADR-0004), offline persistence (NFR-O1/R1) and sync with low bandwidth (NFR-B1).
>
> ## Options
> | # | Option | Licence | Pros | Cons / risk |
> |---|---|---|---|---|
> | A | **Tauri 2 mobile** (system WebView, Rust core native) | MIT/Apache-2.0 | same code as desktop; native Rust core (Loro, SQLite) outside WASM; store distribution; plugins (fs, notifications, deep links) | mobile support younger than desktop; WebView version varies per Android device; plugin gaps; build tooling heavy |
> | B | **PWA** only (installable, service worker, OPFS/IndexedDB) | n/a | no store, tiny install, instant updates, works on Android Chrome | iOS storage eviction (7-day for non-installed), limited background sync, no store presence, OPFS quotas; relies on user's browser |
> | C | PWA + **TWA/Bubblewrap** wrapper (Play Store/APK of the PWA) | Apache-2.0 | store presence at low cost; uses Chrome (usually newer than System WebView) | Android only; needs Chrome installed; no native Rust |
> | D | Native Rust UI (Slint/Dioxus-native/GPUI) | various (Slint GPL/commercial → **excluded**; Dioxus MIT/Apache) | no WebView | rewrites chrome, shadcn lost, a11y/IME immature; contradicts ADR-0002 |
> | E | React Native / Flutter | MIT / BSD | mature mobile | second UI stack, can't share TS chrome+WASM engines without bridge; contradicts ADR-0002 |

#### ADR-0008 — recommandation

> ## Recommendation
> **Phase the mobile approach:** ship **PWA (B) first** as the universal low-friction mobile/web path (same build as self-hosted web), add **Tauri 2 mobile (A)** for iOS/Android store apps once Story 0.4 measures pass; keep **C** as the Android store/APK shortcut if A's Android WebView perf is no-go. Mobile v1 scope = view, light edit, comments, offline reading (heavy canvas authoring stays desktop-first), without reducing product scope long-term. Storage: SQLite native (A) / OPFS + IndexedDB fallback (B/C) behind `wiro-storage` trait; request persistent storage (`navigator.storage.persist()`) and warn on eviction risk. Distribution for Africa: Google Play (Play Console fee), **direct signed APK** from website/self-hosted server + F-Droid-compatible build, Huawei AppGallery optional, iOS App Store/TestFlight (Apple Developer fee — see ADR-0009), plus APK size budget < 25 MB (split ABIs) and delta updates to respect data costs.

#### ADR-0008 — protocole de mesure (intégral)

> ## Measurement protocol (Story 0.4)
> Devices: D1 Android 4 GB / Mali-G52 class (Android 10), D2 Android 3 GB / Adreno 610 (Android 12, Go-edition if possible), D3 mid Android 6 GB, D4 iPhone SE 2/3, plus Chrome-PWA on D1/D2. Record WebView/Chrome version.
> | Measure | Method | Go |
> |---|---|---|
> | WebGL2 / WebGPU availability | `getContext('webgl2')`, `navigator.gpu`; report renderer string, max texture | WebGL2 on ≥ 90 % of tested devices; else CPU fallback (ADR-0004 C) |
> | Cold start to interactive | shell launch → engine ready | < 3 s (D3/D4), < 5 s (D1/D2) |
> | Canvas fps 1k / 5k / 10k objects (ADR-0004 scene) | scripted pan/zoom | ≥ 40 fps @10k on D3/D4; ≥ 30 fps @ 5k on D1/D2 |
> | RSS / WebView process memory | `adb shell dumpsys meminfo`, Instruments | < 400 MB @ 5k objects; no OOM-kill in 10-min soak |
> | WASM load + instantiate | trace | < 1.5 s on D1 |
> | Input latency typing in doc / sticky | high-speed video or event timestamps | p95 < 80 ms |
> | Offline persistence | airplane mode, kill app, relaunch, 100 edits | 0 loss (NFR-R1) |
> | Install size / update size | APK/AAB, delta | < 25 MB / < 3 MB patch |
> | IME & RTL | Wolof/Yoruba/Arabic keyboards (Gboard) | no composition loss (cf. Story 0.5) |
> | Battery | 30 min edit session | < 8 % on D2 |
> Decision rule: A go if Go on D3/D4 and Acceptable (≤ 1.5× thresholds) on D1/D2; otherwise ship B/C for Android and re-evaluate.

#### ADR-0008 — conséquences

> ## Consequences
> - `wiro-storage`/`wiro-sync` must run in both native and WASM; CI builds Android/iOS shells from S0.
> - Mobile UX adaptations (touch, pen, bottom sheets) tracked in UX spec.

#### UX — mobile (ux-spec §6)

> ## 6. Responsive & devices
> - Desktop app (Tauri): native menus, tray sync indicator, file drop, offline by default.
> - Web: same UI; install as PWA; "offline available" per workspace opt-in.
> - Tablet: canvas-first, Apple Pencil/stylus pressure, sidebar as overlay.
> - Mobile: view + comment + stickies + quick notes + vote in workshops; full doc editing; board editing basic (stickies, text, move, connectors).

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. Crates/paquets : réutilise `ubao-bench` (agrégateur) et `tools/bench/canvas/web` ; ajoute `apps/web/src/bench/MobileProbe.tsx` (route `/__bench/mobile`, désactivée en production sauf `?bench=1`).

- `apps/web/src/bench/MobileProbe.tsx` + `apps/web/src/bench/mobile-metrics.ts`
- `tools/bench/src/results_mobile.rs` (schéma `MobileResult`, fonction `verdict_mobile`)
- `tools/xtask` : `bench-report-mobile`
- `docs/research/bench-mobile-runbook.md` (adb, Instruments, checklists IME/RTL, batterie)
- `docs/research/bench-mobile-results.md` (généré)
- `tools/bench/canvas/results/mobile/*.json`

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/0-4c-mesures-mobile` depuis `main` à jour.

1. Implémente la page `MobileProbe` : bouton « Lancer les mesures » qui enregistre dans un objet `MobileResult` : user-agent, version WebView/Chrome, `webgl2` (contexte créé ?), `navigator.gpu` ?, `UNMASKED_RENDERER_WEBGL`/`UNMASKED_VENDOR_WEBGL`, `MAX_TEXTURE_SIZE`, `wasm_load_ms` (depuis `window.__ubaoBoot`), `cold_start_ms` (navigation start → moteur prêt via `performance.timing`/`PerformanceNavigationTiming`), fps p50/p95 pour 1k/5k/10k via le harnais de 0.4b (scène seed 42), latence de frappe p95 dans un sticky, persistance (`navigator.storage.persist()` résultat, test d'écriture/relecture 100 modifications en IndexedDB/OPFS), `deviceMemory`, `hardwareConcurrency`. Bouton « Exporter JSON » (téléchargement) et « Copier ».
2. `verdict_mobile(MobileResult, DeviceClass) -> Vec<(Metric, Go|Acceptable|NoGo)>` en Rust : applique le tableau « Go » de l'ADR-0008 (WebGL2 présent ; cold start < 3 s D3/D4 et < 5 s D1/D2 ; fps ≥ 40 @10k D3/D4 et ≥ 30 @5k D1/D2 ; WASM load < 1,5 s sur D1 ; latence p95 < 80 ms ; RSS < 400 Mo @5k ; install < 25 Mo ; patch < 3 Mo ; batterie < 8 % / 30 min sur D2) ; « Acceptable » = ≤ 1,5× le seuil (règle de décision de l'ADR). Les mesures non automatisables (RSS adb/Instruments, batterie, taille APK, IME/RTL) sont saisies à la main dans le JSON (`manual: {…}`) selon le runbook.
3. `cargo xtask bench-report-mobile <dossier>` : produit `docs/research/bench-mobile-results.md` : tableau appareil × mesure × verdict, et la **règle de décision** : « Tauri mobile (A) go si Go sur D3/D4 et Acceptable sur D1/D2, sinon PWA/TWA pour Android et réévaluer » ; **sans modifier l'ADR**.
4. Écris `bench-mobile-runbook.md` : appareils D1 (Android 4 Go / Mali-G52, Android 10), D2 (3 Go / Adreno 610, Android 12 Go-edition si possible), D3 (Android 6 Go), D4 (iPhone SE 2/3), PWA Chrome sur D1/D2 ; commandes `adb shell dumpsys meminfo <package>`, `adb shell dumpsys batterystats --reset` / `--checkin`, installation de l'APK debug de la story 0.4, déploiement du PWA sur un hôte local HTTPS (`pnpm --filter @ubao/web preview --host`), checklist IME/RTL (Gboard Wolof, Yoruba, Arabe : composer des mots avec diacritiques, aucune perte de composition), test hors ligne (mode avion, kill app, relance, 100 modifications : 0 perte).
5. Exécute la page sur le navigateur de ta machine (mode émulation mobile) pour valider le schéma et l'export ; **ne prétends pas avoir mesuré un appareil réel** : le rapport généré liste les appareils « non mesurés » explicitement.

## Critères d'acceptation

**AC1 — Page de sonde**
- **Given** la page `/__bench/mobile?bench=1` dans Chromium
- **When** je clique « Lancer les mesures » puis « Exporter JSON »
- **Then** un fichier JSON valide contient `webgl2`, `renderer`, `max_texture`, `wasm_load_ms`, `cold_start_ms`, fps pour 1k/5k/10k et le résultat de persistance

**AC2 — Verdict mobile**
- **Given** un résultat D1 avec fps@5k = 28 et un autre avec 31
- **When** `verdict_mobile`
- **Then** 28 → `Acceptable` (≥ 30/1,5 = 20) ; 31 → `Go` ; 12 → `NoGo`

**AC3 — Rapport honnête**
- **Given** un dossier avec uniquement des résultats d'émulation
- **When** `bench-report-mobile`
- **Then** le rapport affiche D1-D4 « non mesuré » et ne produit aucune recommandation « A go »

**AC4 — Persistance hors ligne**
- **Given** une session avec 100 écritures puis rechargement
- **When** la page relit le stockage
- **Then** le compteur lu vaut 100 ; sinon le résultat marque `data_loss=true`

## Tests à écrire
- Unitaire Rust : `verdict_mobile` (table de bornes), parsing du JSON (champs manquants = `null` accepté, jamais de panique).
- Propriété (`proptest`) : pour toute valeur de fps ≥ 0, le verdict est monotone (plus de fps ne dégrade jamais le verdict).
- Unitaire TS : collecte des métriques avec un `WebGL2RenderingContext` simulé (avec/sans extension `WEBGL_debug_renderer_info`).
- E2E Playwright : AC1 sur Chromium (émulation Pixel 5).
- Manuel : runbook sur D1-D4 (mainteneur).

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-bench
cargo xtask bench-report-mobile tools/bench/canvas/results/mobile
pnpm --filter @ubao/web test
pnpm --filter @ubao/web exec playwright test mobile-probe
cargo deny check
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
- Aucune télémétrie réseau : les résultats restent locaux (export manuel).
- Ne tranche pas l'ADR-0008 ; ne change pas la stratégie PWA/Tauri.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Quels appareils D1-D4 sont disponibles (marque/modèle exacts) et qui exécute le runbook ?
- Compte Apple Developer disponible pour installer sur iPhone SE (sinon test PWA Safari seulement) ?
