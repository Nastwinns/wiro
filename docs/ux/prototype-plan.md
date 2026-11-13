---
title: Prototype interactif Desktop & Web — plan
status: v0.1 — 2026-11-11 (GO maintainer reçu ; exécution après les variantes sombres)
---

# Objectif
Un prototype Penpot cliquable (desktop 1440/1366 + web) pour tester **tous les parcours**, **menus**, **tableaux**, **filtres**, **formulaires** et **fenêtres modales**. Pas d'app mobile (responsive web 390/768 couvert par les frames B13 seulement, sans parcours dédié). Identité visuelle et design system inchangés (jetons, composants, typos existants).

# Contrainte technique (vérifiée dans l'API)
Un lien Penpot (navigate-to / overlay) cible un board **de la même page** ; un flow appartient à une page. Donc le prototype vit sur **une page dédiée B14 · Prototype flows** qui contient des **copies** des frames utiles. Les sources restent sur B01–B16/C (inchangées). Copie inter-pages : cloner le frame source → `createComponent` → `instance()` sur B14 → `detach()` → supprimer le clone-main (procédure testée le 2026-11-11 pour déplacer ; ici le clone protège la source). Les copies portent le préfixe `P · ` et un calque `proto-source` (nom de la source). Régénérable ; toute modification de design se fait sur la source puis recopie.

# Parcours (flows nommés, point de départ)
| Flow | Départ | Étapes (frames existants → à créer = ⊕) |
|---|---|---|
| F1 Connexion & onboarding | S-02.1 Sign in | email invalide ⊕/erreur → S-02.3 code (Code entry → Wrong code → Resend) → S-02.5 wizard étapes 0-storage/1/2/3/4 (⊕ erreur nom d'espace) → S-03.1 Home |
| F2 Home → board | S-03.1 Home | menu espace de travail ⊕ → menu utilisateur ⊕ → menu « + Nouveau » ⊕ → S-05.1 Board → S-05.2 toolbar (menu « Plus » ⊕) → S-05.3 quick toolbar → S-05.4 inspecteur → S-05.5 calques → S-05.6 zoom/minimap → S-05.7 présentation |
| F3 Atelier | S-06.1 barre animateur | S-06.2 minuteur → fin (toast) → S-06.3 config vote → vote participant → résultats → S-06.4 mode privé → S-06.5 réactions |
| F4 Doc + cadre live + partage | S-04.1 Doc | S-04.2 menu « / » → S-04.3 barre de sélection → S-04.4 cadre live (+ états) → S-09.1 partage ⊕ (invitation, e-mail invalide, lien copié) → S-02.4 invité |
| F5 Bases de données | S-07.1 Table | tri ⊕ (asc/desc) → panneau filtres ⊕ → résultat filtré ⊕ → filtre sans résultat ⊕ → S-07.2 Kanban → S-07.5 fiche → S-07.3/07.4 vues |
| F6 Recherche & wiki | S-08.3 Search | résultats ⊕ filtrés → sans résultat ⊕ → S-08.1 Wiki → S-08.2 backlinks → S-08.5 corbeille → restauration |
| F7 Réglages & admin | S-10.1 Compte | S-10.4 Membres : recherche/filtre rôle ⊕, menu rôle ⊕, modale invitation ⊕, confirmation retrait ⊕ → S-10.5 rôles → S-10.6 SSO → S-10.7 audit (filtre ⊕) → S-10.8 facturation (ajout de places) → S-10.9 marque |
| F8 Administration serveur | S-11.1 Vue d'ensemble | S-11.2 sauvegardes (modale restauration ⊕) → S-11.3 mises à jour → S-11.4 tenants → S-11.5 abonnement → S-11.6 intégrations |
| F9 Extensions & migration | S-16.1 Marketplace | S-16.2 détail → S-16.3 consentement (modale) → S-16.4 exécution → S-16.5 gestion → S-02.6 import (étapes 1→4) → S-16.9 export |
| F10 IA & agents | S-15.1 Assistant | S-15.2/15.3 suggestions → S-15.8 permission (modale) → S-15.4 tâche agent → S-15.5 présence → S-15.6/15.7 réglages |
| F11 États système | S-12.1 Hors ligne | S-12.2 sync → S-12.4 erreur → S-12.5/12.6/12.7 → S-12.9 récupération |

# Interactions à câbler (types Penpot)
- **navigate-to** (clic bouton/ligne/onglet) entre frames complets ; **previous-screen** pour « Annuler/Fermer/Retour ».
- **open-overlay / close-overlay** pour menus et popovers (workspace, utilisateur, « + », « Plus », rôle, menu contextuel, filtres) : chaque menu = petit board overlay ⊕ (position relative au déclencheur).
- **modales** : dialogues (invitation, restauration, retrait, consentement, vote) en overlay avec fond atténué ⊕ ; fermeture clic dehors / « Annuler ».
- **tableaux/filtres/formulaires** : Penpot ne calcule rien → chaque état est un frame (⊕) relié par interaction ; les en-têtes de colonne, puces de filtre, champs en erreur et boutons de soumission sont les déclencheurs. Champs : état normal → focus → erreur → succès.
- Survols (hover) sur lignes de tableau, boutons ; raccourcis non simulés (documentés).

# États à créer (⊕) — page d'origine, nom `S-xx.y … / Proto / <état>`
S-02.1 e-mail invalide ; S-02.5 erreur nom d'espace ; S-03.1 menu espace + menu utilisateur + menu « + Nouveau » ; S-05.2 menu « Plus » ; S-07.1 tri asc, tri desc, panneau filtres, filtré, filtré vide ; S-08.3 résultats filtrés, aucun résultat ; S-09.1 dialogue de partage (défaut, e-mail invalide, invité ajouté, lien copié) ; S-10.4 recherche, filtre rôle, menu rôle, modale invitation, confirmation retrait ; S-10.7 filtre actif ; S-11.2 modale de restauration ; S-12.x aucun nouveau. ≈ 30 frames/overlays.

# Livrables
1. Page **B14 · Prototype flows** : un frame « Carte des parcours » (diagramme F1–F11) + copies `P · …` rangées par flow (une ligne par flow) + flows Penpot nommés F1…F11 (`page.createFlow`).
2. Interactions câblées (comptées par flow dans le rapport).
3. `docs/ux/prototype-test-script.md` : scénarios de test par flow (tâche, chemin attendu, critère de réussite, points d'observation), + checklist menus/tableaux/filtres/formulaires/modales.
4. Lien de visualisation (mode « présenter » Penpot) à fournir par le mainteneur (le MCP ne génère pas de lien public) ; doc d'usage.

# Hors périmètre / limites assumées
Pas de logique réelle (tri/filtre calculés), pas de saisie clavier réelle, pas de temps réel/collab simulée, pas de prototype mobile natif. Les copies divergent des sources si les sources changent (recopie scriptée : `tools/penpot/proto_copy.js`).
