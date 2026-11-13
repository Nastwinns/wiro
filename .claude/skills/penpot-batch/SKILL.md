---
name: penpot-batch
description: Travaille efficacement sur le fichier Penpot `wiro` via le plugin MCP (appels sérialisés, onglet unique). Utiliser pour tout scan, audit, revue, correction ou batch sur les pages Penpot : dump local d'une page, batch de jobs groupés par page, gestion des gels d'onglet (suspended/frozen), relances idempotentes. Éviter le mode « des dizaines de micro-appels » qui sature la file.
version: 1.0.0
---

# Penpot en batch — règles et outils

## Contrainte racine (à ne jamais oublier)
Le plugin Penpot tourne dans **un seul onglet de navigateur du mainteneur** : mono-thread, **une seule page active**, un seul appel exécuté à la fois. `tools/penpot_call.sh` sérialise tout via `flock /tmp/wiro-penpot.lock`. Multiplier les agents au-delà de 4-5 ne va pas plus vite : ça remplit juste la file. Limite MCP dure : ~100 s par appel (viser ≤ 60 s de travail utile par appel).

## Les trois outils (repo `tools/`)
1. **`penpot_call.sh <script.js>`** — appel unitaire, prélude `lib.js` auto (helpers : `openPage`, `board`, `text`, `hex`, `typo`, `slot`…). Token `PENPOT_MCP_URL` dans `.env` (le token ne change pas quand Penpot redémarre : une erreur « No Penpot instance connected » = onglet plugin fermé/gelé, **pas** un problème de token).
2. **`penpot_dump.sh "<page>" [out.json]`** — **un appel = une page entière** dans `cache/penpot/dump/` (arbre complet, coordonnées absolues, `characters` des textes). READ-ONLY. À faire en premier : les analyses (typo, coquilles, cohérence, inventaire) se font **sur le JSON en local**, sans rappeler Penpot. Only fixes justify new calls.
3. **`penpot_group.sh <manifest.json> [outdir]`** — batch de corrections : manifest `[{name, page, files:[f1,f2…]}]`, une seule exécution plugin par groupe (`openPage` unique, jobs séquentiels, `results` par fichier), idempotent et **reprebable** (`.done` par groupe, `.json` de sortie dans `cache/penpot/group/`).

## Workflow standard (scan + fix + revue d'une page)
```
penpot_dump.sh "B09 · …"           # 1 appel : tout le contenu
analyse locale des JSON             # 0 appel
penpot_group.sh manifest.json       # 1-2 appels : fixes liste blanche + re-scan de vérif inclus dans le même groupe
```
Un job de vérification = snippet qui relit la page en fin de groupe et retourne les compteurs (vides restants, doublons…). Pas de « re-scan complet » séparé.

## Modes de défaillance et parades
- **« tab appears to be suspended … no heartbeat »** : l'onglet s'est gelé (Brave/Memory Saver). Parade : onglet **épinglé** dans Brave, exception Memory Saver pour `design.penpot.app`, keepalive léger (~1 appel/3 s de `"hb"`) pendant les gros travaux. Un onglet en gel profond ne se réveille que par un **clic humain**.
- **« No Penpot instance connected »** : Penpot/plugin redémarré ou onglet fermé → réouvrir le fichier + lancer le plugin, puis relancer les jobs FAILED.
- **Retry pattern obligatoire** dans toute boucle : `suspended|frozen|No Penpot instance|ECONN|refused|timed out` (les patterns courts type « suspended|frozen » only ont fait perdre ~1 h le 2026-11-13).
- **Scripts idempotents par construction** : skip si `EXISTS`/`.done`/`vdone`, suppression seulement des doublons stricts. Un crash en plein batch doit être relançable sans tri.

## Consignes d'écriture des snippets
- Retour compact : compteurs + findings, jamais l'arbre complet (déjà dans le dump).
- Tout ce qui touche les calques : rester dans la page ouverte du groupe ; `openPage` coûte ~1 s et change la page visible pour les autres → ne jamais changer de page au milieu d'un groupe.
- Découper au-delà de ~60 s de travail ; le batcheur reprend au groupe non-`done`.

## Historique
- 2026-11-13 : 5 agents × ~200 micro-appels sérialisés → files de 12+, onglet gelé par vagues. Outils dump/group ajoutés le soir même (114/114 écrans couverts, gate design en cours).
