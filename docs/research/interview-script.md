# Script d'entretien — découverte client Ubao (Mom Test)

> But : apprendre, pas vendre. 30 min. On parle de **leur passé et de leurs habitudes**, jamais de l'avenir ni de notre idée.
> Règle d'or : pas de pitch avant la minute 25. Si on te demande « c'est quoi ton produit ? » → « Je te montre à la fin, d'abord je veux comprendre comment vous travaillez. »
> Prendre des notes dans le gabarit en bas. Un entretien = une fiche.

## 0. Ouverture (2 min)
- « Merci pour ton temps. Je travaille sur des outils de collaboration pour les équipes en Afrique. Je ne vends rien aujourd'hui : je veux comprendre comment vous travaillez vraiment. Je peux prendre des notes ? »

## 1. Contexte (3 min)
- Ton rôle, la taille de l'équipe, qui travaille avec qui (sites, télétravail, terrain) ?
- Qui décide des outils dans ton organisation ?

## 2. Outils actuels (8 min)
- Raconte-moi la dernière fois que vous avez écrit un document à plusieurs. Avec quel outil ? Comment ça s'est passé ?
- Et la dernière fois que vous avez fait un atelier, un brainstorm ou un schéma d'architecture ?
- Quels outils payez-vous aujourd'hui (M365, Google Workspace, Notion, Miro, Confluence…) ? Combien par mois, environ ?
- Qui paie, et comment (carte bancaire en $/€, bon de commande, appel d'offres) ?

## 3. Douleurs (8 min) — creuser chaque réponse avec « Raconte-moi la dernière fois »
- Qu'est-ce qui vous a fait perdre du temps le mois dernier avec ces outils ?
- Connexion : que se passe-t-il quand Internet est lent ou coupé ? Dernier exemple concret ?
- Données : vous êtes-vous déjà posé la question d'où sont hébergées vos données ? Quelqu'un vous l'a-t-il demandé (client, régulateur, CDP, direction) ?
- Coût : le prix en devises ou par utilisateur vous a-t-il déjà empêché d'équiper toute l'équipe ?
- Langue : documents en wolof / swahili / anglais — un problème ou non ?
- Qu'avez-vous déjà essayé pour résoudre ça ? (Nextcloud, OnlyOffice, outil maison…) Pourquoi ça a marché / pas marché ?

## 4. Priorités et budget (4 min)
- Si tu pouvais régler un seul de ces problèmes demain, lequel ?
- Combien vous coûte ce problème aujourd'hui (temps, argent, risque) ?
- Avez-vous un budget outils cette année ? Quand se décide-t-il ?

## 5. Variantes par segment
**CTO / fondateur de startup**
- Combien d'éditeurs actifs (ceux qui écrivent, pas qui lisent) ?
- Vous changeriez d'outil pour quoi ? Qu'est-ce qui vous retient ?

**DSI administration / établissement public**
- Comment se passe un achat logiciel chez vous (seuil, appel d'offres, Senum, bailleur) ?
- Y a-t-il une directive sur l'hébergement des données (Senum, datacenter national) ?
- Quels projets de digitalisation ou de « zéro papier » sont prévus ou en cours ?
- Qui d'autre que vous faudrait-il convaincre ?

**Intégrateur / hébergeur**
- Quelles solutions de collaboration revendez-vous ou hébergez-vous ? Marge et modèle ?
- Vos clients publics vous demandent-ils du souverain / de l'open source ?
- Qu'est-ce qui vous ferait ajouter une nouvelle solution à votre catalogue (certification, support, marge, référence) ?

## 6. Clôture (5 min) — c'est là qu'on montre
- Courte démo du prototype Penpot (2 min max). Puis : « Qu'est-ce qui manque pour que ce soit utile chez vous ? »
- **Demande d'engagement** (signal réel, pas compliment) — demander UNE de ces choses :
  - tester l'alpha avec ton équipe (partenaire de conception) ;
  - une intro à la personne qui décide / à un autre DSI ;
  - 30 min de plus avec un membre de l'équipe qui souffre le plus ;
  - une lettre d'intention (pilote, prix indicatif).
- « Qui d'autre devrais-je absolument rencontrer ? »

## Signaux à noter
| Bon signal | Faux signal |
|---|---|
| Ils ont déjà payé / bricolé une solution | « C'est génial, j'utiliserais » |
| Un exemple daté et chiffré | Opinions générales sur le futur |
| Ils proposent une intro ou un test | « Envoie-moi un mail » sans suite |
| Ils parlent de budget et de calendrier | Compliments sur le design |

## Gabarit de fiche (copier par entretien)
```
Date / Nom / Rôle / Organisation / Segment :
Outils actuels + coût :
Qui décide / comment on achète :
Douleur n°1 (citation exacte) :
Hors-ligne : oui/non — exemple :
Souveraineté : demandée par qui ? :
Prêt à payer ? Montant évoqué :
Engagement obtenu : (test alpha / intro / LOI / rien)
Intros proposées :
Prochaine action + date :
```

## Objectif de la série
- 12 à 15 entretiens d'ici fin décembre 2026 : ~8 startups, ~4 DSI, ~3 intégrateurs.
- Critère de succès : **3 à 5 partenaires de conception engagés** + 1 intégrateur intéressé + compréhension claire du circuit d'achat public.
- Mise à jour de `prospects.csv` (colonne statut) après chaque entretien.

---

# Messages d'approche LinkedIn (à envoyer toi-même)

**Karim Sy (Jokkolabs / Digital Senegal)**
> Bonjour Karim, je suis ingénieur plateforme (Kubernetes, cloud) et je construis un outil open source (MIT) de documents + tableau blanc pensé pour l'Afrique : hors-ligne, hébergeable localement. Avant d'écrire plus de code, je veux comprendre les vrais besoins des équipes au Sénégal. Auriez-vous 20 minutes pour un échange ? Votre regard sur l'écosystème me serait précieux, et je serais ravi d'être orienté vers 2–3 membres de Digital Senegal.

**Moustapha Kane (Accel Tech)**
> Bonjour Moustapha, votre parcours sur Sénégal Services et le cloud souverain m'a marqué. Je développe un outil open source de collaboration (docs + canvas) local-first, conçu pour être hébergé dans des datacenters locaux. Je cherche à comprendre comment les administrations achètent et hébergent ce type d'outil, et ce qu'un intégrateur comme Accel Tech attendrait d'une telle solution. Seriez-vous ouvert à un échange de 20 minutes ?

**CTO de startup (générique)**
> Salut [Prénom], je suis ingénieur DevOps et je travaille sur une alternative open source à Notion/Miro qui marche hors-ligne et coûte en FCFA. Pas de pitch : je veux juste comprendre comment ton équipe documente et fait ses ateliers aujourd'hui, et ce qui coince. 20 min cette semaine ou la suivante ? Je te partage en retour ce que j'apprends des autres équipes.
