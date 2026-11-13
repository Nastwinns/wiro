---
id: "2.5"
slug: accessible-object-list
title: "Accessible object list"
epic: EP2
sprint: S2
depends_on: ["2.3"]
size: M
status: ready-for-dev
branch: feat/2-5-accessible-object-list
---

# Story 2.5 — Accessible object list

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Un utilisateur de lecteur d'écran doit pouvoir lire, parcourir et réorganiser le tableau grâce à une liste miroir du canvas (WCAG 2.2 AA, NFR-A1).

## Dépendances (doivent être mergées dans `main` avant de commencer)
2.3 (sélection partagée, ordre Z, verrouillage) ; 2.4 recommandée pour le panneau latéral et F6.

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 2.5: Accessible object list
>
> As a screen-reader user,
> I want a layers/object list mirroring the canvas (S-05.5),
> So that the board is accessible.
>
> **Acceptance Criteria:**
>
> - [ ] tab/arrow navigation announces object type and label
> - [ ] WCAG 2.2 AA checks pass on the panel

#### PRD — NFR-A1 et FR3.8

> | NFR-A1 | Accessibility | WCAG 2.2 AA (docs, chrome, canvas object list) |
> - FR3.8 Keyboard-complete canvas (tab objects, arrows move, Enter edit) + screen-reader object list.

#### Architecture — a11y (§8)

> | A1 a11y | DOM chrome; canvas object tree mirrored to accessible DOM list |

#### UX — S-05.5 Layers / object list

> ## S-05.5 Layers / object list (accessible tree)
> Left panel tab next to page tree or right panel: frames → objects; search; visibility & lock toggles; reorder by drag; screen-reader friendly (this is the a11y representation of the canvas).

#### UX — accessibilité (§7)

> ## 7. Accessibility
> WCAG 2.2 AA. Canvas exposes an **object list** (layers panel = accessible tree) and live region announcing selection/moves. All colour-coded meaning duplicated with icon/label. Minimum text 13 px UI, 16 px docs. Reduced motion respected.

#### UX — critères canvas

> ### Canvas acceptance criteria
> - 60 fps pan/zoom at 10k objects (NFR-P1); text editing latency < 50 ms.
> - All tools reachable by keyboard; selection announced via live region.
> - Offline: everything except sharing works.

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

> Stack UI (ADR-0002) : React + TypeScript + Tailwind mappé sur les variables `--ubao-*` de `@ubao/tokens`, primitives Radix (MIT) dans `packages/ui` (créées en story 1.1), icônes `lucide-react`. Zéro hex en dur (DESIGN.md règle 1). Libellés par clés i18n (`t('canvas.toolbar.sticky')`) ; pas de tiret cadratin dans la copy affichée (DESIGN.md règle 7).

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. Préfixe de crates : **`ubao-*`** (voir story 0.1 : les dossiers `crates/wiro-*` sont renommés en `crates/ubao-*`).

- `apps/web/src/board/ObjectList/{ObjectList.tsx,ObjectRow.tsx,LiveAnnouncer.tsx,useObjectList.ts}`
- `crates/ubao-canvas/src/a11y.rs` (description textuelle d'un objet : type, libellé, couleur nommée, position Z)
- `locales/{fr,en}/app.ftl` (noms de types : « Post-it », « Texte », « Rectangle », « Ellipse », « Losange », « Triangle »)
- `tests/e2e/board-a11y.spec.ts`

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/2-5-accessible-object-list` depuis `main` à jour.

1. `ubao-canvas::a11y::describe(object) -> AccessibleName{kind_key, label, tint_key}` : libellé = texte de l'objet tronqué à 80 graphèmes, sinon le libellé d'accessibilité (inspecteur 2.4), sinon « sans libellé ». Les noms de teinte viennent du modèle (jamais la couleur seule).
2. Panneau « Objets » (onglet gauche à côté de l'arbre de pages ou panneau droit, **Ctrl/Cmd+Maj+O** pour l'ouvrir/focaliser) : liste de **tous** les objets (cadres → objets quand les cadres existeront ; ici liste à plat dans l'ordre Z), champ de recherche (filtre par libellé/type), bascules **visibilité** (œil : un objet masqué n'est pas rendu mais reste dans la liste) et **verrouillage** (cadenas), ligne = icône du type, libellé, teinte nommée, boutons ; **réordonnancement** par glisser **et** Alt+↑/↓ (modifie l'ordre Z via indices fractionnaires).
3. Motif ARIA : `role="listbox"` avec `aria-multiselectable`, options `role="option"` (`aria-selected`, `aria-setsize`, `aria-posinset`, `aria-label` = « <Type>, <libellé>, <teinte>, <n> sur <total> » + « verrouillé » si besoin), tabindex itinérant, Début/Fin, ↑/↓, Maj+↑/↓ étend la sélection, Entrée = centrer la vue sur l'objet **et** donner le focus au canvas, Suppr = supprimer (avec annulation).
4. **Miroir bidirectionnel** : sélectionner dans la liste sélectionne sur le canvas et inversement (même modèle de sélection que 2.3) ; faire défiler la liste ne change pas la sélection ; la vue du canvas suit la sélection sur demande (Entrée) pas automatiquement.
5. **Virtualisation** : 10 000 objets sans lenteur (fenêtrage maison, hauteur de ligne fixe 32 px, `aria-setsize`/`aria-posinset` pour les lignes non rendues) ; le focus ne se perd jamais lors du défilement ; temps d'ouverture < 100 ms sur 10 000 objets.
6. **Région live** : un composant `LiveAnnouncer` (`aria-live="polite"`, `aria-atomic`) annonce : sélection (« Post-it, ‹libellé›, sélectionné »), multi-sélection (« 5 objets sélectionnés »), déplacement (« Objet déplacé en position 3 sur 120 »), verrouillage, suppression (« Objet supprimé. Annuler : Ctrl Z »), création ; **anti-spam** : regroupe les annonces émises en < 300 ms, n'annonce jamais pendant un drag souris continu mais uniquement à la fin.
7. Conformité WCAG 2.2 AA du panneau : ordre de focus logique, focus visible, cibles ≥ 32 px (24 px minimum WCAG 2.5.8), contrastes via tokens, pas d'information par la couleur seule, redimensionnement du texte 200 % sans perte, `prefers-reduced-motion` ; **pas de piège clavier** (Échap/F6 sortent).
8. Tests d'accessibilité automatisés : **ne pas ajouter `axe-core`** (licence MPL-2.0) sans accord du mainteneur ; utilise les instantanés ARIA de Playwright (`toMatchAriaSnapshot`), des vérifications maison (noms accessibles non vides, `aria-setsize` cohérent, ordre de tabulation, contraste calculé depuis les tokens) et la checklist manuelle `docs/research/a11y-checklist-canvas.md` (lecteurs d'écran NVDA/VoiceOver : cases pour le mainteneur).

## Critères d'acceptation

**AC1 — Navigation et annonces**
- **Given** une liste de 20 objets de types différents
- **When** je navigue au clavier avec ↑/↓ dans la liste
- **Then** chaque option expose « Type, libellé, teinte, n sur 20 » et la région live annonce la sélection

**AC2 — Miroir de sélection**
- **Given** un objet sélectionné dans la liste puis un autre sur le canvas
- **When** je regarde les deux surfaces
- **Then** les deux reflètent toujours la même sélection ; Entrée centre la vue et donne le focus au canvas

**AC3 — Réordonnancement**
- **Given** 3 objets
- **When** j'appuie sur Alt+↑ dans la liste
- **Then** l'objet monte d'un cran dans l'ordre Z (rendu et liste cohérents), annonce « position 2 sur 3 »

**AC4 — 10 000 objets**
- **Given** 10 000 objets
- **When** j'ouvre le panneau et je parcours jusqu'à la fin avec Fin
- **Then** ouverture < 100 ms ; le focus reste visible ; `aria-posinset` = 10 000 sur la dernière ligne

**AC5 — Masquer et verrouiller**
- **Given** un objet
- **When** je clique l'œil puis le cadenas (ou touche H/L)
- **Then** l'objet disparaît du rendu puis n'est plus déplaçable ; les boutons exposent `aria-pressed`

**AC6 — WCAG 2.2 AA**
- **Given** le panneau
- **When** je lance les contrôles automatisés et la checklist
- **Then** 0 bloquant : noms accessibles, contrastes ≥ 4,5:1 (texte) et ≥ 3:1 (contrôles), pas de piège clavier, cibles ≥ 24 px

## Tests à écrire
- Unitaire Rust : `describe` (troncature graphèmes, repli, RTL), noms de teinte.
- Propriété (`proptest`) : pour toute liste d'objets, `describe` ne panique pas, la longueur du libellé ≤ 80 graphèmes, la position annoncée ∈ [1,total].
- Vitest : liste (clavier complet, `aria-*`, filtre, virtualisation avec focus), `LiveAnnouncer` (regroupement < 300 ms).
- Playwright e2e : AC1 à AC5 + `toMatchAriaSnapshot` ; perf d'ouverture sur 10 000.
- A11y : contraste calculé depuis les jetons ; checklist manuelle NVDA/VoiceOver laissée au mainteneur.

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-canvas
pnpm --filter @ubao/web test
pnpm i18n:check
pnpm --filter @ubao/web exec playwright test board-a11y
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
- N'ajoute pas `axe-core`/`jest-axe`/`@axe-core/playwright` (MPL-2.0) sans autorisation écrite du mainteneur.
- Aucune structure d'arbre d'accessibilité copiée de tldraw/Excalidraw/Miro/AFFiNE.
- Pas de tiret cadratin dans la copy affichée.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Autoriser `axe-core` en dépendance de développement uniquement (MPL-2.0, non modifié, non distribué) pour les tests ? (AGENTS.md : MPL « flagged »)
- Raccourci d'ouverture du panneau Objets : Ctrl/Cmd+Maj+O (proposé) ?
- Qui exécute la checklist NVDA/VoiceOver ?
