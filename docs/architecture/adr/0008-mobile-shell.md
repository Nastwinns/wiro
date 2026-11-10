# ADR-0008 — Mobile shell

- Status: **proposed** (decision by Jean Balin)
- Date: 2026-11-10

## Context
Target users include low-end Android (≤ 4 GB RAM, Mali/Adreno entry GPUs, old System WebView) and iOS. ADR-0002 selects Tauri 2 (which has iOS/Android targets); Story 0.4 requires signed dev builds on 4 targets with the WASM engine reporting the GPU backend. The canvas needs WebGL2 at minimum (ADR-0004), offline persistence (NFR-O1/R1) and sync with low bandwidth (NFR-B1).

## Options
| # | Option | Licence | Pros | Cons / risk |
|---|---|---|---|---|
| A | **Tauri 2 mobile** (system WebView, Rust core native) | MIT/Apache-2.0 | same code as desktop; native Rust core (Loro, SQLite) outside WASM; store distribution; plugins (fs, notifications, deep links) | mobile support younger than desktop; WebView version varies per Android device; plugin gaps; build tooling heavy |
| B | **PWA** only (installable, service worker, OPFS/IndexedDB) | n/a | no store, tiny install, instant updates, works on Android Chrome | iOS storage eviction (7-day for non-installed), limited background sync, no store presence, OPFS quotas; relies on user's browser |
| C | PWA + **TWA/Bubblewrap** wrapper (Play Store/APK of the PWA) | Apache-2.0 | store presence at low cost; uses Chrome (usually newer than System WebView) | Android only; needs Chrome installed; no native Rust |
| D | Native Rust UI (Slint/Dioxus-native/GPUI) | various (Slint GPL/commercial → **excluded**; Dioxus MIT/Apache) | no WebView | rewrites chrome, shadcn lost, a11y/IME immature; contradicts ADR-0002 |
| E | React Native / Flutter | MIT / BSD | mature mobile | second UI stack, can't share TS chrome+WASM engines without bridge; contradicts ADR-0002 |

## Recommendation
**Phase the mobile approach:** ship **PWA (B) first** as the universal low-friction mobile/web path (same build as self-hosted web), add **Tauri 2 mobile (A)** for iOS/Android store apps once Story 0.4 measures pass; keep **C** as the Android store/APK shortcut if A's Android WebView perf is no-go. Mobile v1 scope = view, light edit, comments, offline reading (heavy canvas authoring stays desktop-first), without reducing product scope long-term. Storage: SQLite native (A) / OPFS + IndexedDB fallback (B/C) behind `wiro-storage` trait; request persistent storage (`navigator.storage.persist()`) and warn on eviction risk. Distribution for Africa: Google Play (Play Console fee), **direct signed APK** from website/self-hosted server + F-Droid-compatible build, Huawei AppGallery optional, iOS App Store/TestFlight (Apple Developer fee — see ADR-0009), plus APK size budget < 25 MB (split ABIs) and delta updates to respect data costs.

## Measurement protocol (Story 0.4)
Devices: D1 Android 4 GB / Mali-G52 class (Android 10), D2 Android 3 GB / Adreno 610 (Android 12, Go-edition if possible), D3 mid Android 6 GB, D4 iPhone SE 2/3, plus Chrome-PWA on D1/D2. Record WebView/Chrome version.
| Measure | Method | Go |
|---|---|---|
| WebGL2 / WebGPU availability | `getContext('webgl2')`, `navigator.gpu`; report renderer string, max texture | WebGL2 on ≥ 90 % of tested devices; else CPU fallback (ADR-0004 C) |
| Cold start to interactive | shell launch → engine ready | < 3 s (D3/D4), < 5 s (D1/D2) |
| Canvas fps 1k / 5k / 10k objects (ADR-0004 scene) | scripted pan/zoom | ≥ 40 fps @10k on D3/D4; ≥ 30 fps @ 5k on D1/D2 |
| RSS / WebView process memory | `adb shell dumpsys meminfo`, Instruments | < 400 MB @ 5k objects; no OOM-kill in 10-min soak |
| WASM load + instantiate | trace | < 1.5 s on D1 |
| Input latency typing in doc / sticky | high-speed video or event timestamps | p95 < 80 ms |
| Offline persistence | airplane mode, kill app, relaunch, 100 edits | 0 loss (NFR-R1) |
| Install size / update size | APK/AAB, delta | < 25 MB / < 3 MB patch |
| IME & RTL | Wolof/Yoruba/Arabic keyboards (Gboard) | no composition loss (cf. Story 0.5) |
| Battery | 30 min edit session | < 8 % on D2 |
Decision rule: A go if Go on D3/D4 and Acceptable (≤ 1.5× thresholds) on D1/D2; otherwise ship B/C for Android and re-evaluate.

## Decision
_pending — after Story 0.4 measurements._

## Consequences
- `wiro-storage`/`wiro-sync` must run in both native and WASM; CI builds Android/iOS shells from S0.
- Mobile UX adaptations (touch, pen, bottom sheets) tracked in UX spec.
