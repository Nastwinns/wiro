# Écarts Penpot ↔ tokens.json

Export en lecture seule le 2026-11-11 (126 couleurs de bibliothèque ; jetons : sets `primitive` 68, `component` 8, `light` 20, `dark` 20, `direction-b/light` 4, `direction-b/dark` 4 ; thèmes Light, Dark, A Malachite, B Indigo Adire light/dark).

| Écart | Penpot | tokens.json (avant) | Résolution |
|---|---|---|---|
| `bg.subtle`, `accent.subtle`, `border.strong`, `bg.inverse`, `overlay/scrim` en couleurs de bibliothèque, absents des sets de jetons | `#F1F2EE`/`#1D2220`, `#E3EFEA`/`#15302A`, `#C9CBC4`/`#3A413E` | absents | ajoutés (`border.strong` = décoratif seulement ; `overlay/scrim` → `light/dark.bg.scrim`) |
| `status/*-subtle` (4 états, 2 thèmes) | couleurs | absents | ajoutés : `state.<état>.bg/text/border` |
| Couleurs canvas sombres (8) | `canvas / dark/*` | absentes | `primitive.color.canvas-dark.*` + `dark.canvas-note.*` |
| Présence `presence/p1..p6` (6, non thémées) | ex. `#B26B00` | absentes | 8 teintes par thème, `light/dark.presence.N.bg/text` ; p2 `#B26B00` remplacée (texte blanc 4,2:1) |
| Contour de champ `#C9CBC4` (1,64:1) | utilisé | n'existait pas | `border.control` ≥ 3:1 ; Penpot doit migrer les champs/cases/radios |
| Texte warning `#B26B00` sur `#FBF0DF` (3,73:1) | utilisé | `status.warning` seul | `text.warning` / `state.warning.text` |
| `control-height.sm` | 28 px dessiné | 28 px | 32 px (md = 36) ; redessiner Partager, segments, lignes d'arbre |
| `text.on-accent` | blanc sur malachite clair en sombre | `#0D0F0E` | tokens corrects ; corriger les instances Penpot |
| Couleurs de stylo, guide, confettis, curseurs | valeurs brutes | absentes | `pen.1-5`, `guide`, `celebration.1-5`, `presence` |
| Jeu `direction-b/*` (4 jetons) | présent | partiel (`indigo` primitif) | inchangé, hors périmètre |
| Jetons Penpot nouveaux | — | — | À réimporter dans Penpot (un seul rédacteur) : les ajouts ci-dessus n'y existent pas encore comme jetons |
