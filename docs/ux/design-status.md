---
title: Design status — Penpot file `wiro`
updated: 2026-11-11 (measured from Penpot via MCP, not assumed)
---

# Design status

**Coverage: 114/114 spec screens have at least one non-empty frame in Penpot (100 %).**
Counting rule: a spec ID counts as done when ≥ 1 frame named with that ID exists on its page with children. "Done" means *present*, not *reviewed*: no screen has passed the impeccable / design-reviewer gate yet, and visual rendering was spot-checked only for some (B07, S-14.1 map).
Regenerate: `tools/penpot_call.sh <inventory.js>` + `python3 tools/design_matrix.py <inventory.json>`.

## Platform decision (2026-11-11)
Desktop client + web are mandatory. Mobile/tablet = **responsive web** (390 / 768), no native apps (ADR-0015, supersedes ADR-0008). Penpot page B13 is renamed "Responsive web (390 / 768)".

## Not done / open (honest list)
- **A0 Directions** (A vs B comparison): page empty. Direction A (Malachite) is what the design system uses; the A/B choice is not recorded in an ADR.
- **B14 Prototype flows**: en construction active (voir « Prototype B14 » plus bas — F5-F11 finis, F1-F4 en cours au 2026-11-13 soir).
- **Home 390** (S-14.1 responsive): not built. S-14.2 Pricing 390 is built (XOF only).
- **Dark variants**: S-12.3–S-12.11, most of S-13 states, S-14.x marketing, S-15.2 toolbar menu, S-15.3 synthesis are light only.
- **States**: S-13.1–13.7 only have the default state (spec does not ask for more); S-15.x agent screens have no empty/loading/offline variants.
- **Library gaps**: many blocks are hand-built boards (no component): tiles, steppers, table rows, pins, skeletons. Dark frames of some screens are colour-remapped clones (library has no dark component variants).
- **Page 00 · Index**: still contains scaffolding boards `_test` and `_shell`; not cleaned (owner decision).
- **[ASSUMPTION] data**: NGN/KES prices (converted), partner tiers/directory (S-14.5), storage numbers (S-12.10), maintenance dates (S-12.11), demo content in S-07.x.
- **Name "Ubao"**: logo final in A5; no trace of the A/B naming test result.
- **Review gate** (impeccable + design-reviewer, 1366×768 and FR long strings): not run.

## Landing map (S-14.1 → section `reach-map`)
Dot-matrix world map (Natural Earth land, public domain; 3 px squares, 11 px pitch), gold ornament heat zones as stepped concentric rings (no gradients), 14 numbered pins + 2 legend rows. Cities: Dakar (launch), Abidjan, Nairobi, Accra, Lagos (market study / PRD personas); Addis-Abeba, Johannesburg, Casablanca, Paris, Londres, Bruxelles, São Paulo, Bangkok, Shanghai (maintainer request 2026-11-11; city choice per country and intensity are assumptions).

## Screen matrix (generated)
| ID | Screen | Page | Frames | Light/Dark | Viewports |
|---|---|---|---|---|---|
| S-01.1 | Shell | B01 | 7 | 6/1 | 1366,1440 |
| S-01.2 | Sidebar | B01 | 1 | 1/0 | 1440 |
| S-01.3 | Topbar | B01 | 1 | 1/0 | 1440 |
| S-01.4 | Command palette | B01 | 1 | 1/0 | 1440 |
| S-01.5 | Inbox | B01 | 1 | 1/0 | 1440 |
| S-01.6 | Sync indicator | B01 | 1 | 1/0 | 1440 |
| S-02.1 | Sign in | B02 | 7 | 7/0 | 1440 |
| S-02.2 | SSO | B02 | 4 | 4/0 | 1440 |
| S-02.3 | Magic link / code | B02 | 3 | 3/0 | 1440 |
| S-02.4 | Guest join (no account) | B02 | 3 | 2/1 | 390,1440 |
| S-02.5 | Onboarding wizard (first run, ≤ 4 steps, skippable) | B02 | 6 | 5/1 | 1440 |
| S-02.6 | Import | B02 | 5 | 4/1 | 1440 |
| S-03.1 | Home | B03 | 4 | 3/1 | 1440 |
| S-04.1 | Doc page | B04 | 2 | 2/0 | 1440 |
| S-04.2 | Slash menu | B04 | 1 | 1/0 | 1440 |
| S-04.3 | Block & text toolbars | B04 | 1 | 1/0 | 1440 |
| S-04.4 | Live canvas frame block | B04 | 6 | 5/1 | 1440 |
| S-04.5 | Page properties | B04 | 2 | 1/1 | 1440 |
| S-04.6 | Outline & focus | B04 | 4 | 2/2 | 1440 |
| S-05.1 | Board page | B05 | 5 | 4/1 | 1440 |
| S-05.2 | Main toolbar (8 default tools + More) | B05 | 1 | 1/0 | 1440 |
| S-05.3 | Quick toolbar (on selection) | B05 | 2 | 2/0 | 1440 |
| S-05.4 | Inspector (right panel) | B05 | 3 | 2/1 | 1440 |
| S-05.5 | Layers / object list (accessible tree) | B05 | 1 | 1/0 | 1440 |
| S-05.6 | Zoom, minimap, navigation | B05 | 2 | 1/1 | 1440 |
| S-05.7 | Frames & presentation | B05 | 2 | 1/1 | 1440 |
| S-05.8 | Diagram kits | B05 | 1 | 1/0 | 1440 |
| S-05.9 | Mind map | B05 | 1 | 1/0 | 1440 |
| S-06.1 | Workshop bar | B06 | 3 | 2/1 | 1440 |
| S-06.2 | Timer | B06 | 2 | 2/0 | 1440 |
| S-06.3 | Voting | B06 | 3 | 3/0 | 1440 |
| S-06.4 | Private mode | B06 | 3 | 3/0 | 1440 |
| S-06.5 | Follow / summon / raise hand / reactions | B06 | 2 | 2/0 | 1440 |
| S-06.6 | Workshop templates gallery | B06 | 2 | 1/1 | 1440 |
| S-07.1 | Table view | B07 | 4 | 3/1 | 1440 |
| S-07.2 | Kanban | B07 | 2 | 1/1 | 1440 |
| S-07.3 | Timeline (Gantt-lite) | B07 | 2 | 1/1 | 1440 |
| S-07.4 | Calendar | B07 | 2 | 1/1 | 1440 |
| S-07.5 | Record page | B07 | 2 | 1/1 | 1440 |
| S-07.6 | Meeting notes | B07 | 2 | 1/1 | 1440 |
| S-08.1 | Wiki page | B08 | 3 | 2/1 | 1440 |
| S-08.2 | Backlinks & graph | B08 | 2 | 1/1 | 1440 |
| S-08.3 | Search | B08 | 3 | 2/1 | 1440 |
| S-08.4 | Templates gallery | B08 | 2 | 1/1 | 1440 |
| S-08.5 | Trash | B08 | 3 | 2/1 | 1440 |
| S-09.1 | Share dialog (520 px) | B09 | 2 | 1/1 | 1440 |
| S-09.2 | Comments | B09 | 2 | 1/1 | 1440 |
| S-09.3 | Presence | B09 | 2 | 1/1 | 1440 |
| S-09.4 | Version history | B09 | 2 | 1/1 | 1440 |
| S-09.5 | Export / import dialog | B09 | 2 | 1/1 | 1440 |
| S-10.1 | Account | B10 | 2 | 2/0 | 1440 |
| S-10.2 | Preferences | B10 | 1 | 1/0 | 1440 |
| S-10.3 | Offline & data | B10 | 3 | 2/1 | 1440 |
| S-10.4 | Members | B10 | 4 | 3/1 | 1440 |
| S-10.5 | Roles & guests | B10 | 1 | 1/0 | 1440 |
| S-10.6 | SSO & provisioning | B10 | 1 | 1/0 | 1440 |
| S-10.7 | Audit log | B10 | 3 | 3/0 | 1440 |
| S-10.8 | Billing (fair-billing UX) | B10 | 3 | 2/1 | 1440 |
| S-10.9 | Branding (white-label) | B10 | 1 | 1/0 | 1440 |
| S-11.1 | Overview | B11 | 2 | 1/1 | 1440 |
| S-11.2 | Backups & restore | B11 | 2 | 1/1 | 1440 |
| S-11.3 | Updates | B11 | 2 | 1/1 | 1440 |
| S-11.4 | Tenants (partner multi-tenant mode) | B11 | 2 | 1/1 | 1440 |
| S-11.5 | Subscription | B11 | 2 | 1/1 | 1440 |
| S-11.6 | Integrations & config | B11 | 2 | 1/1 | 1440 |
| S-12.1 | Offline | B12 | 1 | 1/0 | 1440 |
| S-12.2 | Reconnecting / syncing | B12 | 1 | 1/0 | 1440 |
| S-12.3 | Low bandwidth | B12 | 1 | 1/0 | 1440 |
| S-12.4 | Sync error | B12 | 1 | 1/0 | 1440 |
| S-12.5 | Permission denied | B12 | 1 | 1/0 | 1440 |
| S-12.6 | Not found / deleted | B12 | 1 | 1/0 | 1440 |
| S-12.7 | Read-only / locked | B12 | 1 | 1/0 | 1440 |
| S-12.8 | Update available (desktop) | B12 | 1 | 1/0 | 1440 |
| S-12.9 | Crash recovery | B12 | 1 | 1/0 | 1440 |
| S-12.10 | Storage almost full (device) | B12 | 1 | 1/0 | 1440 |
| S-12.11 | Server maintenance | B12 | 1 | 1/0 | 1440 |
| S-12.12 | Empty states | B12 | 6 | 3/3 | 1440 |
| S-12.13 | Loading | B12 | 6 | 3/3 | 1440 |
| S-13.1 | Bottom bar: Accueil · Recherche · + (create sheet) · Boîte · | B13 | 2 | 1/1 | 390 |
| S-13.2 | Page tree as full screen list with breadcrumbs. | B13 | 2 | 1/1 | 390 |
| S-13.3 | Doc editing full (toolbar above keyboard: Aa, list, checklis | B13 | 2 | 1/1 | 390 |
| S-13.4 | Board: view, pan/zoom, add sticky/text, move, connect (basic | B13 | 2 | 1/1 | 390 |
| S-13.5 | Workshop participant view: timer, vote budget, "Ajouter une  | B13 | 2 | 1/1 | 390 |
| S-13.6 | Guest join & quick capture (share target from other apps). | B13 | 2 | 1/1 | 390 |
| S-13.7 | Canvas-first: horizontal toolbar bottom, pencil = pen, finge | B13 | 2 | 1/1 | 768 |
| S-13.8 | Split view doc | B13 | 2 | 1/1 | 768 |
| S-14.1 | Home | C | 1 | 1/0 | 1440 |
| S-14.2 | Pricing | C | 5 | 5/0 | 390,1440 |
| S-14.3 | Sovereign / Government | C | 1 | 1/0 | 1440 |
| S-14.4 | Download | C | 1 | 1/0 | 1440 |
| S-14.5 | Partners | C | 1 | 1/0 | 1440 |
| S-14.6 | Docs/Blog shell | C | 1 | 1/0 | 1440 |
| S-15.1 | Assistant panel (right panel 380, Ctrl J) | B15 | 3 | 2/1 | 1440 |
| S-15.2 | Inline AI in docs | B15 | 3 | 2/1 | 1440 |
| S-15.3 | AI on the canvas | B15 | 3 | 2/1 | 1440 |
| S-15.4 | Agent task (multi-step, visible) | B15 | 1 | 1/0 | 1440 |
| S-15.5 | Agent presence | B15 | 2 | 1/1 | 1440 |
| S-15.6 | Settings → IA (workspace admins) | B15 | 1 | 1/0 | 1440 |
| S-15.7 | Settings → Connexions MCP | B15 | 1 | 1/0 | 1440 |
| S-15.8 | Permission prompt & audit | B15 | 1 | 1/0 | 1440 |
| S-15.9 | Mobile | B13 | 3 | 2/1 | 390 |
| S-15.10 | Generate on the canvas (« Dessiner avec l'IA ») | B15 | 2 | 2/0 | 1440 |
| S-15.11 | Fill documents, templates and databases (« Remplir ») | B15 | 1 | 1/0 | 1440 |
| S-15.12 | Suggestion system — how AI proposals appear, and their N var | B15 | 1 | 1/0 | 1480 |
| S-16.1 | Marketplace (in-app, Settings → Extensions or Ctrl K « Ajout | C | 1 | 1/0 | 1440 |
| S-16.2 | Plugin detail | B16 | 2 | 1/1 | 1440 |
| S-16.3 | Install consent | B16 | 3 | 2/1 | 1440 |
| S-16.4 | Plugin running | B16 | 4 | 3/1 | 1440 |
| S-16.5 | Manage extensions (workspace admins) | B16 | 2 | 1/1 | 1440 |
| S-16.6 | Developer portal & SDK (docs site + in-app dev mode) | B16 | 2 | 1/1 | 1440 |
| S-16.7 | Publisher console (marketplace web) | B16 | 2 | 1/1 | 1440 |
| S-16.8 | Import & migration hub | B16 | 3 | 3/0 | 1440 |
| S-16.9 | Export center | B16 | 1 | 1/0 | 1440 |
| S-16.10 | Trust, certification and contribution | B16 | 1 | 1/0 | 1440 |

## Reprise (état au 2026-11-11 soir)
- **Écrans** : 114/114 IDs présents ; variantes sombres : ≈ 49 créées (lots 1 et 2, contrôle visuel partiel : 4 + 2 frames relus) ; A0 Directions construit (A vs B, non tranché) ; Home 390 construite ; page 00 · Index reconstruite ; données NGN/KES/partenaires/S-12.10-11 tranchées (règles dans specs 12 et 14).
- **Prototype (B14)** : en cours. 3 agents copient les frames par flow (propriétaires : F1–F4, F5–F8, F9–F11 — voir `docs/ux/prototype-flows.md`) puis câblent les interactions et créent les flows Penpot. À 22 h 12 : 10 frames copiées, 0 interaction, 0 flow. Les agents peuvent avoir été interrompus (onglet Penpot en veille) : **au redémarrage, relancer `s14`-like (compter frames/interactions/flows sur B14) et relancer les agents manquants** avec les mêmes consignes (copie idempotente : `EXISTS` si déjà copiée).
- **Reste après B14** : navigation transverse (sidebar/Home) + frame « Carte des parcours » ; contrôle visuel des sombres (24 non relus) ; correctifs connus (S-06.4 icônes carrées, S-10.6 chevauchement « Étape 2 sur… », S-15.8 avatars clairs, S-12.5 contrastes, icônes smartphone sur cartes Download) ; lien « Présenter » à créer par le mainteneur dans Penpot ; sessions de test (`docs/ux/prototype-test-script.md`).
- **Docs/ADR** (non commités, 2 worktrees) : ADR-0015 (responsive web, supersede 0008), ADR-0016 (MIT OR Apache-2.0), LICENSE-MIT/APACHE/NOTICE, mobile→responsive dans epics/PRD/plan, design-status, prototype-plan/flows/test-script.

## Revue de coherence — resultats 2026-11-13

### Coquilles (5 agents)
- **Corrige** : ~700 textes (espaces doubles FR, apostrophes droites, ponctuation) sur A0, B01-B11, B13 ; 1 frame vide et 6 doublons strictes supprimes ; orphelins retires.
- **Restants signales (non bloquants)** : mentions de licence « MIT » dans des maquettes marketing ; « Mobile » en pied de page ; cartes Download avec icone smartphone.

### Revue UI/UX (partielle : 00, A0-A6, B01)
- **Jetons** : `#8a5200` (warning) hors bibliotheque, present dans ~10 frames + planches A1-A4 → creer un jeton warning.
- **Contraste sombre** : badge « En revue » 2,4:1 sur S-01.4/S-01.5 Dark → remap a faire.
- **Decore** : A0 Direction A vs B construit ; statut « a trancher apres test utilisateur » pose sur la page ; `ARCHIVE` A5 et legendes orphelines = decores acceptes.

### Revue fonctionnelle (spec vs frames, 2 agents) — points rouges
1. S-14.3 Souverain sans corps (modeles de deploiement, conformite, securite, annuaire, etudes de cas).
2. S-08.1 Wiki page sans corps (couverture, titre, badge verifiee, sommaire, pages liees).
3. S-07.1 « Vide » = texte « espace vide » de S-01.2 au lieu d'une base vide.
4. S-12.10 sans liste des 3 plus gros espaces avec « Liberer ».
5. **Personal Cloud absente des pricing** → DECISION MAINTENEUR 2026-11-13 : trop tot, pas de frames ; prix provisionnes (500 XOF / 1 150 NGN / 115 KES / 0,80 EUR par membre/mois) documentes dans la spec 14 ; la carte Personal Cloud revient dans la pricing page a l'ouverture du palier (post-v1). La mention Personal Cloud ajoutee par le mainteneur dans Penpot est conservee.
6. S-15.7 sans « Clients connectes » ni snippets de config (Claude Desktop, OpenCode, Cursor, VS Code).
7. S-04.3 menu de bloc absent.
8. S-04.1 etats lecture seule/verrouille/hors ligne sans frames doc.
9. Palette de commandes : sections Pages/Parametres et etats vide/aucun resultat/hors ligne absents.
10. Votes S-06.3 : noms du panneau vs badges divergents.
11. S-10.8 Billing : factures differentes entre Light/Dark et Add seats.
+ ~30 points oranges detailles dans les rapports (terminologie « Mode faible debit » vs « economie de donnees », roles B10, versions 0.9.2/1.4.2, S-15.1 etats off/hors ligne/erreur, etc.).

### Prototype B14
- Copie en cours par 3 agents (F1-F4 / F5-F8 / F9-F11) avec la regle « clics hors zone » (ajoutee a prototype-flows.md) : clic sur le fond = avancer/revenir dans le flow ; overlay = clic pour fermer. Releves : 22 puis 81 copies ; 0 interaction et 0 flow au dernier releve.

## Revue UI/UX complete (24 pages, 2026-11-13 soir) + suivi

### Releve (lecture seule, ~461 frames)
- **Rouge (couleurs)** : textes sombre-sur-sombre dans les instances « Tree row » non remappees (B04/B08/B09/S-01.5 Dark) ; tooltips restes clairs (S-05.2 Dark, S-12.7 Dark) ; badge « En revue » `#8a5200` a 2,4:1 en dark (S-01.4/01.5/04.2/15.8/12.7) ; boutons primaires dark a texte sombre (S-16.2/16.4/16.6/16.7) ; B13 Sombre avec texte noir (S-13.2/13.3/13.6/13.7/13.8). → **agent « contrastes dark » en cours** (sources + copies B14).
- **Rouge (polices)** : « Inter » (non-Tight) dans l'UI de B06, B10, B12 (S-12.1/2/4), B16 (S-16.8/9/10), B02 (SSO/locked/magic), B05 board, B08 wiki. → **agent « polices » en cours** (sources + copies B14).
- **Orange** : doublons S-10.8-11 entre B10 et B15 (8 frames, copies cote B15 a supprimer) → script `tools/penpot/b15_fix.js` pret (supprime l'identique, signale le divergent) ; noms de frames hors convention (Light lowercase, FR/EN melange, segments manquants) → `tools/penpot/rename_frames.js` a lancer en fin de chaine ; orphelins texte racine B15 (4 etiquettes de zone, volontaires, gardees comme sur les autres pages).

### Tranches decidees (complete design-decisions.md)
- **Fraunces applicatif** : autorise pour titres de page Home et grands titres d'etats vides (moment editorial) ; interdit ailleurs que page C. Frames en l'etat, reglee par la presente.
- **« Abonnement » B10 vs B11** : les deux sont legitimes (facturation workspace vs licence serveur). Libelle B11 a renommer « Licence » en passe finale pour lever l'ambiguite de navigation.
- **S-05.1 « Board » (142 enfants) vs « Board page » (29)** : arbitrage en passe finale apres comparaison PNG ; la copie F2 utilise « Board page ».

### Prototype B14 (mesure 2026-11-13 soir)
- F5-F8 : finished (P2) — 57 frames, 489 interactions, flows nommes corrects.
- F9-F11 : finished (P3) — 51 frames, 99 interactions, flows F9/F9b/F9c/F9d/F10/F11.
- F1 : 12 frames copiees ; **flow F1 supprime par erreur (bug rename Penpot)** → P1 le recree depuis S-02.1 Sign in.
- F2 : 12/24 frames posees (Home, Proto x3, Shell x3, palette, inbox, board, toolbar) ; F2-F4 copie + cablage + flows repris par P1.
- **Pieges Penpot confirmes** : (1) `flow.name =` renomme le MAUVAIS flow — renommer = removeFlow + createFlow ; (2) chaque `addInteraction` hors flow cree un « Flow N » automatique — nettoyage en passe finale ; (3) l'onglet plugin en veille suspend toutes les sessions (retries des agents, eveil par clic humain).
- Passe finale orchestrateur (scripts prets) : `b15_fix.js` → `rename_frames.js` → `proto_map.js` (carte des parcours + liens sidebar) → consolidation flows (delete+recreate, noms exacts) → `design-status` + memoire + commit.
- **Demo partielle possible des maintenant** avec les flows F5-F11 (bases de donnees → server admin → extensions → IA → etats systeme) ; demo complete des que F2-F4 cablés.
