# 05 — Canvas (board)

Canvas surface = `bg.canvas`; dot grid 24 px at 4 % opacity (toggle: dots / lines / none). Rendering by Rust/WASM engine; chrome in TS.

## S-05.1 Board page
- Full bleed under topbar; floating UI only:
  - **Main toolbar** left-centre vertical (desktop) / bottom-centre horizontal (tablet): see S-05.2.
  - **Quick toolbar** above selection (S-05.3).
  - **Zoom & minimap** bottom-right (S-05.6).
  - **Workshop bar** top-centre when workshop active (S-06.1).
  - Inspector right panel on demand (S-05.4).
- Board empty state: centred card "Tableau vide" + buttons: Ajouter un post-it · Choisir un modèle · Importer une image/PDF; hint "Double-cliquez n'importe où pour écrire".
- Perf HUD (dev flag): fps, objects, memory.

## S-05.2 Main toolbar (8 default tools + More)
Select (V) · Hand (H) · Sticky (S, long-press = colour) · Text (T) · Shapes (R, flyout: rect, ellipse, diamond, triangle, star, cylinder, cloud) · Connector (L, flyout: straight, elbow, curved) · Pen (P, flyout: pen, highlighter, eraser) · Frame (F) · **More** (Image, Table, Mind map, Comment pin, Templates, Diagram kits, Embed doc card).
- Tool states: hover tooltip with shortcut; active = malachite fill; locked tool (double-click) shows lock dot.
- Width 44, buttons 36, gap 4, radius 10, shadow 2.

## S-05.3 Quick toolbar (on selection)
Contextual, ≤ 7 controls: fill colour (8 canvas tints + custom) · stroke · text size/style · alignment · connector style/arrowheads · lock · comment · ⋯ (group, z-order, duplicate, copy style, create frame from selection, convert to mind map, export selection).
Multi-select shows count + align/distribute.

## S-05.4 Inspector (right panel)
Sections: Position & size (x, y, w, h, rotation, lock ratio) · Fill · Stroke · Text · Connector · Frame (name, background, slide order) · Data (linked database item) · Accessibility (alt text, label). Empty selection → board settings (background, grid, snapping, default sticky colour).

## S-05.5 Layers / object list (accessible tree)
Left panel tab next to page tree or right panel: frames → objects; search; visibility & lock toggles; reorder by drag; screen-reader friendly (this is the a11y representation of the canvas).

## S-05.6 Zoom, minimap, navigation
Bottom-right cluster: zoom % (click → menu: 50/100/200, fit, selection), − / +, minimap toggle (180×120 with viewport rectangle draggable). Navigation: wheel = pan (trackpad) / zoom with Ctrl; space+drag = pan; pinch on touch.

## S-05.7 Frames & presentation
- Frame: title tab top-left, resize handles, background optional; frames list in left panel (reorder = slide order).
- Presentation mode: full screen, frame by frame (←/→), laser (hold L), "Follow me" auto; presenter notes in a small window (desktop).

## S-05.8 Diagram kits
Library panel (More → Diagram kits): Flowchart (process, decision, start/end, document, data), Wireframe kit (desktop/mobile UI components in grey-scale, ink/stone), Org chart, Swimlanes, Cloud/infra icons (generic, no brand logos). Drag to canvas; smart connectors snap to ports.

## S-05.9 Mind map
Create from sticky or text (Tab child, Enter sibling); auto-layout left/right/radial; collapse branches; convert to doc outline and back.

### Canvas acceptance criteria
- 60 fps pan/zoom at 10k objects (NFR-P1); text editing latency < 50 ms.
- All tools reachable by keyboard; selection announced via live region.
- Offline: everything except sharing works.
