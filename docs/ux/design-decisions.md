---
title: Tranches de décisions — maquettes Ubao (design)
status: decided — 2026-11-13 (mainteneur: « finis tout et tranche en respectant spec + archi + guidelines »)
---

# Décisions appliquées aux maquettes (source: specs 09/10, architecture.md, brand-charter, ui-ux-guidelines)

1. **Rôles — deux échelles par périmètre (elles ne se contredisent pas)**
   - **Espace de travail / admin (S-10.4, S-10.5)** : Propriétaire · Admin · Membre · Invité (spec 10 : Owner/Admin/Member/Guest ; custom roles plus tard). Les menus Proto et le filtre de B10 qui proposent « Éditeur/Lecteur » sont **corrigés** vers cette échelle.
   - **Partage de document (S-09.1)** : Éditeur · Commentateur · Lecteur (spec 09). « Lecteur » doit exister dans le sélecteur.
   - Facturation suit l'architecture : seuls les rôles **Éditeur et au-dessus** sont facturés ; Commentateur/Lecteur/Invité/suspendus/jamais connectés jamais facturés (spec 09 l.8).

2. **Facturation S-10.8 — prix dérivés de la grille marketing (règle EUR-parité)**
   - Siège Business Cloud : **4 000 FCFA · HT · par éditeur et par mois** (6 € au cours retenu). 38 sièges facturés = **152 000 HT**, TVA 18 % = **27 360**, total **179 360 FCFA**. Les 5 000 HT et 4 500 TTC des frames sont **abandonnés** ; les trois frames (Light, Dark, Add seats) sont unifiées.
   - Les prix du site sont **HT** ; mention « TVA 18 % » sur la facture uniquement.
   - Factures : numéros FAC-2026-0xx cohérents, contact **comptabilite@mnum.gouv.sn** (univers gouv.sn des personas).

3. **Noms de frames** — convention page 00 : `S-xx.y <Nom> / <Viewport> / <Thème> / <État>` ; thème `Light/Dark` (noms des tokens), états standard en anglais (`Default/Loading/Empty/Offline/Error`), états descriptifs `Proto / …` en français conservés. Segments d'état manquants → `/ Default`. `light` → `Light`. **Appliqué seulement le prototype B14 terminé** (proto_copy est idempotent par nom de source). Les copies `P ·` de B14 gardent leur nom figé à la copie.

4. **Version démo unique : 0.9.2** (client et serveur, un seul train de publication avant v1 ; ADR-0011). S-10.1 « 1.4.2 » → 0.9.2 ; B11 « 2.4.x » → 0.9.2 ; S-12.8 déjà 0.9.2.

5. **Terminologie** : « **Mode faible débit** » partout (S-01.6, S-10.3, S-02.4 l'emploient déjà) ; « Économie de données » (S-12.3) est abandonné.

6. **Votes S-06.3** : les badges du canvas font foi ; le panneau de résultats est aligné dessus (Dépôt de dossier 14 · Paiement 11 · Retrait 9 · Kiosque 7 · SMS 5 · Aide 3, cadre « Idées »).

7. **États ajoutés / corrigés** : S-07.1 « Vide » = base vide (« Aucune ligne » + « + Nouvelle ligne » + « Importer »), pas l'espace vide ; Kanban reçoit une colonne « Bloqué » (1 carte déplacée, WIP 4/4 respecté) ; S-10.4 Read only : bouton « Inviter des membres » désactivé visuellement ; S-15.2 langues locales = « bêta » (pas « Brouillon ») ; B13 S-13.6 champ « Votre nom » (spec S-02.4) et S-13.2 arborescence réelle (pas les textes du wizard).

8. **S-15.1 « Off »** (décision états manquants 2026-11-13) : la spec 15 (acceptance) fait foi — quand l'IA est désactivée, **tous les points d'entrée IA sont masqués côté utilisateur**, jamais grisés. La frame `S-15.1 Panneau Assistant / … / Off` (panneau grisé + carte « L'assistant est désactivé » + bouton Réglages › IA) est **conservée comme état transitoire** : panneau déjà ouvert quand la politique admin s'applique en cours de session. À l'implémentation : masquer l'entrée (Ctrl J, boutons IA, menus) ; ne jamais griser.
