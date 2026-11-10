# ADR-0006 — Docs editor engine

- Status: **accepted** (Jean Balin, 2026-11-10)
- Date: 2026-11-10

## Options
1. ProseMirror (MIT) — de-facto standard, schema-driven, strong IME/selection, CRDT bindings
2. Lexical (MIT)
3. Tiptap core (MIT layer over ProseMirror)

## Decision
**ProseMirror**, bound to Loro via `loro-prosemirror`. Tiptap core may be used for convenience only if no paid extension is needed (licence gate).

## Consequences
Block schema shared with `wiro-model`; custom node views for live canvas frame, database, mermaid, math.
