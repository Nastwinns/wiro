# design/tokens

`tokens.json` (W3C DTCG) est la **source de vérité**. Penpot est un miroir.

```
Penpot (sets primitive/component/light/dark) ⇄ tokens.json ──▶ packages/tokens (Story 0.3)
                                                   │            ├─ CSS vars (light/dark)
                                                   │            └─ consts Rust
                                                   └──▶ tools/contrast-check (CI)
```

- Penpot → fichier : export des jetons, puis revue de diff dans `PENPOT-DIFF.md`. Les couleurs de bibliothèque doivent référencer un jeton, jamais une valeur isolée.
- Fichier → Penpot : import DTCG (un seul rédacteur à la fois sur le fichier Penpot).
- Pipeline attendu (Story 0.3) : lire `tokens.json`, résoudre les alias `{…}`, générer `packages/tokens/dist/{tokens.css,tokens.rs}` (thèmes `light`/`dark`), puis lancer `node tools/contrast-check/check.mjs` ; la CI échoue si un ratio est sous le seuil ou si la sortie générée diffère.
- Les paires de contraste attendues sont dans `$extensions["ubao.contrast"]` de chaque jeton. Rapport : `CONTRAST-REPORT.md`.
- Règle : `border.default`/`strong` = séparation décorative ; `border.control` pour champs, cases, radios, segments.
