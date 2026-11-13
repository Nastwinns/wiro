# Brief agents — revue de cohérence Penpot (fichier `wiro`)

Répertoire : `/Users/balin/Project/wiro`. Lis d'abord `docs/ux/penpot-agent-brief.md` (règles obligatoires : verrou sérialisé, appels < 100 s, retries jusqu'à 20 fois avec attente 60-90 s sur erreurs « suspended » ET « frozen » de l'onglet Penpot).

Même mécanique de scan que `docs/ux/penpot-audit-brief.md` (script JS + `tools/penpot_call.sh`, page par page), mais ici la dimension vérifiée est **[DIMENSION]** — pas la typographie.

## Règle commune
- **Lecture seule sur Penpot** par défaut. Tu ne corriges QUE ce qui est explicitement dans ta liste blanche. Tout le reste = rapport.
- Chaque finding = evidencé : page, frame, calque, texte/valeur mesurée, source de vérité citée (fichier + ligne), correction proposée.
- Les sources de vérité sont dans le repo : `docs/ux/screens/*.md` (specs écran par écran), `docs/product/prd.md`, `docs/ux/ux-spec.md`, `docs/ux/brand-charter.md`, `design/penpot/library-catalog.md`, `docs/ux/penpot-handoff.md`, ADR dans `docs/architecture/adr/`.
- Les frames sombres (`/ Dark /`) et `Proto /` et `Overlay /` sont dans le périmètre.

## Format du rapport
Par sévérité : 🔴 contredit une décision/spec ; 🟠 incohérence entre écrans ; 🟡 doute à trancher ; ⚪ cosmétique. Avec compteurs en fin de rapport (frames vérifiés, findings par sévérité).
