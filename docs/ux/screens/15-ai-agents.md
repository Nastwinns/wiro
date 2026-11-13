# 15 — AI assistant & agents (MCP)

Scope: PRD E10 (AI optional, off by default, bring-your-own model) + FR8.3 (MCP server for AI agents). Principle: **respectful copilot, never autopilot** — AI proposes, the human disposes; every AI action is labelled, previewable, reversible and audited. Sovereignty first: the model runs where the admin decides (local Ollama/vLLM, in-country endpoint, or none); a data-boundary badge always says where data goes.

Visual language: AI marker = `sparkles` icon + label « IA » in `text.secondary` on `accent.subtle` — **never gold** (gold = Sovereign ornament) and no gradients/glow. AI-generated content carries a discreet « Généré par IA » chip until a human edits or accepts it.

## S-15.1 Assistant panel (right panel 380, Ctrl J)
- Header: « Assistant » · scope selector (Cette page / Ce tableau / L'espace) · model badge (« Modèle local · hébergé par le ministère ») · ⋯ (history, settings).
- Empty state: 4 suggested prompts adapted to context (doc: Résumer, Lister les décisions, Traduire en anglais, Rédiger la suite ; board: Regrouper les post-it, Synthétiser l'atelier, Créer une carte mentale, Transformer en tâches).
- Messages: user right-aligned plain; assistant left with **sources** (chips linking to pages, blocks, stickies), actions (Insérer dans la page, Copier, Créer des tâches), feedback 👍/👎, « Généré par IA ».
- Streaming with « Arrêter ». Composer: multiline, @ to mention pages/people, attach selection, model + autonomy hint below.
- States: off (admin disabled → explanation, no upsell), offline (desktop with local model works; web shows « Disponible en ligne »), low bandwidth (text-only, no previews), error (retry, model unreachable).

## S-15.2 Inline AI in docs
- Selection toolbar « IA ▾ » and slash command `/ia`: Résumer · Améliorer l'écriture · Raccourcir · Traduire (FR, EN, wolof, haoussa, swahili — marked « bêta » for local languages) · Transformer en tâches · Rédiger depuis le plan · Diagramme depuis le texte.
- Result appears as an inline **suggestion block** (accent left border, diff for rewrites): Accepter · Modifier · Rejeter · Réessayer. Nothing is written before Accepter. Undo 10 s toast after accept.

## S-15.3 AI on the canvas
- Quick toolbar on multi-selection: « IA ▾ » → Regrouper par thème · Résumer · Créer une carte mentale · Transformer en tâches · Dupliquer en anglais.
- Preview as **ghost objects** (dashed outline, 50 % opacity) with a floating approval bar: « 6 groupes proposés » · Appliquer · Ajuster · Annuler.
- Workshop end: « Synthétiser l'atelier » → creates a meeting-notes doc draft (decisions, actions) shown side-by-side before saving.

## S-15.10 Generate on the canvas (« Dessiner avec l'IA »)
The assistant is a **maker**, not only a chat: it creates real, editable board objects (never flat images).
- Entry points: canvas prompt bar (Ctrl K → « Dessiner… », or double-click empty space → « Décrire »), toolbar `sparkles` tool, assistant panel.
- Prompt bar (bottom-centre, 640 px): text field « Décrivez ce que vous voulez dessiner », **type chips** (Diagramme de flux · Carte mentale · Organigramme · Frise chronologique · Kanban · Matrice 2×2 · Parcours usager · Maquette d'écran · Schéma d'architecture · Diapositives), style (Précis / Esquisse), size (Simple / Détaillé), « Utiliser la sélection comme contexte ».
- Generation streams **object by object** into a ghost frame with the agent cursor drawing (dashed outline, 50 % opacity), then an approval bar: Conserver · Régénérer · Variantes (3 thumbnails) · Annuler. Everything stays native (stickies, shapes, connectors, text), so it is editable and synced.
- Also: sketch → clean shapes (pen strokes recognised), photo of a paper whiteboard → editable stickies (OCR, local model), text block → diagram, table → chart, frames → slide deck with speaker notes.
- Optional image generation (only if an image model is configured by the admin): illustration / icon placeholder, labelled « Image générée par IA », with alt text proposed.

## S-15.11 Fill documents, templates and databases (« Remplir »)
- On any template (meeting notes, spec, project brief, decision record): « Remplir avec l'assistant » → asks 3 short questions or uses linked sources (board, previous meeting, attached PDF) → fills each section as **suggestion blocks** (accept per section or all).
- Databases: « Remplir les colonnes vides » (e.g. summary, priority, owner suggestion) with per-cell suggestions highlighted until accepted; « Créer des lignes depuis… » (pasted text, PDF, board selection).
- Doc ↔ board: « Transformer cette section en tableau blanc » and « Rédiger le document à partir de ce tableau » (both directions keep links).
- Forms in local languages: translate a filled doc while keeping structure (FR → EN, wolof, haoussa, swahili — beta).

## S-15.12 Suggestion system — how AI proposals appear, and their N variants
One grammar everywhere (doc, board, database, settings): **trigger → generating → proposal → choose among N → accept / modify / reject → applied (undoable) → logged**.

### 1. Surfaces (from quietest to most explicit)
| # | Surface | Where | Trigger | Looks like | Accept / dismiss |
|---|---|---|---|---|---|
| 1 | **Ghost text** (autocomplete) | doc body, sticky text | user pauses ≥ 600 ms at end of a line, opt-in per user | grey `text.muted` continuation after the caret, max 1 sentence | `Tab` accept · `Échap` or keep typing dismiss · `Alt+]` / `Alt+[` next/previous variant |
| 2 | **Hint chip** (proactive) | margin of a block / near a selection on the board | detected opportunity (e.g. 12 unsorted stickies, a list that looks like tasks) — max 1 visible, max 3 per session, never during typing | small chip `sparkles · Regrouper par thème ?` | click → opens 3 or 4; `×` dismiss (then silent for this object) |
| 3 | **Inline suggestion block** | doc | `/ia`, selection toolbar « IA ▾ », assistant « Insérer » | dashed accent block with label « Suggestion », body, actions; rewrites show a **diff** (strike/insert) | Accepter · Modifier (edits become yours) · Rejeter · ‹ 1/3 › |
| 4 | **Ghost objects** | board | prompt bar, quick-toolbar « IA ▾ », chip | native objects at 50 % opacity, dashed accent outline, agent cursor drawing | approval bar: Conserver · Régénérer · Variantes · Annuler |
| 5 | **Cell suggestions** | database | « Remplir les colonnes vides » | cell text in `text.muted` italic + small sparkles; header shows « 18 suggestions » | per cell ✓/✕, per column « Tout accepter », `Entrée` / `Suppr` in grid |
| 6 | **Assistant answer** | right panel | chat | message with sources + action buttons | actions create a block / ghost objects (back to 3 or 4) |
| 7 | **Approval gate** | panel or dialog | any write outside the current page, external MCP agent | warning card listing side effects | Autoriser une fois · Toujours ici · Refuser |

### 2. N variants ("n possibilités")
- Default **N = 3** (admin can set 1 to 5; local small models default to 2 to save compute). Generated **lazily**: variant 1 streams immediately; 2..N are generated only when the user asks for them (‹ › or « Variantes »), to save time, data and GPU.
- **Text** (ghost text, suggestion block): pager `‹ 2 / 3 ›` in the block header; keys `Alt+]` / `Alt+[`; each variant has a one-word intent tag (« Concis », « Formel », « Détaillé ») so they differ on purpose, not randomly.
- **Board**: variants are **different structures**, not reshuffles — e.g. Flux · Couloirs par acteur · Carte mentale; shown as thumbnails under the approval bar; hovering a thumbnail previews it in place (ghost swap, 200 ms crossfade); click to select; « Affiner » field adds an instruction and regenerates only the selected variant.
- **Database**: per-cell variants via a small popover (`Alt+]` cycles) — rarely more than 2.
- **Compare**: `Maj+clic` on two variants opens a side-by-side compare (text) or split preview (board).
- **Mix**: board variants can be partially kept — select ghost objects in variant 2 and « Conserver la sélection ».

### 3. Lifecycle & states
1. *Trigger* (explicit or chip) → 2. *Generating*: skeleton lines or ghost objects appearing one by one, « Arrêter » always visible, progress « 9 objets sur 14 » → 3. *Proposal*: labelled « Suggestion », nothing saved, not synced to others (only the requester sees ghosts unless they share the preview) → 4. *Choose* among N → 5. *Accept* (writes, syncs, undo toast 10 s, chip « Généré par IA » stays until a human edits) / *Modify* (content becomes human-owned) / *Reject* (gone, optional reason 👎 for feedback) → 6. *Logged* in page history (« Suggestion de l'assistant acceptée par Aïcha ») and audit log.
- Failure states: model unreachable (retry, « Continuer sans IA »), offline (« Disponible en ligne » unless local desktop model), low confidence (block shows « À vérifier » + sources), content policy refusal (plain explanation).
- Collaboration: if someone edits the target while a proposal is open, the proposal is marked « Contenu modifié depuis » and must be re-generated or merged manually; never silently overwrites.

### 4. Motion (all respect `prefers-reduced-motion` → fades only)
- Ghost text: fade in 120 ms, no movement. Suggestion block: height expand 200 ms `cubic-bezier(.2,0,0,1)`, content fades 120 ms after. Variant switch: crossfade 200 ms (text) / ghost swap 200 ms (board). Ghost objects: each appears with 120 ms fade + 4 px rise, staggered 40 ms, agent cursor eases between them (320 ms). Accept: dashed outline → solid in 120 ms, then label fades out after 1.5 s. Reject: fade out 120 ms.

### 5. Accessibility
- Every proposal is announced via a polite live region (« Suggestion disponible, 3 variantes, Tab pour accepter »).
- Ghost text is not read as document content; accepting moves the caret after the inserted text.
- All actions reachable by keyboard; variant pager is a labelled group; colour is never the only signal (dashed outline + label).

## S-15.4 Agent task (multi-step, visible)
- Card in panel: goal, steps with status (✓ / en cours / à venir), elapsed time, **tool-use transparency** (Lecture du tableau « Atelier de cadrage » · 48 post-it ; Création de la page « Compte rendu » ; Création de 6 tâches dans « Tâches »), side effects highlighted.
- **Approval gate** before any write outside the current page: « L'assistant veut créer 6 tâches dans Tâches » → Autoriser une fois · Toujours pour cet espace · Refuser. Pause / Annuler at any time. Full log afterwards.

## S-15.5 Agent presence
- Agents appear in presence like people but with a distinct shape (rounded-square avatar with sparkles) and label « Assistant · pour Aïcha » or « OpenCode (MCP) · pour Kofi ». Agent cursor on canvas uses the same colour as its sponsor, dashed label. Pending agent edits shown as ghost objects until accepted.

## S-15.6 Settings → IA (workspace admins)
- Activation (off by default) · Fournisseur: Aucun / Modèle local (Ollama, vLLM) / Point d'accès compatible OpenAI (URL, clé, modèle, Tester) · **Frontière des données**: « Aucune donnée ne quitte votre serveur » indicator · per-space enable · per-action **autonomy level** (Suggérer seulement / Appliquer avec annulation) · local-language translation toggles · usage this month (requests, tokens) · retention of conversations (0 / 30 / 90 days).

## S-15.7 Settings → Connexions MCP
- **Ubao comme serveur MCP**: endpoint URL (copy), transport (streamable HTTP), personal access tokens with **scopes** (lecture / écriture / commentaires) per space, expiry, last used; « Créer un jeton ». Copy-paste config snippets for Claude Desktop, OpenCode, Cursor, VS Code.
- **Clients connectés**: list (name, user, scopes, last activity, actions count) · Révoquer.
- **Outils pour l'assistant (Ubao comme client MCP)**: add external MCP servers (URL), per-tool permission (Toujours demander / Autoriser / Bloquer). Sovereign edition: allow-list only.
- Exposed MCP tools (read-only list, documentation): `search`, `get_page`, `create_page`, `append_blocks`, `list_board_objects`, `create_stickies`, `create_tasks`, `add_comment`.

## S-15.8 Permission prompt & audit
- Dialog when an external agent requests a sensitive action: who (client + user), what (diff summary), where (space/page), scope → Autoriser une fois · Refuser · Voir les détails.
- Audit log (S-10.7) filter « Agents & IA »: actor = agent + sponsor, tool, object, before/after link.

## S-15.9 Mobile
- Assistant as bottom sheet (full height on 360 px), suggested prompts as chips, voice input optional; approvals as sheets.

Acceptance: AI never blocks a non-AI path; every AI write is attributable and undoable; works with AI disabled (all AI entry points hidden, not greyed); sovereign deployments can prove that no data leaves the server.
