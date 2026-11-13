---
id: "1.6"
slug: home
title: "Home"
epic: EP1
sprint: S1
depends_on: ["1.2", "1.4", "1.5"]
size: M
status: ready-for-dev
branch: feat/1-6-home
---

# Story 1.6 — Home

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
L'utilisateur reprend instantanément son travail depuis un accueil qui se charge depuis le stockage local.

## Dépendances (doivent être mergées dans `main` avant de commencer)
1.2 (pages, `updated_at`), 1.1 (drapeau `offline_available`), 1.4 (état hors ligne). Les tâches assignées/mentions n'existent pas encore (7.x, 4.3).

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 1.6: Home
>
> As a user,
> I want a Home with recent, for-me and templates (S-03.1),
> So that I resume work instantly.
>
> **Acceptance Criteria:**
>
> - [ ] loads from local store < 300 ms
> - [ ] offline greys pages not available offline

#### PRD — FR1.4 et FR1.5

> - FR1.4 Home: recent, assigned to me, mentions, templates, sync status.
> - FR1.5 Multi-workspace switcher; offline-available workspaces flagged.

#### UX — S-03.1 Home (intégral)

> ## S-03.1 Home
> - Greeting line (Fraunces 30 px): "Bonjour Aïcha" + date.
> - Row 1 — **Reprendre**: 4–6 recent cards (thumbnail of board or doc first lines, space, edited time, avatars).
> - Row 2 — **Pour moi**: assigned tasks (from databases, due date chips), mentions, comments awaiting reply.
> - Row 3 — **Commencer**: template chips per launch use case (Atelier rétro, Spécification produit, Réunion, Page wiki, Roadmap).
> - Right column (≥1440): upcoming meetings (from meeting-notes DB), workspace activity.
> - States: new workspace (only Commencer + invite CTA) · offline (recent available offline highlighted; others greyed "Non disponible hors ligne").
> - Acceptance: loads from local store < 300 ms.

#### UX — motifs globaux (§3)

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

#### UX — états système (S-12.12 vides, S-12.13 chargement)

> | S-12.12 | Empty states | Per screen: Fraunces title, one line, one primary action, one template |
> | S-12.13 | Loading | Skeletons per layout; canvas progressive (frames first, then details) |

#### UX — S-01.2 : disponibilité hors ligne

> Context menu (⋯): …, "Disponible hors ligne (toggle)", …
> Workspace switcher … menu: workspaces list with offline badge

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

- `apps/web/src/home/{Home.tsx,RecentCards.tsx,ForMeSection.tsx,StartChips.tsx,useHomeData.ts}`
- `crates/ubao-wasm/` (requête `recent_pages(limit)` triée par `updated_at`)
- `crates/ubao-crdt/src/page_tree.rs` (lecture seule : `recent(limit)`)
- `locales/{fr,en}/app.ftl`
- `tests/e2e/home.spec.ts`, `tests/fixtures/seed-5k.ts`

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/1-6-home` depuis `main` à jour.

1. `recent_pages(limit)` côté Rust/WASM : tri décroissant par `updated_at`, exclut la corbeille, retourne {id, title, icon, kind, space, updated_at, available_offline}.
2. `available_offline` d'une page = `workspace.offline_available` (1.1) ; la disponibilité par page individuelle arrive plus tard.
3. UI `Home` (UX S-03.1) : ligne de salutation (Fraunces 30 px, **une seule occurrence de Fraunces dans l'écran**) « Bonjour <prénom> » + date au format de la locale (`Intl.DateTimeFormat`) ; si pas de prénom (propriétaire « Moi »), affiche « Bonjour ».
4. Rangée 1 **Reprendre** : 4 à 6 cartes récentes (aperçu : icône de type grande taille sur fond `bg.subtle` en l'absence de contenu, titre, espace, « modifié il y a … » localisé, avatars des membres = « Moi »). Clic/Entrée ouvre la page. Rangée 2 **Pour moi** : sections Tâches assignées / Mentions / Commentaires à répondre, chacune avec état vide explicite (« Rien d'assigné pour l'instant ») car les bases de données et commentaires n'existent pas. Rangée 3 **Commencer** : 5 puces de modèles (Atelier rétro, Spécification produit, Réunion, Page wiki, Roadmap) ; le clic crée une page vide du bon type (rétro → Tableau, Roadmap → Tableau, autres → Doc) avec le titre du modèle ; **le contenu des modèles est hors périmètre** (stories 6.6/8.3) ; ajoute en commentaire de PR « Reporté : contenu des modèles ».
5. État « nouvel espace de travail » (aucune page) : seulement la rangée Commencer + CTA « Inviter » désactivé (« Disponible bientôt », partage = 4.4). Colonne droite ≥ 1440 px : « Réunions à venir » et « Activité » en états vides (pas de données).
6. Hors ligne : les pages dont `available_offline = false` sont **grisées** avec la mention « Non disponible hors ligne » et non ouvrables (info-bulle) ; les autres en surbrillance légère (jeton `accent.subtle`) ; le texte n'est jamais le seul indicateur (icône nuage barré + libellé).
7. Chargement : squelettes qui épousent la mise en page ; **temps de chargement < 300 ms** depuis le stockage local mesuré (de la navigation vers Home jusqu'à la première carte rendue) avec un workspace de 5 000 pages (fixture seedée), mesuré avec `performance.mark`.
8. Accessibilité : titres hiérarchiques (h1 salutation, h2 par rangée), cartes = liens avec nom accessible complet, ordre de focus logique, contrastes via tokens.
9. Responsive : à 1366×768 tout tient avec sidebar ouverte ; en dessous de 600 px les rangées passent en colonne (la vue mobile complète est EP12, ne pas la dépasser).

## Critères d'acceptation

**AC1 — Chargement rapide**
- **Given** un workspace de 5 000 pages seedé en local
- **When** j'ouvre Home (démarrage à froid de la page, stockage local)
- **Then** la première carte « Reprendre » est rendue en moins de 300 ms (médiane de 5 mesures)

**AC2 — Ordre des récents**
- **Given** des pages modifiées à des instants différents
- **When** Home s'affiche
- **Then** les cartes sont triées de la plus récente à la plus ancienne, sans pages en corbeille, 6 maximum

**AC3 — Hors ligne grisé**
- **Given** un workspace `offline_available = false` et le réseau coupé
- **When** Home s'affiche
- **Then** toutes ses pages sont grisées « Non disponible hors ligne » et ne s'ouvrent pas ; avec `offline_available = true` elles s'ouvrent

**AC4 — Nouveau workspace**
- **Given** un workspace sans page
- **When** Home s'affiche
- **Then** seule la rangée Commencer est visible avec les 5 puces ; cliquer « Atelier rétro » crée une page de type Tableau intitulée « Atelier rétro » et l'ouvre

**AC5 — États vides honnêtes**
- **Given** aucune base de données ni commentaire
- **When** la rangée Pour moi s'affiche
- **Then** chaque section affiche un état vide explicite, jamais de données factices

## Tests à écrire
- Unitaire Rust : `recent_pages` (tri, exclusion corbeille, limite).
- Vitest : `Home` (états : normal, nouveau, hors ligne, chargement), formatage de dates FR/EN, structure des titres.
- Playwright e2e : AC1 (perf, 5 000 pages seedées par script), AC3, AC4 ; capture de l'événement `performance.measure('home.firstCard')` exposé en test.
- A11y : snapshot ARIA ; navigation clavier de la rangée de cartes.
- Pas de test sur des données fictives : les tests utilisent des fixtures étiquetées.

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-crdt -p ubao-wasm
pnpm --filter @ubao/web test
pnpm i18n:check
pnpm --filter @ubao/web exec playwright test home
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
- Aucune donnée factice affichée à l'utilisateur (pas de faux avatars, fausses tâches, faux logos).
- Pas de nouvelle police ni de dégradé ; Fraunces une seule fois.
- Pas de tiret cadratin dans la copy affichée.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Contenu exact des 5 puces (libellés FR) et leur type de page par défaut : valider la proposition ci-dessus.
- Prénom de l'utilisateur local : le demander au premier lancement (1.1) ?
