---
id: "1.1"
slug: workspace-and-spaces
title: "Workspace & spaces"
epic: EP1
sprint: S1
depends_on: ["0.1", "0.2", "0.3", "0.4", "1.3"]
size: L
status: ready-for-dev
branch: feat/1-1-workspace-spaces
---

# Story 1.1 — Workspace & spaces

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Le fondateur crée un espace de travail avec des espaces d'équipe qui survivent à un redémarrage hors ligne, point de départ de toute l'organisation du contenu.

## Dépendances (doivent être mergées dans `main` avant de commencer)
0.3 (tokens), 0.4 (shell, sonde WASM), 1.3 (`StorageAdapter`, `ubao-storage`). Pose aussi la fondation UI (Tailwind + primitives) et l'i18n minimale réutilisées par toutes les stories suivantes.

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 1.1: Workspace & spaces
>
> As a founder (P1),
> I want to create a workspace with spaces,
> So that my team's work is organised.
>
> **Acceptance Criteria:**
>
> - [ ] created workspace persists after app restart offline
> - [ ] a space has a name, icon and members list (local until sync)

#### PRD — E1 Workspace & navigation

> ### E1 Workspace & navigation
> - FR1.1 Workspaces with spaces (team areas) and nested pages; a page is a **doc** or a **board**, switchable (doc ↔ canvas view of the same content).
> - FR1.2 Sidebar: favourites, recent, spaces tree, trash; drag to reorder; keyboard navigation.
> - FR1.3 Command palette (Ctrl/Cmd+K): navigate, create, run actions, search.
> - FR1.4 Home: recent, assigned to me, mentions, templates, sync status.
> - FR1.5 Multi-workspace switcher; offline-available workspaces flagged.

#### Architecture — modèle de données (§4)

> ## 4. Data model (simplified)
> `Workspace → Space → Page{kind: doc|board|database, crdt_doc_id}`; Doc = block tree; Board = elements (sticky, shape, connector, text, frame, image, pen, table, embed) with transforms; Database = schema + rows (each row a page). Comments, presence, permissions are separate collections. IDs: UUIDv7.

#### ADR-0003 — Loro, arbre déplaçable, snapshots

> ## Decision
> **Loro** (MIT, Rust-native, WASM). Rationale: rich text + movable tree (page tree, layers) + lists in one engine, compact encoding (low-bandwidth A2), history/time-travel for version history (FR6.4).
>
> ## Consequences
> - Docs editor binding via `loro-prosemirror` — younger than y-prosemirror: budget a hardening spike in S1 (IME, undo, cursor mapping).
> - Canvas elements modelled as Loro maps in a movable tree; z-order via fractional indices.
> - Snapshots + shallow snapshots for fast cold start; GC policy documented.

#### UX — layout (ux-spec §2) et architecture de l'information (§1)

> ## 1. Information architecture
> ```
> Workspace
>  ├─ Home (personal)
>  ├─ Inbox (mentions, comments, assignments)
>  ├─ Search (global, offline)
>  ├─ Spaces (team areas)            ← permissions boundary
>  │   └─ Pages (tree, unlimited depth)
>  │        ├─ Doc  ⇄  Board        ← same page, two views (Ctrl/Cmd+E toggles)
>  │        └─ Database (table/kanban/timeline/calendar/list views)
>  ├─ Templates
>  ├─ Trash
>  └─ Settings (me · workspace · server*)   *sovereign/admin only
> ```
> Objects are addressable by URL `/{workspace}/{space}/{page}?view=doc|board&frame=…` (deep links work offline on desktop).
>
> ## 2. Layout model (desktop / web)
> ```
> ┌──────────────────────────────────────────────────────────────────────────┐
> │ Topbar 48px: breadcrumb · page title · view toggle Doc|Board · presence · Share · ⋯ │
> ├────────────┬───────────────────────────────────────────────┬─────────────┤
> │ Sidebar    │ Main surface                                  │ Inspector / │
> │ 264px      │  Doc: centred column 720px (wide: 1040px)     │ Right panel │
> │ collapsible│  Board: full bleed canvas + floating toolbars │ 300px       │
> │ (Ctrl+\)   │                                               │ (comments,  │
> │            │                                               │ props, history)│
> ├────────────┴───────────────────────────────────────────────┴─────────────┤
> │ Status strip (optional, 24px): sync · data usage · offline · zoom        │
> └──────────────────────────────────────────────────────────────────────────┘
> ```
> Breakpoints: ≥1440 comfortable · 1366×768 **reference** (everything must fit, sidebar + inspector both open) · 1024 tablet (sidebar overlays) · ≤ 600 mobile (bottom bar, sheets).

#### UX — S-01.1 Shell

> ## S-01.1 Shell
> - **Purpose:** stable frame for every page; maximise working surface.
> - **Zones:** Sidebar (264, collapsible to 56 rail) · Topbar (48) · Main · Right panel (300, optional) · Status strip (24, optional).
> - **States:** default · sidebar collapsed · focus mode (all chrome hidden, Esc returns) · offline · read-only.
> - **Acceptance:** at 1366×768 with sidebar + inspector open, doc column ≥ 640 px; canvas ≥ 760 px wide.

#### UX — S-01.2 Sidebar (en-tête, espaces, pied)

> ## S-01.2 Sidebar
> Top → bottom:
> 1. Workspace switcher (logo, name, chevron) → menu: workspaces list with offline badge, "Créer un espace de travail", settings.
> 2. Search button (opens S-08.3) · Inbox with unread count · Home.
> 3. **Favourites** (draggable).
> 4. **Spaces**: each space collapsible; page tree rows 28 px: icon (doc/board/database emoji or glyph), title, hover actions (+ child, ⋯). Drag to reorder/nest; drop indicator line malachite.
> 5. Templates · Trash.
> 6. Footer: user avatar + status · sync indicator mini (S-01.6) · "Inviter" button.
> - **Interactions:** ↑/↓ navigate, → expand, ← collapse, Enter open, F2 rename, Del → trash (undo toast).
> - **Context menu (⋯):** Renommer, Dupliquer, Déplacer vers…, Copier le lien, Disponible hors ligne (toggle), Exporter, Supprimer.
> - **Empty space:** "Cet espace est vide" + "Nouvelle page" + 3 template chips.

#### UX — onboarding S-02.5 (étape 2 seulement)

> 2. Créer l'espace de travail: name, logo optional, team size (for templates only — never pricing).
> (Dans cette story : nom + icône. Pas de taille d'équipe, pas de modèles.)

#### UX — motifs globaux (§3) : états vides, chargement, hors ligne

> ## 3. Global patterns
> | Pattern | Rule |
> |---|---|
> | Command palette | Ctrl/Cmd+K everywhere; fuzzy actions + pages + people; recent first; works offline |
> | Slash menu | `/` in doc and in canvas text; same catalogue grouped (Basic, Media, Canvas, Database, Advanced) |
> | Quick toolbar | Appears above selection (doc text or canvas objects); ≤ 7 actions + ⋯ |
> | Inspector | Context-dependent right panel; never modal |
> | Dialogs | Only for destructive confirmation, share, import/export, settings flows; Esc closes; focus trapped |
> | Toasts | Sonner bottom-right; undo for destructive actions (10 s) instead of confirm where possible |
> | Empty states | Title (Fraunces), one sentence, one primary action, one template suggestion |
> | Loading | Skeletons matching layout; no spinners > 300 ms without text |
> | Offline | Never block; badge "Hors ligne — vos modifications sont enregistrées sur cet appareil" |
> | Read-only | Banner + disabled tools + "Demander l'accès" |
> | Errors | What happened + what to do + "Copier le diagnostic" |
> | Undo/redo | Ctrl/Cmd+Z / Shift+Z, per user, across doc & canvas |

#### UX — i18n (§8)

> ## 8. Content & i18n
> Fluent keys: `area.screen.element` (e.g. `canvas.toolbar.sticky`). FR default for francophone locales, EN otherwise; locale switch in onboarding and settings. Layouts tolerate +30 %. Dates/numbers via locale; currencies in billing.

#### DESIGN.md — règles

> ## Règles pour les agents
> 1. Jetons uniquement : aucun hex brut dans les composants.
> 2. Un seul accent (malachite) par vue. **Or** : ornement et édition Souverain uniquement ; jamais une action, un état, un favori ni un statut.
> 3. Champs, cases, radios, segments : `border.control` (≥ 3:1). `border.default`/`strong` = séparation décorative.
> 4. Texte d'avertissement : `text.warning` ; texte sur fond teinté : `text.secondary` (pas `text.muted`). Texte sur accent clair en sombre : `text.on-accent` (noir).
> 5. Cibles ≥ 32 px (44 px tactile) ; densité par l'espacement, pas par des cibles de 28 px.
> 6. Inter pour l'UI, JetBrains Mono pour le code. Fraunces : une fois par écran en app. Exception marketing (titres de page) : **à décider par le mainteneur**, non tranchée.
> 7. Pas de tiret cadratin (—) ni demi-cadratin décoratif dans la copy ; utiliser deux-points, virgule ou point.
> 8. Mots d'interface en français : Tableau (pas Board), Page, Partager.
> 9. Logo officiel : `design/exports/logo/ubao/final` (symbole Escalier). Ne jamais le redessiner ni le retaper. Wordmark : SVG, jamais du texte composé.
> 10. Sentence case, pas de majuscules d'étiquette, pas de dégradés, pas de verre, pas de cartes imbriquées.
> 11. WCAG 2.2 AA, focus visible (2 px + 2 px de décalage), `prefers-reduced-motion`.
> 12. Conçu pour 1366×768, 4 Go de RAM et réseaux lents ; tester FR + EN (+30 %).
> 13. Chaque écran livre ses états vide, chargement, hors ligne, erreur, lecture seule ; états « verrouillé » et « hors ligne » en neutre + icône.
> 14. Présence, stylo, guides, confettis : jetons `presence`, `pen`, `guide`, `celebration` ; guide jamais en rouge.

#### Pile UI

> Stack UI (ADR-0002) : React + TypeScript, **Tailwind CSS** (MIT) mappé sur les variables CSS de `@ubao/tokens`, primitives **Radix UI** (MIT) à la manière de shadcn/ui (composants copiés dans `packages/ui`, pas de dépendance à un registre externe), icônes `lucide-react` (ISC), `clsx` + `class-variance-authority` (MIT/Apache-2.0). Zéro hex en dur (DESIGN.md règle 1). Libellés d'interface en français, via clés (`t('sidebar.page.new')`), jamais en dur ; **pas de tiret cadratin « — » dans la copy affichée** (DESIGN.md règle 7) : remplace par « : » ou « , » quand le texte des specs UX en contient.

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. Préfixe de crates : **`ubao-*`** (voir story 0.1 : les dossiers `crates/wiro-*` sont renommés en `crates/ubao-*`).

- `crates/ubao-model/src/{ids.rs,workspace.rs,space.rs}` (types : `WorkspaceId`, `SpaceId` UUIDv7, `Workspace{id,name,icon,offline_available}`, `Space{id,workspace_id,name,icon,members}`, `Member{id,display_name,role}` avec `Role` = owner|admin|editor|commenter|viewer|guest)
- `crates/ubao-crdt/src/workspace_doc.rs` (document Loro du workspace : map `meta`, map `spaces`, liste `members`)
- `crates/ubao-wasm/` (expose `WorkspaceStore` à TS) ; `packages/storage` (1.3)
- `packages/ui/` (Tailwind config liée aux tokens, primitives : `Button`, `IconButton`, `TextField`, `EmojiPicker` (12 emoji fixes), `Toast` via `sonner` (MIT), `Skeleton`, `EmptyState`) + `src/i18n.ts`
- `locales/fr/app.ftl`, `locales/en/app.ftl` (clés `area.screen.element`)
- `apps/web/src/{shell/AppShell.tsx,shell/Sidebar.tsx,workspace/*}`
- `tests/e2e/workspace.spec.ts`

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/1-1-workspace-spaces` depuis `main` à jour.

1. `ubao-model` : ajoute les types ci-dessus (`serde` derive, `Display`/`FromStr` pour les ids ; **aucun I/O**). Règles : nom de workspace/espace 1 à 80 caractères après trim, Unicode NFC, interdit uniquement vide/espaces seuls ; icône = un cluster de graphèmes emoji ou un identifiant d'icône `lucide:<nom>`.
2. `ubao-crdt::WorkspaceDoc` (crate `loro`, MIT) : `create(name, icon, owner) -> Self`, `create_space(name, icon) -> SpaceId`, `rename_space`, `set_space_icon`, `list_spaces()`, `add_member`/`remove_member` (le propriétaire local « Moi » est créé automatiquement ; membres = liste locale jusqu'à la synchro, story 4.x), `export_snapshot()`, `import(bytes)`, `subscribe(callback)` pour obtenir les ops à persister. Les ops produites sont transmises à `ubao-storage` via `StorageAdapter.append` **avant** de mettre à jour l'UI (flux : commande → op CRDT → WAL → rendu).
3. `ubao-wasm` : classe `WorkspaceStore` (wasm-bindgen + `serde-wasm-bindgen`/`tsify`) : `open(adapter)`, `create_workspace(name, icon)`, `create_space(...)`, `list_spaces()`, `on_change(cb)`. Les types TS sont générés (pas de JSON écrit à la main).
4. Fondation UI : configure Tailwind pour utiliser **exclusivement** les variables `--ubao-*` (couleurs, rayons, espacements, durées issus de `@ubao/tokens`) ; crée les primitives listées avec focus visible 2 px + décalage 2 px (`component.focus-ring`), hauteur de contrôle ≥ 32 px (44 px en tactile), `prefers-reduced-motion` respecté. i18n : `@fluent/bundle` (Apache-2.0) + `@fluent/langneg` ; `t(key, args)`; locale par défaut `fr`, repli `en`, détection `navigator.language`.
5. UI : (a) premier lancement sans workspace → écran vide pleine page (EmptyState : titre Fraunces « Créez votre espace de travail », une phrase, **un** bouton principal « Créer ») avec champ nom + choix d'icône ; (b) après création : `AppShell` avec Sidebar 264 px (S-01.2 : en-tête sélecteur de workspace — menu avec la liste et « Créer un espace de travail » —, section **Espaces** avec « Nouvel espace » : champ nom + icône, **sans** arbre de pages encore), Topbar 48 px vide avec fil d'Ariane de l'espace. État d'espace vide : « Cet espace est vide » + bouton « Nouvelle page » **désactivé avec info-bulle** « Disponible bientôt » (activé par la story 1.2).
6. Persistance hors ligne : au démarrage, `WorkspaceStore.open` recharge snapshot + ops (1.3) ; aucune requête réseau. Affiche un squelette (≤ 300 ms) pendant le chargement.
7. Le sélecteur de workspace montre pour chaque workspace un badge « Hors ligne » si `offline_available` (UX S-01.2 / FR1.5) ; valeur par défaut : **vrai** sous Tauri, **faux** sur le web ; basculable par l'utilisateur plus tard (story 1.6 lit ce drapeau).
8. Accessibilité : formulaires avec `<label>`, erreurs liées par `aria-describedby`, ordre de tabulation logique, `Esc` ferme les menus, focus piégé dans les menus/popovers ; navigation clavier du sélecteur (flèches).
9. Ajoute `locales/fr/app.ftl` et `en/app.ftl` avec toutes les chaînes ; un test vérifie que **chaque clé utilisée dans le code existe en fr et en en** (script `pnpm i18n:check`).

## Critères d'acceptation

**AC1 — Création et persistance hors ligne**
- **Given** aucun workspace et le réseau coupé
- **When** je crée le workspace « Direction produit » avec l'icône 🧭 puis je ferme et relance l'application (ou recharge la page web)
- **Then** le workspace et ses espaces sont toujours là, sans aucun appel réseau (vérifié par interception Playwright)

**AC2 — Espace**
- **Given** un workspace ouvert
- **When** je crée l'espace « Atelier » avec une icône
- **Then** l'espace apparaît dans la section Espaces avec nom, icône et une liste de membres contenant « Moi » (propriétaire) ; il persiste au redémarrage

**AC3 — Validation**
- **Given** le champ nom
- **When** je saisis uniquement des espaces ou 81 caractères
- **Then** le bouton Créer est désactivé / un message d'erreur lié au champ est lu par le lecteur d'écran ; rien n'est créé

**AC4 — Crash pendant la création**
- **Given** une création en cours
- **When** le processus est tué juste après le retour de `create_space`
- **Then** après relance l'espace existe (op écrite avant retour)

**AC5 — Thème et tokens**
- **Given** l'interface affichée
- **When** je bascule `data-theme` clair/sombre
- **Then** tous les composants changent sans hex en dur (test de lint : aucune couleur `#xxxxxx` dans `apps/web/src` et `packages/ui/src` hors fichiers de tokens générés)

**AC6 — i18n**
- **Given** la locale `fr` puis `en`
- **When** je lance `pnpm i18n:check`
- **Then** aucune clé manquante ; l'interface s'affiche dans la bonne langue

## Tests à écrire
- Unitaire Rust : validation des noms (NFC, bornes, emoji), `WorkspaceDoc` (création, rename, membres), snapshot/import.
- Propriété (`proptest`) : deux répliques de `WorkspaceDoc` appliquant des renommages/créations concurrents convergent (états équivalents après échange de mises à jour).
- Intégration Rust : `WorkspaceDoc` + `SqliteWal` : crée, rouvre, retrouve (simule redémarrage).
- Vitest : composants UI (clavier, rôles ARIA, états), `t()` avec repli, script i18n.
- Playwright e2e : AC1, AC2, AC3, AC5 (web, hors ligne via `context.setOffline(true)`).
- A11y : snapshot ARIA (`toMatchAriaSnapshot`) de l'écran vide et du sélecteur ; contrôle de contraste via les tokens (story 0.3).

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-model -p ubao-crdt -p ubao-wasm
cargo build -p ubao-wasm --target wasm32-unknown-unknown --release
pnpm --filter @ubao/web build:wasm
pnpm --filter @ubao/ui test && pnpm --filter @ubao/web test
pnpm i18n:check
pnpm --filter @ubao/web exec playwright test workspace
cargo deny check && pnpm licenses:check
cargo fmt --all -- --check && cargo clippy --workspace --all-targets --all-features -- -D warnings
pnpm typecheck && pnpm lint && pnpm build
```

## Portes de qualité (toutes obligatoires ; **arrêt immédiat si l'une est rouge**, ne contourne jamais)
**Rust**
```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace
cargo deny check
```

**JS/TS**
```bash
pnpm install --frozen-lockfile
pnpm typecheck      # = pnpm -r typecheck
pnpm lint           # Biome
pnpm test           # = pnpm -r test (Vitest)
pnpm build          # = pnpm -r build
pnpm licenses:check # allow-list JS (créé par la story 0.2)
```

Rapport clean-room joint à la PR (voir story 0.2 une fois mergée) ; avant, relis la section « Interdits ».

## Interdits
- **Clean-room** : aucun code, snippet, asset, nom d'API interne ou structure de données copié de tldraw, AFFiNE, BlockSuite, Excalidraw, Miro, Collaboard, Notion ou Figma. Tu écris à partir de la spécification de cette story et de la documentation publique des crates/paquets MIT/Apache autorisés. Si tu as un doute sur l'origine d'un morceau de code : ne le garde pas, écris-le autrement et signale-le dans la PR.
- **Licences** : aucune dépendance GPL/AGPL/LGPL, Commons Clause, propriétaire (tldraw, Aceternity, React Bits, Animate UI, Slint…). Autorisées : MIT, Apache-2.0, BSD-2/3-Clause, ISC, Zlib (+ exceptions listées dans `deny.toml` après la story 0.2). Toute nouvelle dépendance : vérifier sa licence **avant** de l'ajouter (`cargo deny check licenses` / `pnpm licenses:check`) et la lister dans la PR.
- Ne pas modifier `docs/architecture/adr/**`, `AGENTS.md`, `docs/product/**` : si une décision manque, **arrête-toi et demande** (point « À demander » ci-dessous).
- Ne pas élargir ni réduire le périmètre de la story. Pas de TODO sans ticket ; tout ce qui est reporté est écrit dans la PR sous « Reporté ».
- Aucun secret dans le repo ; pas de `unwrap()`/`expect()` hors tests ; pas de `unsafe` sans commentaire `// SAFETY:` et accord du mainteneur.
- Pas de composants copiés depuis la registry shadcn/ui **sans** vérifier la licence (MIT : OK) et réécrire les couleurs vers les tokens ; pas de thème par défaut shadcn.
- Pas d'Aceternity, React Bits, Animate UI (licences interdites). Pas de bibliothèque d'icônes autre que lucide.
- Pas de fetch réseau ; pas de télémétrie.
- Aucune couleur, taille de police ou rayon en dur.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Accepter Tailwind, Radix, `lucide-react`, `sonner`, `clsx`, `class-variance-authority`, `@fluent/bundle` (toutes MIT/ISC/Apache-2.0) ?
- Le propriétaire local s'appelle-t-il « Moi » (défaut) ou demande-t-on un prénom au premier lancement ?
- Liste d'emoji/icônes par défaut pour les espaces (12 proposées) : à valider ?
