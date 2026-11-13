---
title: Prototype Ubao — script de test utilisateur (desktop & web)
status: v1 — 2026-11-11
---

# Principe
Prototype Penpot (page **B14 · Prototype flows**, flows F1–F11). Mode « Présenter » (View mode) sur écran ≥ 1366 px. Pas de saisie réelle : les états de tri/filtre/erreur sont des écrans reliés. Dire au participant : « c'est une maquette cliquable, certaines zones ne répondent pas ; cliquez là où vous le feriez ». Ne jamais guider ; noter le premier clic.

# Participants et mesures
5 fondateurs/CTO (P1–P5), 1–2 DSI/décideurs (D1–D2), 1 invité pressé (G1 : F4 étape invité). Par tâche : **réussite** (oui / avec aide / non), **temps** (cible entre parenthèses), **premier clic**, **erreurs** (clics hors cible), **verbatim**. Succès global : ≥ 80 % de réussite sans aide par tâche, aucune tâche < 60 %.

# Tâches (une par flow)
| # | Flow | Consigne au participant | Chemin attendu (critère de réussite) | Cible |
|---|---|---|---|---|
| T1 | F1 | « Vous recevez une invitation : connectez-vous et préparez votre espace. » | Sign in → e-mail (essayer une adresse invalide → erreur lisible) → code (essayer un faux code) → assistant 4 étapes (erreur nom d'espace corrigée) → Accueil | 2 min |
| T2 | F2 | « Créez un nouveau tableau et ajoutez un objet. » | Accueil → « + Nouveau » → Tableau → barre d'outils (menu Plus) → Inspecteur | 1 min 30 |
| T3 | F3 | « Animez un atelier de 10 minutes avec un vote. » | Barre d'atelier → minuteur → vote (config → résultats) → mode privé → révéler | 2 min 30 |
| T4 | F4 | « Écrivez une page avec un cadre de tableau en direct et partagez-la à un collègue (adresse erronée d'abord). » | « / » → cadre canvas → Partager → e-mail invalide → corrigé → invité ajouté ; copier le lien | 2 min |
| T5 | F5 | « Trouvez les tâches en cours dont le budget dépasse 2 M FCFA, triées par échéance. » | Tableau → tri échéance → filtres → Filtré ; puis un filtre sans résultat → effacer | 2 min |
| T6 | F6 | « Retrouvez la page « plan d'action » puis restaurez-en une supprimée. » | Recherche (saisie, filtres, aucun résultat) → wiki → corbeille → confirmation | 2 min |
| T7 | F7 | « Invitez deux personnes comme éditeurs puis retirez un membre ; passez en thème sombre. » | Membres → recherche/filtre rôle/menu rôle → invitation → retrait (confirmation) ; Préférences → Sombre | 3 min |
| T8 | F8 | « Restaurez la sauvegarde d'hier. » | Admin serveur → Sauvegardes → modale de restauration | 1 min 30 |
| T9 | F9 | « Installez une extension et importez un fichier d'un autre outil. » | Marketplace → détail → consentement → exécution ; Import étapes 1→4 | 3 min |
| T10 | F10 | « Demandez à l'assistant de regrouper des post-it, puis acceptez la proposition. » | Suggestion → aperçu fantôme → appliquer ; permission agent (modale) | 2 min |
| T11 | F11 | « Vous perdez la connexion : que se passe-t-il pour votre travail ? » | Hors ligne → sync → erreur → réessayer ; message de sécurité des données compris | 1 min 30 |

# Checklist transversale (à cocher à chaque session)
- **Menus** : workspace, utilisateur, « + Nouveau », « Plus d'outils », menu rôle, filtre rôle, menu contextuel — s'ouvrent, se ferment (clic dehors), items cliquables.
- **Tableaux** : tri asc/desc visible (flèche + ordre), compteur cohérent, pied de tableau recalculé, état vide et « Effacer les filtres ».
- **Filtres** : panneau, puces actives, retrait d'une puce, filtre sans résultat.
- **Formulaires** : champ normal → erreur (message sous le champ, bouton désactivé) → corrigé ; e-mail, nom d'espace, code, invitation.
- **Fenêtres modales** : fond atténué, fermeture clic dehors / Annuler / ✕, action danger distincte (retrait, restauration), focus logique.
- **Parcours** : chaque flow démarre depuis sa première frame ; chaque écran a une sortie (retour, fermer, lien).
- **Identité** : jetons et typo respectés (pas de dérive visuelle), Fraunces max une fois par écran, FR vouvoiement.

# Observation et restitution
Enregistrer écran + voix (accord oral). Synthèse par flow : taux de réussite, temps médian, 3 principaux frottements, correctif proposé (design) — table dans `docs/research/prototype-test-results.md` (à créer après les sessions). Les écarts « le prototype ne répond pas » ne comptent pas comme erreurs d'usage ; les consigner pour compléter le câblage.

# Limites connues
Aucune logique réelle ; pas de saisie clavier ; pas de temps réel/collab ; mobile non testé ici (frames B13 sans parcours) ; copies de B14 à régénérer si une source change (`tools/penpot/proto_copy.js`).
