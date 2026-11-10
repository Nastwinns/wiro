# ADR-0002 — UI shell for desktop & web

- Status: **accepted** (Jean Balin, 2026-11-10)
- Date: 2026-11-10

## Context
See docs/architecture/project-structure.md and docs/research/competitive-audit.md (perf P1, data-loss P2, offline P3).

## Options
1. Tauri 2 + web UI (React/shadcn or Leptos) — mature, mobile path, webview perf ceiling
2. GPUI (Zed) — native GPU, top perf, Windows/web less mature
3. Dioxus (webview now, Blitz native later) — Rust end to end, younger

## Recommendation
Option 1 variant — "Figma model": Tauri 2 shell + thin TS chrome (shadcn) + Rust→WASM engines (canvas, CRDT, storage, sync). See docs/architecture/ui-stack-analysis.md.

## Decision
"Figma model" accepted: Tauri 2 shell + thin TS chrome (shadcn/ui) + Rust→WASM engines (canvas, CRDT, storage, sync). Same frontend for desktop and self-hosted web.
