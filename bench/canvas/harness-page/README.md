# In-page harness (to write in S0)

Node cannot measure WebGL/WebView. The real runner is a small page (`bench/canvas/harness-page/`, to be created by the dev agent)
loaded by: Chrome/Firefox/Safari (M5), Tauri shells (M1–M4).

Contract
1. Fetch `scenes/scene-<variant>-<layout>-seed42.json` + `traces/<id>.json`; verify sha256 against `scenes/CHECKSUMS.json` (abort on mismatch).
2. Instantiate a backend implementing `src/harness/backend.mjs` (B/C/D = Rust->WASM via wasm-bindgen; E = TS Canvas2D).
3. Pace the trace on `requestAnimationFrame` (event time `t` -> frame whose timestamp >= t); collect `dtMs` per rAF.
4. Typing latency: timestamp key event -> next rAF after the glyph is presented (p95). Cross-check with 240 fps camera on 1 device.
5. Memory: `performance.measureUserAgentSpecificMemory()` (Chromium, cross-origin-isolated) / `adb shell dumpsys meminfo` / Instruments; WASM `memory.buffer.byteLength`; GPU memory when exposed.
6. Post the JSON back (`POST /report`) or download; reuse `runMatrixCell`'s aggregation (`src/harness/report.mjs`) to produce `wiro-bench-report/1`.
7. SSIM: capture a fixed viewport (zoom 1, centre) with each backend, compare to C (vello_cpu); SSIM >= 0.98.
