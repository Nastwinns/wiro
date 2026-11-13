---
id: "1.2"
slug: page-tree-sidebar
title: "Page tree & sidebar"
epic: EP1
sprint: S1
depends_on: ["1.1", "1.3"]
size: L
status: ready-for-dev
branch: feat/1-2-page-tree-sidebar
---

# Story 1.2 — Page tree & sidebar

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
L'utilisateur retrouve vite son travail grâce à un arbre de pages qu'il crée, imbrique, renomme, réordonne et met à la corbeille au clavier comme à la souris.

## Dépendances (doivent être mergées dans `main` avant de commencer)
1.1 (modèle, `WorkspaceDoc`, shell, primitives UI, i18n), 1.3 (persistance).

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 1.2: Page tree & sidebar
>
> As a user,
> I want to create, nest, rename, reorder and trash pages in the sidebar (S-01.2),
> So that I find my work fast.
>
> **Acceptance Criteria:**
>
> - [ ] keyboard ↑↓←→ Enter F2 Del work
> - [ ] moving a subtree keeps children (Loro movable tree)
> - [ ] trash restores within retention

#### PRD — FR1.1 et FR1.2

> - FR1.1 Workspaces with spaces (team areas) and nested pages; a page is a **doc** or a **board**, switchable (doc ↔ canvas view of the same content).
> - FR1.2 Sidebar: favourites, recent, spaces tree, trash; drag to reorder; keyboard navigation.

#### Architecture — modèle de données (§4)

> ## 4. Data model (simplified)
> `Workspace → Space → Page{kind: doc|board|database, crdt_doc_id}`; Doc = block tree; Board = elements (sticky, shape, connector, text, frame, image, pen, table, embed) with transforms; Database = schema + rows (each row a page). Comments, presence, permissions are separate collections. IDs: UUIDv7.

#### ADR-0003 — arbre déplaçable (Loro) et indices fractionnaires

> ## Decision
> **Loro** (MIT, Rust-native, WASM). Rationale: rich text + movable tree (page tree, layers) + lists in one engine, compact encoding (low-bandwidth A2), history/time-travel for version history (FR6.4).
>
> ## Consequences
> - Docs editor binding via `loro-prosemirror` — younger than y-prosemirror: budget a hardening spike in S1 (IME, undo, cursor mapping).
> - Canvas elements modelled as Loro maps in a movable tree; z-order via fractional indices.
> - Snapshots + shallow snapshots for fast cold start; GC policy documented.

#### UX — S-01.2 Sidebar (intégral)

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

#### UX — S-01.3 Topbar (fil d'Ariane)

> ## S-01.3 Topbar
> Left: breadcrumb (space › parent › page, truncation middle). Centre: segmented **Doc | Board** toggle (only on pages). Right: presence avatars (max 5 + n), "Partager" (primary, malachite), comments toggle, history, ⋯ (page menu: export, import, page width, lock, offline, delete).
> - Guest view: shows "Invité" pill and "Créer un compte" secondary.

#### UX — S-08.5 Corbeille

> ## S-08.5 Trash
> List with type, original location, deleted by/when, restore / delete forever (confirm). Retention policy shown ("Supprimé définitivement après 30 jours").

#### UX — motifs globaux (§3) dont toasts d'annulation 10 s

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

#### UX — raccourcis clavier (§5)

> ## 5. Keyboard map (core)
> | Action | Shortcut |
> |---|---|
> | Command palette | Ctrl/Cmd+K |
> | New page | Ctrl/Cmd+N |
> | Toggle Doc/Board | Ctrl/Cmd+E |
> | Search | Ctrl/Cmd+Shift+F |
> | Toggle sidebar / inspector | Ctrl/Cmd+\ / Ctrl/Cmd+. |
> | Canvas tools | V select · H hand · S sticky · T text · R rect · O ellipse · L connector · P pen · F frame · C comment |
> | Zoom | Ctrl/Cmd+= / − / 0 (100 %) / 1 (fit) / 2 (selection) |
> | Workshop | Alt+T timer · Alt+V vote · Alt+P private mode · Alt+F follow me |

#### DESIGN.md

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

- `crates/ubao-model/src/page.rs` (`PageId`, `Page{id,title,icon,kind: Doc|Board|Database,space_id,parent: Option<PageId>,created_at,updated_at,deleted_at: Option<Timestamp>}`)
- `crates/ubao-crdt/src/page_tree.rs` (arbre **Loro movable tree** par espace + map de métadonnées par nœud)
- `crates/ubao-wasm/` (méthodes `create_page`, `rename_page`, `move_page`, `trash_page`, `restore_page`, `purge_expired`, `tree(space)`)
- `apps/web/src/sidebar/{PageTree.tsx,PageRow.tsx,TrashView.tsx,usePageTree.ts}`
- `apps/web/src/shell/Topbar.tsx` (fil d'Ariane)
- `locales/{fr,en}/app.ftl`
- `tests/e2e/page-tree.spec.ts`

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/1-2-page-tree-sidebar` depuis `main` à jour.

1. `ubao-crdt::PageTree` : par espace, un `LoroTree` (arbre déplaçable, MIT) ; chaque nœud porte une map `{title, icon, kind, created_at, updated_at, deleted_at}`. API : `create(parent, index, kind, title)`, `rename`, `set_icon`, `move_to(node, new_parent, index)` (refuse les cycles : déplacer un nœud sous son descendant → `Err(WouldCycle)`), `trash(node)` (marque `deleted_at` sur la **racine du sous-arbre** et masque le sous-arbre), `restore(node)`, `purge_expired(now, retention)` (suppression définitive après la rétention), `children(parent)` triés par index fractionnaire Loro, `breadcrumb(node)`. Rétention par défaut : **30 jours** (constante `TRASH_RETENTION_DAYS = 30`, UX S-08.5 : « Supprimé définitivement après 30 jours »).
2. Déplacer un sous-arbre **conserve tous les enfants** (propriété de l'arbre déplaçable) ; une restauration depuis la corbeille remet le sous-arbre à son emplacement d'origine, ou à la racine de l'espace si le parent n'existe plus.
3. Persistance : chaque opération transite par `StorageAdapter.append` avant mise à jour de l'UI (1.3). `updated_at` est mis à jour à chaque modification de titre/déplacement (la Home 1.6 l'utilise).
4. UI `PageTree` : composant ARIA `role="tree"` / `treeitem` avec `aria-expanded`, `aria-level`, `aria-selected`, tabindex itinérant ; lignes 28 px **mais cibles ≥ 32 px** (DESIGN.md règle 5 : densité par l'espacement ; ligne 32 px) ; icône, titre, actions au survol (+ sous-page, ⋯). Clavier : ↑/↓ naviguer, → déplier (ou aller au 1er enfant), ← replier (ou aller au parent), Entrée ouvrir, F2 renommer (édition inline, Entrée valide, Échap annule), Suppr → corbeille avec toast « Page déplacée dans la corbeille » + « Annuler » (10 s), Alt+↑/↓ réordonner, Alt+→/← changer le niveau (indenter/désindenter). Souris : glisser-déposer avec ligne d'indication d'insertion (token accent) ; au pointeur seulement si le clavier propose déjà l'équivalent (menu « Déplacer vers… »).
5. Menu contextuel ⋯ (UX S-01.2) : Renommer, Dupliquer (copie le sous-arbre de métadonnées, pas le contenu pour l'instant), Déplacer vers…, Copier le lien (`/{workspace}/{space}/{page}` dans le presse-papiers), Disponible hors ligne (bascule : **drapeau d'espace de travail** pour l'instant, griser l'option avec info-bulle si web), Exporter (désactivé : « Disponible bientôt »), Supprimer.
6. Création : bouton « Nouvelle page » de l'espace vide (activé ici) et `+` de ligne ; la nouvelle page s'ouvre, le titre est en édition ; type par défaut Doc ; (choix Doc/Board via petit menu). Raccourci Ctrl/Cmd+N crée une page dans l'espace courant.
7. Topbar : fil d'Ariane espace › parent › page, troncature au milieu ; le sélecteur Doc/Board et le reste de la barre arrivent avec 3.2 (ne pas les afficher).
8. Corbeille : entrée « Corbeille » dans la sidebar → vue liste (type, emplacement d'origine, supprimé quand, Restaurer, Supprimer définitivement avec confirmation) + texte de rétention. Vide : titre, une phrase « La corbeille est vide ».
9. Performance : arbre de 5 000 pages virtualisé (fenêtrage maison, `aria-setsize`/`aria-posinset`) ; mesure le temps d'ouverture < 300 ms et la navigation clavier sans saccade (test de rendu < 16 ms par frappe de flèche sur 5 000 nœuds).
10. Chaînes i18n pour tout ; états chargement/vide/hors ligne conformes à UX §3.

## Critères d'acceptation

**AC1 — Navigation clavier**
- **Given** un arbre de pages dans la sidebar avec le focus sur une ligne
- **When** j'appuie sur ↓ ↑ → ← Entrée F2 Suppr
- **Then** le focus bouge, les nœuds se déplient/replient, la page s'ouvre, le titre devient éditable, la page part en corbeille avec un toast « Annuler » (10 s)

**AC2 — Déplacement conserve les enfants**
- **Given** une page P avec 3 sous-pages
- **When** je déplace P sous une autre page Q (souris ou Alt+→)
- **Then** P garde ses 3 enfants, l'ordre relatif est conservé ; déplacer P sous un de ses descendants est refusé avec un message

**AC3 — Corbeille et rétention**
- **Given** une page mise à la corbeille il y a 29 jours puis 31 jours (horloge simulée)
- **When** je restaure / je purge
- **Then** à 29 jours : restauration OK à l'emplacement d'origine ; à 31 jours : `purge_expired` l'a supprimée définitivement

**AC4 — Hors ligne et redémarrage**
- **Given** des pages créées/renommées/déplacées hors ligne
- **When** je redémarre l'application
- **Then** l'arbre est identique (ordre, imbrication, titres)

**AC5 — Concurrence de déplacement**
- **Given** deux répliques qui déplacent la même page vers des parents différents puis se synchronisent
- **When** elles échangent leurs mises à jour
- **Then** les deux convergent vers le même parent, sans cycle ni nœud orphelin

**AC6 — Annuler la suppression**
- **Given** une page supprimée
- **When** je clique « Annuler » dans les 10 s ou j'appuie sur Ctrl/Cmd+Z
- **Then** la page revient à sa place

## Tests à écrire
- Unitaire Rust : `PageTree` (création, ordre, cycle refusé, trash/restore, purge, breadcrumb).
- Propriété (`proptest`) : séquences aléatoires de create/move/trash/restore sur 3 répliques avec synchros aléatoires → convergence, invariants : pas de cycle, chaque nœud non supprimé a un parent existant ou la racine, indices fractionnaires ordonnés strictement.
- Vitest (testing-library) : `PageTree` clavier (toutes les touches), rôles ARIA, édition inline, virtualisation (5 000 nœuds, nœud focalisé toujours rendu).
- Playwright e2e : AC1, AC2 (souris + clavier), AC4 (reload), AC6.
- Perf : test de rendu 5 000 nœuds.
- A11y : snapshot ARIA de l'arbre ; vérifier noms accessibles (icône + titre), annonces d'expansion.

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-crdt -p ubao-model
pnpm --filter @ubao/web test
pnpm i18n:check
pnpm --filter @ubao/web exec playwright test page-tree
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
- Pas de bibliothèque d'arbre/virtualisation sous licence douteuse ; `@dnd-kit/core` (MIT) permis après `pnpm licenses:check`, sinon implémentation maison.
- Pas de contenu de page ici (éditeur = story 3.1) ; une page ouverte affiche un placeholder « Page vide ».
- Pas de tiret cadratin dans la copy affichée (DESIGN.md règle 7).

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Rétention de la corbeille : 30 jours (UX) confirmé ? Configurable par l'admin plus tard ?
- Les favoris (FR1.2) et « Récents » de la sidebar sont-ils attendus dans cette story ? (non prévus dans epics 1.2 ; défaut : non, reportés)
- Le titre par défaut d'une nouvelle page : « Sans titre » (défaut) ?
