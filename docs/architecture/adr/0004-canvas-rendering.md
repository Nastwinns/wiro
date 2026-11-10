# ADR-0004 — Canvas rendering

- Status: **proposed** (decision by Jean Balin)
- Date: 2026-11-10

## Context
Target NFR-P1: 60 fps pan/zoom with 10 000 objects on a 4 GB RAM / integrated-GPU laptop; NFR-P4 < 600 MB RSS; NFR-P3 initial web bundle ≤ 1.5 MB gz. Renderer runs as Rust→WASM inside the webview (ADR-0002), so it must work on WKWebView (macOS/iOS), WebView2 (Windows) and Android System WebView (often old, low-end GPU). WebGPU is not guaranteed there; **WebGL2 is the realistic floor**. See `docs/research/competitive-audit.md` (P1, P2, P3).

State of the ecosystem (checked Nov 2026, [linebender/vello README](https://github.com/linebender/vello)): the Vello repo now ships three renderers — `vello_cpu` (most mature, SIMD + multithread), `vello_gpu` (CPU path prep + GPU raster/composite, **native WebGL2 backend** and a wgpu backend **without compute shaders**; the former `vello_hybrid`), and the original compute-centric `vello` (moved to `research/`, **experimental**, needs compute-capable GPU). Text/glyph runs via `glifo`; shaping via `parley`.

## Options
| # | Option | Licence | Maturity | WebGL2 / low-end WebView | Text cost | Risk |
|---|---|---|---|---|---|---|
| A | `vello` compute (wgpu) | Apache-2.0/MIT | experimental | **No** (compute → WebGPU only) | parley + glifo | WebGPU absent on most target WebViews; unusable as sole path |
| B | `vello_gpu` (WebGL2 or wgpu-no-compute) | Apache-2.0/MIT | young, stated future primary | **Yes** (native WebGL2) | parley + glifo, glyph cache | API churn; perf on weak iGPU unmeasured; bundle size of WASM |
| C | `vello_cpu` → `ImageData`/texture upload | Apache-2.0/MIT | most mature in family | Works anywhere (no GPU) | parley + glifo | CPU-bound at 10k objects full-frame; needs dirty rects/tiles; WASM threads/SIMD availability |
| D | Custom `wgpu` instanced renderer (WebGPU + WebGL2 backends) | wgpu MIT/Apache-2.0 | wgpu mature; renderer is ours | Yes (wgpu GL backend) | SDF/atlas glyphs via parley + own atlas, or Canvas2D text overlay | Most dev effort; AA quality of arbitrary paths; maintenance |
| E | Canvas2D / WebGL via webview (TS or thin WASM) | n/a (browser) | very mature | Yes everywhere | Browser text (free, good i18n/RTL) | Ceiling ~ thousands of objects without culling; JS↔WASM overhead; less control |
| F | `tiny-skia` (CPU) | BSD-3-Clause | mature, no text | Anywhere (CPU) | needs separate text path | Single-threaded, slower than vello_cpu; no GPU |

`skia-safe` excluded: Skia bindings are BSD but build/bundle weight (multi-MB WASM) is incompatible with NFR-P3.

## Recommendation (to be validated by the bench below)
Layered **renderer trait** in `wiro-render` with backends chosen at runtime by capability probe:
1. **Primary: B (`vello_gpu`)** on WebGL2/WebGPU.
2. **Fallback: C (`vello_cpu`)** with tile/dirty-rect upload when no usable GPU (blocklisted drivers, software GL).
3. **Escape hatch: D** only if B fails go/no-go on P1 hardware (decision gate in S0).
Always do culling/LOD (`rstar`), cached object layers (rasterised stickies/images at zoom bands), and text LOD (below ~6 px → placeholder bars). Never ship A as only path. E is kept as a baseline in the bench, not as a product path.

## Bench protocol (Story 0.4 — shells + GPU backend report; extends to a perf spike "0.4b")
**Goal:** pick between B/C/D with data; reproducible by anyone from `bench/canvas/` (cargo + pnpm, one command `just bench-canvas`).

**Scene generator** (seeded, deterministic, `seed=42`, same file for all backends): 10 000 objects on a 20 000 × 20 000 px world.
| Type | Share | Detail |
|---|---|---|
| Sticky notes | 40 % | rect + shadow + 20–60 chars text (FR/Wolof/Arabic mixed, 10 % RTL) |
| Text boxes | 15 % | 1–5 lines, 2 fonts, 12–48 px |
| Shapes | 15 % | rect/ellipse/polygon, fill + stroke |
| Connectors | 20 % | bezier/orthogonal with arrowheads, attached to objects |
| Images | 10 % | 256–1024 px JPEG/WebP (≈ 400 MB decoded if naïve → forces mipmaps/LOD) |
Variants: 1k / 10k / 25k objects; clustered vs uniform layout.

**Scripted interactions** (identical input trace replayed, 60 s each): (1) continuous pan, (2) zoom 5 %↔400 % sweep, (3) pan+zoom while dragging 100 selected objects, (4) typing in a sticky with 10k objects loaded, (5) 5-min soak.

**Machines (min. matrix):**
| Id | Device | Role |
|---|---|---|
| M1 | 4 GB RAM Windows laptop, Intel UHD iGPU (≈ 2018–2020 Celeron/i3), WebView2 | NFR-P1 reference |
| M2 | MacBook Air M1/Intel 2017, WKWebView | macOS |
| M3 | Android ≤ 4 GB, Mali-G52/Adreno 610 class, Android 10–13 System WebView | mobile floor (ADR-0008) |
| M4 | iPhone SE 2/3 or iPad 9 | iOS floor |
| M5 | Browser web: Chrome + Firefox + Safari on M1 | web |
Also record WebGPU availability per machine; force WebGL2 and CPU paths explicitly.

**Metrics** (median of 5 runs, release build, power plugged, thermal warm-up 2 min, record device/driver/WebView version): frame time p50/p95/p99 and fps (from `requestAnimationFrame` deltas), input-to-photon latency (typing/drag, p95), time to first rendered frame from app start and from scene load (cold + warm), peak and steady RSS / WASM linear memory / GPU memory where exposed, WASM size gz, dropped-frame ratio, 5-min soak memory slope (leak check), pixel diff vs reference screenshots (AA/text quality, SSIM ≥ 0.98 vs vello_cpu reference).

**Go / no-go thresholds (aligned on NFR)**
| Metric | Go | Acceptable (fallback tier) | No-go |
|---|---|---|---|
| fps p50 pan/zoom 10k, M1/M2 | ≥ 60 | ≥ 45 | < 45 |
| fps p95 (frame ≤ 33 ms) | ≥ 30 | ≥ 24 | < 24 |
| fps p50 10k, M3/M4 | ≥ 40 | ≥ 30 | < 30 |
| input latency p95 (NFR-P2) | < 50 ms | < 80 ms | ≥ 80 ms |
| First frame, 10k scene, M1 | < 1.5 s | < 3 s | ≥ 3 s |
| RSS, 10k (NFR-P4) | < 600 MB | < 800 MB | ≥ 800 MB |
| Renderer WASM, gz | < 600 KB | < 900 KB | > 900 KB (NFR-P3 bundle ≤ 1.5 MB) |
| Soak 5 min memory growth | < 5 % | < 10 % | ≥ 10 % |
Decision rule: B passes "Go" on M1+M2+M5 and "Acceptable" on M3/M4 → adopt B (+C fallback). B fails but D passes → adopt D. Both fail P1 only via LOD → keep and tighten LOD; report the achievable object count honestly to Jean Balin (scope is not reduced; strategy changes).

## Decision
_pending — maintainer decision after bench results (Story 0.4 / perf spike)._

## Consequences
- `wiro-render` exposes a backend-agnostic trait; capability probe selects backend and reports it (Story 0.4 AC).
- Bench harness and results committed under `bench/canvas/` and summarised as an ADR addendum.
- Licence check (`cargo deny`) on `vello_*`, `wgpu`, `parley`, `glifo`, `tiny-skia`: all Apache-2.0/MIT/BSD — compliant.
