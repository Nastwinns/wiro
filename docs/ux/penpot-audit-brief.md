# Brief agents — audit de coquilles Penpot (fichier `wiro`)

Objectif : vérifier **chaque frame de ta liste de pages** et corriger les coquilles. Répertoire : `/Users/balin/Project/wiro`. Lis d'abord `docs/ux/penpot-agent-brief.md` (règles générales : verrou, timeouts, retries sur « suspended » ET « frozen », page active globale).

## Méthode (lecture seule d'abord)
1. Écris un script JS (dans un dossier temporaire à toi) qui, pour chaque page de TA liste : `openPage`, puis pour chaque frame :
   - liste les calques `text` avec leur `characters` ;
   - signale les anomalies ci-dessous ;
   - liste aussi les frames elles-mêmes (nom, taille, enfants, position).
2. Fais tourner via `tools/penpot_call.sh <script>` (un appel < 100 s ; découpe page par page si besoin).
3. **Corrige** ce qui est mécanique (liste blanche ci-dessous). Signale tout le reste dans ton rapport, ne corrige pas ce qui demande une décision.
4. Relis après correction (re-run du scan sur ce qui a été touché).

## Anomalies à chercher
- **Textes vides** ou réduits à un caractère (`-`, `/`, espace).
- **Espaces doubles** entre mots ; espace avant virgule ; double ponctuation (`..`, `!!`, `!,`) ; ` ,` (espace avant virgule — en français l'espace avant `?!:;` est normal, ne pas toucher).
- **Mots répétés** consécutifs identiques (« la la », « de de »…).
- **Guillemets droits** `"` dans du texte FR (préférer `« »`), apostrophe droite `'` dans un mot (préférer `’`).
- **Fautes / accents manquants** courants en FR : `acces`, `evenement`, `parametres`, `presentation`, `autoriser`, `connection`, `addresse`, `language`, `sur`, `modale` vs `model` — juge avec contexte (certains mots anglais sont voulus : noms de produits, `S-xx`, `Souverain` est correct…). Le fichier est en **français** pour l'UI ; l'anglais n'est attendu que pour des termes techniques ciblés (Marketing, SSO, MCP, API…).
- **Noms de frames** hors convention `S-xx.y <Nom> / <Viewport> / <Thème> / <État>` : signale (les renommer = correction mécanique si évidente, sinon rapport).
- **Frames vides (100×100 ch=0), doublons de frames** (même nom dans la même page, ou contenu identique à la position près), frames orphelins (`_test`, `_shell`, `Text`, calques parasites à la racine de page).
- **Textes hors cadre** : `isContainedIn` donne des faux positifs ; vérifier par les coordonnées absolues avant de signaler.

## Corrigé sans demander (liste blanche)
- Espaces doubles, espaces avant virgule, doubles ponctuations, guillemets/apostrophes typographiques, textes vides isolés (supprimer le calque s'il est vide ET sans rôle visible dans son nom).
- Suppression de frames vides 100×100 ch=0 et de doublons **stricts** (même nom, enfants identiques) en gardant celui bien positionné.

## Ne corrige pas (rapport seulement)
- Choix de copie, ton, vocabulaire métier ; termes anglais ambigus ; incohérences de rôles entre écrans ; tout ce qui touche la structure d'un écran.

## Format du rapport final
Tableau par page : frame | anomalie | corrigé? | détail. Puis « propres » : nombre de frames vérifiées, nombre de corrections, liste des anomalies non corrigées avec raison.
