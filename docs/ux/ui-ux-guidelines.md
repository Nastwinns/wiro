---
title: UI/UX guidance canon for Wiro (humans + agents)
status: v0.1
created: 2026-11-10
---

# UI/UX guidance canon

## 1. Sources we follow (priority order)
1. **WCAG 2.2 AA** — non-negotiable (gov procurement).
2. **Vercel Web Interface Guidelines** — interaction details: keyboard everywhere, visible `:focus-visible`, hit targets ≥ 32 px desktop (Ubao raises the 24 px baseline; 44 touch), input ≥ 16 px on mobile, never block paste/zoom, optimistic updates + undo, loading show-delay 150–300 ms & min 300–500 ms, URL as state / deep-link everything, gestures have click/keyboard alternatives, aria-live for async, locale-aware shortcuts, ellipsis for "Rename…" / "Saving…".
3. **Apple HIG design principles** — purpose, agency, responsibility, familiarity, flexibility, simplicity, craft, delight; preserve context across devices; multiple input methods.
4. **Material 3 (usability)** — one primary task per view, emphasise key actions, use empty space.
5. **Laws of UX / NN/g heuristics** — Fitts (edge-anchored toolbars, big frequent actions), Hick (8 default tools), Jakob (familiar shortcuts V/H/T/R…), Miller/recognition over recall (command palette, recent), Doherty (< 400 ms feedback; our target < 50 ms on canvas), Tesler (complexity moved to defaults, not users).
6. **Craft canon** (Rauno "invisible details", Emil Kowalski motion, Linear method, Refactoring UI colour ramps).

## 2. Domain principles for our product
- **"The canvas is sacred."** Every panel/toolbar is dismissable; chrome serves the canvas (UI Craft principles catalog).
- **"Conflict is expected, not exceptional."** Simultaneous edits are the happy path; merge UX designed before launch (CRDT, no manual conflict dialogs).
- **Performance is UX.** Perf budgets live in the design system next to colours (NFR-P1..P4).
- **Honesty.** No fake progress, no fake social proof, no dark patterns in billing (P4).
- **Low-end first.** 1366×768, 4 GB RAM, 360 px Android, slow 3G.

## 3. Generated-UI tells to avoid (anti-slop)
Identical rounded card grids with grey shadows · purple/blue gradients · glassmorphism · all-caps eyebrow labels · cream + serif + terracotta template look · nested cards · grey text on coloured backgrounds · bounce easing · emoji as icons · stock photos · fake logos/testimonials.

## 4. Agent skills — recommended set (Nov 2026)
| Skill | Use in Wiro | Status in repo |
|---|---|---|
| **impeccable** (audit, critique, polish, 59 detector rules) | review every Penpot screen & UI PR | ✔ installed (from pass-spark) |
| design, hooked-ux, onboarding, signup, cro, site-architecture, copywriting | screens, onboarding, landing | ✔ installed |
| **szilu/ux-designer-skill** — includes *canvas navigation*, *canvas objects/performance*, *presence*, *CRDT/offline sync UX*, i18n/RTL, data tables, ethical design | the most domain-relevant skill for a whiteboard | ✔ installed in `.agents/skills/ux-designer/` (MIT, v. Nov 2026) |
| **Anthropic frontend-design** | design direction for new pages (landing) | ⏳ needs OK |
| **Vercel web-design-guidelines** | `file:line` review of UI code before merge | ⏳ needs OK |
| **UI UX Pro Max** | style/palette/font database for desktop & mobile | ⏳ needs OK (CLI) |
| **Emil Kowalski skills** | motion & feel of canvas interactions | ⏳ needs OK |
| nexu-io/open-design `craft/` (laws-of-ux, state-coverage, anti-ai-slop, color, typography) | reference files for agents | ⏳ needs OK |
| Interface Playbook / UI Craft (smoothui) | reading list | link only |

Rule (from 2026 comparisons): per task, **one skill that designs + one that reviews** — e.g. Penpot screens: design-guide/ux-designer → impeccable review; landing: frontend-design → web-design-guidelines review.

## 5. Règles de cohérence (Ubao)
- Logo officiel Ubao (Escalier) : `design/exports/logo/ubao/final`, jamais retapé ; remplace « Fil-cadre ».
- Contours de champs : `border.control` ≥ 3:1. Or : ornement et édition Souverain seulement.
- Copy : pas de tiret cadratin ; mots d'interface en français (Tableau, pas Board).
- Fraunces : une fois par écran en app ; exception marketing à trancher.
- Cibles ≥ 32 px (44 tactile) ; vérifier `node tools/contrast-check/check.mjs` après tout changement de jeton.
