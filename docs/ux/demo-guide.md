# Guide de démonstration — prototype B14

## Prérequis (une fois, dans Penpot)
1. Ouvrir le fichier `wiro`, page **B14 · Prototype flows**.
2. Dans le panneau Prototype : chaque flow listé a son bouton **▶ Présenter** → copier le lien. Un lien par flow suffit ; garder la liste dans cet ordre.
3. Garder l'onglet Penpot visible pendant toute la démo (l'onglet plugin en veille fige les sessions d'édition — sans effet sur un lien de présentation déjà ouvert).

## Démo complète (11 parcours, ~12 min racontés)
| # | Flow | Ce qu'on montre | Durée |
|---|---|---|---|
| 1 | F1 Connexion et onboarding | Sign in → SSO → onboarding 4 étapes → import | 1 min |
| 2 | F2 Accueil et board | Home, menus (espace/utilisateur/Nouveau), ⌘K, Inbox, shell, puis board : toolbar → Menu Plus, post-it → quick toolbar, calques, zoom, présenter, kits, mind map | 2 min |
| 3 | F3 Atelier | Minuteur (setup → fin → toast), vote (setup → vote → résultats), mode privé (révélation), réactions, galerie modèles | 1,5 min |
| 4 | F4 Doc, cadre live et partage | Doc vide → slash menu → cadre live (inline edit, supprimé, sans permission, hors ligne) → propriétés → plan/focus → partage (e-mail invalide, invité ajouté, lien copié) → jointure invité | 2 min |
| 5 | F5 Bases de données | Tableau : tri, filtres (panneau, appliqué, sans résultat), fiche record ; bascule Kanban / Chronologie / Calendrier ; états chargement/vide ; notes de réunion | 1,5 min |
| 6 | F6 Recherche et wiki | Recherche : saisie, filtres, aucun résultat, hors ligne ; wiki + backlinks ; modèles ; corbeille + suppression définitive | 1 min |
| 7 | F7 Réglages et administration | Compte, préférences (→ thème sombre en direct), membres (filtre rôle, invitations, retrait), SSO, audit (filtre agents IA), facturation (ajout sièges) | 1,5 min |
| 8 | F8 Administration serveur | Vue d'ensemble, sauvegardes + modale de restauration, mises à jour (0.9.1 → 0.9.2), tenants, licence, intégrations | 1 min |
| 9 | F9 Extensions et migration | Marketplace → détail (Mobile Money) → installation avec consentement → exécution (sondage) → gestion ; portail + console éditeur ; import Miro/Notion en 4 étapes → hub import → rapport ; export center | 1,5 min |
| 10 | F10 IA et agents | Assistant vide → conversation ; suggestion en ligne (accepter/rejeter) ; ghost preview canvas ; tâche d'agent avec approbation une fois ; réglages IA/MCP ; génération | 1 min |
| 11 | F11 États système | Hors ligne → réconnexion → erreur de sync → faible débit ; accès refusé ; introuvable ; lecture seule ; mise à jour dispo ; récupération crash ; stockage ; maintenance | 1 min |

**Règle de navigation de secours** : sur chaque écran, un clic hors zone (fond) avance à l'écran suivant du parcours, dernier → premier ; un clic sur le fond d'un overlay le ferme. Si un bouton précis n'est pas câblé (déclencheur absent de la maquette), le clic-fond couvre le passage.

## Démo partielle (si F2-F4 non finis)
Flows démontrables immédiatement : **F1, F5, F6, F7, F8, F9 (+b/c/d), F10, F11** — soit la base, les données, l'admin, les extensions, l'IA et les états. Raconter « l'admin qui configure, l'agent qui installe une extension et migre l'espace, et ce que voit l'utilisateur quand le réseau tombe ».

## Points à ne pas survoler (honnêteté)
- Les parcours F2-F4 restent en câblage jusqu'à la fin de la passe des agents.
- Les variantes sombres de quelques écrans (S-16.4 scrim, S-16.8 footer) gardent des surfaces claires résiduelles.
- A0 : direction A vs B non tranchée (choix après test utilisateur).
