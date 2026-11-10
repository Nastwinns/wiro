---
title: Handoff — generate the UI in Penpot with OpenCode (local)
status: ready v0.1
created: 2026-11-10
---

# Penpot handoff (OpenCode + Penpot MCP)

## 0. Setup (once)
1. Penpot: self-hosted or design.penpot.app. Create team **Wiro** and file **`Wiro — Design System`** + file **`Wiro — App`** + file **`Wiro — Marketing`**.
2. MCP server:
   - **Local** (default in `opencode.json`): run the Penpot MCP server (see help.penpot.app/mcp — local server on `http://localhost:4401/mcp`), then in Penpot: *File → MCP Server → Connect* on the open file.
   - **Cloud**: Account → Integrations → MCP Server → copy URL with `userToken` → `export PENPOT_MCP_URL=…` → set `penpot-cloud.enabled: true`.
3. Fonts in Penpot: upload **Inter**, **Fraunces**, **JetBrains Mono**, **Noto Sans** (+ Arabic) — all OFL.
4. Import tokens: Penpot Tokens panel → Import → `design/tokens/tokens.json` (DTCG). Create themes **light** / **dark** from the `light` and `dark` sets; `primitive` set always active.
5. Run `opencode` at repo root. It loads `AGENTS.md`, `DESIGN.md`, UX spec and this file. Skills in `.claude/skills/` (impeccable, design, onboarding, signup, cro, site-architecture…) — if OpenCode doesn't auto-discover them, reference the `SKILL.md` path in your prompt.

## 1. Global rules to paste at the start of every session
```
You are designing in Penpot via MCP for the product "Wiro" (placeholder name).
Follow DESIGN.md and docs/ux/brand-charter.md strictly: tokens only (no raw hex), Inter UI, Fraunces max once per screen,
malachite = only accent for actions, gold = ornament only, sentence case, no gradients/glass/nested cards,
radius 6/10/16, spacing 4-pt grid, 1px borders, shadows 1–2 only.
Reference viewport 1366×768 must fit; also produce 1440×900. Light first, then duplicate in dark theme.
Every screen: default + empty + loading + offline + error/read-only states as separate frames.
Use French UI copy (vouvoiement) and keep EN keys in layer names: e.g. "canvas.toolbar.sticky".
Name frames exactly "S-xx.y <Name> / <Viewport> / <Theme> / <State>".
After each screen, run a self-critique with the impeccable skill (critique → audit) and fix issues before moving on.
```

## 2. Production order (prompts)
Work file by file; one prompt per step. Each prompt = "Read docs/ux/screens/<file> section <ID> and build it in Penpot".

### Phase A — Design system (`Wiro — Design System`)
| # | Prompt |
|---|---|
| A1 | Create pages Foundations / Components / Patterns. On Foundations, render colour swatches (light & dark) from tokens with contrast labels, type scale (Inter, Fraunces, Mono) with FR + Wolof/Hausa/Yoruba sample strings (ë ñ ŋ ɓ ɗ ƙ ẹ ọ ṣ), spacing, radius, shadows, motion notes. |
| A2 | Components (variants + states default/hover/active/focus/disabled): Button (primary, secondary, ghost, danger; sm/md/lg), IconButton, Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Segmented control (Doc | Board), Tabs, Tooltip, Popover, Menu, Dialog, Sheet (mobile), Toast, Badge/Pill (status, offline, guest, sovereign-gold), Avatar + group, Breadcrumb, Tree row, Table row/cell, Kanban card, Comment, Empty state, Skeleton, Progress, OTP input, Kbd shortcut. |
| A3 | Canvas components: tool button, toolbar (vertical/horizontal), quick toolbar, sticky (8 tints, light/dark), shapes, connector with label, frame with title tab, comment pin, cursor with name, selection box & handles, minimap, zoom cluster, vote dot, timer pill, workshop bar. |
| A4 | Patterns: app shell skeleton, settings layout, side peek, command palette, slash menu, share dialog — as components. |
| A5 | Logo exploration (brand-charter §8): 6 symbol sketches (board + thread), 2 wordmarks, app icon at 1024/64/16, favicon. Neutral placeholder name "wiro". |
| A6 | "Fil" motif tiles (abstract strip-weave + dot/line marks), 3 variants at 5 % opacity on paper and dark. |

### Phase B — App (`Wiro — App`)
| # | Screens (spec file) |
|---|---|
| B1 | S-01.1–S-01.6 App shell, sidebar, topbar, command palette, inbox, sync indicator (01-app-shell.md) |
| B2 | S-02.1–S-02.6 Auth, SSO, OTP, guest join, onboarding wizard, import (02-auth-onboarding.md) |
| B3 | S-03.1 Home (03-home.md) |
| B4 | S-04.1–S-04.6 Doc editor incl. live canvas frame block (04-doc-editor.md) |
| B5 | S-05.1–S-05.9 Board: toolbar, quick toolbar, inspector, layers, minimap, frames/presentation, diagram kits, mind map (05-canvas.md) — include a dense demo board (~200 objects) to judge readability |
| B6 | S-06.1–S-06.6 Workshop mode (06-workshop.md) |
| B7 | S-07.1–S-07.6 Databases & meeting notes (07-databases-planning.md) |
| B8 | S-08.1–S-08.5 Wiki, backlinks, search, templates, trash (08-knowledge-search.md) |
| B9 | S-09.1–S-09.5 Share, comments, presence, history, export (09-collaboration.md) |
| B10 | S-10.1–S-10.9 Settings & admin incl. fair-billing page (10-settings-admin.md) |
| B11 | S-11.1–S-11.6 Server admin console (11-server-admin.md) |
| B12 | S-12.x System states applied to Doc, Board, Home (12-system-states.md) |
| B13 | S-13.x Mobile 390/360 & tablet (13-mobile-tablet.md) |
| B14 | Prototype flows: onboarding → home → new board → workshop (timer+vote) → doc with live frame → share guest link |

### Phase C — Marketing (`Wiro — Marketing`)
| # | Screens |
|---|---|
| C1 | S-14.1 Home desktop + mobile |
| C2 | S-14.2 Pricing with currency switch states (XOF, NGN, KES, EUR) |
| C3 | S-14.3 Sovereign, S-14.4 Download, S-14.5 Partners, S-14.6 Docs shell |

## 3. Review gates
- After A2, B5, C1: run `design-reviewer` agent (`.claude/agents/design-reviewer.md`) and the impeccable `audit` + `critique`.
- Check at 1366×768 and 360 px; check FR long strings; check dark theme contrast against tokens.
- Export tokens back from Penpot to `design/tokens/tokens.json` if changed (keep DTCG) and commit.

## 4. Definition of done (per screen)
Spec IDs covered · all states present · light + dark · 1366 + 1440 (+ mobile where listed) · tokens only · a11y annotations (focus order, labels) · copy in FR with EN keys · reviewed (impeccable) · linked in prototype if part of a flow.
