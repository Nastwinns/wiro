# Spikes S0 — ordre, durées, dépendances

Tout ce qui précède l'exécution est dans `bench/` (Node ≥ 22, zéro dépendance, `just -f bench/justfile test` = 33 tests verts).

| # | Spike | Doc | Durée | Dépend de | Machines |
|---|---|---|---|---|---|
| 1 | **0.5 Loro + ProseMirror** | `spike-0.5-loro-prosemirror.md` | 3 j | rien (peut démarrer vendredi) | 1 poste dev (Chromium auto) ; manuel : Mac+Safari, Windows, Android/iOS pour IME |
| 2 | **0.4b Bench canvas** (E→C→B, puis D si besoin) | `spike-0.4b-canvas-bench.md` | 6–8 j | scène/traces prêtes ; harnais à écrire (J1) | M1 (Win 4 Go iGPU), M2 (Mac), M5 (3 navigateurs) ; M3/M4 en fin |
| 3 | **0.4 Coque mobile + signature** | `spike-0.4-mobile-shell.md` | 5 j | scaffold Tauri 2 (S0), bench canvas (J3+) pour fps | D1–D4, Mac+Xcode, SDK Android |
| 4 | **Recherche** | `spike-search.md` | 2 j | 0.5 terminé (même agent/éditeur), décision licence Unicode-3.0 | 1 poste dev ; M3 pour latence Android |

## Ordre recommandé (parallélisable : 3 agents)
- Piste A : 0.5 (J1–J3) puis Recherche (J4–J5).
- Piste B : 0.4b : harnais + backend E (J1), C (J2–3), B (J3–5), mesures M1/M2/M5 (J5–6), D si B échoue (J7–8).
- Piste C : 0.4 : builds Tauri desktop (J1), Android + signature (J2–3), iOS (J3–4), mesures avec le bench (J4–5).
Total calendaire ≈ 8 j ouvrés ; machines physiques à réserver dès J1 (M1, D1, D2, D4).

## Quand reporter la décision à Jean Balin (obligatoire)
1. Tout passage d'ADR-0004/0007/0008 de « proposed » à « accepted » (les spikes ne tranchent pas ; ils livrent un rapport + recommandation).
2. Verdict « NO-GO » ou « GO avec réserves » du spike 0.5, ou activation du plan C (Yrs) : amende ADR-0003.
3. Résultat 0.4b où ni B ni D ne passent Go sur M1 (stratégie LOD à valider, objet atteignable à communiquer).
4. Licence hors liste AGENTS.md rencontrée : `Unicode-3.0` (décision demandée), polices OFL (Noto), toute autre → ne pas ajouter, signaler.
5. Appareil manquant (D1/D2/M1), achat/prêt, compte Apple Developer / entité (ADR-0009).
6. Règles linguistiques du normaliseur (ŋ→n, ɛ→e, ة→ه…) : validation par locuteurs natifs.
7. Toute dépendance > budget NFR-P3 (WASM > 900 Ko gz) ou crate à licence douteuse.
Règle générale : en cas de doute, mesurer, consigner, **ne pas contourner un seuil** ; escalader avec les chiffres.

## Livrables attendus par spike
`docs/architecture/spikes/report-<spike>.md` (modèle dans chaque doc) + JSON bruts (`bench/canvas/reports/`) + addendum d'ADR proposé (statut inchangé tant que le mainteneur n'a pas tranché).
