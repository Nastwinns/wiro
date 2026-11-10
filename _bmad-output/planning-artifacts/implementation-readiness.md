---
title: Implementation readiness check
date: 2026-11-10
verdict: CONCERNS (proceed with S0; resolve items before S1/S2)
---

# Implementation readiness — verdict: **CONCERNS**

| Area | Status | Notes |
|---|---|---|
| Brief | ✅ | complete (coaching round 1) |
| PRD v0.2 | ✅ with assumptions | NFR targets set; some [ASSUMPTION] tags remain (pricing NGN/KES, server sizing) |
| UX spec + 14 screen files | ✅ | Penpot designs not yet produced (WS2) |
| Architecture | ⚠ | ADR-0004 (renderer + bench protocol), 0007 (search), 0008 (mobile shell), 0009 (legal/billing skeleton) drafted as *proposed* — awaiting measurements (Story 0.4/0.5 spikes) and decision by Jean Balin; architecture.md v0.2 adds API, permissions, sync, observability, tests, supply-chain, i18n, perf budget |
| Epics/stories | ⚠ | 14 epics / 65 stories; ACs as checklists, to refine per story; story-level estimates missing |
| Cohesion PRD↔UX↔Arch↔Epics | ✅ | FR coverage map complete (AI deliberately post-v1) |
| Risks | ⚠ | solo capacity vs scope incl. mobile; loro-prosemirror maturity; WKWebView canvas perf |

## Blocking before S1
1. S0 spike result Loro + ProseMirror (Story 0.5) → go/no-go.
2. ADR-0008 mobile shell (proposed: PWA first, Tauri 2 mobile if bench passes) — measure in Story 0.4, then decide.
3. Licence gate: allow `Unicode-3.0` (ICU4X / unicode-normalization data) or not — see ADR-0007.

## Blocking before S2
4. ADR-0004 renderer (proposed: vello_gpu WebGL2 + vello_cpu fallback) — decide from perf bench.

## Non-blocking
Penpot DS (A/B), name validation, entity, partner terms.

Next: maintainer decisions on proposed ADRs (PR #1); then `bmad-create-story` for Story 0.1.
