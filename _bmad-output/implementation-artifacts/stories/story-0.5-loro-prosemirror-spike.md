---
id: "0.5"
slug: loro-prosemirror-spike
title: "Spike Loro + ProseMirror"
epic: EP0
sprint: S0
depends_on: ["0.1", "0.2"]
size: M
status: ready-for-dev
branch: feat/0-5-loro-prosemirror-spike
---

# Story 0.5 — Spike Loro + ProseMirror

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Prouver (ou réfuter) avant le S3 que loro-prosemirror tient la convergence, l'IME, l'annulation et les curseurs, car ADR-0003 et ADR-0006 reposent sur ce pari.

## Dépendances (doivent être mergées dans `main` avant de commencer)
0.1 (workspace pnpm). 0.2 (licences JS vérifiées).

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 0.5: Loro + ProseMirror spike
>
> As a architect,
> I want a spike proving loro-prosemirror for IME, undo and cursor mapping,
> So that we de-risk ADR-0003/0006.
>
> **Acceptance Criteria:**
>
> - [ ] two editors converge after concurrent edits incl. offline
> - [ ] FR accents and Wolof/Yoruba diacritics typed via IME are preserved
> - [ ] spike report with go/no-go and fallback written as ADR addendum

#### ADR-0003 — décision et conséquences

> ## Decision
> **Loro** (MIT, Rust-native, WASM). Rationale: rich text + movable tree (page tree, layers) + lists in one engine, compact encoding (low-bandwidth A2), history/time-travel for version history (FR6.4).
>
> ## Consequences
> - Docs editor binding via `loro-prosemirror` — younger than y-prosemirror: budget a hardening spike in S1 (IME, undo, cursor mapping).
> - Canvas elements modelled as Loro maps in a movable tree; z-order via fractional indices.
> - Snapshots + shallow snapshots for fast cold start; GC policy documented.

#### ADR-0006 — décision et conséquences

> ## Decision
> **ProseMirror**, bound to Loro via `loro-prosemirror`. Tiptap core may be used for convenience only if no paid extension is needed (licence gate).
>
> ## Consequences
> Block schema shared with `wiro-model`; custom node views for live canvas frame, database, mermaid, math.

#### Architecture §5 (sync) et risque ouvert

> ## 5. Sync & offline
> CRDT = **Loro** (ADR-0003): rich text, movable tree, maps, compact encoding, Rust + WASM, MIT. Delta compression; checkpoints; resumable upload; low-bandwidth mode drops presence frequency and media prefetch. Server is authority for permissions only, not for content merge.
>
> Open (spike, Story 0.5/S1): Loro update encoding stability across versions → pin versions and test cross-version compatibility.

#### Test strategy (architecture §13)

> ## 13. Test strategy
> | Level | Approach |
> |---|---|
> | Unit | per-crate `cargo test`, Vitest for TS chrome; coverage tracked, not gated blindly |
> | Property-based | `proptest` on model invariants, permission resolution, normalisation (ADR-0007), codecs |
> | CRDT convergence / fuzz | random concurrent op sequences across N replicas incl. offline/partition → assert identical state; `cargo-fuzz` on decoders (import formats, sync frames); cross-version update compatibility |
> | Integration | server + Postgres + MinIO via testcontainers; sync protocol conformance suite |
> | E2E | Playwright (web + Tauri WebDriver), multi-client collaboration, offline/online flips, IME/diacritics (Story 0.5) |
> | Performance | canvas bench (ADR-0004), sync load tests (k6/own harness), budgets in §16 enforced in CI on reference machines |
> | Chaos / durability | kill -9 mid-write, disk-full, network partition/latency injection (toxiproxy), restore-from-backup drills (R1) |
> | Accessibility / i18n | axe + keyboard scripts; pseudo-localisation, RTL snapshots |
> All licences of test tooling checked under the same allow-list.

#### NFR-I1 / NFR-P2 / NFR-R2 (PRD §5)

> | NFR-P2 | Input latency (type, move) | < 50 ms p95 |
> | NFR-R2 | Sync convergence | CRDT, no manual conflict resolution for text/canvas |
> | NFR-I1 | i18n | all strings externalised; +30 % text expansion tolerant; RTL-ready |

#### PRD — langues cibles (E12 + UI)

> UI languages v1: FR, EN, then AR (RTL), and Wolof/Hausa/Yoruba/Swahili as community-driven. IME composition safe in docs and canvas text (architecture §15).

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. Pas de crate Rust nécessaire. Code jetable dans `tools/spikes/loro-prosemirror/` (paquet pnpm privé, non publié). Le rapport est un **nouveau** fichier `docs/architecture/adr/0003-addendum-spike-0-5.md` (tu ne modifies pas l'ADR-0003 existant).

- `tools/spikes/loro-prosemirror/` : `package.json` (privé), `index.html`, `src/{schema.ts,editor.ts,two-peers.ts}`, `test/*.test.ts` (Vitest, sans DOM), `e2e/*.spec.ts` (Playwright Chromium)
- `pnpm-workspace.yaml` (ajouter `tools/spikes/*`)
- `docs/architecture/adr/0003-addendum-spike-0-5.md` (nouveau)
- `docs/research/spike-0-5-ime-checklist.md` (checklist manuelle IME)

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/0-5-loro-prosemirror-spike` depuis `main` à jour.

1. Installe `loro-crdt`, `loro-prosemirror`, `prosemirror-model`, `prosemirror-state`, `prosemirror-view`, `prosemirror-transform`, `prosemirror-schema-basic`, `prosemirror-keymap`, `prosemirror-history` (si nécessaire), `vite`, `vitest`, `@playwright/test`, `fast-check`. **Épingle les versions exactes** (pas de `^`) et lance `pnpm licenses:check` ; si l'un n'est pas MIT/Apache/BSD/ISC : stop, demande. Lis le `README.md` et les `.d.ts` de `loro-prosemirror` dans `node_modules` pour connaître l'API réelle (plugins de sync, d'annulation, de curseurs) ; **n'invente pas d'API**.
2. Schéma : doc → blocs `paragraph`, `heading(level 1-3)`, `bullet_list`, `list_item`, avec marques `strong`, `em`, `code`, `link`. Deux éditeurs `A` et `B` dans la même page (`index.html`), chacun avec son `LoroDoc` (peerId différent) ; un « réseau » simulé : boutons/API test `connect()`, `disconnect()` (hors ligne), échange de `doc.export({mode:'update', from: versionVector})` puis `doc.import(bytes)`.
3. Tests de convergence (Vitest, sans DOM, directement sur `LoroDoc`/arbre produit par le binding si possible) : (T1) deux répliques insèrent concurremment au même offset → états identiques ; (T2) scénario hors ligne : A et B éditent 20 opérations chacun déconnectés, puis échangent → états identiques ; (T3) fuzz : `fast-check` génère des séquences (insert/delete/format/split bloc) sur 3 répliques avec partitions aléatoires, 200 exécutions, graine fixe loggée, assertion : JSON de document identique après synchro complète ; (T4) compatibilité de format : exporte un snapshot avec la version épinglée, le réimporte (même version) et vérifie l'égalité (le test inter-versions sera ajouté quand on mettra à jour la version).
4. Tests IME/diacritiques (Playwright, Chromium, 2 pages ou 2 éditeurs) : simule la composition avec CDP (`Input.imeSetComposition`, `Input.insertText`, `compositionstart/update/end`) pour : français (`é`, `ê`, `ç`, `œ`, `à`, guillemets « »), Wolof (`ŋ`, `ñ`, `ë`, `ó`, `à`, `ñ`), Yoruba (`ẹ`, `ọ`, `ṣ` avec tons combinants `ẹ́`, `ọ̀`, séquences NFC **et** NFD), Arabe (RTL, séquence de 20 caractères). Après composition + synchro, assert : texte de B == texte de A == texte attendu **octet à octet** (compare aussi `normalize('NFC')` pour documenter les écarts), aucune perte/duplication de caractère sur 50 compositions scriptées, aucun caractère combinant orphelin.
5. Annulation : (U1) A tape « abc », B tape « xyz » ailleurs ; `undo` sur A n'annule que « abc » ; `redo` le restaure ; (U2) annulation après réception d'une édition distante dans le même paragraphe ; (U3) undo d'un changement de formatage. Utilise le plugin d'annulation de `loro-prosemirror` ; consigne tout comportement qui diffère de l'attendu.
6. Curseurs/sélections : (C1) le curseur de A reste **logiquement** au même endroit quand B insère avant lui ; (C2) la sélection de A survit à un split de paragraphe distant ; (C3) curseur distant de B affiché chez A et mis à jour (plugin de curseurs du binding). Mesure aussi la latence de frappe p95 locale sur un doc de 5 000 mots (cible NFR-P2 < 50 ms ; protocole : 200 frappes simulées, `performance.now()` avant dispatch / après rendu).
7. Checklist manuelle `spike-0-5-ime-checklist.md` : Windows (clavier FR AZERTY, touches mortes `^`+`e`), macOS (Option+e puis e ; Pinyin pour tester la composition longue), Android Gboard (Yoruba/Wolof/Arabe), iOS clavier FR ; pour chaque ligne : saisie attendue, résultat, OK/KO. Cases laissées vides pour le mainteneur ; ne les coche pas.
8. Rapport `docs/architecture/adr/0003-addendum-spike-0-5.md` : versions testées, résultats par test (tableau), mesures de latence, défauts constatés (avec repro minimal), **verdict GO / NO-GO** par axe (convergence, IME, annulation, curseurs) et **plan de repli chiffré** : (R1) petit binding maison au-dessus de `loro-crdt` (texte riche + arbre) : effort estimé en jours ; (R2) repli Yjs/y-prosemirror (MIT) + `yrs` : impact sur ADR-0003 (moteur CRDT unique, arbre déplaçable, taille d'encodage). Termine par « Décision : à prendre par le mainteneur ».

## Critères d'acceptation

**AC1 — Convergence concurrente**
- **Given** deux éditeurs hors ligne ayant chacun 20 modifications différentes, y compris dans le même paragraphe
- **When** ils se reconnectent et échangent leurs mises à jour
- **Then** les deux documents ProseMirror sont strictement identiques (JSON égal) sans intervention manuelle

**AC2 — Fuzz de convergence**
- **Given** 200 scénarios aléatoires (graine fixe) sur 3 répliques avec partitions
- **When** synchro complète
- **Then** 200/200 convergent ; en cas d'échec le test affiche la graine et le scénario minimal

**AC3 — Diacritiques par IME**
- **Given** des compositions simulées FR, Wolof, Yoruba (NFC et NFD) et Arabe
- **When** le texte est synchronisé vers l'autre éditeur
- **Then** le texte est identique octet à octet à l'attendu, sans caractère perdu, dupliqué ou combinant orphelin (50 compositions)

**AC4 — Annulation locale**
- **Given** A a tapé « abc » et B a tapé « xyz »
- **When** A annule une fois
- **Then** seul « abc » disparaît ; « xyz » reste ; refaire restaure « abc »

**AC5 — Mapping de curseur**
- **Given** le curseur de A après le mot « bonjour »
- **When** B insère « oh » au début du paragraphe
- **Then** le curseur de A reste juste après « bonjour » (même position logique)

**AC6 — Rapport**
- **Given** les tests exécutés
- **When** j'ouvre l'addendum
- **Then** il contient les versions épinglées, le tableau de résultats, un GO/NO-GO par axe, un plan de repli avec estimation, et la mention « Décision : à prendre par le mainteneur »

## Tests à écrire
- Vitest sans DOM : T1, T2, T3 (propriété `fast-check`), T4.
- Playwright : IME/diacritiques (AC3), annulation (AC4), curseurs (AC5), latence de frappe.
- Manuel : checklist IME (mainteneur).
- Aucun test ne doit dépendre de l'heure ou du réseau ; graine fixe et loggée.

## Commandes de vérification (exactes)
```bash
pnpm install --frozen-lockfile
pnpm --filter spike-loro-prosemirror test
pnpm --filter spike-loro-prosemirror exec playwright test
pnpm licenses:check
pnpm typecheck && pnpm lint
```

## Portes de qualité (toutes obligatoires ; **arrêt immédiat si l'une est rouge**, ne contourne jamais)
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
- Ne copie pas d'exemples d'éditeurs de BlockSuite/AFFiNE/tldraw ; utilise uniquement la doc et les exemples MIT de ProseMirror et loro-prosemirror (cite-les dans le rapport).
- Le code du spike est jetable : ne l'importe pas dans `apps/*`/`packages/*` ; seul le rapport et les constats sont durables.
- Ne modifie pas `docs/architecture/adr/0003-crdt-engine.md` ni `0006-*.md`.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).
- [ ] Le rapport contient un GO/NO-GO explicite par axe ; un axe NO-GO déclenche l'arrêt et la question au mainteneur avant toute story 3.x.

## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Si un axe est NO-GO : repli R1 (binding maison) ou R2 (Yjs) ? (décision d'ADR)
- Peut-on utiliser un clavier IME réel (Windows/macOS/Android) pour la checklist manuelle ?
- Autoriser l'usage de Tiptap core dans la suite (ADR-0006) ou rester sur ProseMirror brut ?
