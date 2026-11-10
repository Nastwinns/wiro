---
title: UI/UX stack analysis — heavy client (desktop) + self-hosted web
status: proposed (decision: Jean Balin) — feeds ADR-0002 / ADR-0004
created: 2026-11-10
---

# UI stack analysis

## Constraints (from brief + audit)
1. **One core** for desktop (Win/macOS) and self-hosted web — Rust.
2. **Canvas perf** at 10k+ objects on modest hardware (audit P1, A3) → canvas must **not** be DOM.
3. **Docs editor** at Notion level: IME, spellcheck, selection, copy/paste, accessibility (gov procurement requires a11y) → text editing is the hardest part.
4. **Offline / local-first**, low bandwidth (P2, P3, A2) → small web bundle, lazy loading.
5. **Mobile/tablet editing** later (P10) — keep a path open.
6. **MIT-compatible** deps only; clean-room.
7. Built by **AI agents** in ~3 months → ecosystem the models know well matters.

## Candidates (status Nov 2026)

| | GPUI + gpui-kit | Tauri 2 + web UI + Rust/WASM engines | Dioxus (webview → Blitz) | egui / Iced / Slint |
|---|---|---|---|---|
| Licence | Apache-2.0 ✔ | MIT/Apache ✔ | MIT/Apache ✔ | egui/Iced ✔, Slint GPLv3/commercial ✘ |
| Desktop perf | Excellent (Metal / D3D11, 120 fps; Zed, Discord rewrite) | Chrome = webview; canvas via WebGL2/WebGPU — good if canvas is not DOM | Webview today; Blitz native still alpha (0.8.0-alpha) | egui: full redraw, ~32 ms at 3k rows; Iced slow pace |
| Web target | wasm exists but young: **no a11y tree on web**, 1 window, fonts must be embedded | **Native**: same UI is the web app | Web renderer mature | Partial |
| Rich-text docs editor | Build from scratch (Zed text is code, not blocks) | Mature MIT engines (ProseMirror, Lexical) + CRDT bindings | DOM editors via webview | Build from scratch |
| Accessibility | Desktop AccessKit ✔ / web ✘ | Browser a11y ✔ everywhere | ✔ (webview) | Partial |
| Mobile | No | Tauri mobile (iOS/Android) ✔ | ✔ webview | Partial |
| Agent productivity | Low corpus, API churn (gpui-pre snapshots) | Very high (React/TS + Rust) | Medium | Medium |
| Risk | Web + docs editor = 2 big unknowns | Webview inconsistencies (WKWebView tied to macOS version, WebView2 OK) | Native renderer experimental | Not suited to polished product |

## Recommendation (proposed): "Figma model" — Rust engines, thin web chrome

```
┌────────────── Tauri 2 shell (desktop) ── or ── browser (self-hosted web) ──────────────┐
│  UI chrome (TS): panels, menus, sidebar, command palette, settings  ← design system     │
│  Docs editor: ProseMirror-based blocks  ⇄  CRDT binding                                │
│  Canvas: <canvas> driven by Rust→WASM engine (wiro-canvas + wiro-render, wgpu:          │
│          WebGPU, WebGL2 fallback; vello_gpu has a native WebGL2 backend)               │
│  Core (Rust→WASM): wiro-model · wiro-crdt · wiro-storage(IndexedDB/OPFS) · wiro-sync   │
└───────────────── Tauri side (desktop only): native FS, SQLite WAL, updates, tray ──────┘
                       apps/server (Rust): sync relay, auth, storage
```

Why:
- Canvas hot path is Rust/GPU, out of the DOM → same engine native & web (lesson: CANcorder rewrote React tables to Canvas2D to survive 2M rows).
- Docs get browser-grade text editing + accessibility for free — critical for gov tenders.
- 100 % code reuse desktop ↔ web; mobile path via Tauri mobile.
- Rust owns everything that matters (model, CRDT, storage, sync, canvas, render, server); TS is limited to chrome + editor glue.
- Escape hatch: if webview perf disappoints on desktop, the canvas engine can render to a native wgpu surface, or the shell can migrate to GPUI later — because apps are thin and crates own the logic.

Trade-offs to accept: three webview engines to test (WebView2, WKWebView, WebKitGTK); some TypeScript in the codebase.

### Alternative (full Rust): GPUI + gpui-kit
Choose if "zero TypeScript" is a hard requirement. Cost: build a block/rich-text editor from scratch, web build without accessibility tree (blocks gov), no mobile. Higher risk for a 3-month commercial MVP.

## UI kit (if recommendation accepted) — all MIT
| Need | Pick | Note |
|---|---|---|
| Primitives / components | **shadcn/ui** (Radix or Base UI) | Already your stack (pass-spark, intent, cardcraft) |
| Icons | lucide | idem |
| Motion | Motion (ex-Framer Motion) | respect `prefers-reduced-motion`; low-end devices |
| Command palette | cmdk | |
| Toasts | Sonner | |
| Drag & drop (lists, sidebar) | dnd-kit | canvas DnD stays in Rust engine |
| Virtualised lists | Virtuoso | |
| Numbers | NumberFlow | |
| Editor | ProseMirror (+ y-prosemirror or loro-prosemirror per ADR-0003) | Tiptap core is MIT; avoid paid extensions |
| Landing effects only | Magic UI, Motion Primitives, Paper Shaders | **Not** React Bits / Animate UI (Commons Clause), not Aceternity (own licence) |
| Design source of truth | Penpot → tokens → `packages/tokens` → CSS vars + Rust constants | |

## UX principles derived from the audit
1. **Performance is UX**: perceived latency < 50 ms on input, 60 fps pan/zoom at 10k objects, cold start < 2 s.
2. **Structure over chaos** (P8): frames, outline, minimap, global search docs+canvas, focus mode.
3. **Progressive disclosure** (P9): small default toolbar; power tools behind cmdk palette.
4. **Offline is normal** (P3): no "offline mode" toggle; quiet sync indicator; data-usage meter (A2).
5. **No dark patterns in billing** (P4) — UX copy reviewed.
6. **Guest without account** (P15), facilitation tools for all (P16).
7. **i18n/RTL ready**, FR/EN at launch (A6); text expansion +30 % in layouts.
8. **Low-end first**: test on 4 GB RAM / integrated GPU / 1366×768 / slow 3G.
9. **Accessibility** WCAG 2.2 AA (gov procurement).

## Sources
gpui-kit README & v0.8.0 release (Oct 2026), gpui-ce web/platform docs (docs.rs), LavX benchmarks (Nov 2026), Discord GPUI rewrite (Nov 2026), Dioxus releases & dioxus-native crate (0.8.0-alpha.3, Oct 2026), Moonkale ADR-0016, Linebender Q1 2026 + Vello releases (vello_gpu WebGL2), Tauri webview docs & issues #6381/#8020, rust-gui-desktop-ecosystem-state report, Vanille "Two million CAN frames" (Apr 2026), Rust GUI comparison 2026 (gpui-starter), crates.io download counts (HN Nov 2026).
