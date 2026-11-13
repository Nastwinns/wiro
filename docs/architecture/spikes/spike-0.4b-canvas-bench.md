# Spike 0.4b — Bench canvas (ADR-0004)

Statut : générateur, traces, rapport et orchestration **prêts et testés** ; harnais in-page et backends = squelette à implémenter en S0.
Durée : 6–8 j-dev (3 j backends B/C + harnais, 2 j D si nécessaire, 1–2 j machines/rapport). Décideur : Jean Balin (ADR-0004).
Code : `bench/canvas/` (Node ≥ 22, zéro dépendance, `npm test` = 21 tests verts). Tâches : `bench/justfile`.

## 1. Ce qui existe déjà
| Élément | Fichier | État |
|---|---|---|
| PRNG seedé (mulberry32, seed=42) | `src/prng.mjs` | testé |
| Générateur de scène (ADR : 40/15/15/20/10 %, 20 000² px, 10 % RTL, textes FR/Wolof/AR(+YO/HA/EN), connecteurs attachés, images 256–1024 px ≈ 570 Mo décodés naïvement, ADR ≈ 400 Mo) | `src/gen-scene.mjs` | testé |
| Variantes 1k/10k/25k × clustered/uniform | `src/cli.mjs gen` | généré, checksums figés |
| Traces d'entrée 120 Hz (pan, zoom 5 %↔400 %, drag de 100, frappe, soak 5 min) | `src/traces.mjs` | testé, checksums figés |
| Contrat de backend B/C/D/E + backend `null` | `src/harness/backend.mjs` | squelette + self-test |
| Seuils ADR encodés (go/acceptable/no-go, desktop vs mobile) | `src/harness/thresholds.mjs` | testé |
| Statistiques (p50/p95/p99, fps, pente mémoire soak, médiane de 5) | `src/stats.mjs`, `report.mjs` | testé |
| Schéma JSON du rapport + validateur | `report.schema.json`, `validateReport` | testé |
| Orchestrateur de rejeu | `src/harness/run.mjs` | testé avec backend `null` |

Scène d'exemple versionnée : `bench/canvas/scenes/example-1k-clustered-seed42.json` ; checksums (sha256 de `JSON.stringify(scene)`) de toutes les variantes et traces dans `scenes/CHECKSUMS.json`. 10k clustered : `40ece1da0e6914ba5b8a8cc283210df8b00dafc7b8c377fe69a508a010510b08` (scène 10k ≈ 1,8 Mo, régénérée, non versionnée). Le test `golden.test.mjs` échoue si le générateur dérive : toute modification = nouveau `format` + nouveaux checksums + note dans le rapport.

Notes de conformité ADR : la scène ne contient **pas de pixels** (images = descripteurs `srcW/srcH/pixelSeed` ; chaque backend synthétise le même bitmap déterministe), textes originaux (`src/text-pool.mjs`), polices : Inter + Noto Naskh Arabic (SIL OFL, à embarquer dans le harnais — licence OFL à signaler : permissive mais hors liste AGENTS.md ; **à valider par le mainteneur** ou prendre une autre police Arabe).

## 2. Ordre d'implémentation (agent dev)
1. `harness-page/` : page Vite/TS qui charge scène + trace, vérifie les sha256, pilote un `Backend` (voir `bench/canvas/harness-page/README.md`) ; backend **E** (Canvas2D, TS, ~200 lignes : culling bbox + fillText) en premier = valide le harnais et fournit la baseline.
2. Crate `bench/canvas/backends/` (workspace Cargo hors workspace produit tant que l'ADR n'est pas tranché) : `vello_cpu` (**C**, référence SSIM) puis `vello_gpu` (**B**, WebGL2 puis wgpu-no-compute) ; wasm-bindgen ; parley/glifo pour le texte. Vérifier `cargo deny` sur chaque crate ajouté.
3. Culling `rstar` + LOD texte (< 6 px → barres) + cache de calques (stickies/images par bande de zoom) : **communs à B/C/D** pour comparer les moteurs, pas les stratégies. Mesurer aussi « sans LOD » pour mémoire de l'écart.
4. **D** (wgpu instancié maison) seulement si B échoue Go sur M1 (règle de décision ADR) — ne pas démarrer avant la mesure B/C.
5. Runs : 5 répétitions, release, secteur, échauffement 2 min, première frame cold + warm, forcer explicitement `webgl2` / `webgpu` / `cpu` (champ `machine.gfxApiForced`).

## 3. Matrice d'exécution
Machines M1–M5 (ADR-0004). Par machine × backend {E,C,B[,D]} : scènes 1k et 10k clustered (obligatoires), 10k uniform, 25k (stress), traces pan/zoom/drag/typing (60 s) ; soak 5 min sur 10k clustered uniquement. Environ 4 backends × 4 traces × 5 runs × 60 s ≈ 80 min/machine + soak 4 × 5 × 5 min = 100 min. Prévoir ½ journée par machine.
Priorité si le temps manque : M1 et M2 d'abord (décident B), puis M5 (Chrome/Firefox/Safari), puis M3/M4.

## 4. Mesures (champs du rapport)
`frameMs{p50,p95,p99}`, `fpsP50/P95`, `droppedRatio` (> 25 ms), `inputLatencyP95Ms` (trace `typing` + `drag`), `firstFrameColdMs/WarmMs/SceneLoadMs`, `rssPeakMb/rssSteadyMb`, `wasmLinearMemoryMb`, `gpuMemoryMb`, `soakGrowthPct` (pente moindres carrés sur 5 min), `wasmGzBytes` (backend), `ssimVsReference` (≥ 0,98 vs C, viewport fixe zoom 1), + `machine` (GPU, driver, WebView, WebGPU dispo, WebGL2 dispo). Un rapport par (machine, backend, scène, trace) : `bench/canvas/reports/<machine>-<backend>-<variant>-<trace>.json`, validé par `node src/cli.mjs validate reports/*.json` (refuse < 5 runs, build non-release, checksum absent).

## 5. Seuils et règle de décision (copie de l'ADR-0004, encodée dans `thresholds.mjs`)
| Métrique | Go | Acceptable | No-go |
|---|---|---|---|
| fps p50 pan/zoom 10k M1/M2 | ≥ 60 | ≥ 45 | < 45 |
| fps p95 (frame ≤ 33 ms) | ≥ 30 | ≥ 24 | < 24 |
| fps p50 10k M3/M4 | ≥ 40 | ≥ 30 | < 30 |
| latence entrée p95 | < 50 ms | < 80 ms | ≥ 80 ms |
| 1re frame 10k M1 | < 1,5 s | < 3 s | ≥ 3 s |
| RSS 10k | < 600 Mo | < 800 Mo | ≥ 800 Mo |
| WASM gz | < 600 Ko | < 900 Ko | > 900 Ko |
| Soak 5 min | < 5 % | < 10 % | ≥ 10 % |
Tolérance de 0,5 fps (vsync 16,67 ms = 59,99 fps) appliquée dans `grade()`.
Règle : B Go sur M1+M2+M5 **et** Acceptable sur M3/M4 → adopter B (+C repli). B échoue mais D passe → D. Les deux échouent → LOD plus agressif, communiquer honnêtement le nombre d'objets atteignable à Jean Balin (le périmètre produit n'est pas réduit). Le mainteneur tranche : ne rien écrire « accepted » dans l'ADR sans lui.

## 6. Commandes
```
just -f bench/justfile test                      # tests canvas+search+editor
just -f bench/justfile bench-canvas-prep         # régénère scènes/traces, affiche les sha256
just -f bench/justfile bench-canvas-selftest     # pipeline avec backend null (doit afficher overall=go)
cd bench/canvas && node src/cli.mjs validate reports/*.json
```

## 7. Rapport-type (`docs/architecture/spikes/report-0.4b.md`)
Versions (vello_*, wgpu, parley, glifo, rustc, wasm-bindgen, navigateurs/WebViews) · licences (cargo deny) · tableau machine × backend × scène de `overall` + médianes · captures SSIM · courbes de frame-time · ce qui a été désactivé (LOD, cache) · verdict selon §5 · risques (churn API vello, taille WASM) · décision demandée.
