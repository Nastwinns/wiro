---
title: Ecosystem mapping — pass-spark JS deps → Wiro (TS chrome vs Rust core)
status: proposed
created: 2026-11-10
note: Licences to re-verify with `cargo deny` / `license-checker` before adoption (clean-room-guard agent).
---

# Ecosystem mapping

Source: `Project/pass-spark/package.json` (your production stack). With ADR-0002 (Figma model), the **UI chrome stays TS** and reuses what you already master; **logic moves to Rust**.

| Need | pass-spark (JS) | Wiro TS chrome | Wiro Rust core (crate) | Licence (verify) |
|---|---|---|---|---|
| UI primitives | radix-ui/*, shadcn, cva, clsx, tailwind-merge | **keep** (shadcn on Radix/Base UI) | — | MIT |
| Icons | lucide-react | keep | — | ISC |
| Motion | framer-motion | keep (`motion`) | canvas anim in wiro-canvas | MIT |
| Command palette | cmdk | keep | fuzzy scoring: `nucleo` or `fuzzy-matcher` | MPL-2.0 / MIT → prefer MIT |
| Toasts, drawers | sonner, vaul | keep | — | MIT |
| Panels / dock | react-resizable-panels | keep | — | MIT |
| Drag & drop (lists) | dnd-kit | keep (sidebar, kanban) | canvas DnD = wiro-canvas | MIT |
| Onboarding tour | react-joyride | keep | — | MIT |
| OTP / passkeys | input-otp, @simplewebauthn | keep client | `webauthn-rs` (server) | MIT / MPL-2.0 ⚠ |
| Forms + validation | react-hook-form, zod | keep in chrome | `serde` + `garde`/`validator` (shared schemas) | MIT/Apache |
| State | zustand | UI-only state | document state lives in WASM core (CRDT) | MIT |
| Server state | @tanstack/react-query | mostly unnecessary (local-first) | wiro-sync | MIT |
| Tables / DB views | @tanstack/react-table | keep for DB views | query/filter in wiro-model | MIT |
| Charts | recharts | keep for dashboards | `plotters` if rendered in canvas | MIT |
| i18n | i18next, react-i18next | **switch to Fluent** (`@fluent/bundle`) | `fluent-rs` — same `.ftl` files TS & Rust, better plurals/gender for wo/sw/ha/ar | Apache/MIT |
| Dates | date-fns | `Temporal`/date-fns | `jiff` | MIT/Unlicense |
| IDs | nanoid | — | `uuid` v7 / `ulid` (sortable, CRDT-friendly) | MIT/Apache |
| Markdown | react-markdown, remark-gfm, rehype-sanitize | render via core | `comrak` (GFM) / `pulldown-cmark` + `ammonia` sanitize | BSD-2 / MIT / Apache |
| Image upload/crop | react-dropzone, react-easy-crop, smartcrop | keep UI | `image` + `fast_image_resize` (low-bandwidth downscale, A2) | MIT/Apache |
| Export image/PDF | html-to-image, snapdom | — | SVG: own writer; raster: `resvg`/`tiny-skia`; real-text PDF: `krilla` | Apache/MIT ⚠ verify |
| QR (share links offline) | qrcode | — | `qrcode` | MIT/Apache |
| Maps (later) | leaflet, turf | maybe | `geo` | MIT/Apache |
| Analytics | posthog-js | opt-in only | wiro-telemetry; **off in sovereign builds** | — |
| Fonts | @fontsource/* | bundled subset fonts | text shaping `parley` / `cosmic-text`, rasterize `swash` | Apache/MIT |
| Tests | vitest, testing-library, playwright, axe-core | keep (+ axe for a11y) | `cargo-nextest`, `insta`, `proptest`, `criterion` (bench) | MIT/Apache |

## Rust-only building blocks (no JS equivalent in pass-spark)

| Concern | Crate candidates | Crate |
|---|---|---|
| CRDT | `loro`, `yrs`, `automerge` | wiro-crdt (ADR-0003) |
| Spatial index (hit-test, culling — perf P1) | `rstar` | wiro-canvas |
| Geometry / paths | `kurbo`, `lyon` | wiro-canvas / render |
| 2D GPU render | `vello` / `vello_gpu` (WebGL2 + wgpu), `wgpu` | wiro-render (ADR-0004) |
| Layout (frames, auto-layout) | `taffy` | wiro-canvas |
| Canvas accessibility | `accesskit` (+ DOM mirror on web) | wiro-canvas |
| Local storage | `rusqlite` (desktop), OPFS/IndexedDB via `wasm-bindgen` (web) | wiro-storage |
| Full-text search | `tantivy` (desktop/server), lighter index for WASM | wiro-search |
| Server | `axum`, `tokio`, `tower` | apps/server |
| Auth | `openidconnect`, `oauth2` | wiro-auth |
| WASM bridge | `wasm-bindgen`, `tsify` (TS types from Rust) | all |
| Desktop shell | `tauri` 2 | apps/desktop |

⚠ = licence needs a check (MPL-2.0 is file-level copyleft: usable as a dependency in an MIT project, but flag it in ADRs).

## Skills imported from pass-spark into `.claude/skills/`
UI/UX: impeccable, design, hooked-ux, onboarding, signup, cro, site-architecture, aidesigner-frontend.
Messaging/GTM: copywriting, copy-editing, storybrand-messaging, product-marketing, marketing-psychology, obviously-awesome, launch, social.
Research/biz: jobs-to-be-done, mom-test, customer-research, competitor-profiling, crossing-the-chasm, pricing, hundred-million-offers, predictable-revenue.
Tech: rust-engineer, websocket-engineer.
