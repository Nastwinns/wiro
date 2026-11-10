# ADR-0003 — CRDT engine

- Status: **accepted** (Jean Balin, 2026-11-10)
- Date: 2026-11-10

## Context
See docs/architecture/project-structure.md and docs/research/competitive-audit.md (perf P1, data-loss P2, offline P3).

## Options
1. Yrs (Yjs Rust port) — mature, Yjs ecosystem
2. Loro — fast, rich-text + tree + movable list
3. Automerge 3 — strong history, larger payloads

## Decision
**Loro** (MIT, Rust-native, WASM). Rationale: rich text + movable tree (page tree, layers) + lists in one engine, compact encoding (low-bandwidth A2), history/time-travel for version history (FR6.4).

## Consequences
- Docs editor binding via `loro-prosemirror` — younger than y-prosemirror: budget a hardening spike in S1 (IME, undo, cursor mapping).
- Canvas elements modelled as Loro maps in a movable tree; z-order via fractional indices.
- Snapshots + shallow snapshots for fast cold start; GC policy documented.
