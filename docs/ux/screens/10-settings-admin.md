# 10 — Settings & workspace admin

Layout: settings modal-page (full overlay) with left nav groups: **Compte** · **Préférences** · **Hors ligne & données** · **Espace de travail** (admins) · **Sécurité** (admins) · **Facturation** (owners).

## S-10.1 Account
Avatar, name, email, password/passkeys, sessions & devices (revoke), 2FA, delete account.

## S-10.2 Preferences
Language (FR/EN/+community with completeness %), theme (system/light/dark), density (compact/comfortable), start page, keyboard shortcuts viewer, canvas input (trackpad/mouse), reduced motion.

## S-10.3 Offline & data
Per workspace: "Disponible hors ligne" toggle + size on device; storage location (desktop); **Mode faible débit** (auto when connection slow / always / never); media quality (original / optimized / minimal); data used this month chart; clear local cache; export local backup.

## S-10.4 Members
Table: name, email, role, groups, last active, status (active/invited/suspended), billed (yes/no column — transparency); bulk actions; invite; domain auto-join.

## S-10.5 Roles & guests
Roles matrix (Owner, Admin, Member, Guest; custom roles later); guest policy (allow links, max guest role, expiry default); space creation rights.

## S-10.6 SSO & provisioning
OIDC/SAML setup wizard (metadata URL, test login), enforce SSO, SCIM token, group → role mapping.

## S-10.7 Audit log
Filterable table: time, actor, action, object, IP/device; export CSV/JSON; retention setting; integrity hash (sovereign).

## S-10.8 Billing (fair-billing UX)
Plan card, seats used/billed, next invoice preview in local currency, **"Qui est facturé ?"** explainer, add seats (shows exact cost before confirming), invoices list (PDF), billing contact, payment methods (card / bank transfer / invoice; mobile money later). Never auto-upgrade; downgrades pro-rata.

## S-10.9 Branding (white-label)
Logo light/dark, accent colour (validated for contrast), custom domain, email sender, login page text.
