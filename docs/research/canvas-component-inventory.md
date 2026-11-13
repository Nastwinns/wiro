---
title: Canvas component inventory (clean-room)
status: v0.1 — feeds Penpot page "A3 · Canvas components" and docs/ux/screens/05-canvas.md, 06-workshop.md
created: 2026-11-10
---

# Canvas component inventory

Clean-room rule (AGENTS.md §1): this file lists **features observed in public documentation and marketing pages** only. No code, asset or icon was copied. Our names, layout and visuals are our own (Malachite design system).

## Sources (public docs, read Nov 2026)
- Miro Help Center — *Toolbars*, *Connection lines* (help.miro.com)
- Collaboard — *Features* page (collaboard.app/features)
- FigJam — *Guide to FigJam* (help.figma.com)
- Mural — *Facilitation superpowers* (mural.co/features/superpowers)
- AFFiNE — release notes 0.8 / 0.15 (affine.pro/blog): edgeless toolbar, mind map, connector labels, synced docs on board
- Excalidraw element properties as documented publicly (stroke style, roughness, arrowheads)
- tldraw public feature page (selection & transformation) — **concept only, proprietary licence, nothing reused**

## 1. Board bars
| Bar | Position | Content (Wiro) |
|---|---|---|
| Creation bar | left, vertical (bottom on tablet) | Select · Hand · Sticky · Text · Shapes & lines · Connector · Pen (pen / highlighter / eraser / lasso) · Frame · More (image, PDF, table, mind map, card, stamps, comment, templates, diagram kits, embed doc). User can pin / unpin / reorder (profile-level). Tools are one-shot except pen, eraser, lasso, comment. |
| Collaboration bar | top-right | presence, reactions, timer, voting, private mode, follow / summon, share |
| Canvas controls | bottom-right | frames navigator, layers, zoom cluster, minimap, help |

## 2. Objects and their properties
| Object | Properties |
|---|---|
| Sticky | shape square / rectangle / round; size S / M / L; 8 mineral tints; author name toggle; tags; auto-fit text; stack (pile) |
| Shape | rect, rounded rect, ellipse, diamond, triangle, parallelogram, trapezoid, hexagon, pentagon, star, cross, cylinder, cloud, arrow shape, speech bubble, document; text inside; fill solid / light / none; stroke solid / dashed / dotted; width S / M / L; style *précis* / *esquisse* (hand-drawn) |
| Connector | straight / elbow (orthogonal) / curved; arrowheads none, arrow, triangle, dot, bar, diamond, crow's foot (one / many); line jumps on crossings; label (horizontal or following the line); ports on 4 sides + centre (centre = never crosses objects); one-click "create next shape and connect" via side handles; insert shape on a line |
| Text | free text (auto-width / fixed), heading style, lists, links |
| Pen | pen, highlighter (translucent, wide), eraser, lasso select; thickness; colour; shape recognition (smart drawing) |
| Media | image (alt text mandatory field), PDF pages, video embed, audio note, file card, link preview card, code block |
| Cards | task card (status, assignee, due date, tags — linked to database row), embedded **live doc card** (synced, editable in place), table, kanban lane, timeline lane |
| Mind map | root, branches, colour per branch, collapse, auto-layout (right / both / radial), convert to outline |
| Frame / section | title tab, background, lock, hide / reveal (facilitator), slide order, presentation |
| Stamps & reactions | stamp wheel (+1, ✓, ?, ★, ♥, « Bravo », « À revoir »), temporary emotes floating ~2 s, celebrate (confetti) |
| Comment | pin with avatar or count, thread, resolve |

## 3. Facilitation (workshop)
Timer · voting session (setup → live → ranked results) · private mode (blurred cards until reveal) · summon / follow / take control · laser pointer · hide cursors · facilitator lock · outline (agenda of frames with hide / reveal) · raise hand queue · cursor chat · custom participant toolbar.

## 4. Interaction patterns
Selection handles + rotate handle · multi-select with count and align / distribute bar · lasso · smart guides (alignment lines + distance labels) · snap to grid / objects · group · lock indicator · z-order · right-click context menu · duplicate with offset · copy style · hover outline · drop-into-frame highlight · keyboard focus ring on objects (a11y) · board search with highlighted matches · frames navigator · layers tree (accessible representation) · board settings (grid dots / lines / none, snapping, background).

## 5. Wiro-specific additions (differentiators)
- Low-bandwidth indicators on media (placeholder « Charger (240 Ko) »).
- Offline badge on objects not yet synced.
- Live doc card = same ProseMirror doc rendered on canvas (ADR-0006) — two-way.
- Facilitation available on every tier, including guests on mobile.
