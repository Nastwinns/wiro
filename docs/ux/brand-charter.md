---
title: Brand charter (charte graphique) — direction "Malachite"
status: proposed v0.1 — name is still open (see docs/product/naming-shortlist.md); "Wiro" used as placeholder
created: 2026-11-10
---

# Brand charter — "Malachite"

## 1. What the competition looks like (measured on their homepages, Nov 2026)

| Brand | Background | Accent | Type | Feel |
|---|---|---|---|---|
| Miro | warm off-white #FBFAF7, black | yellow #FDE050 | Roobert PRO, 56 px / 400 | friendly, mass-market |
| AFFiNE | #F8F8F7 | blue #1E96EB | Inter, 90 px / 500 | dev/OSS, clean |
| Collaboard | cream #F8F9E6 + navy #062431 | orange #D14424 | Inter Variable, 54 px / 650 | Swiss-serious, corporate |
| Boardmix | white | violet #832FFF | Satoshi 900 | loud, AI startup |
| Cynoia (African) | white | violet #8D45BA, navy #0E153A | Inter Display / Geist / Cal Sans | generic SaaS |

Gaps: **nobody owns deep green**, nobody plays *premium/restraint*, the only African player looks generic. Violet, blue, yellow and orange are taken.

## 2. Positioning of the visual identity
**"Le luxe du calme"** — clean, airy, very premium, quietly African. Luxury here = restraint, precision, generous space, perfect typography, materials (stone, mineral, gold leaf) — not ornament.

- Reference mood: high-end editorial, architecture monographs, jewellery houses, Linear/Things precision.
- Anti-references: rainbow sticky chaos as brand, purple AI gradients, glassmorphism, stock photos, "afro" clichés (masks, sunsets, safari), cream + serif + terracotta template look.

## 3. Colour

**Malachite** — the green mineral of the Congolese copper belt (Katanga), used in jewellery and ornament: African, precious, deep, calm. **Gold** used like gold leaf: rare, small, premium tier and achievements only.

### Light theme
| Token | Hex | Use | Contrast |
|---|---|---|---|
| paper | #FAFAF7 | app background | — |
| surface | #FFFFFF | panels, cards, canvas background | — |
| ink | #0F1211 | primary text | 18.0:1 on paper |
| ink-2 | #3D4441 | secondary text | 9.6:1 |
| muted | #6B726F | tertiary text, placeholders | 4.7:1 (AA) |
| line | #E4E5E0 | borders, dividers | decorative |
| malachite | #0B5D49 | primary actions, focus, links | 7.5:1; white on it 7.9:1 |
| malachite-600 | #0E7458 | hover / secondary emphasis | 5.5:1 |
| gold | #B08A2E | ornaments, premium badges (non-text only) | 3.1:1 (graphics ≥ 3:1) |
| gold-text | #7A5E1A | gold text on light | 5.8:1 |

### Dark theme
| Token | Hex | Contrast |
|---|---|---|
| bg | #0D0F0E | — |
| surface | #161A18 | — |
| text | #F2F1EC | 17.0:1 |
| text-2 | #B9BDB8 | 10.1:1 |
| muted | #8A908C | 5.9:1 |
| malachite | #3FBF95 | 8.3:1 (bg text on it 8.3:1) |
| gold | #D9B65A | 9.9:1 |

### Semantic
success = malachite family · warning #B26B00 / dark #F0A845 · danger #B42318 / dark #F97066 · info #1D5F8A / dark #6CB4E4. Never rely on colour alone (icon + label).

### Canvas content palette (stickies, shapes) — not brand colours
8 soft mineral tints, ink text ≥ 12:1 on each: sand #F4E7B8 · ochre #F6D9A8 · clay #F2DCD3 · stone #E9E6DF · mint #DCEBDD · aqua #CFE8E4 · sky #D9E6F2 · lilac #E7DDF0. Dark-mode variants are 18 % luminance versions with text #F2F1EC.

## 4. Typography (all SIL OFL — compatible with MIT distribution)
| Role | Family | Usage |
|---|---|---|
| UI & docs | **Inter** (v4, variable, `font-feature-settings: "cv11","ss01","tnum"` for data) | everything in-app |
| Display (marketing, empty-state titles, cover pages) | **Fraunces** (opsz high, SOFT 0, WONK 0), weights 300–500 | sparingly: 1 per screen max |
| Code / data | **JetBrains Mono** | code blocks, IDs |
| Fallbacks | **Noto Sans** (+ Noto Sans Arabic, Noto Sans Ethiopic) | RTL & non-Latin scripts |

Coverage requirement (to verify in Penpot with real strings): Wolof ë ñ ŋ, Hausa ɓ ɗ ƙ ƴ, Yoruba ẹ ọ ṣ + tone marks, Lingala ɛ ɔ, Swahili, Arabic.

Scale (rem, base 16, ratio ≈ 1.2): 12 · 13 · 14 (UI default) · 16 (doc body) · 20 · 24 · 30 · 36 · 48 · 64 (display). Line-height: UI 1.4, doc 1.6, display 1.05. Tracking: display −2 %, caps labels avoided (cliché) — use sentence case.

## 5. Shape, space, depth
- Spacing base 4 px: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 96.
- Radius: 6 (inputs, buttons) · 10 (cards, popovers) · 16 (dialogs) · full (avatars, pills). No over-rounded "bubble" look.
- Borders 1 px `line`; elevation via very soft shadows, max 2 levels: `0 1px 2px rgba(15,18,17,.06)` and `0 8px 24px rgba(15,18,17,.08)`. No glass, no blur except command palette backdrop (dim only).
- Density: compact default for tool chrome (32 px controls), comfortable for docs (16/1.6).

## 6. Iconography
Lucide (ISC), 1.5 px stroke, 16/20 px grid, rounded joins. Custom glyphs for canvas tools drawn on the same grid. No filled duotone icons.

## 7. Motif — "Fil" (thread)
A single-weight geometric line pattern derived from **strip-weaving grids** (kente-style rhythm, abstracted) and **bogolan mark-making** (abstracted to dots/lines) — never literal reproduction of a specific cultural design. Used only: marketing backgrounds at 4–6 % opacity, empty states, loading splash, sovereign-tier certificate. Never inside working surfaces.
Cultural note: commission or validate the motif with an African designer; credit inspiration.

## 8. Logo direction (to be designed in Penpot)
- Wordmark in Inter Display-style custom lettering, lowercase, tight, with one ligature/detail.
- Symbol: a square board whose stroke turns into a **thread** that closes the frame (board + people joined). Must work at 16 px (favicon, tray icon) and in one colour.
- Lock-ups: symbol + wordmark horizontal; symbol alone for app icon (malachite on paper / paper on malachite). Gold version reserved for "Sovereign" edition.

## 9. Motion
Purposeful and quiet: 120 ms (micro), 200 ms (panels), 320 ms (page/doc↔canvas morph); easing `cubic-bezier(.2,.0,0,1)` (out) and `(.4,0,.2,1)` (standard). No bounce. `prefers-reduced-motion` → fades only. Canvas pan/zoom is never animated beyond inertia.

## 10. Voice & tone (FR/EN)
Calm, precise, respectful, never hype. "Vous" in French UI. Short sentences, verbs first on buttons ("Créer le tableau", "Inviter"). Errors say what happened + what to do. No fake urgency, no guilt copy in billing. Local idioms only in marketing, never in system messages.

## 11. Accessibility baseline
WCAG 2.2 AA everywhere; focus ring 2 px malachite + 2 px offset; hit targets ≥ 32 px desktop / 44 px touch; full keyboard on canvas (tab through objects, arrows move, Enter edits).
