# DESIGN.md

Design system d'Ubao (nom de code Wiro). Direction **« Malachite » : le luxe du calme**.

- Charte : `docs/ux/brand-charter.md` · Principes UX : `docs/ux/ui-ux-guidelines.md`
- Jetons (DTCG) : `design/tokens/tokens.json` → `packages/tokens` ; contrastes : `tools/contrast-check`, `design/tokens/CONTRAST-REPORT.md`
- Écrans : `docs/ux/screens/` · Fondations : `docs/ux/ux-spec.md` · Handoff : `docs/ux/penpot-handoff.md`

## Règles pour les agents
1. Jetons uniquement : aucun hex brut dans les composants.
2. Un seul accent (malachite) par vue. **Or** : ornement et édition Souverain uniquement ; jamais une action, un état, un favori ni un statut.
3. Champs, cases, radios, segments : `border.control` (≥ 3:1). `border.default`/`strong` = séparation décorative.
4. Texte d'avertissement : `text.warning` ; texte sur fond teinté : `text.secondary` (pas `text.muted`). Texte sur accent clair en sombre : `text.on-accent` (noir).
5. Cibles ≥ 32 px (44 px tactile) ; densité par l'espacement, pas par des cibles de 28 px.
6. Inter pour l'UI, JetBrains Mono pour le code. Fraunces : une fois par écran en app. Exception marketing (titres de page) : **à décider par le mainteneur**, non tranchée.
7. Pas de tiret cadratin (—) ni demi-cadratin décoratif dans la copy ; utiliser deux-points, virgule ou point.
8. Mots d'interface en français : Tableau (pas Board), Page, Partager.
9. Logo officiel : `design/exports/logo/ubao/final` (symbole Escalier). Ne jamais le redessiner ni le retaper. Wordmark : SVG, jamais du texte composé.
10. Sentence case, pas de majuscules d'étiquette, pas de dégradés, pas de verre, pas de cartes imbriquées.
11. WCAG 2.2 AA, focus visible (2 px + 2 px de décalage), `prefers-reduced-motion`.
12. Conçu pour 1366×768, 4 Go de RAM et réseaux lents ; tester FR + EN (+30 %).
13. Chaque écran livre ses états vide, chargement, hors ligne, erreur, lecture seule ; états « verrouillé » et « hors ligne » en neutre + icône.
14. Présence, stylo, guides, confettis : jetons `presence`, `pen`, `guide`, `celebration` ; guide jamais en rouge.
