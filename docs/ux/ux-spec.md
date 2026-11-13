---
title: UX specification — foundations
status: draft v0.1 (BMAD UX phase)
created: 2026-11-10
inputs: PRD v0.1, brand-charter.md, tokens.json, competitive-audit.md
---

# UX spec — foundations

## 1. Information architecture
```
Workspace
 ├─ Home (personal)
 ├─ Inbox (mentions, comments, assignments)
 ├─ Search (global, offline)
 ├─ Spaces (team areas)            ← permissions boundary
 │   └─ Pages (tree, unlimited depth)
 │        ├─ Doc  ⇄  Board        ← same page, two views (Ctrl/Cmd+E toggles)
 │        └─ Database (table/kanban/timeline/calendar/list views)
 ├─ Templates
 ├─ Trash
 └─ Settings (me · workspace · server*)   *sovereign/admin only
```
Objects are addressable by URL `/{workspace}/{space}/{page}?view=doc|board&frame=…` (deep links work offline on desktop).

## 2. Layout model (desktop / web)
```
┌──────────────────────────────────────────────────────────────────────────┐
│ Topbar 48px: breadcrumb · page title · view toggle Doc|Board · presence · Share · ⋯ │
├────────────┬───────────────────────────────────────────────┬─────────────┤
│ Sidebar    │ Main surface                                  │ Inspector / │
│ 264px      │  Doc: centred column 720px (wide: 1040px)     │ Right panel │
│ collapsible│  Board: full bleed canvas + floating toolbars │ 300px       │
│ (Ctrl+\)   │                                               │ (comments,  │
│            │                                               │ props, history)│
├────────────┴───────────────────────────────────────────────┴─────────────┤
│ Status strip (optional, 24px): sync · data usage · offline · zoom        │
└──────────────────────────────────────────────────────────────────────────┘
```
Breakpoints: ≥1440 comfortable · 1366×768 **reference** (everything must fit, sidebar + inspector both open) · 1024 tablet (sidebar overlays) · ≤ 600 mobile (bottom bar, sheets).

## 3. Global patterns
| Pattern | Rule |
|---|---|
| Command palette | Ctrl/Cmd+K everywhere; fuzzy actions + pages + people; recent first; works offline |
| Slash menu | `/` in doc and in canvas text; same catalogue grouped (Basic, Media, Canvas, Database, Advanced) |
| Quick toolbar | Appears above selection (doc text or canvas objects); ≤ 7 actions + ⋯ |
| Inspector | Context-dependent right panel; never modal |
| Dialogs | Only for destructive confirmation, share, import/export, settings flows; Esc closes; focus trapped |
| Toasts | Sonner bottom-right; undo for destructive actions (10 s) instead of confirm where possible |
| Empty states | Title (Fraunces), one sentence, one primary action, one template suggestion |
| Loading | Skeletons matching layout; no spinners > 300 ms without text |
| Offline | Never block; badge "Hors ligne — vos modifications sont enregistrées sur cet appareil" |
| Read-only | Banner + disabled tools + "Demander l'accès" |
| Errors | What happened + what to do + "Copier le diagnostic" |
| Undo/redo | Ctrl/Cmd+Z / Shift+Z, per user, across doc & canvas |

## 4. Interaction principles (from audit)
1. Speed is the feature (NFR-P*): optimistic UI everywhere, no blocking network calls on edit.
2. Structure tames chaos: frames, outline, minimap, search across docs+boards.
3. Progressive disclosure: default toolbar = 8 tools; the rest in "More" and command palette.
4. Guests are first-class: no account, name + colour, clear limits.
5. Fair billing UX: show who is billed, never auto-upgrade, preview cost before adding seats.
6. Same mental model doc ⇄ board: blocks become cards on the board; frames embed in docs.

## 5. Keyboard map (core)
| Action | Shortcut |
|---|---|
| Command palette | Ctrl/Cmd+K |
| New page | Ctrl/Cmd+N |
| Toggle Doc/Board | Ctrl/Cmd+E |
| Search | Ctrl/Cmd+Shift+F |
| Toggle sidebar / inspector | Ctrl/Cmd+\ / Ctrl/Cmd+. |
| Canvas tools | V select · H hand · S sticky · T text · R rect · O ellipse · L connector · P pen · F frame · C comment |
| Zoom | Ctrl/Cmd+= / − / 0 (100 %) / 1 (fit) / 2 (selection) |
| Workshop | Alt+T timer · Alt+V vote · Alt+P private mode · Alt+F follow me |

## 6. Responsive & devices
- Desktop app (Tauri): native menus, tray sync indicator, file drop, offline by default.
- Web: same UI; install as PWA; "offline available" per workspace opt-in.
- Tablet (responsive web): canvas-first, stylus via pointer events, sidebar as overlay.
- Mobile (responsive web): view + comment + stickies + quick notes + vote in workshops; full doc editing; board editing basic (stickies, text, move, connectors).

## 7. Accessibility
WCAG 2.2 AA. Canvas exposes an **object list** (layers panel = accessible tree) and live region announcing selection/moves. All colour-coded meaning duplicated with icon/label. Minimum text 13 px UI, 16 px docs. Reduced motion respected.

## 8. Content & i18n
Fluent keys: `area.screen.element` (e.g. `canvas.toolbar.sticky`). FR default for francophone locales, EN otherwise; locale switch in onboarding and settings. Layouts tolerate +30 %. Dates/numbers via locale; currencies in billing.

## 9. Screen index
See `docs/ux/screens/` — each screen has an ID (`S-xx.y`), Penpot frame name, states and acceptance criteria. Order of production in Penpot: `docs/ux/penpot-handoff.md`.

| File | Screens |
|---|---|
| 01-app-shell.md | S-01.1 shell · .2 sidebar · .3 topbar · .4 command palette · .5 inbox · .6 sync indicator |
| 02-auth-onboarding.md | S-02.1 sign in · .2 SSO · .3 magic link · .4 guest join · .5 onboarding wizard · .6 import |
| 03-home.md | S-03.1 home |
| 04-doc-editor.md | S-04.1 doc · .2 slash menu · .3 block toolbar · .4 live frame block · .5 page properties · .6 outline/focus |
| 05-canvas.md | S-05.1 board · .2 toolbar · .3 quick toolbar · .4 inspector · .5 layers · .6 minimap/zoom · .7 frames & presentation · .8 diagram kits · .9 mind map |
| 06-workshop.md | S-06.1 workshop bar · .2 timer · .3 voting · .4 private mode · .5 follow/summon · .6 templates |
| 07-databases-planning.md | S-07.1 table · .2 kanban · .3 timeline · .4 calendar · .5 record page · .6 meeting notes |
| 08-knowledge-search.md | S-08.1 wiki page · .2 backlinks · .3 search · .4 templates gallery · .5 trash |
| 09-collaboration.md | S-09.1 share dialog · .2 comments · .3 presence · .4 version history · .5 export/import dialog |
| 10-settings-admin.md | S-10.1 account · .2 preferences · .3 offline & data · .4 members · .5 roles & guests · .6 SSO · .7 audit log · .8 billing · .9 branding |
| 11-server-admin.md | S-11.1 server overview · .2 backups · .3 updates · .4 tenants · .5 subscription/licence · .6 integrations |
| 12-system-states.md | S-12.x offline, sync, errors, empty, permissions, update, crash recovery |
| 13-mobile-tablet.md | S-13.x responsive web adaptations (phone 390 / tablet 768 in the browser; no native apps) |
| 14-marketing-site.md | S-14.x landing, pricing, sovereign, download, partners, docs |
