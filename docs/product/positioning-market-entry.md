---
title: Positionnement, entrée marché Afrique + Europe, différenciation
status: draft v0.1 (obviously-awesome + crossing-the-chasm + recherche web nov 2026). Les points [À VÉRIFIER] ne sont pas prouvés.
created: 2026-11-11
inputs: docs/research/competitive-audit.md, docs/product/market-offer-study.md, brief, PRD v0.2
---

# Positionnement d'Ubao

## 1. Description (une phrase, un paragraphe)

**Une phrase.** Ubao est l'espace de travail ouvert où une équipe écrit, dessine et décide au même endroit : documents et tableau blanc infini, qui fonctionne hors ligne et que vous hébergez où la loi l'exige.

**Un paragraphe.** Ubao réunit le document de type Notion et le tableau blanc de type Miro dans une seule application, sous licence MIT, serveur compris. Elle reste fluide sur un portable d'entrée de gamme, continue de fonctionner sans réseau, ménage les données mobiles, se facture en monnaie locale et se déploie sur votre serveur, un cloud national ou un réseau isolé. Les invités ne paient jamais.

**Version courte pour l'écran** : « Écrivez, dessinez, décidez, ensemble. »

## 2. Canevas de positionnement (méthode Dunford)

| Composant | Réponse |
|---|---|
| Alternatives réelles | 1) Notion + Miro (ou FigJam) payés en USD par carte ; 2) WhatsApp + Google Docs + Excel + papier (alternative n°1 en Afrique, à confirmer en entretiens) ; 3) Microsoft 365 / Whiteboard déjà dans le budget ; 4) pour l'administration : ne rien faire ou un outil bureautique imposé |
| Attributs uniques (test « seulement nous ») | Documents + canvas dans un même objet (une page est un doc ou un board) ; MIT sur tout le périmètre, serveur inclus, sans plafond d'utilisateurs ; hors ligne par défaut et mode faible débit avec compteur de données ; prix en XOF/NGN/KES et invités gratuits ; déployable en réseau isolé (air-gap) avec réseau de partenaires certifiés |
| Valeurs | Ne plus perdre de travail ni de temps sur une mauvaise connexion ; garder ses données chez soi (conformité) ; payer en monnaie locale, sans surprise ; un seul outil au lieu de trois |
| Clients les plus adaptés | Startups et PME techniques (5 à 50 personnes) d'Afrique francophone d'abord ; administrations et agences qui doivent héberger en pays ; facilitateurs d'ateliers (ONG, agences) |
| Catégorie | **Sous-catégorie** : « espace de travail souverain (docs + canvas) ». Éviter « nouvelle catégorie » (coût d'éducation trop élevé pour un fondateur seul) et éviter de se placer contre Miro seul. |
| Tendances | Politiques cloud en Afrique : Kenya Cloud Policy 2025, NITDA 2026 au Nigeria, cloud souverain au Sénégal (SENUM avec Alibaba Cloud, atelier technique récent). En Europe : stratégie open source de l'UE (Communication du 3 juin 2026) et projet de Cloud and AI Development Act avec un principe « open source d'abord » dans la commande publique (proposition, pas encore une loi) |
| Preuves à produire | Benchmark public 10 000 objets à 60 i/s ; démo hors ligne en direct ; pilote startup + pilote administration ; code auditable ; paquet d'appel d'offres |

### Déclaration de positionnement
Pour les équipes et administrations qui doivent garder leurs données chez elles et travailler avec un réseau instable, Ubao est l'espace de travail souverain (documents + tableau blanc) sous licence MIT qui fonctionne hors ligne et se paie en monnaie locale, contrairement à Notion + Miro (cloud en dollars) et aux solutions européennes propriétaires.

## 3. Se démarquer des concurrents (honnête)

| Concurrent | Ce qu'il fait bien | Notre écart vrai | Notre écart à NE PAS revendiquer |
|---|---|---|---|
| Miro | Référence canvas, écosystème | Pas de déploiement sur site, USD, lourd au-delà de quelques milliers d'objets | Ne pas attaquer sur les fonctions (modèles, intégrations) avant la v1 |
| Notion | Docs + bases | Hors ligne partiel, cloud seulement | Ne pas promettre la parité des bases de données au lancement |
| AFFiNE | Docs + canvas open source, local-first : **notre concurrent le plus proche** | Serveur sous licence distincte, limites rapportées en auto-hébergement, stabilité (issue #14006), pas d'offre souveraine/partenaires | « Docs + canvas open source » n'est pas unique en soi |
| AppFlowy | Open-core, très orienté Notion | Pas de canvas de première classe | : |
| Collaboard / Conceptboard | Souveraineté européenne, secteur public (Suisse, Allemagne), cloud DE/CH/NL, sur site | MIT + serveur ouvert, prix et monnaies africains, docs intégrés | Ne pas nier leur maturité sectorielle |
| La Suite numérique (France) / openDesk (Allemagne) | Suite publique open source, financement d'État | [À VÉRIFIER] absence de tableau blanc/canvas intégré de ce niveau ; Ubao peut être une brique, pas un rival | Ne pas se présenter comme « suite complète » |
| Cynoia | Africain, prix bas | Docs + canvas, MIT, souverain | Le prix seul n'est pas un avantage |

**Ce qui est unique aujourd'hui (à garder dans le discours) :** (1) MIT de bout en bout serveur compris, (2) docs et canvas fusionnés, (3) hors ligne + faible débit, (4) monnaie locale + invités gratuits, (5) réseau de partenaires certifiés. Une seule de ces cinq choses est copiable en un trimestre par un concurrent (la licence), donc le **fossé réel = la combinaison + la confiance + le réseau**. Dire cela à voix haute dans les pitchs.

## 4. Entrer en Afrique (méthode du fossé : une seule tête de pont)

**Tête de pont recommandée : startups et agences tech d'Afrique francophone de l'Ouest (Dakar, Abidjan), 5 à 50 personnes, qui animent des ateliers.**
- Raison : douleur urgente (facture USD, faible débit, cartes bancaires), accès direct via le réseau du fondateur, bouche-à-oreille rapide, cas d'usage ateliers + spec.
- Second quille : administration (Sénégal d'abord) via intégrateur local et cloud souverain (SENUM, Orange Business/Sonatel). Cycle long, donc lancé en parallèle mais non critique pour la trésorerie.
- Troisième quille : Kenya et Nigeria anglophones (politiques cloud déjà actées), avec traduction EN/SW.

**Produit complet (« whole product »)** : import Notion/Miro/Excalidraw, onboarding < 10 min, modèles par cas d'usage, facturation en XOF (virement/Mobile Money plus tard), support en français, hébergement en pays, formation de facilitateurs.

**Canaux** : démos X (hors ligne, faible débit), LinkedIn pour décideurs, communautés de startups (Dakar, Abidjan), programme partenaires (intégrateurs et opérateurs de datacenter), appels d'offres via consortiums locaux.

**Messages à tester (entretiens « Mom Test », jamais « achèteriez-vous ? »)** : « Vous perdez combien d'heures par mois quand la connexion saute ? », « Combien payez-vous Notion + Miro aujourd'hui et comment ? ».

## 5. Entrer en Europe (deuxième quille, après les premières références)

L'Europe n'est pas un marché de départ pour un fondateur seul ; c'est une **deuxième quille** à ouvrir quand la v1 et 3 références existent. Angle : la souveraineté et l'open source ne sont plus un argument de niche mais un critère d'achat.

- **Signal marché** : stratégie open source de l'UE (juin 2026), proposition de Cloud and AI Development Act (article « open source first » dans la commande publique, article de contribution à l'écosystème européen), La Suite numérique (France) et openDesk (Allemagne) qui construisent des suites publiques open source.
- **Positionnement Europe** : pas « alternative à Miro » (14 alternatives déjà listées, sans domination claire), mais **« la brique docs + canvas MIT pour les suites publiques »** : intégrable, auditée, sans verrou.
- **Voies d'entrée** : (1) partenaire ou brique pour La Suite / openDesk / ZenDiS, (2) pilotes ONG et agences de développement européennes actives en Afrique (avantage naturel : terrain africain + conformité européenne), (3) fonds publics et subventions pour l'open source (Sovereign Tech type), (4) places de marché publiques et accords-cadres, (5) communautés open source (GitHub, FOSDEM).
- **Pré-requis** : conformité RGPD documentée, hébergement UE possible, SBOM et signatures, entité juridique claire (ADR-0009 non décidé), documentation en anglais, FR/EN/DE à terme.
- **Piège** : Collaboard et Conceptboard sont déjà établis dans le secteur public suisse et allemand. Ne pas les attaquer de front ; viser les administrations qui exigent l'open source et la liberté de code.

## 6. Séquence

1. **Maintenant à v1** : Afrique francophone (startups + 1 pilote administration), démos publiques, dépôt ouvert, entretiens.
2. **v1 + 3 mois** : Kenya/Nigeria (EN), Team Cloud en 3 pays, premières références publiées.
3. **v1 + 6 mois** : ouverture Europe via brique La Suite/openDesk, ONG européennes, dossiers de financement.
4. **Ensuite** : appels d'offres UE avec partenaire, éditions en allemand.

## 7. À vérifier avant de communiquer
- Existence ou non d'un tableau blanc/canvas intégré dans La Suite numérique et openDesk.
- Limites actuelles de l'auto-hébergement AFFiNE (licence du serveur).
- Statut du Cloud and AI Development Act (proposition seulement).
- Concurrents africains autres que Cynoia.
- Validation du nom Ubao (locuteur swahili, marque OAPI/ARIPO/EUIPO).

## Sources
Commission européenne, stratégie open source (digital-strategy.ec.europa.eu) ; Global Policy Watch (juin 2026) ; analyses du Cloud and AI Development Act (Cloud Security Alliance, SUSE, Law & Economics Center) ; La Suite numérique (github.com/suitenumerique), openDesk.eu ; European Tech Map (Miro, 23 sept. 2026) ; Collaboard et Conceptboard (sites officiels) ; Tech Review Africa (SENUM / Alibaba Cloud) ; Dabafinance (Afrique francophone) ; AppFlowy et AFFiNE (comparatifs auto-hébergés 2026) ; audits internes du dépôt.
