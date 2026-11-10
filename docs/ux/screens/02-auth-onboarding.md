# 02 — Auth & onboarding

Frames: desktop 1440×900, mobile 390×844. Layout: split 50/50 — left form, right brand panel (paper + "Fil" motif 5 %, one Fraunces line). Mobile: form only.

## S-02.1 Sign in
- Fields: email → "Continuer" (magic link or password depending on server config); "Se connecter avec SSO"; passkey button if available.
- Server field (self-hosted): "Adresse du serveur" with validation + TLS indicator (desktop app only).
- Language selector (FR/EN) top-right.
- States: invalid email · server unreachable (offline: "Ouvrir mes espaces hors ligne") · account locked · SSO enforced (hide email/password).

## S-02.2 SSO
Workspace domain or org code → redirect to IdP → return with spinner + "Connexion à {org}…". Error mapping: IdP denied, user not provisioned (ask admin).

## S-02.3 Magic link / code
"Vérifiez vos e-mails" + 6-digit OTP input (input-otp) as fallback for slow mail; resend after 30 s; open mail app buttons.

## S-02.4 Guest join (no account)
From share link: preview card (page title, owner, workspace), field "Votre nom", colour chip auto, checkbox "Mémoriser sur cet appareil", "Rejoindre". Shows what guest can do (modifier / commenter / voir). Data-light note if mobile: "Mode faible débit activé".

## S-02.5 Onboarding wizard (first run, ≤ 4 steps, skippable)
1. Langue & région (FR/EN, date format, currency).
2. Créer l'espace de travail: name, logo optional, team size (for templates only — never pricing).
3. Ce que vous voulez faire: Atelier · Spécification · Planification · Wiki (multi-select) → seeds templates.
4. Inviter l'équipe: emails or link copy, roles; "Plus tard".
End: lands on Home with a seeded sample board "Bienvenue" (interactive tutorial board, dismissible).
- Desktop app first run adds: "Où stocker vos données ?" (local folder, encryption on) + server connect or local-only.

## S-02.6 Import
Sources tiles: Notion (zip), Markdown folder, Excalidraw, Miro (backup/CSV), Images/PDF → board. Steps: choose file → mapping preview (pages count, assets) → destination space → progress (resumable) → report (imported / warnings). Offline-capable for local files.
