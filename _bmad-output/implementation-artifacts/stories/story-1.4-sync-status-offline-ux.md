---
id: "1.4"
slug: sync-status-offline-ux
title: "Sync status & offline UX"
epic: EP1
sprint: S1
depends_on: ["1.1", "1.3"]
size: M
status: ready-for-dev
branch: feat/1-4-sync-status-offline-ux
---

# Story 1.4 — Sync status & offline UX

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Un utilisateur en connexion instable doit voir à tout moment si son travail est enregistré, en attente ou synchronisé, et continuer à travailler sans réseau.

## Dépendances (doivent être mergées dans `main` avant de commencer)
1.3 (`pending_count`, `mark_synced`), 1.1 (shell, toasts, i18n). **Aucun serveur n'existe encore** (story 4.1) : un `SyncTransport` abstrait et un transport factice servent aux tests.

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 1.4: Sync status & offline UX
>
> As a user in low connectivity (P5),
> I want to see sync state and keep working offline (S-01.6, S-12.1),
> So that I trust the app without network.
>
> **Acceptance Criteria:**
>
> - [ ] airplane mode: all editing works, badge shows offline
> - [ ] pending ops count visible; returns to synced after reconnect

#### PRD — E7 Local-first

> ### E7 Local-first, offline & low bandwidth
> - FR7.1 All workspaces marked offline are fully usable without network (read, write, search); default ON for desktop.
> - FR7.2 Every change persisted locally before sync; crash-safe (no data loss on kill -9).
> - FR7.3 Sync status indicator (synced / syncing / offline / conflict-free merge done); per-workspace data-usage meter.
> - FR7.4 **Low-bandwidth mode**: images downscaled, media on demand, compressed delta sync, presence throttled.
> - FR7.5 Peer discovery on LAN (desktop) to sync without internet [ASSUMPTION — later phase].

#### Architecture — protocole de synchro (§11)

> ## 11. Sync protocol
> Transport: WebSocket (binary frames, zstd-compressed batches), one multiplexed connection, room per document.
> 1. **Handshake**: `hello{protocol_version, client_id, auth, capabilities}` → server `welcome{server_version, limits}`; version mismatch → `426`-style close with upgrade hint.
> 2. **Join doc**: client sends Loro **version vector** of its local state; server replies with the missing updates (or a snapshot + updates if the gap is large) and its own vector; client pushes ops the server lacks. Peers then exchange incremental updates.
> 3. **Resume**: on reconnect repeat step 2 per open doc (idempotent, vector-based; no server session state required); exponential backoff + jitter.
> 4. **Backpressure**: per-room credit windows (server grants N bytes in flight); coalescing of updates (≤ 100 ms batches, longer in low-bandwidth mode); presence/cursors droppable and rate-limited; server can reply `slow_down`; oversized updates rejected with chunked upload path.
> 5. **Durability**: server ack only after WAL/DB commit; client keeps ops in local WAL until acked (R1).
> 6. **Compaction**: server snapshots + trims history by policy; shallow snapshots keep recent history for undo/version history.
> Open (spike, Story 0.5/S1): Loro update encoding stability across versions → pin versions and test cross-version compatibility.

#### UX — S-01.6 Indicateur de synchro

> ## S-01.6 Sync indicator
> - Mini (sidebar footer) + detailed popover.
> - States: ✓ Synchronisé · ↻ Synchronisation (n modifications) · ⏸ Hors ligne — enregistré sur cet appareil · ⚠ Erreur (retry, diagnostic) · Low-bandwidth mode on (icon leaf).
> - Popover: last sync time, pending ops count, data used this week (MB), toggle "Mode faible débit", link "Paramètres hors ligne".

#### UX — états système (S-12.x, fichier complet)

> # 12 — System states (apply to every screen)
>
> | ID | State | Pattern |
> |---|---|---|
> | S-12.1 | Offline | Status badge + toast once; all editing allowed; disabled: share, permission changes, AI, external embeds (placeholder with "Disponible en ligne") |
> | S-12.2 | Reconnecting / syncing | Indicator animates; pending ops count; never blocks |
> | S-12.3 | Low bandwidth | Leaf icon; images as blurred placeholders "Charger (240 Ko)"; presence throttled |
> | S-12.4 | Sync error | Banner with retry, "Copier le diagnostic", data safe message |
> | S-12.5 | Permission denied | Full-page: lock illustration (line), "Vous n'avez pas accès", "Demander l'accès" (sends request) |
> | S-12.6 | Not found / deleted | "Cette page a été supprimée" + restore (if allowed) / go home |
> | S-12.7 | Read-only / locked | Top banner, tools disabled with tooltip reason |
> | S-12.8 | Update available (desktop) | Small pill in sidebar footer → "Redémarrer pour mettre à jour"; never forced mid-session |
> | S-12.9 | Crash recovery | On restart: "Vos modifications locales ont été restaurées" (n ops) |
> | S-12.10 | Storage almost full (device) | Warning in settings + toast with "Libérer de l'espace" |
> | S-12.11 | Server maintenance | Banner with schedule; app keeps working offline |
> | S-12.12 | Empty states | Per screen: Fraunces title, one line, one primary action, one template |
> | S-12.13 | Loading | Skeletons per layout; canvas progressive (frames first, then details) |
>

#### UX — motif hors ligne (§3)

> | Offline | Never block; badge "Hors ligne — vos modifications sont enregistrées sur cet appareil" |

#### NFR-O1, NFR-B1

> | NFR-O1 | Offline | 100 % features except sharing/permissions changes & AI |
> | NFR-B1 | Bandwidth | edit session ≤ 1 MB/h idle presence; low-bandwidth mode halves media traffic |

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

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. Préfixe de crates : **`ubao-*`** (voir story 0.1 : les dossiers `crates/wiro-*` sont renommés en `crates/ubao-*`).

- `crates/ubao-sync/src/{status.rs,transport.rs,fake.rs}` (machine d'état pure + trait `SyncTransport` + `FakeTransport`)
- `crates/ubao-wasm/` (expose `SyncStatus`)
- `apps/web/src/sync/{SyncIndicator.tsx,SyncPopover.tsx,OfflineBadge.tsx,useSyncStatus.ts}`
- `apps/web/src/settings/lowBandwidth.ts` (préférence persistée)
- `locales/{fr,en}/app.ftl`
- `tests/e2e/offline.spec.ts`

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/1-4-sync-status-offline-ux` depuis `main` à jour.

1. `ubao-sync::status` (Rust pur, sans I/O) : `enum SyncState { LocalOnly, Offline, Syncing{pending:u64}, Synced{last_sync:Option<Timestamp>}, Error{kind,message} }` et `fn step(state, event) -> state'` avec `Event = NetworkUp | NetworkDown | ServerConfigured | ServerRemoved | OpsAppended(n) | OpsAcked(n) | SyncFailed(kind) | Retry | LowBandwidth(bool)`. Invariants : `pending` ne devient jamais négatif (`OpsAcked` plus grand que `pending` = saturation + compteur d'anomalie) ; `Synced` ⇔ réseau up ∧ serveur configuré ∧ pending = 0 ∧ pas d'erreur ; sans serveur configuré l'état est `LocalOnly` (jamais `Error`) ; `Error` ne masque pas `pending`.
2. `trait SyncTransport { fn connect(); fn send(ops); fn on_ack(cb); fn status() }` + `FakeTransport` (latence, pertes, déconnexions scriptables) pour les tests. **Pas de WebSocket ici.**
3. `ubao-wasm` : `SyncStatus` (observable) alimenté par `ubao-storage.pending_count()` (ops non `synced`) et les événements réseau (`window` `online`/`offline` + `FakeTransport` en test).
4. UI `SyncIndicator` (pied de sidebar, UX S-01.6) : ✓ « Synchronisé » · ↻ « Synchronisation (n modifications) » · ⏸ « Hors ligne : enregistré sur cet appareil » · ⚠ « Erreur de synchronisation » (Réessayer, Copier le diagnostic) · icône feuille si mode faible débit. **Chaque état = icône + libellé** (jamais la couleur seule, UX §7). `LocalOnly` s'affiche comme « Enregistré sur cet appareil » (style neutre, pas d'alerte).
5. Popover détaillé : dernière synchro, nombre d'ops en attente, données utilisées cette semaine (« — » tant qu'aucun serveur, avec texte explicatif), bascule « Mode faible débit » (préférence persistée localement, aucun effet réseau encore), lien « Paramètres hors ligne » (désactivé : « Disponible bientôt »).
6. Passage hors ligne : toast **une seule fois** par coupure « Vous êtes hors ligne. Vos modifications sont enregistrées sur cet appareil. » ; badge discret dans la zone d'état ; aucune fonctionnalité d'édition n'est désactivée ; seuls partager / permissions / IA / embeds externes sont désactivés avec info-bulle (S-12.1) — pas encore présents, expose un hook `useOnlineOnly()` pour les stories suivantes.
7. Retour du réseau : l'état passe à `Syncing(n)` puis `Synced` dès que `n = 0` avec le `FakeTransport` ; annonce `aria-live="polite"` à chaque changement d'état (texte de l'état).
8. Erreur de synchro (S-12.4) : bannière avec « Réessayer », « Copier le diagnostic » (JSON sans contenu de document : version, état, pending, derniers codes d'erreur, `request_id` fictif) et la phrase « Vos données sont en sécurité sur cet appareil. »
9. Récupération après crash : branche le toast de 1.3 « Vos modifications locales ont été restaurées (n opérations) » ici s'il n'existe pas encore.

## Critères d'acceptation

**AC1 — Mode avion**
- **Given** un document ouvert et le réseau coupé (Playwright `setOffline(true)`)
- **When** je crée une page, renomme, déplace
- **Then** toutes les actions fonctionnent ; le badge affiche « Hors ligne : enregistré sur cet appareil » ; un seul toast est apparu

**AC2 — Compteur en attente**
- **Given** 5 opérations locales en attente et un transport factice hors ligne
- **When** l'indicateur est ouvert
- **Then** il affiche « Synchronisation (5 modifications) » ou l'état hors ligne avec « 5 en attente » dans le popover

**AC3 — Retour du réseau**
- **Given** les 5 opérations en attente
- **When** le réseau revient et le transport factice acquitte
- **Then** le compteur descend à 0 et l'état devient « Synchronisé » ; l'annonce live est émise une fois

**AC4 — Erreur**
- **Given** un échec de synchro simulé
- **When** j'ouvre la bannière
- **Then** « Réessayer » relance le transport ; « Copier le diagnostic » place un JSON sans contenu de document dans le presse-papiers ; le message rassure sur les données

**AC5 — Pas de serveur**
- **Given** aucun serveur configuré
- **When** l'application démarre
- **Then** l'état est `LocalOnly` « Enregistré sur cet appareil », jamais « Erreur »

**AC6 — Accessibilité de l'indicateur**
- **Given** les 5 états
- **When** je les parcours au lecteur d'écran/clavier
- **Then** chaque état a icône + texte, le déclencheur est focalisable, Échap ferme le popover et rend le focus

## Tests à écrire
- Unitaire Rust : table de transitions complète (chaque état × chaque événement).
- Propriété (`proptest`) : pour toute séquence d'événements, invariants (pending ≥ 0, `Synced` ⇒ pending = 0 ∧ réseau up ∧ serveur configuré, `LocalOnly` si pas de serveur, jamais de panique).
- Vitest : composants (5 états, aria-live, clavier), préférence faible débit persistée.
- Playwright e2e : AC1, AC3 (avec transport factice injecté via `window.__ubaoTest`), AC5.
- Contrôle d'accessibilité : snapshot ARIA de l'indicateur ; pas d'information par la couleur seule.

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-sync
pnpm --filter @ubao/web test
pnpm i18n:check
pnpm --filter @ubao/web exec playwright test offline
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
- Aucune connexion réseau réelle, aucun WebSocket, aucun serveur (story 4.1).
- N'affiche jamais « Synchronisé » sans serveur configuré.
- Pas de tiret cadratin dans la copy affichée.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).


## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Sans serveur, afficher « Enregistré sur cet appareil » (LocalOnly, défaut) est-il acceptable, ou veux-tu « Hors ligne » même sans serveur ?
- Le mode faible débit : simple préférence pour l'instant (défaut) ?
