# Spike Recherche (ADR-0007) — normaliseur, index client, porte de licence Unicode-3.0

Statut : corpus, normaliseur de référence, tests dorés et harnais de métriques **prêts et testés** (`cd bench/search && npm test`, 9 tests) ; moteurs candidats à brancher en S0/S1. Durée : 2 j (après Story 0.5), décideur Jean Balin. **Décision de licence Unicode-3.0 nécessaire avant tout ajout de `unicode-normalization`/ICU4X (voir §5).**

## 1. Contenu livré (`bench/search/`)
| Fichier | Rôle |
|---|---|
| `src/norm.mjs` | **Spécification exécutable de `wiro-text-norm`** (règles R1–R9 documentées en tête de fichier) : `normalize(token) → {primary, secondary}`, `tokenize`, `analyze`. |
| `golden/norm-golden.json` | 29 cas dorés (FR/EN/Wolof/Hausa/Yoruba/Arabe, ligatures, ZWNJ, apostrophes, chiffres arabes), 4 cas de tokenisation, 8 classes d'équivalence. La crate Rust doit les reproduire **bit à bit** (secondaire stocké en NFD, comparer après NFD). |
| `src/lexicon.mjs`, `src/gen-corpus.mjs` | Corpus synthétique seedé (42) : vocabulaire Zipf par langue (mots-graines originaux + syllabes), mélange FR 28 / EN 20 / AR 17 / WO 15 / HA 10 / YO 10 %, pages à langue dominante 70 % + mélange 30 %. Défaut 5 000 pages × 1 000 mots = 5 M mots (génération 3 s) ; échantillon versionné `bench/search/corpus/` (200 p. × 300 mots, sha256 dans `manifest.json`). Wikipédia (CC-BY-SA) : à télécharger par l'agent **hors repo** pour le test de réalisme, jamais livré. |
| `corpus/queries.json` | ≈ 600 requêtes : `exact`, `diacritic-insensitive` (saisie sans signes : é→e, ɓ→b, ọ̀→o, alef/harakat arabes) et `prefix`, avec résultats attendus (vérité terrain par force brute via le normaliseur). |
| `src/run-reference.mjs` | Harnais : interface moteur `{name, build(docs), query(typed,{prefix})}` → build ms, latence p50/p95, rappel par type, mémoire. Moteur `reference-js` fourni. |
| tests | déterminisme, 6 langues présentes, NFC/NFD/NFKC équivalents, idempotence, classes d'équivalence. |

Limite assumée : la vérité terrain utilise le même normaliseur (circulaire pour le rappel du moteur de référence = 100 %). Elle valide qu'un **autre** moteur (MiniSearch, `wiro-search`, FTS5) applique bien les règles ; le rappel « humain » se vérifie sur la liste d'équivalences dorée écrite à la main.
Mesure faite ici (Node, 5 M mots, moteur naïf de référence) : build 11,6 s, p95 requête 0,7 ms, tas 137 Mo — pas un résultat candidat, seulement la preuve que le harnais tourne.

## 2. Règles de normalisation (résumé ; autorité = `src/norm.mjs`)
Deux clés par jeton. **primary** (rappel) : NFKD, suppression des caractères ignorables (ZWSP/ZWNJ/ZWJ/LRM/RLM/soft hyphen), minuscules (+ß→ss, ς→σ), apostrophes typographiques→`'`, arabe : suppression harakat/tatweel/marques coraniques, alef (آ أ إ ٱ)→ا, ى/ئ/ی→ي, ؤ→و, ة→ه, ک→ك, chiffres arabo-indiens→0–9 ; Latin spéciaux œ æ ø đ ł ŋ ɲ ɛ ɔ ɨ ʋ → ASCII ; Hausa ɓ ɗ ƙ ƴ → b d k y ; **toutes** les marques combinantes U+0300–036F supprimées. **secondary** (classement) : mêmes règles sauf que grave, aigu, circonflexe, macron, caron, point-dessus et **point-dessous (U+0323, Yoruba)** sont conservés et les lettres hameçonnées Hausa ne sont pas repliées → un résultat avec la bonne orthographe passe devant un résultat « replié ». Recomposition NFC en sortie.
Choix à valider par un locuteur natif (S0, ajouter à la revue) : ŋ→n (Wolof), ɛ→e/ɔ→o (Yoruba ancien/Fula), ة→ه, ى→ي. Hors périmètre v1 : racinisation, translittération, détection de langue.

## 3. Critères (ADR-0007, inchangés) et protocole
| Métrique | Go | Comment mesurer |
|---|---|---|
| p95 requête 1–3 termes + préfixe | < 50 ms M1 / < 150 ms Android M3 | 600 requêtes × 3 passes, ADR-0004 machines |
| Index complet 5 M mots | < 20 s ; incrément < 20 ms/édition | `build`, puis 500 éditions de page |
| RAM / disque | < 80 Mo / < 30 % du texte | RSS après build ; taille sérialisée |
| WASM gz | < 150 Ko (C) ; > 600 Ko → D/B rejetés | `wasm-opt -Oz` + gzip |
| Rappel insensible aux diacritiques | ≥ 98 % ; précision@10 ≥ baseline MiniSearch | `queries.json` ; baseline = MiniSearch + `processTerm = normalize().primary` |
| Hors ligne / crash | OK avec réseau coupé ; reprise après kill -9 (R1) | script kill pendant écriture d'index |
Candidats : **E** MiniSearch (MIT, baseline obligatoire, 0,5 j), **C** `wiro-search` Rust/WASM (prototype minimal : index inversé + BM25 + préfixe + distance 1), **D** SQLite FTS5 (tokenizer maison ; mesure indicative desktop), **B** tantivy WASM seulement pour confirmer le rejet (taille). Ajouter chaque adaptateur dans `src/adapters/` (créer) ; licences à vérifier avant `npm install` / `cargo add`.
Décision : C si Go partout ; sinon D desktop + E web provisoire ; B uniquement serveur. Jean Balin tranche.

## 4. Rapport-type (`report-search.md`)
Versions/licences · corpus (sha256) · tableau moteur × critère (valeur, Go/KO) · rappel par langue (FR/EN/WO/HA/YO/AR) · cas d'échec listés · conformité aux tests dorés · recommandation · décision demandée.

## 5. Porte de licence Unicode-3.0
**Faits** (à confirmer par `cargo deny list` sur le lockfile réel, je n'ai pas pu exécuter `cargo deny` ici) :
- `Unicode-3.0` (SPDX, approuvée OSI) est une licence **permissive de type MIT** : permission d'usage/copie/modification/redistribution, conditions = conserver l'avis de copyright et l'avis de permission dans la documentation/les notices ; **pas de copyleft**, pas de clause commerciale, compatible avec un dépôt MIT et une distribution binaire/WASM.
- Elle ne figure pas dans la liste d'AGENTS.md (MIT/Apache/BSD/ISC/Zlib) : exige une décision explicite du mainteneur.
- Elle est **déjà inévitable** : `unicode-ident` (`(MIT OR Apache-2.0) AND Unicode-3.0`) est dépendance transitive de `proc-macro2`→`syn`→ quasiment tout l'écosystème Rust (serde, tauri, wasm-bindgen…) ; les crates ICU4X (`icu_*`) sont `Unicode-3.0`. L'opérateur `AND` signifie que la licence s'applique réellement.
- L'alternative « nos propres tables » ne contourne rien : les tables sont dérivées de `UnicodeData.txt`/UCD, publiés sous la **même licence Unicode** ; il faudrait quand même la citer. Elle ajouterait en plus un coût de maintenance (versions d'Unicode).
- Données Unicode (CLDR/UCD) et les polices OFL : licences de natures différentes ; OFL (polices Noto) n'est pas dans la liste non plus → à décider séparément (§ spike 0.4b).

**Recommandation** : autoriser `Unicode-3.0` globalement dans `deny.toml` (`[licenses] allow`), amender la liste d'AGENTS.md/ADR-0007 (« licences de données Unicode permissives »), et ajouter les crates concernées à `THIRD_PARTY_NOTICES.md` (génération automatique par `cargo about`/`cargo deny` + texte de licence). Ne pas faire d'exception par crate : `unicode-ident` est partout. Garder interdits GPL/AGPL/Commons Clause/propriétaires.
Extrait proposé (le fichier `deny.toml` n'existe pas encore dans ce worktree ; non écrit ici, hors périmètre) :
```toml
[licenses]
allow = ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "Zlib",
         "Unicode-3.0"]   # permissive data licence; unicode-ident / ICU4X; maintainer-approved (ADR-0007)
confidence-threshold = 0.9
# Pas d'exception pour GPL-*/AGPL-*/LGPL-*/Commons Clause/propriétaires.
# 0BSD, CC0-1.0, BSL-1.0 (si rencontrées) : décision au cas par cas, signalées.
```
**Décision demandée à Jean Balin avant Story 0.5/S1** : « J'autorise `Unicode-3.0` dans `deny.toml` ». Tant que non décidé : le normaliseur de référence JS (`String.prototype.normalize`, ICU du moteur JS) suffit pour toute la phase de spike.
