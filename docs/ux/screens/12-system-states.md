# 12 — System states (apply to every screen)

| ID | State | Pattern |
|---|---|---|
| S-12.1 | Offline | Status badge + toast once; all editing allowed; disabled: share, permission changes, AI, external embeds (placeholder with "Disponible en ligne") |
| S-12.2 | Reconnecting / syncing | Indicator animates; pending ops count; never blocks |
| S-12.3 | Low bandwidth | Leaf icon; images as blurred placeholders "Charger (240 Ko)"; presence throttled |
| S-12.4 | Sync error | Banner with retry, "Copier le diagnostic", data safe message |
| S-12.5 | Permission denied | Full-page: lock illustration (line), "Vous n'avez pas accès", "Demander l'accès" (sends request) |
| S-12.6 | Not found / deleted | "Cette page a été supprimée" + restore (if allowed) / go home |
| S-12.7 | Read-only / locked | Top banner, tools disabled with tooltip reason |
| S-12.8 | Update available (desktop) | Small pill in sidebar footer → "Redémarrer pour mettre à jour"; never forced mid-session |
| S-12.9 | Crash recovery | On restart: "Vos modifications locales ont été restaurées" (n ops) |
| S-12.10 | Storage almost full (device) | Warning in settings + toast with "Libérer de l'espace" |
| S-12.11 | Server maintenance | Banner with schedule; app keeps working offline |
| S-12.12 | Empty states | Per screen: Fraunces title, one line, one primary action, one template |
| S-12.13 | Loading | Skeletons per layout; canvas progressive (frames first, then details) |
