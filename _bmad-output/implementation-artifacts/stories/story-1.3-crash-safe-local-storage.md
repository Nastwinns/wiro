---
id: "1.3"
slug: crash-safe-local-storage
title: "Crash-safe local storage"
epic: EP1
sprint: S1
depends_on: ["0.1", "0.2", "0.4"]
size: L
status: ready-for-dev
branch: feat/1-3-crash-safe-storage
---

# Story 1.3 — Crash-safe local storage

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
L'utilisateur ne doit jamais perdre une modification : chaque opération CRDT est écrite durablement sur l'appareil avant tout autre effet (NFR-R1, FR7.2).

## Dépendances (doivent être mergées dans `main` avant de commencer)
0.1, 0.2 (licences : `rusqlite` bundled), 0.4 (shell Tauri pour les commandes natives ; le web fonctionne sans). **À faire en premier dans S1** : 1.1, 1.2, 1.4 et 1.6 en dépendent.

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 1.3: Crash-safe local storage
>
> As a user,
> I want every change written locally before anything else,
> So that I never lose work.
>
> **Acceptance Criteria:**
>
> - [ ] kill -9 during typing loses 0 committed ops on replay
> - [ ] restore test runs in CI on desktop and web (OPFS)

#### Architecture — flux de données et durabilité

> Data flow: user input → command → CRDT op → **local WAL write (IndexedDB/OPFS on web, SQLite on desktop)** → render → sync queue → server → broadcast → merge on peers.
>
> 5. **Durability**: server ack only after WAL/DB commit; client keeps ops in local WAL until acked (R1).

#### Architecture §8 — tactique R1

> | R1 no data loss | WAL before ack, fsync on desktop, crash-recovery replay, chaos tests |

#### PRD — E7 Local-first

> ### E7 Local-first, offline & low bandwidth
> - FR7.1 All workspaces marked offline are fully usable without network (read, write, search); default ON for desktop.
> - FR7.2 Every change persisted locally before sync; crash-safe (no data loss on kill -9).
> - FR7.3 Sync status indicator (synced / syncing / offline / conflict-free merge done); per-workspace data-usage meter.
> - FR7.4 **Low-bandwidth mode**: images downscaled, media on demand, compressed delta sync, presence throttled.
> - FR7.5 Peer discovery on LAN (desktop) to sync without internet [ASSUMPTION — later phase].

#### PRD — NFR-R1/O1 (§5)

> | NFR-R1 | Data durability | zero loss on crash; restore tests in CI |
> | NFR-O1 | Offline | 100 % features except sharing/permissions changes & AI |

#### ADR-0003 — conséquences (snapshots)

> ## Consequences
> - Docs editor binding via `loro-prosemirror` — younger than y-prosemirror: budget a hardening spike in S1 (IME, undo, cursor mapping).
> - Canvas elements modelled as Loro maps in a movable tree; z-order via fractional indices.
> - Snapshots + shallow snapshots for fast cold start; GC policy documented.

#### ADR-0005 — le stockage client reste SQLite

> - Desktop client local store remains SQLite (client-side, not server) — unaffected.

#### ADR-0008 — stockage mobile (OBSOLÈTE : superseded by ADR-0015, pas de stockage natif mobile ; seul le chemin OPFS/IndexedDB du web reste)

> Storage: SQLite native (A) / OPFS + IndexedDB fallback (B/C) behind `wiro-storage` trait; request persistent storage (`navigator.storage.persist()`) and warn on eviction risk.

#### Test strategy — chaos/durabilité (§13)

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

#### UX — crash recovery (S-12.9) et stockage presque plein (S-12.10)

> | S-12.9 | Crash recovery | On restart: "Vos modifications locales ont été restaurées" (n ops) |
> | S-12.10 | Storage almost full (device) | Warning in settings + toast with "Libérer de l'espace" |

## Chemins et crates concernés
Structure de référence : `docs/architecture/project-structure.md`. Préfixe de crates : **`ubao-*`** (voir story 0.1 : les dossiers `crates/wiro-*` sont renommés en `crates/ubao-*`).

- `crates/ubao-storage/` : `src/{lib.rs,wal.rs,sqlite.rs,memory.rs,snapshot.rs}`, `tests/crash.rs`, `tests/bin/crash_writer.rs` (binaire de test)
- `crates/ubao-crdt/` : (lecture seule ici) seulement le type `OpBytes = Vec<u8>` et `DocId` viennent de `ubao-model`
- `packages/storage/` (nouveau paquet TS `@ubao/storage` : interface `StorageAdapter`, `WebStorage` OPFS+IndexedDB, `TauriStorage`, suite de conformité) — **à ajouter à la structure du projet**
- `apps/desktop/src-tauri/src/storage.rs` (commandes `storage_append`, `storage_load`, `storage_checkpoint`)
- `tests/e2e/storage-crash.spec.ts` (Playwright)
- `docs/architecture/storage-format.md` (nouveau, 1 page : schéma SQLite, format d'enregistrement, versions)

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/1-3-crash-safe-storage` depuis `main` à jour.

1. `ubao-model` : si absents, ajoute `DocId(Uuid)` (UUIDv7 via crate `uuid` avec feature `v7`, MIT/Apache) et `Seq(u64)`.
2. `ubao-storage` : définis le trait `Wal` : `append(&mut self, doc: DocId, op: &[u8]) -> Result<Seq>` (**retourne uniquement après écriture durable** : fsync / `synchronous=FULL`), `replay(&self, doc: DocId, after: Seq) -> impl Iterator<Item=Result<(Seq,Vec<u8>)>>`, `checkpoint(&mut self, doc: DocId, snapshot: &[u8], upto: Seq)` (remplace atomiquement l'historique ≤ upto par un snapshot), `last_acked(&self, doc)->Seq`, `mark_synced(&mut self, doc, upto: Seq)` (pour 1.4), `pending_count(&self)->u64`.
3. `SqliteWal` (crate `rusqlite` features `bundled`, MIT) : `PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON;` ; tables `ops(doc BLOB, seq INTEGER, op BLOB, crc32 INTEGER, synced INTEGER DEFAULT 0, PRIMARY KEY(doc,seq))`, `snapshots(doc BLOB PRIMARY KEY, upto INTEGER, data BLOB, crc32 INTEGER)`, `meta(key TEXT PRIMARY KEY, value)` (`schema_version`). Chaque `append` dans une transaction `IMMEDIATE`. À l'ouverture : vérifie `schema_version`, `PRAGMA integrity_check` (échec → erreur explicite `Corrupt`, jamais de suppression silencieuse), recalcule les CRC des dernières entrées. CRC32 : crate `crc32fast` (MIT/Apache).
4. `MemoryWal` (tests et web fallback logique) + **suite de conformité** `ubao_storage::conformance::run(make_wal)` (fonction publique réutilisée par les tests de chaque implémentation).
5. Test de crash Rust : binaire `crash_writer` qui ouvre une base temporaire, boucle `append` d'opérations numérotées de 1 à N (payload pseudo-aléatoire seedé de 64 à 4 096 octets), et **après chaque append réussi** écrit `ACK <seq>` sur stdout (flush). Le test parent lance le processus, lit stdout, le tue en SIGKILL (`Child::kill()`) à un instant aléatoire (graine loggée) entre 50 ms et 500 ms, puis rouvre la base et vérifie : toutes les opérations `ACK` sont rejouées dans l'ordre et sans trou, aucune opération corrompue, `integrity_check` = ok. Répète 50 fois (20 en CI).
6. `TS StorageAdapter` (`packages/storage`) : `append(doc, bytes): Promise<Seq>` (résout après durabilité), `load(doc): Promise<{snapshot?: Uint8Array, ops: Uint8Array[]}>`, `checkpoint(...)`, `pendingCount()`, `markSynced(...)`. Implémentations : `TauriStorage` (via `invoke` des commandes de `src-tauri/src/storage.rs`, qui encapsulent `SqliteWal` dans un `Mutex`, chemin = dossier de données de l'application) ; `WebStorage` : OPFS dans un **Worker dédié** avec `FileSystemSyncAccessHandle` (`write` + `flush()` avant de résoudre), journal append-only par document avec enregistrements `[len u32][crc32 u32][seq u64][payload]` et reprise qui **tronque** au dernier enregistrement valide ; repli IndexedDB (`durability: 'strict'`) si OPFS indisponible ; appelle `navigator.storage.persist()` au premier lancement et expose `persisted: boolean`.
7. Suite de conformité TS (mêmes scénarios que Rust, mêmes vecteurs dans `tests/fixtures/storage-vectors.json`) exécutée contre `MemoryStorage`, `WebStorage` (Playwright) et un `TauriStorage` simulé.
8. Test de crash web (Playwright + CDP) : lance Chromium comme processus (`chromium.executablePath()`, `--remote-debugging-port=0`, `--user-data-dir=<tmp>`), `connectOverCDP`, la page écrit 500 opérations numérotées en notant chaque ack dans `window.__acks`, le test lit `__acks` périodiquement et envoie `SIGKILL` au processus navigateur à un instant aléatoire, relance sur le même `user-data-dir`, recharge la page, `load()` et vérifie que toutes les ops acquittées avant le kill sont présentes et ordonnées.
9. Récupération au démarrage : au lancement, `ubao-storage` expose `RecoveryReport { docs: n, replayed_ops: n, truncated_bytes: n }` ; l'UI affiche le toast « Vos modifications locales ont été restaurées (n opérations) » **uniquement si** `replayed_ops > 0` après un arrêt non propre (drapeau `clean_shutdown` dans `meta`, mis à faux au démarrage, vrai à la fermeture propre).
10. Stockage presque plein : `StorageEstimate` (`navigator.storage.estimate()` / espace disque Tauri) ; si usage > 90 % du quota expose un événement `storage_low` (l'UI sera faite en 1.4) ; ne supprime rien automatiquement.
11. Écris `docs/architecture/storage-format.md` (schéma, version, règles de migration : toute évolution = nouvelle `schema_version` + migration testée).

## Critères d'acceptation

**AC1 — kill -9 pendant la frappe (desktop)**
- **Given** un processus écrivant des opérations et affichant `ACK n` après chaque append
- **When** je le tue en SIGKILL à un instant aléatoire puis je rouvre la base
- **Then** toutes les opérations jusqu'au dernier `ACK` sont rejouées dans l'ordre, sans trou ni corruption (0 opération acquittée perdue)

**AC2 — kill -9 (web, OPFS)**
- **Given** la page web a acquitté k opérations
- **When** le processus navigateur est tué (SIGKILL) puis relancé sur le même profil
- **Then** `load()` renvoie au moins les k opérations acquittées, ordonnées ; un enregistrement partiel final est tronqué sans erreur

**AC3 — Corruption détectée**
- **Given** une base dont un enregistrement a un CRC faux
- **When** j'ouvre la base
- **Then** une erreur `Corrupt` explicite est retournée (ou l'enregistrement final partiel est tronqué si c'est la queue) ; aucune donnée valide antérieure n'est supprimée

**AC4 — Checkpoint atomique**
- **Given** un document de 1 000 opérations
- **When** je fais `checkpoint(upto=900)` puis je tue le processus en plein checkpoint (point d'injection de panne)
- **Then** après réouverture : soit l'ancien état complet, soit le nouvel état complet ; jamais un mélange

**AC5 — Test de restauration en CI**
- **Given** la CI de la PR
- **When** les jobs de crash s'exécutent sur Linux (desktop + web) et macOS/Windows (desktop)
- **Then** les 3 plateformes passent ; le job web tourne sur Linux

## Tests à écrire
- Unitaire Rust : suite de conformité contre `SqliteWal` et `MemoryWal` ; CRC ; migration de `schema_version`.
- Propriété (`proptest`) : pour toute séquence d'`append`/`checkpoint`/`mark_synced` suivie d'une réouverture, `replay` == modèle en mémoire (le modèle est la spécification).
- Intégration Rust : crash avec SIGKILL x50 (`tests/crash.rs`), `integrity_check`.
- Injection de panne : feature de test `failpoints` interne (simple variable d'env lue en test) pour couper entre `INSERT` et `COMMIT` et pendant `checkpoint`.
- Vitest : sérialisation des enregistrements OPFS, troncature du dernier enregistrement partiel (fuzz : tronquer à tous les offsets).
- Playwright : crash web (AC2) ; `persist()` appelé.
- Chaos disque plein : tâche documentée + test Rust avec limite `PRAGMA max_page_count` → `append` retourne `StorageFull`, rien n'est acquitté à tort.

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-storage
cargo test -p ubao-storage --test crash -- --nocapture
cargo deny check
pnpm --filter @ubao/storage test
pnpm --filter @ubao/web exec playwright test storage-crash
cargo fmt --all -- --check && cargo clippy --workspace --all-targets --all-features -- -D warnings
pnpm typecheck && pnpm lint && pnpm licenses:check
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
- Ne contourne jamais `fsync` / `synchronous=FULL` pour « accélérer » ; si la latence d'append dépasse 20 ms p95, mesure et signale au mainteneur plutôt que de relâcher la durabilité.
- Aucun `unwrap()` sur I/O ; aucune suppression silencieuse de données corrompues.
- Pas d'ORM ; SQL écrit à la main avec paramètres liés (jamais de concaténation).

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).
- [ ] Test de crash vert 3 fois de suite en CI (flakiness = échec).

## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- Chemin des données desktop (dossier d'app par défaut Tauri OK ?) et chiffrement local (NFR/FR9.4 : « server + local », story 9.6 plus tard) : rien à faire ici sauf confirmation.
- Si la latence d'append SQLite FULL dépasse 20 ms p95 sur le poste de référence : accepter `synchronous=NORMAL` avec WAL (risque documenté) ou grouper les écritures ?
- Ajouter `packages/storage` à la structure du projet ?
