# 04 — Doc editor

## S-04.1 Doc page
- Header: optional cover (image or "Fil" motif tint), icon, title (32 px Inter semibold; Fraunces only for wiki cover pages), properties row (collapsed by default), "Ajouter une description".
- Body: 720 px column (toggle wide 1040), doc type 16/1.6, block spacing 4 px, headings H1 30, H2 24, H3 20.
- Left gutter on hover: drag handle ⋮⋮ + "+" (opens slash menu below).
- Right margin: comment markers aligned to blocks.
- Footer: backlinks count (opens S-08.2), last edited by/time.
- States: empty page ("Commencez à écrire, ou appuyez sur / pour les commandes" + template chips) · loading skeleton · read-only · locked page (banner) · offline · conflict-merged notice (subtle, dismissible).

## S-04.2 Slash menu
- 320 × max 420 popover; search field implicit (typed text); groups: Basique · Listes · Médias · Tableau blanc · Base de données · Avancé.
- Row: icon 20, label, description muted, shortcut. Keyboard ↑↓ Enter Esc.
- Items include **"Cadre de tableau blanc"** (live frame), "Nouveau tableau blanc lié", "Diagramme Mermaid", "Base de données (vue tableau/kanban/chronologie)".

## S-04.3 Block & text toolbars
- Text selection toolbar: Turn into ▾ · B I U S code · link · colour/highlight (canvas palette) · comment · @mention · AI (if enabled) · ⋯.
- Block menu (handle click): Turn into, Duplicate, Move to, Copy link to block, Comment, Delete, Colour.

## S-04.4 Live canvas frame block
- Embeds a frame from any board, rendered by the Rust canvas engine inside the doc.
- Default height 420, resizable; hover header: frame name, board link, "Ouvrir dans le tableau", "Modifier ici" (enters inline canvas mode: mini toolbar), "Actualiser l'aperçu" (only when offline asset missing).
- Click-through: double-click enters edit; Esc returns to doc.
- States: frame deleted ("Ce cadre n'existe plus" + restore) · no permission · offline-not-available.

## S-04.5 Page properties
Expandable rows: owner, status (select), tags, dates, people, verified (wiki), custom. "+ Propriété". Same component as database properties (S-07.5).

## S-04.6 Outline & focus
- Outline in right panel: H1–H3 tree, current section highlighted, click to scroll.
- Focus mode: hide sidebar/topbar, typewriter scrolling option, word count bottom.
- Find & replace (Ctrl/Cmd+F / H) bar top of column: match count, case, whole word, replace one/all.
