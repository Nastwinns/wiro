# CLA ou DCO : comparatif et recommandation (brouillon)

Contexte : ADR-0012 (licence en cours de décision). Actuellement **DCO** (`git commit -s`). Pas de conseil juridique ; à valider avec un juriste.

## Comparatif
| Critère | DCO | CLA (licence de contribution) | CLA avec cession de droits |
|---|---|---|---|
| Friction contributeur | très faible (un `Signed-off-by`) | moyenne (signature une fois, bot) | élevée, souvent mal perçue |
| Droit de relicencier | non, la licence d'origine reste | oui, si la licence accordée est assez large | oui |
| Compatible scénario A (tout MIT) | oui | oui, inutile | inutile |
| Compatible scénario B (MIT + modules commerciaux) | oui si les contributions au cœur restent MIT et que les modules commerciaux sont écrits par le projet ; risque si un contributeur touche un module commercial | oui | oui |
| Option C (AGPL + double licence) | non sans accord de chaque contributeur | indispensable | indispensable |
| Option D (source-available) | non | oui | oui |
| Signal communauté / marchés publics | positif (Linux, CNCF) | neutre à négatif | négatif |
| Coût d'outillage | DCO bot GitHub | CLA bot + registre des signatures | idem + juridique |
| Contributeurs salariés | l'employeur n'est pas engagé explicitement | CLA d'entreprise possible (CCLA) | idem |

## Recommandation
1. **Scénario A (tout MIT)** : rester sur **DCO**. Simple, adapté à un projet communautaire.
2. **Scénario B (MIT + modules hébergeurs)** : DCO suffit **si** (a) les modules commerciaux vivent dans des répertoires séparés, (b) seul le projet les écrit, (c) le cœur reste MIT à jamais. Sinon CLA de **licence** (pas de cession), identique à `contributor-agreement-draft.md`.
3. **Options C ou D** : CLA obligatoire avant toute contribution externe.
4. Dans tous les cas : décider **avant la première contribution externe** ; ne pas accepter de PR externe pendant l'indécision (ou limiter aux corrections triviales, déjà couvertes par DCO).
5. Option de repli compatible avec tout : accorder dans la CLA une licence large mais **sous engagement public** que la version du cœur déjà publiée reste MIT.

## Prochaines étapes
- Décision dans ADR-0012.
- Si CLA : relecture juriste du brouillon, choix de l'outil (CLA assistant ou équivalent), mise à jour de CONTRIBUTING.md.
