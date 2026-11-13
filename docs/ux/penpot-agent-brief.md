---
title: Brief agents — produire des écrans dans Penpot (fichier `wiro`)
status: v1 — 2026-11-11
---

# Contexte
Produit **Ubao** (ex-Wiro). Cible produit finale : **client lourd (Windows/macOS) + web**. **Pas d'apps natives mobile/tablette** : mobile et tablette = **web responsive** (décision 2026-11-11). Le design system (A1–A6) existe déjà dans Penpot ; on ne le modifie pas, on l'utilise.

# Accès Penpot
- `tools/penpot_call.sh <fichier.js>` exécute du JS dans le contexte plugin Penpot (MCP). Il préfixe automatiquement `tools/penpot/lib.js` (helpers : `openPage`, `board`, `rect`, `text`, `inst`, `hex`, `typo`, `comp`, `mkTheme`, `slot`, `frameName`). Le code se termine par `return …`. Écrire les scripts dans `/private/var/folders/zd/c0dffmdn4bq781jnp0h6l04w0000gn/T/opencode/<ton-nom>/`.
- Catalogue des composants/couleurs/typos disponibles : `design/penpot/library-catalog.md`. **Tokens uniquement** (via `hex("light / bg/app")` etc.), pas de hex brut. Typos : « H1/H2/H3/md/sm/xs… » (Inter Tight), Fraunces au plus une fois par écran, JetBrains Mono pour le code.
- Exemples d'écrans existants à imiter (même page B01 / B10 / B06) : lire leur structure avec `penpotUtils.shapeStructure`.
- **CONCURRENCE** : plusieurs agents écrivent dans le même fichier en même temps. L'état « page active » est global. Donc : **chaque appel commence par `const pg = await openPage("<ta page>")`**, construit **un seul frame par appel**, et ne touche **jamais** une autre page ni un frame qui n'est pas à toi. Ne supprime rien hors de tes frames. Positionne avec `slot(pg)` (grille 1600×1100, 3 par ligne) puis `await penpot.waitForLayoutUpdate()`.
- Un appel qui échoue peut laisser un frame à moitié construit : retrouve-le par nom et supprime-le avant de réessayer (pas de doublons).

# Mise à jour 2026-11-11 (à lire)
- `tools/penpot_call.sh` **sérialise** désormais tous les appels (verrou fichier) : plus de course sur la page active entre agents. Chaque appel doit tout de même commencer par `openPage(...)` et rester < 100 s (timeout MCP 120 s) : un frame (ou ≤ 6 clones) par appel.
- Si l'erreur est « plugin tab suspended » : l'onglet Penpot est en veille côté utilisateur. Attends 60 s et réessaie, jusqu'à 15 fois.
- Pas d'app native : mobile/tablette = responsive web (390 / 768). Direction A Malachite (tokens `light / …`, `dark / …`) est celle du design system.
- Dark : `tools/penpot/darken.js` (globals `PAGE`, `NAMES`) clone + remappe les couleurs light→dark par jeton. Les composants de la bibliothèque n'ont pas de variante sombre : leurs instances sont remappées aussi.
- Les frames ne peuvent pas passer d'une page à l'autre par l'API : construis sur la bonne page.

# Règles de design (DESIGN.md / brand-charter)
Malachite = seul accent d'action ; or = ornement ; sentence case ; pas de dégradés/verre/cartes imbriquées ; rayons 6/10/16 ; grille 4 px ; bordures 1 px ; ombres 1–2 max ; copie UI **en français (vouvoiement)**, clés EN dans les noms de calques ; contraste conforme.
Nommage des frames exact : `S-xx.y <Nom> / <Viewport> / <Thème> / <État>` (viewport 1440 ; 1366 si le spec l'exige ; 390 et 768 pour le responsive web).
Chaque écran : état par défaut + vide + chargement + hors-ligne + erreur/lecture seule **quand le spec le demande** (sinon ne pas inventer), clair, et **sombre pour au moins l'état par défaut**.
Chaque frame utilise des instances de composants de la bibliothèque dès qu'un composant existe (Button, Input, Badge, Toast, Tabs, Avatar, Tree row…), des boards en flex layout pour les listes/barres.

# Source de vérité
Le spec texte `docs/ux/screens/NN-*.md` + `docs/ux/ux-spec.md`. Ne construis que ce que le spec décrit ; en cas de trou, note-le dans ton rapport au lieu d'inventer.

# Vérification obligatoire avant de rendre
Pour chaque frame créé : relire via `penpotUtils.shapeStructure`, vérifier qu'il est sur la bonne page, aux bonnes dimensions, qu'il a des enfants, et qu'aucun texte n'est vide/hors cadre (`penpotUtils.isContainedIn`). Pas de supposition : liste ce que tu as **réellement lu** dans Penpot.

# Rapport final (court)
Tableau : ID du spec → noms exacts des frames créés (page, taille, nb enfants) → manques éventuels/écarts vis-à-vis du spec. N'édite aucun fichier du repo (docs, status) : la consolidation est faite par l'orchestrateur.
