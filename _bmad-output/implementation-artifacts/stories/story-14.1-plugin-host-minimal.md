---
id: "14.1"
slug: plugin-host-minimal
title: "Plugin host, manifest & permissions (version minimale)"
epic: EP14
sprint: S4
depends_on: ["0.1", "0.2", "0.3"]
size: L
status: ready-for-dev
branch: feat/14-1-plugin-host-minimal
---

# Story 14.1 — Plugin host, manifest & permissions (version minimale)

> Fichier **autonome** : tout le contexte utile est copié ci-dessous. Ne pars pas à la chasse dans le repo ; lis seulement les chemins listés. Ce que cette story ne dit pas, tu ne l'inventes pas : tu demandes (section « À demander au mainteneur »).

## Pourquoi
Un code tiers ne doit jamais pouvoir lire en dehors de la portée qui lui est accordée : le noyau de sécurité de l'extensibilité doit exister avant tout plugin.

## Dépendances (doivent être mergées dans `main` avant de commencer)
0.1, 0.2, 0.3 seulement : l'hôte est testé avec des **interfaces injectées** (`PagesApi`, `StorageApi`, `AuditSink`) et des plugins de test. Le câblage aux stores réels et l'installation avec consentement relèvent de 14.3. Parallélisable avec S1/S2.

## Contexte copié des documents sources

#### Story d'origine (epics.md)

> ### Story 14.1: Plugin host, manifest & permissions
>
> As a maintainer,
> I want a sandboxed plugin host (iframe client, WASM component server) with a typed manifest and a permission broker,
> So that third-party code cannot read outside its granted scope.
>
> **Acceptance Criteria:**
>
> - [ ] manifest schema (JSON Schema) validated at install; undeclared permission = denied
> - [ ] iframe `sandbox="allow-scripts"`, strict CSP, no network unless allow-listed
> - [ ] a plugin cannot read pages outside its granted scope (sandbox tests)
> - [ ] crashing plugin is isolated; kill switch and audit events exist

#### ADR-0010 — options, recommandation, conséquences (statut : proposed)

> ## Options
> 1. **Client sandboxed iframes + typed SDK (postMessage RPC)** for UI plugins, blocks and canvas widgets — the model used by Figma/Penpot plugins; mature browser isolation; works in Tauri WebView.
> 2. **WebAssembly components (WASI 0.2, component model) on the server** for importers/exporters, jobs, webhooks — capability-based, language-agnostic, runs in `wasmtime` (Apache-2.0 WITH LLVM-exception).
> 3. Native Rust dynamic libraries — fastest, but unsafe for third-party code; rejected.
> 4. JS on the server (Deno/QuickJS) — simpler for authors, weaker isolation story and extra runtime; possible later for "scripts".
> 5. MCP servers as extension points for AI tools/connectors — already planned (FR8.3).
>
> ## Recommendation (to decide)
> **1 + 2 + 5** combined, one manifest format (`ubao-plugin.toml`/JSON): declared permissions, network allow-list, scopes; packages signed (Sigstore/cosign) with SBOM; marketplace = static, mirrorable index (OCI registry or signed JSON index) so air-gapped deployments can host a private mirror. Templates/themes are data-only packages.
>
> ## Consequences
> - New crates: `ubao-plugin-host` (server, wasmtime), `ubao-plugin-sdk` (Rust/WIT), `@ubao/plugin-sdk` (TS, generated types from the same schema as the public API/OpenAPI).
> - Security work: permission broker, CSP for plugin iframes (`sandbox="allow-scripts"`, no same-origin), rate limits, kill switch, audit events, fuzz/sandbox-escape tests.
> - Licence gate: plugin SDKs MIT; marketplace shows each plugin's licence; public listing requires an OSI licence or explicit proprietary flag (filterable).
> - Paid plugins / revenue share: deferred (ADR-0009 billing entity).

#### ADR-0010 — addendum : permissions, tiers, SDK (extrait utile)

> Pipeline : manifest and permission lint, SBOM (CycloneDX), licence allow-list, dependency advisories, sandbox/escape tests, size and performance budget. Package `.ubx` = manifest + payload (WASM or JS bundle) + SBOM + Sigstore signature bound to the publisher identity. Permission increase on update requires re-consent. Revocation list and kill switch are synced and enforced offline.
> Semver with a 12-month API compatibility window (architecture §9).
>
> Open questions: 1. Human-review capacity … 2. Which non-Rust languages … (hors périmètre de cette story).

#### UX — plugins : types d'extension et principes (16-plugins-marketplace.md)

> ## Extension types
> | Type | Examples | Runs where |
> |---|---|---|
> | Templates & kits | workshop templates, diagram kits, icon packs | data only (no code) |
> | UI plugins | panel in sidebar/right panel, command palette actions, slash commands, quick-toolbar actions | sandboxed iframe (TS) with typed SDK |
> | Blocks & canvas widgets | custom doc block (chart, map, form), canvas widget (poll, timer variant, Kanban card from Jira) | sandboxed iframe rendering inside a host frame |
> | Server extensions | importers/exporters, webhooks handlers, scheduled jobs, custom auth hooks | WASM component (WASI) in the server, capability-based |
> | Connectors & AI tools | MCP servers exposed to the assistant, data sources | MCP (see 15-ai-agents.md) |
> | Themes | brand themes on tokens (white-label) | tokens JSON |
>
> ## Principles
> - **Manifest + permissions** declared up front (read page, write page, read board, write board, network domains allow-list, storage, current user identity, AI). Shown before install; revocable; least privilege; no network unless declared.
> - **Signed packages** (Sigstore) with publisher identity; verified badge for reviewed publishers; SBOM and licence shown (MIT/Apache/BSD/ISC… licence filter).
> - **Sovereign mode**: admins allow-list plugins, mirror the marketplace offline (air-gapped bundle), disable public marketplace, pin versions.
> - **Offline-first**: installed plugins are cached and work offline unless they declare network needs.
> - Plugins never block core flows; a crashing plugin is isolated with « Désactiver » toast.

#### UX — S-16.4 Plugin running

> ## S-16.4 Plugin running
> - Sidebar section « Extensions » + right panel host with plugin header (name, permissions shield, ⋯ settings, close).
> - Canvas widget example (poll widget, Jira card); doc block example (chart from database).
> - Command palette actions contributed by plugins (labelled with plugin name).

#### UX — critère d'acceptation du bloc plugins

> Acceptance: install in ≤ 3 clicks with explicit consent; uninstall removes data access instantly; sovereign admins can run with zero outbound marketplace traffic; a malicious plugin cannot read pages outside granted scope (sandbox tests).

#### PRD — FR8.4

> - FR8.4 **Extension system** (ADR-0010): sandboxed plugins with declared permissions; first-party **mandatory plugins** (all importers and exporters above) are signed, bundled in every release including the air-gapped bundle, and work offline on local files.

#### Architecture — sécurité (§6) et API (§9)

> ## 6. Security
> TLS everywhere; encryption at rest (server: envelope encryption with KMS/CMK; client: OS keychain-protected key on desktop); RBAC enforced server-side + signed capability tokens for guest links; audit log; SBOM + signed releases (Sigstore); `cargo deny` licence/advisory gate; CSP strict on web.
>
> ## 9. API
> - REST/JSON over HTTPS, **OpenAPI 3.1** generated from Rust types (`utoipa`, MIT/Apache) and published with the server; typed TS client generated from it. Realtime = WebSocket (§11), not REST.
> - Versioning: path prefix `/v1`; additive changes only within a major; deprecation header + 12-month window; webhooks versioned by payload `version` field.
> - Resources: workspaces, spaces, pages, blobs, comments, members, permissions, audit, search, webhooks, plugins (§18), AI/MCP tokens (§19), tenants (§20, partner mode only). Cursor pagination (`?cursor=&limit=`), `If-Match`/ETag on metadata, idempotency keys on POST.
> - Errors: RFC 9457 `application/problem+json` (`type`, `title`, `status`, `detail`, `code`, `request_id`); stable machine codes; no internal details.
> - Rate limits per token/IP with `Retry-After`; payload caps; all inputs validated at the edge.

#### Périmètre de cette version minimale (décidé dans cette story)

> **Inclus** : plugins `kind: "ui"` (panneau iframe) ; schéma de manifeste ; courtier de permissions ; RPC postMessage ; isolement (sandbox, CSP, battement de cœur, interrupteur d'arrêt, révocation) ; événements d'audit vers une interface ; tests d'évasion. **Exclus (stories ultérieures)** : hôte WASM serveur (`wasmtime`), `.ubx` signés Sigstore (14.4), marketplace/consentement (14.3), SDK/CLI (14.2), blocs et widgets de canvas (`kind` `block`, `canvas-widget`, `server` sont **valides dans l'énumération mais refusés à l'installation avec l'erreur `kind_not_supported`**).

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
Structure de référence : `docs/architecture/project-structure.md`. **Nouveaux** (à ajouter à `docs/architecture/project-structure.md`) : `crates/ubao-plugin-host` (manifeste + modèle de permissions, nom imposé par ADR-0010), `packages/plugin-schema` (JSON Schema + fixtures partagés), `packages/plugin-host` (hôte iframe TypeScript). Préfixe de crates `ubao-*` (story 0.1).

- `packages/plugin-schema/{manifest.schema.json,permissions.md,fixtures/manifests/{valid,invalid}/*.json,fixtures/broker/*.json}`
- `crates/ubao-plugin-host/src/{lib.rs,manifest.rs,permissions.rs,broker.rs,audit.rs,revocation.rs}` + `tests/conformance.rs`
- `packages/plugin-host/src/{host.ts,sandbox.ts,rpc.ts,broker.ts,heartbeat.ts,audit.ts,api.ts}` (+ `test/`)
- `packages/plugin-host/test-plugins/{good,evil-fetch,evil-parent,evil-scope,evil-loop,evil-spoof}/` (plugins de test)
- `apps/web/src/plugins/PluginPanel.tsx` (panneau hôte S-16.4 minimal : en-tête nom, bouclier de permissions, ⋯, fermer ; toast « Désactiver »)
- `tests/e2e/plugin-sandbox.spec.ts`
- `docs/architecture/plugin-host.md` (modèle de menace, 1 page)

## Tâches (dans cet ordre)
Crée d'abord la branche `feat/14-1-plugin-host-minimal` depuis `main` à jour.

1. **Schéma de manifeste** `packages/plugin-schema/manifest.schema.json` (JSON Schema 2020-12) : `id` (reverse-DNS, regex `^[a-z0-9]+(\.[a-z0-9-]+)+$`), `name`, `version` (semver), `ubao_api` (plage semver compatible), `publisher{name,id}`, `license` (SPDX), `kind` ∈ `ui|block|canvas-widget|server`, `entry` (chemin relatif `.html`/`.js`, sans `..`, sans schéma), `permissions` : tableau d'objets `{name, reason}` où `name` ∈ `pages.read | pages.write | board.read | board.write | storage | identity.read | network | ai` ; si `network` est présent : `network.allow` = liste de domaines (hôtes exacts ou `*.exemple.org`, **pas de `*` seul**, pas d'IP, `https` seulement) ; `additionalProperties: false` partout ; taille max du manifeste 64 Ko. Documente le sens de chaque permission dans `permissions.md` (langage simple, c'est ce que 14.3 affichera).
2. **Fixtures partagées** : ≥ 12 manifestes valides et ≥ 25 invalides (id mal formé, permission inconnue, `network` sans `allow`, `allow:['*']`, `entry` avec `..`, additionalProperties, version non semver, `kind` inconnu…), et des scénarios du courtier `fixtures/broker/*.json` `{manifest, grants, request, expected}`. **Les mêmes fixtures sont exécutées par Rust et par TypeScript** ; toute divergence casse la CI.
3. **Rust `ubao-plugin-host`** (deps : `serde`, `serde_json`, `semver`, `thiserror`, `jsonschema` avec `default-features = false` — vérifier licences) : `Manifest::parse_and_validate(&str) -> Result<Manifest, ManifestError>` (validation par le schéma embarqué via `include_str!` + règles supplémentaires), `Permission` enum, `Grant{plugin_id, permission, scope}` avec `Scope` ∈ `Pages(Vec<PageId>)` | `Space(SpaceId)` | `Workspace` | `None`, `Broker::decide(&self, plugin_id, &Request) -> Decision` (`Allow` | `Deny(Reason)`) : **une permission non déclarée dans le manifeste est refusée** ; une permission déclarée mais non accordée est refusée ; une ressource hors portée est refusée ; `network` n'autorise que les domaines listés ET accordés ; plugin révoqué (`RevocationList`) = tout refusé. `AuditEvent` (`plugin.loaded|permission_denied|crashed|killed|revoked`) avec `plugin_id`, `time`, `detail` **sans contenu de page**.
4. **TS `packages/plugin-host`** (deps : `ajv` (MIT) + `ajv-formats`, `semver` (ISC)) : `PluginHost.load(manifest, payload, grants)` crée une `<iframe sandbox="allow-scripts">` (**jamais** `allow-same-origin`, ni `allow-top-navigation`, ni `allow-forms`/`allow-popups`) avec `srcdoc` construit par l'hôte : `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-<n>'; style-src 'nonce-<n>'; img-src data: blob:; font-src data:; connect-src <domaines accordés ou 'none'>; frame-src 'none'; base-uri 'none'; form-action 'none'">` ; le JS du plugin est injecté inline avec le nonce (le nonce est aléatoire `crypto.getRandomValues`, 128 bits, par chargement) ; l'attribut `referrerpolicy="no-referrer"`, `allow=""` (aucune Permissions Policy).
5. **RPC** : poignée de main par `MessageChannel` : l'iframe envoie `{type:'ubao:ready'}` à `window.parent` ; l'hôte vérifie `event.source === iframe.contentWindow` (l'origine est `null` en sandbox) puis transfère `port2` ; toute communication ultérieure passe **par le port** (JSON-RPC 2.0 : `{id,method,params}` → `{id,result|error}`), jamais par `window.postMessage` global. Méthodes v1 : `host.hello`, `pages.list`, `pages.read(id)`, `pages.update(id, patch)`, `storage.get/set/delete` (espace de clés **par plugin**, quota 1 Mo), `identity.current` (id pseudonyme + nom d'affichage seulement). Chaque appel : validation de schéma des paramètres, décision du courtier, audit, **limitation de débit 100 requêtes/s par plugin** (`rate_limited`), taille de message ≤ 1 Mo, timeout hôte 10 s. Réponses d'erreur stables : `permission_denied`, `scope_denied`, `invalid_params`, `rate_limited`, `not_found`, `plugin_revoked`.
6. **Isolement** : battement de cœur (`host.ping` toutes les 2 s, 3 manquants ⇒ `crashed`) ; un plugin planté ou bloqué est retiré du DOM, un toast « <nom> ne répond plus » avec bouton « Désactiver » apparaît (UX S-16.4), le reste de l'application **n'est pas affecté** ; **interrupteur d'arrêt** `host.kill(pluginId, reason)` (immédiat, détruit l'iframe, ferme le port, refuse toute nouvelle requête) ; `RevocationList::is_revoked` consultée à chaque chargement et chaque requête, **liste fournie localement** (fonctionne hors ligne, source de synchro = 14.4) ; événements d'audit émis vers `AuditSink` (interface ; implémentation en mémoire + `console` en dev ; le journal chaîné est 9.4).
7. **Interface `PagesApi`** injectée : `list(scope)`, `read(id)`, `update(id, patch)` ; l'hôte **filtre** par portée **avant** d'appeler `PagesApi` (jamais de fuite puis masquage).
8. **Plugins de test** (dans `test-plugins/`, JS simple, sans dépendance) : `good` (utilise `pages.read` accordé), `evil-fetch` (tente `fetch('https://example.com')`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon`), `evil-parent` (accède à `window.parent.document`, `top.location`, `parent.localStorage`), `evil-scope` (lit une page hors portée, demande une permission non déclarée, tente `storage` d'un autre plugin), `evil-loop` (`while(true){}`), `evil-spoof` (envoie des faux messages `ubao:ready` depuis un 2e iframe ou `window.postMessage`).
9. **Panneau hôte minimal** `PluginPanel` (UX S-16.4) : en-tête avec nom, bouclier de permissions (liste en langage simple), ⋯ (Désactiver), fermer ; zone iframe ; pas d'installation ni de marketplace.
10. Écris `docs/architecture/plugin-host.md` : modèle de menace (attaquants : plugin malveillant, plugin compromis, page de contenu hostile), mesures, limites connues (ex. fuite par timing, déni de service CPU limité par le battement de cœur), ce qui est repoussé à 14.3/14.4.

## Critères d'acceptation

**AC1 — Manifeste validé à l'installation**
- **Given** les fixtures valides et invalides
- **When** `Manifest::parse_and_validate` (Rust) et `validateManifest` (TS) les traitent
- **Then** les valides passent, les invalides sont rejetés avec une erreur nommant le champ ; Rust et TS donnent **exactement** les mêmes verdicts

**AC2 — Permission non déclarée refusée**
- **Given** un plugin dont le manifeste ne déclare pas `pages.write`
- **When** il appelle `pages.update`
- **Then** la réponse est `permission_denied`, l'événement d'audit `plugin.permission_denied` est émis, aucune donnée n'est modifiée

**AC3 — Portée respectée**
- **Given** un plugin avec `pages.read` accordé sur la page P1 uniquement
- **When** il appelle `pages.read` sur P2 (et `pages.list`)
- **Then** `scope_denied` pour P2 ; `pages.list` ne retourne que P1 ; `PagesApi.read(P2)` n'a **jamais** été appelé (espion)

**AC4 — Sandbox et CSP**
- **Given** l'iframe d'un plugin sans permission `network`
- **When** il tente fetch, XHR, WebSocket, sendBeacon, accès à `window.parent.document`, `localStorage`
- **Then** toutes les tentatives échouent (blocage CSP ou `SecurityError`) ; l'attribut `sandbox` vaut exactement `allow-scripts` ; aucune requête réseau n'est observée côté Playwright

**AC5 — Réseau limité à la liste**
- **Given** un plugin avec `network` accordé pour `api.exemple.org`
- **When** il appelle `api.exemple.org` puis `autre.org`
- **Then** seul le premier est autorisé par la CSP `connect-src` ; l'autre est bloqué

**AC6 — Plugin planté isolé**
- **Given** un plugin en boucle infinie
- **When** 3 battements de cœur manquent
- **Then** l'iframe est détruite en ≤ 8 s, un toast « Désactiver » apparaît, l'application reste réactive, `plugin.crashed` est audité

**AC7 — Interrupteur d'arrêt et révocation**
- **Given** un plugin actif puis un autre dans la liste de révocation
- **When** j'appelle `host.kill` / je charge le révoqué
- **Then** le premier est détruit immédiatement et refuse toute requête (`plugin_revoked`) ; le second ne se charge pas ; fonctionne sans réseau

**AC8 — Usurpation de messages**
- **Given** un 2e iframe ou `window.postMessage` envoyant de faux `ubao:ready` / requêtes RPC
- **When** l'hôte reçoit ces messages
- **Then** ils sont ignorés (source et port vérifiés) ; aucun droit n'est obtenu

**AC9 — Non-régression de kind**
- **Given** un manifeste `kind:"server"` valide au schéma
- **When** je tente de l'installer
- **Then** erreur `kind_not_supported` (pas d'exécution)

## Tests à écrire
- Unitaire Rust : manifeste (toutes les fixtures), courtier (table de décisions : non déclaré, déclaré non accordé, hors portée, domaines, révoqué), `Scope` (inclusion espace/page).
- Propriété (`proptest`) : (1) pour tout manifeste, toute liste de grants et toute requête, `decide` ne panique jamais et **`Allow` implique** (permission ∈ manifeste ∧ ∈ grants ∧ ressource ∈ portée ∧ plugin non révoqué) ; (2) ajouter une révocation ne transforme jamais un `Deny` en `Allow` (monotonie) ; (3) domaines : un hôte autorisé par `*.exemple.org` ne couvre jamais `exemple.org.evil.com` ni `evilexemple.org`.
- Conformité croisée : mêmes fixtures Rust (`tests/conformance.rs`) et TS (`conformance.test.ts`).
- Vitest : RPC (validation, rate limit, taille), battement de cœur (temps simulé), interrupteur d'arrêt, construction du `srcdoc`/CSP (snapshot : aucune directive permissive, nonce unique par chargement).
- Playwright e2e **sandbox-escape** : AC4, AC5, AC6, AC8 avec les plugins `evil-*` sur Chromium (+ Firefox si disponible) ; les tests lisent aussi `page.on('request')` pour prouver qu'aucune requête sortante n'a eu lieu.
- Fuzz léger : décodeur RPC avec `fast-check` (messages arbitraires ne plantent pas l'hôte) ; `cargo fuzz` du parseur de manifeste **recommandé mais non requis** (consigne dans la PR si non fait).

## Commandes de vérification (exactes)
```bash
cargo test -p ubao-plugin-host
pnpm --filter @ubao/plugin-schema test
pnpm --filter @ubao/plugin-host test
pnpm --filter @ubao/web exec playwright test plugin-sandbox
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
- Aucune permission élargie « pour faire marcher » un test ; jamais `allow-same-origin` avec `allow-scripts` ; jamais `eval`/`new Function` dans l'hôte.
- Pas d'inspiration de code des SDK de plugins de Figma, Penpot, AFFiNE, Miro, tldraw : le protocole RPC est défini par cette story.
- Pas de `wasmtime` ici (hôte serveur = story ultérieure) ; pas de réseau pour charger un plugin (charge depuis des fichiers/chaînes locaux).
- Les journaux d'audit ne contiennent jamais de contenu de page ni de données personnelles.

## Définition de terminé
- [ ] Tous les critères d'acceptation (Given/When/Then) ont un test automatisé qui passe, ou une justification écrite si manuel.
- [ ] Portes de qualité vertes (voir ci-dessus), exécutées localement **et** en CI.
- [ ] Aucune nouvelle dépendance hors allow-list ; liste des dépendances ajoutées dans la PR.
- [ ] README de chaque crate/app touché mis à jour (responsabilité, API publique, comment tester).
- [ ] PR ouverte vers `main` depuis la branche de la story, titre en Conventional Commits, description = résumé + preuves (sorties des commandes) + « Reporté » + dépendances ajoutées. Jamais de push sur `main`.
- [ ] `sprint-status.yaml` **non modifié** par l'agent (le mainteneur change le statut après revue).
- [ ] `docs/architecture/plugin-host.md` écrit ; tests d'évasion verts sur Chromium ; fixtures partagées vertes dans Rust et TS.

## À demander au mainteneur (Jean Balin) si bloqué — ne devine pas
- ADR-0010 est « proposed » : le mainteneur l'a-t-il accepté ? Sinon cette story est livrée comme **prototype réversible** : confirme ce statut avant de commencer.
- Liste des permissions v1 (`pages.read|write`, `board.read|write`, `storage`, `identity.read`, `network`, `ai`) : à valider ; autres à ajouter ?
- Limites (100 req/s, 1 Mo de stockage, 10 s de timeout) : valeurs par défaut acceptables ?
- Ajouter à la structure du projet `crates/ubao-plugin-host`, `packages/plugin-schema`, `packages/plugin-host` ?
