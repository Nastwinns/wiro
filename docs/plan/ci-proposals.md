# Propositions CI (brouillon, aucune modification appliquée)

## État existant
`.github/workflows/ci.yml` : un seul job `docs` (markdownlint sur `docs/**/*.md`), sur push et pull_request. Aussi : `dependabot.yml`, template de PR, template d'issue `feature.md`. Aucun job Rust ni JS, rien sur les licences. Le workflow actuel reste inchangé ; les ajouts ci-dessous sont **de nouveaux fichiers ou jobs** à créer dans Story 0.1/0.2, après que `Cargo.toml` et `package.json` existent (sinon les jobs échouent).

## Ajouts proposés
| Job | Contenu | Prérequis | Story |
|---|---|---|---|
| `rust` | `cargo fmt --check`, `cargo clippy -D warnings`, `cargo test --workspace`, cache `Swatinem/rust-cache` | workspace Cargo | 0.1 |
| `deny` | `EmbarkStudios/cargo-deny-action` : `cargo deny check licenses advisories bans sources` ; `deny.toml` avec allow-list MIT, Apache-2.0, BSD-2/3-Clause, ISC, Zlib (+ `Unicode-3.0` si accepté) ; deny GPL/AGPL/LGPL, sources inconnues | `deny.toml` | 0.2 |
| `js` | `pnpm install --frozen-lockfile`, lint, typecheck, test | workspace pnpm | 0.1 |
| `js-licenses` | `license-checker-rseidelsohn --production --onlyAllow "MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC;Zlib;0BSD"` et `pnpm audit --prod` | lockfile | 0.2 |
| `clean-room-guard` | voir ci-dessous | aucun | 0.2 |
| `spdx-headers` | vérifie en-têtes SPDX (à activer après ADR-0012) | ADR-0012 | plus tard |
| `sbom` | CycloneDX (`cargo cyclonedx`, `@cyclonedx/cdxgen`) en artefact de release | release | S8 |
| `bench` | banc de perf canvas (10 000 objets, budget 60 fps) en non bloquant puis bloquant | tools/bench | S2 |
| `secrets` | gitleaks sur PR | aucun | 0.2 |
| `typography` | refuse les tirets cadratins dans `docs/**`, `*.md` neufs (règle AGENTS.md, non rétroactif, mode diff) | aucun | 0.2 |

## Clean-room guard (proposition)
Script `tools/xtask` (ou shell) exécuté sur le diff de PR :
1. Refuse les chemins interdits : `**/tldraw/**`, `**/blocksuite/**`, `**/affine/**`, `**/excalidraw/**` hors `docs/research/`.
2. Refuse les en-têtes de licence étrangers (`Copyright ... tldraw`, `MPL`, `GPL`, `AGPL`, `BUSL`) dans le diff ajouté.
3. Refuse `Cargo.toml`/`package.json` qui ajoutent `tldraw`, `@tldraw/*`, `@blocksuite/*`, `react-bits`, `aceternity`, `animate-ui`.
4. Option : similarité de code (jscpd) contre un corpus local de sources interdites, non versionné ; en complément de la revue humaine (agent `clean-room-guard`).
Échec = PR bloquée, revue manuelle obligatoire.

## Esquisse (à créer plus tard comme `.github/workflows/gates.yml`, ne pas fusionner avec ci.yml)
```yaml
name: gates
on: [pull_request]
jobs:
  deny:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: EmbarkStudios/cargo-deny-action@v2
  clean-room:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - run: ./tools/ci/clean-room-guard.sh origin/${{ github.base_ref }}
```

## Autres points
- Épingler les actions par SHA et mettre `permissions: contents: read` par défaut.
- `dependabot.yml` : ajouter les écosystèmes `cargo` et `npm` quand les manifestes existent.
- Branch protection : exiger les jobs `rust`, `deny`, `js`, `clean-room`, `docs`.
- Ajouter `DCO` (probot/app) tant que le DCO est le régime ; à retirer si CLA.
- Étendre le glob markdownlint à `*.md` racine après nettoyage (CONTRIBUTING, LICENSING).
