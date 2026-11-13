# contrast-check

Script Node sans dépendance. Lit `design/tokens/tokens.json`, résout les références `{a.b.c}` et vérifie chaque paire déclarée dans `$extensions["ubao.contrast"]` (`[{ "against": "{light.bg.surface}", "min": 4.5 }]`).

Seuils : 4,5 texte courant · 3 bordures de contrôle, focus, icônes, curseurs · 7 encre de post-it.

```
npm run check            # écrit design/tokens/CONTRAST-REPORT.md, code 1 si échec
node check.mjs tokens.json   # rapport markdown sur stdout
```
À brancher en CI (Story 0.3). Licence MIT.
