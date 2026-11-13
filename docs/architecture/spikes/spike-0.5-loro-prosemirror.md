# Spike 0.5 — Loro + ProseMirror (`loro-prosemirror`)

Statut : prêt à exécuter (S0) · Durée : 3 j · Décideur : Jean Balin (go/no-go) · Lie : ADR-0003 (Loro), ADR-0006 (ProseMirror), Story 0.5 (epics.md), risque « loro-prosemirror maturity » (master-plan).
Jeux de tests : `bench/editor/scenarios.json` (validé par `cd bench/editor && npm test`).

## 1. Question posée
`loro-prosemirror` (binding de la lib Loro, à vérifier : licence MIT, version, dernière release, issues ouvertes sur IME/undo) tient-il, pour un éditeur de docs en production, sur : (a) composition IME (accents FR, diacritiques Wolof/Yoruba/Hausa, arabe RTL), (b) undo/redo par utilisateur, (c) curseurs/sélections distants, (d) édition hors ligne concurrente avec convergence ?
Hors périmètre : schéma de blocs complet, nodeviews (canvas/db), permissions.

## 2. Montage (J0, 0,5 j)
- Package `bench/editor/app/` (à créer par l'agent) : Vite + TS, `prosemirror-state/view/model/schema-basic/history?` (MIT), `loro-crdt` (MIT), `loro-prosemirror`. **Noter versions exactes + licence de chaque dépendance transitive (`license-checker`) ; tout ce qui n'est pas MIT/Apache/BSD/ISC/Zlib est signalé, pas ajouté.**
- Deux (puis trois) éditeurs dans la même page, chacun avec son propre `LoroDoc` (peerId distinct) ; un « réseau » simulé : file d'updates avec `online/offline` par pair, ordre/latence réglables, `doc.export({mode:"update"})` / `import`.
- Schéma minimal : doc > (paragraph | heading(level) | bullet_list/list_item), marks bold/italic/link. Plugins : `LoroSyncPlugin`, `LoroUndoPlugin`, `LoroCursorPlugin` (noms à confirmer dans la version testée).
- Harnais d'exécution : Playwright (Apache-2.0, outil de dev) sur Chromium ; Firefox et WebKit pour tout ce qui n'est pas IME. **Les IME réels (Safari/WKWebView, Gboard Android, Windows IME) sont manuels** (fiche §7).
- Simuler la composition en Chromium via CDP : `Input.imeSetComposition` (étapes successives) puis `Input.insertText`/commit ; en complément `page.keyboard.type` pour touches mortes.

## 3. Scénarios (tous dans `scenarios.json`)
| Bloc | Id (préfixe) | Nb | Ce qu'on vérifie |
|---|---|---|---|
| IME | `ime-*` | 12 | texte final == attendu, aucun changement de forme Unicode (pas de NFC/NFD silencieux : on compare les code points), pas de perte/doublon de caractère composé ; FR (touches mortes), Wolof (ŋ ñ ë ó à), Yoruba (base+U+0323+U+0301), Hausa (ɓ ɗ ƙ ƴ), Arabe (RTL, harakat, bidi mixte), contrôle CJK (longue composition). |
| IME + distant | `remote-*` | 2 | un op distant arrive **pendant** une composition : la composition n'est ni annulée, ni dupliquée, caret cohérent. |
| Undo/redo | `undo-*`, `redo-*` | 6 | undo local-seul (n'annule pas l'autre pair), undo après édition distante dans la plage, redo, marks, undo d'un commit IME en **un** pas (graphème entier), undo des opérations de blocs. |
| Curseurs | `cursor-*`, `selection-*`, `awareness-*`, `relative-position-roundtrip` | 5 | décalage correct, effondrement stable à la suppression, sélection multi-blocs, curseur jamais entre base et diacritique, aller-retour position PM ↔ Loro Cursor (test de propriété, 1000 docs). |
| Hors ligne | `offline-*` | 5 | convergence après partition (2 et 3 pairs, 6 permutations d'ordre de merge), format vs suppression, move de bloc vs édition, session longue (30 min, 5 000 ops). |
| Fuzz | `fuzz` | 200 graines | 2–3 pairs × 500 ops aléatoires (insert/delete/marks/split/join/move/undo/redo), alphabet multi-scripts avec marques combinantes, ZWNJ, ZWJ-emoji ; oracle : états Loro exportés identiques ET `doc.toJSON()` PM identiques ET aller-retour PM→Loro→PM identité. Graines échouantes sauvegardées en `bench/editor/failures/<seed>.json` (rejouables). |
| Perf | `perf` | 5 | frappe→rendu p95, chargement snapshot, collage 5k mots, application op distant, tas après 10 min. |

## 4. Critères go / no-go
**GO** (adopter `loro-prosemirror` tel quel, éventuellement avec patchs amont) si TOUT :
1. Fuzz : 200/200 graines convergent, 0 perte de caractère ; aller-retour identité 100 %.
2. IME : 0 échec sur FR/Wolof/Yoruba/Hausa/Arabe en Chromium automatisé ET sur la fiche manuelle (≥ Safari macOS + Gboard Android + Windows IME) ; `remote-*` OK.
3. Undo : les 6 scénarios conformes au comportement documenté (undo par utilisateur) ; aucun orphelin de marque combinante.
4. Curseurs : 5/5, property test sans écart.
5. Perf : frappe→rendu p95 < 16 ms @20k mots (desktop M1/M2 de l'ADR-0004) ; chargement < 300 ms ; heap stable.

**GO AVEC RÉSERVES** (adopter + patches/contournements suivis, ≤ 3 jours estimés de travail restant par défaut) : ≤ 3 échecs non critiques (cosmétiques curseur, undo différent mais cohérent) sans perte de données, tous reproductibles et contournables ; chaque réserve devient une story S1 avec test rouge.

**NO-GO** (bascule repli §5) si l'un de : divergence au fuzz non corrigée par un correctif < 2 j ; perte/duplication de texte composé IME ; undo qui corrompt le document ; perte de données hors ligne ; perf p95 frappe > 33 ms @20k mots.

Ne PAS conclure GO sur Chromium seul : l'IME WKWebView/Android compte (cibles Tauri, ADR-0008).

## 5. Repli : liaison maison sur texte Loro (ADR-0003 reste Loro)
Principe : on garde Loro (`LoroText` riche + `LoroTree/MovableList` pour blocs) et on écrit `wiro-pm-loro` (~1–2 k lignes TS) :
- Modèle : un `LoroTree` de blocs ; chaque bloc textuel porte un `LoroText` (marks Peritext de Loro) ; ids de bloc stables.
- PM → Loro : à chaque `Transaction`, convertir `Step`s (ReplaceStep, AddMark, RemoveMark, ReplaceAround) en opérations Loro (`insert/delete/mark`) **en transaction unique** ; **ne jamais appliquer pendant `view.composing`** : mettre en tampon les ops distantes (voir plus bas) et les flusher au `compositionend`.
- Loro → PM : abonnement `doc.subscribe` ; diffs d'évènements Loro convertis en `Transaction`s marquées `addToHistory:false` + meta `fromLoro`, positions via `Cursor` Loro ↔ `tr.mapping`.
- Undo : `UndoManager` de Loro (par pair) ou pile maison ; groupement par `captureTimeout` ; commit IME = 1 entrée.
- Curseurs : `LoroDoc` ephemeral/awareness + `Cursor` stables (relative positions), décorations PM.
- Coûts à mesurer en fin de spike : lignes de code, jours estimés (cible ≤ 8 j-dev pour parité fonctionnelle), taux de passage de `scenarios.json` (le même jeu de tests sert de recette).
- Plan C (si Loro texte riche lui-même fautif) : repli sur Yrs + `y-prosemirror` (MIT, mature) pour **le texte des docs seulement** ; Loro garde arbre/canvas ; coût : 2 CRDT, ADR-0003 amendé. À décider par Jean Balin, ne pas lancer sans accord.

## 6. Déroulé / jalons
J1 montage + IME automatisés + convergence basique ; J2 undo/curseurs/hors ligne + fuzz ; J3 perf, manuel Safari/Android/Windows, rédaction. Arrêt anticipé autorisé dès qu'un critère NO-GO est reproduit 3 fois : passer directement au prototype du repli (1 j) pour chiffrer.

## 7. Fiche manuelle IME (à remplir sur chaque machine/clavier)
| Plateforme / clavier | Scénarios joués (`ime-*`) | OK/KO | Notes (capture/vidéo) |
|---|---|---|---|
| macOS Safari + ABC-Extended (touches mortes) | fr, yo | | |
| macOS Chrome | fr, wo, yo, ha, ar | | |
| Windows 10/11 Edge/WebView2 + clavier FR/AR | fr, ar | | |
| Windows + « Wolof/Yoruba » (Africa layouts) | wo, yo, ha | | |
| Android Gboard (FR, Yoruba, Hausa, AR) dans WebView (Tauri) et Chrome | tous | | |
| iOS clavier natif (FR, AR, Yoruba) WKWebView | fr, yo, ar | | |
Documenter pour chaque KO : séquence exacte, événements `beforeinput/compositionstart|update|end`, version OS/WebView.

## 8. Rapport-type (à livrer comme addendum ADR-0003/0006 : `docs/architecture/spikes/report-0.5.md`)
```
# Rapport spike 0.5 — <date> — <auteur/agent>
Versions : loro-crdt x.y.z, loro-prosemirror x.y.z, prosemirror-* …, navigateurs/OS
Licences : tableau dépendances (flag non-permissives)
Résultats : tableau scénario → OK/KO (+ lien trace/vidéo/seed)
Fuzz : graines passées N/200 ; premières divergences (seeds) + cause
IME : matrice §7 remplie
Perf : valeurs p50/p95 vs seuils
Défauts amont : liens issues/PR ; patches locaux (taille)
Verdict : GO | GO AVEC RÉSERVES | NO-GO  (selon §4)
Si repli : coût mesuré (loc, j-dev), taux de passage du jeu de tests
Recommandation + décision demandée à Jean Balin
```
