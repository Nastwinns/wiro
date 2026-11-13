---
id: "1.5"
slug: command-palette
title: "Command palette"
epic: EP1
sprint: S1
depends_on: ["1.2", "1.4"]
size: M
status: ready-for-dev
branch: feat/1-5-command-palette
---

# Story 1.5 — Command palette

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Les utilisateurs rapides naviguent, créent et lancent des actions au clavier en moins de 50 ms, même hors ligne.

## Dépendances (doivent être mergées dans `main` avant de commencer)
1.2 (pages à rechercher), 1.4 (badge hors ligne), 1.1 (primitives UI).

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 1.5: Command palette
>
> As a user,
> I want Ctrl/Cmd+K to navigate, create and run actions (S-01.4),
> So that I move fast.
>
> **Acceptance Criteria:**
>
> - [ ] fuzzy results < 50 ms on 5k pages locally
> - [ ] offline shows local results with badge

#### PRD — FR1.3

> - FR1.3 Command palette (Ctrl/Cmd+K): navigate, create, run actions, search.

#### UX — S-01.4 Palette de commandes (intégral)

> ## S-01.4 Command palette
> - 640 px wide, centred at 20 % from top, backdrop dim 40 %.
> - Input with placeholder "Rechercher ou lancer une action…"; sections: Récents · Pages · Actions · Personnes · Paramètres.
> - Each row: icon, label, path (muted), shortcut hint right.
> - Prefixes: `>` actions, `@` people, `#` spaces, `/` templates.
> - States: empty (recents) · no result ("Aucun résultat — créer « … »") · offline (local results only, badge).

#### UX — motif palette et raccourcis (§3 et §5)

> | Command palette | Ctrl/Cmd+K everywhere; fuzzy actions + pages + people; recent first; works offline |
>
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

#### ADR-0007 — normalisation (contexte futur)

> Recommendation (ADR-0007, **proposed**, non tranchée) : un crate de normalisation partagé (Unicode NFKD, retrait sélectif des marques combinantes, casefold, repli arabe, lettres haoussa ɓ ɗ ƙ ↔ b d k). Pour cette story on écrit un **repli minimal sans dépendance** dans `ubao-search::fold`, qui sera remplacé par le crate de l'ADR-0007 une fois décidé. ADR-0007 signale `Unicode-3.0` hors allow-list AGENTS.md : **ne pas ajouter `unicode-normalization` ni `icu_*`** ici.

#### Test de perf (AC)

> fuzzy results < 50 ms on 5k pages locally ; offline shows local results with badge

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

- `crates/ubao-search/src/{lib.rs,fold.rs,fuzzy.rs,index.rs}` (repli de casse/diacritiques, score fuzzy, index de titres en mémoire)
- `crates/ubao-search/benches/` ou `tests/perf.rs`
- `crates/ubao-wasm/` (`TitleIndex` : `upsert`, `remove`, `query(q, limit)`)
- `apps/web/src/palette/{CommandPalette.tsx,commands.ts,usePalette.ts}`
- `locales/{fr,en}/app.ftl`
- `tests/e2e/palette.spec.ts`

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/1-5-command-palette` depuis `main` à jour.

1. `ubao-search::fold(s: &str) -> String` : minuscules Unicode (`str::to_lowercase`), suppression des diacritiques latins courants par **table écrite à la main** (Latin-1 Supplement, Latin Extended-A, et caractères yoruba/wolof/haoussa : `ẹ ọ ṣ ŋ ñ ë ó à é è ê ç œ æ ɓ ɗ ƙ` + marques combinantes U+0300–U+036F supprimées) ; `ß`→`ss`. Doit être idempotent. Le texte d'origine reste affiché ; seul le texte replié sert à comparer.
2. `fuzzy::score(query_folded, title_folded) -> Option<u32>` : correspondance de sous-séquence avec bonus (début de mot, consécutifs, préfixe exact) et pénalité d'écart ; `None` si pas de sous-séquence ; tri décroissant puis par `updated_at` récent.
3. `TitleIndex` : `Vec` d'entrées {page_id, titre, titre_replié, chemin (fil d'Ariane), updated_at, kind} ; `upsert/remove` incrémentaux alimentés par les événements de l'arbre (1.2) ; `query(q, limit=20)` : parcours linéaire optimisé (pré-filtre sur les octets) — suffisant pour 5 000 pages ; documente la complexité O(n·m).
4. Actions disponibles (registre typé `commands.ts`) : « Nouvelle page » (Ctrl/Cmd+N), « Aller à l'accueil », « Basculer le thème clair/sombre », « Basculer le mode faible débit », « Ouvrir la corbeille », « Créer un espace ». Chaque action : id, libellé i18n, mots-clés, raccourci affiché, `enabled()`.
5. UI (UX S-01.4) : dialogue 640 px centré à 20 % du haut, voile 40 %, champ « Rechercher ou lancer une action… », sections **Récents · Pages · Actions · Personnes · Paramètres** (les sections vides sont masquées : Personnes/Paramètres n'ont pas de données encore) ; chaque ligne : icône, libellé, chemin atténué, raccourci à droite. Préfixes : `>` actions, `@` personnes (aucun résultat pour l'instant), `#` espaces, `/` modèles (liste statique des 5 modèles de Home 1.6, ne crée rien tant que 3.x/6.6 absents : sélection désactivée avec info-bulle). États : vide → récents ; aucun résultat → « Aucun résultat » + « Créer « <q> » » (crée la page) ; hors ligne → badge « Hors ligne : résultats locaux ».
6. A11y : motif combobox/listbox ARIA (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, options `role="option"`), piégeage du focus, Échap ferme et restitue le focus, ↑/↓ naviguent, Entrée exécute, Ctrl/Cmd+K bascule ; annonce du nombre de résultats (`aria-live="polite"`).
7. Ctrl/Cmd+K : écouteur global (pas dans un champ qui l'utilise déjà) ; fonctionne aussi dans l'éditeur futur : n'appelle pas `preventDefault` hors de ton propre raccourci.
8. Perf : test Rust `#[test]` en `--release` (`cargo test --release -p ubao-search --test perf`) sur 5 000 titres générés (mélange FR/Wolof/Yoruba) : `query` p95 < 50 ms sur 200 requêtes ; mesure aussi le temps côté UI (frappe → liste rendue) en Playwright avec 5 000 pages, seuil < 100 ms p95 (CI) / rapporte la valeur.

## Critères d'acceptation

**AC1 — Ouverture et fermeture**
- **Given** l'application ouverte
- **When** j'appuie sur Ctrl/Cmd+K puis Échap
- **Then** la palette s'ouvre avec le focus dans le champ puis se ferme en rendant le focus à l'élément précédent

**AC2 — Recherche tolérante**
- **Given** des pages « Écoute équipe », « Ẹ kú àbọ̀ » et « Atelier rétro »
- **When** je tape « ecoute », « e ku abo » puis « atlr »
- **Then** les trois pages correspondantes sont trouvées, dans cet ordre de pertinence, malgré les diacritiques/sous-séquence

**AC3 — Performance**
- **Given** 5 000 pages locales
- **When** je lance 200 requêtes
- **Then** p95 < 50 ms côté moteur (`ubao-search`) ; rapport du p95 UI

**AC4 — Hors ligne**
- **Given** le réseau coupé
- **When** j'ouvre la palette
- **Then** les résultats locaux s'affichent avec le badge « Hors ligne : résultats locaux »

**AC5 — Création depuis aucun résultat**
- **Given** une requête sans résultat
- **When** je choisis « Créer « <q> » »
- **Then** une page au titre <q> est créée dans l'espace courant et ouverte

**AC6 — Actions**
- **Given** la palette ouverte
- **When** je tape `>` puis « thème » + Entrée
- **Then** le thème bascule et la palette se ferme

## Tests à écrire
- Unitaire Rust : `fold` (table de cas FR/Wolof/Yoruba/Haoussa/Latin étendu), idempotence, `score`, tri, `TitleIndex` upsert/remove.
- Propriété (`proptest`) : `fold(fold(s)) == fold(s)` ; `fold` ne panique jamais sur une chaîne Unicode arbitraire ; si `q` est une sous-séquence de `t` alors `score(fold(q), fold(t))` est `Some`.
- Perf : `tests/perf.rs` (5 000 titres, p95 < 50 ms).
- Vitest : combobox (clavier, ARIA), préfixes, états vide/aucun résultat/hors ligne.
- Playwright e2e : AC1, AC2, AC4, AC5, AC6.
- A11y : snapshot ARIA de la palette.

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-search
cargo test --release -p ubao-search --test perf
pnpm --filter @ubao/web test
pnpm i18n:check
pnpm --filter @ubao/web exec playwright test palette
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
- Pas de `fuse.js`, `cmdk` ou autre bibliothèque de palette sans vérification de licence (MIT acceptable après `pnpm licenses:check`) ; l'algorithme de score doit être le nôtre.
- Pas de dépendance Unicode (`unicode-normalization`, `icu_*`) tant que l'ADR-0007 n'est pas tranché.
- Ne copie aucune implémentation d'algorithme de recherche floue provenant d'un projet non MIT/Apache.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Faut-il la recherche plein texte dans les contenus ici ? (non : story 8.2 ; ici titres seulement)
- Accepter la table de repli manuelle `fold` comme solution temporaire jusqu'à la décision de l'ADR-0007 ?
