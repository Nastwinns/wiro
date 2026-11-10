# 01 — App shell

Frames: `S-01.x / Desktop 1440×900` + `Laptop 1366×768` + `Dark`.

## S-01.1 Shell
- **Purpose:** stable frame for every page; maximise working surface.
- **Zones:** Sidebar (264, collapsible to 56 rail) · Topbar (48) · Main · Right panel (300, optional) · Status strip (24, optional).
- **States:** default · sidebar collapsed · focus mode (all chrome hidden, Esc returns) · offline · read-only.
- **Acceptance:** at 1366×768 with sidebar + inspector open, doc column ≥ 640 px; canvas ≥ 760 px wide.

## S-01.2 Sidebar
Top → bottom:
1. Workspace switcher (logo, name, chevron) → menu: workspaces list with offline badge, "Créer un espace de travail", settings.
2. Search button (opens S-08.3) · Inbox with unread count · Home.
3. **Favourites** (draggable).
4. **Spaces**: each space collapsible; page tree rows 28 px: icon (doc/board/database emoji or glyph), title, hover actions (+ child, ⋯). Drag to reorder/nest; drop indicator line malachite.
5. Templates · Trash.
6. Footer: user avatar + status · sync indicator mini (S-01.6) · "Inviter" button.
- **Interactions:** ↑/↓ navigate, → expand, ← collapse, Enter open, F2 rename, Del → trash (undo toast).
- **Context menu (⋯):** Renommer, Dupliquer, Déplacer vers…, Copier le lien, Disponible hors ligne (toggle), Exporter, Supprimer.
- **Empty space:** "Cet espace est vide" + "Nouvelle page" + 3 template chips.

## S-01.3 Topbar
Left: breadcrumb (space › parent › page, truncation middle). Centre: segmented **Doc | Board** toggle (only on pages). Right: presence avatars (max 5 + n), "Partager" (primary, malachite), comments toggle, history, ⋯ (page menu: export, import, page width, lock, offline, delete).
- Guest view: shows "Invité" pill and "Créer un compte" secondary.

## S-01.4 Command palette
- 640 px wide, centred at 20 % from top, backdrop dim 40 %.
- Input with placeholder "Rechercher ou lancer une action…"; sections: Récents · Pages · Actions · Personnes · Paramètres.
- Each row: icon, label, path (muted), shortcut hint right.
- Prefixes: `>` actions, `@` people, `#` spaces, `/` templates.
- States: empty (recents) · no result ("Aucun résultat — créer « … »") · offline (local results only, badge).

## S-01.5 Inbox
Right panel 380 px or full page. Tabs: Mentions · Commentaires · Assigné · Tout. Row: avatar, actor, action, page, snippet, time; hover: mark read, open. Filters: unread only. Empty: "Vous êtes à jour."

## S-01.6 Sync indicator
- Mini (sidebar footer) + detailed popover.
- States: ✓ Synchronisé · ↻ Synchronisation (n modifications) · ⏸ Hors ligne — enregistré sur cet appareil · ⚠ Erreur (retry, diagnostic) · Low-bandwidth mode on (icon leaf).
- Popover: last sync time, pending ops count, data used this week (MB), toggle "Mode faible débit", link "Paramètres hors ligne".
