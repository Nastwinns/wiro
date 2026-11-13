# ADR-0013 — AI and agents (BYO model, MCP server and client)

- Status: **proposed** (decision by Jean Balin)
- Date: 2026-11-11
- Related: PRD E10 (FR10.1, FR10.2), FR8.3; UX `docs/ux/screens/15-ai-agents.md` (S-15.1…15.12); ADR-0010 (plugins), ADR-0011 (deployment), ADR-0012 (licensing), architecture §6, §9, §10, §11
- Sizing and latency figures are **[ASSUMPTION]** until measured.

## Context
AI is optional and **off by default** (PRD E10). Sovereignty is the product promise: the model runs where the admin decides (local Ollama/vLLM, in-country endpoint, or none), and a sovereign deployment must be able to *prove* that no data leaves the server. UX 15 specifies a "respectful copilot, never autopilot": AI proposes, the human disposes; every AI action is labelled, previewable, reversible and audited. The same UX defines the assistant panel, inline suggestions, ghost objects, N variants, multi-step agent tasks, agent presence, and an MCP server (and client) with scoped tokens.

Constraints from other decisions: CRDT content is merged client-side with Loro (ADR-0003) and confidentiality unit is the page (architecture §10); plugins run in sandboxes (ADR-0010); the server stays a single Rust binary with no extra broker (ADR-0011); every dependency must pass the licence allow-list (AGENTS.md rule 2). Epics currently place E10 post-v1; this ADR must be accepted before the first AI story, not before S0–S2.

## Requirements
1. Provider is configurable: Ollama, vLLM, any OpenAI-compatible endpoint, or none. No vendor SDK, no vendor lock-in, no credit system.
2. Data boundary is explicit, enforced server-side, and visible to users (badge).
3. Graduated autonomy with human approval for anything beyond the current page.
4. Full audit of AI and agent actions (actor = agent + sponsor).
5. MCP server exposing a small, scoped tool set; MCP client for admin-approved external tools.
6. Suggestions are never written or synced before acceptance.
7. Plugins can use AI only through the host, never directly.
8. Works offline on desktop with a local model; hidden (not greyed) when disabled.

## Options

### Where the model call originates
| # | Option | Pros | Cons |
|---|---|---|---|
| A | **Server-side AI gateway** (module of the Ubao server) calls the provider | keys never reach clients; one place to enforce boundary, permissions, quotas, audit; works for web and mobile; MCP server naturally lives there | server must reach the endpoint; no AI offline on desktop without extra path |
| B | Client calls the provider directly | works offline with local model; no server load | keys exposed on the client; boundary and audit not enforceable; every client needs network access to the endpoint |
| C | Plugins provide AI | extensible | fragments the data boundary; no central audit; rejected as the primary path |
| D | **A + desktop local-model path** | A's guarantees, plus offline use | two code paths; the local path needs its own audit buffer |

### How agent writes reach documents
| # | Option | Pros | Cons |
|---|---|---|---|
| W1 | Agent writes directly into CRDT as a peer, relies on undo | simple, real-time | breaks "nothing is written before accept"; hard to roll back inside merged history |
| W2 | **Proposals first**: suggestions live outside the CRDT (client-local ghost state, or a server-side pending changeset for MCP agents); accepted proposals become normal user-attributed ops carrying a provenance mark | satisfies UX 15 lifecycle; not synced until accepted; clean undo (one batch) | needs a proposal store and conflict check ("content modified since") |
| W3 | Per-action choice (W2 default, W1 only when the admin sets "apply with undo") | matches the autonomy levels in S-15.6 | slightly more logic |

### MCP exposure
| # | Option | Notes |
|---|---|---|
| M1 | No MCP; only the REST API | loses the agent ecosystem (Claude Desktop, OpenCode, Cursor, VS Code) |
| M2 | **MCP server (streamable HTTP) as a thin adapter over the public API**, tokens scoped, same permission engine | one source of truth for permissions; tools are a documented subset |
| M3 | MCP server over stdio only (desktop) | useful later for local agents; not for server deployments |

## Recommendation
**D + W3 + M2.**

### 1. Provider and AI gateway
- New server module `ubao-ai` (provider-agnostic trait with a single "OpenAI-compatible chat/completions + embeddings" implementation; Ollama and vLLM are reached through that same protocol). One admin-configured provider per workspace/tenant (plus optional per-space override), stored with the secret in the server keyring, never sent to clients. Test button = a canned prompt.
- Streaming over the existing HTTPS API (SSE); cancel = connection close. Concurrency limits and per-user/per-workspace quotas in the gateway; usage counters (requests, tokens) shown in S-15.6.
- No AI SDK from a vendor; HTTP client only. Prompts are templates versioned in the repo (MIT), no remote prompt fetching.

### 2. Data boundary
- Admin declares the endpoint class: `local` (same host or private network), `in-country` (admin-attested), `external` (any other). The UI badge derives from it (« Aucune donnée ne quitte votre serveur » only for `local`).
- Enforcement: the gateway resolves the endpoint and refuses classes the policy forbids. Sovereign/air-gapped policy = `local` only; DNS or IP outside private ranges is rejected at config time **and** at connect time (egress allow-list, also protects against DNS rebinding). With AI off, the AI module opens no socket (testable).
- Context assembly is server-side and **always filtered by the requesting user's permissions** (architecture §10); the model never sees what the user cannot read. Spaces can be flagged *restricted*: excluded from `external` models regardless of user rights.
- No training or retention by Ubao. Conversations kept 0 / 30 / 90 days (admin choice, default 0 = not stored). Audit stores metadata (actor, tool, object ids, token counts, hashes), prompt/response content only if the admin enables it.

### 3. Autonomy levels (per action type, per space)
| Level | Name | Behaviour | Default |
|---|---|---|---|
| L0 | Off | all entry points hidden | **default** |
| L1 | Suggest only | proposals only; user accepts each | default when AI is enabled |
| L2 | Apply with undo | writes inside the **current page** directly, one undoable batch, 10 s undo toast, labelled « Généré par IA » | admin opt-in |
| L3 | Agent task | multi-step plan, visible tool use; any write **outside the current page** needs an approval gate | admin opt-in |
There is no unattended/autonomous level in v1 (no scheduled or background agents writing content).

### 4. Approval gates
Gate required for: writes outside the current page, creating pages/tasks in another space, comments on behalf of someone, any tool of an external MCP server, any bulk operation above a threshold (default > 20 objects), and every first use of a new tool. Choices: allow once · always in this space (stored per user+space+tool, revocable) · refuse. Gates are decided by the **sponsor** (the user the agent acts for); an agent can never approve its own gate. Pending gates expire (default 15 min). Gate state is server-side so mobile/web/desktop stay consistent.

### 5. Suggestions, ghosts and variants
- Ghost text, inline suggestion blocks, ghost objects, cell suggestions and hint chips are **client-local ephemeral state**, rendered as an overlay layer: not in the Loro document, not in the WAL, not synced, invisible to peers (unless the requester explicitly shares a preview). Hence nothing leaks and no CRDT history is polluted.
- On *Accept*, the client applies ordinary Loro ops as the human user, with an `ai_origin` provenance mark (model id, request id) that drives the « Généré par IA » chip until a human edits. *Modify* drops the mark.
- Conflict rule: each proposal records the version vector of its target; if the target changed, the proposal is flagged « Contenu modifié depuis » and must be regenerated or merged manually; never auto-applied.
- **Variants**: default N = 3 (admin 1–5; 2 for small local models), generated lazily — variant 1 streams at once, 2..N on request, each with a distinct intent tag. Variants are separate gateway requests sharing a `proposal_id`; cancelled when the proposal closes.
- Agent presence (S-15.5): agents join awareness as non-human peers (flag `agent`, sponsor id). Pending agent edits remain ghost objects.

### 6. Audit
Every AI/agent action emits an event into the existing append-only hash-chained audit log: `actor=agent|assistant`, `sponsor`, `client` (e.g. « OpenCode (MCP) »), `tool`, target ids, scope, decision (auto/gate/refused), outcome, `batch_id` for undo, links to before/after versions. Filter « Agents & IA » in S-10.7. Page history shows « Suggestion de l'assistant acceptée par X ». Audit is not disabled by any AI setting.

### 7. MCP server
- Endpoint on the Ubao server, transport **streamable HTTP**, thin adapter over the public API and permission engine (no second permission model).
- Tools (v1, matches S-15.7):
| Tool | Effect | Scope needed |
|---|---|---|
| `search` | permission-filtered search | read |
| `get_page` | page as markdown/blocks | read |
| `list_board_objects` | objects of a board/frame with ids, text, geometry | read |
| `create_page` | new page in a space | write |
| `append_blocks` | append blocks to a page | write |
| `create_stickies` | stickies on a board | write |
| `create_tasks` | rows in a task database | write |
| `add_comment` | comment on block/object | comment |
- Tokens: personal access tokens with **scopes** `read` / `write` / `comment` **per space**, expiry (default 30 days, max 365), stored hashed, shown once, last-used tracking, revocation from S-15.7; rate limits per token; always the **intersection** of token scope and the sponsor's current permissions (never above the issuer, same rule as capability tokens, architecture §10). OAuth 2.1 (PKCE) for interactive MCP clients is a possible later addition.
- External agent writes are **proposals by default** (pending changeset in the server, shown in the sponsor's panel as ghost objects/blocks) unless the token is explicitly marked "apply directly" by an admin policy; sensitive actions trigger the permission prompt of S-15.8.
- Tool descriptions and results are bounded in size; page content returned to agents is marked untrusted.

### 8. MCP client (Ubao as client)
Admin adds external MCP servers (URL) with per-tool permission (ask / allow / block); the sovereign edition is **allow-list only**. External tools always pass through approval gates (§4), cannot be combined with the data boundary `local` unless the MCP server is itself on the allow-list and on a permitted network class, and run from the server (never from the browser).

### 9. Prompt injection and exfiltration
Document, comment and tool-result text is untrusted input. Mitigations: tool outputs delimited and never treated as instructions; an agent that has read restricted content cannot call tools that send data outside the boundary in the same task without a gate; writes limited to the granted scope; outbound URLs rendered by AI are not auto-fetched; a red-team test suite (injection in page, comment, sticky, filename) runs in CI.

### 10. Plugin isolation (links ADR-0010)
Plugins get AI only via a host capability `ai.complete` (permission `ai` in the manifest, shown at install). The host gateway applies the same boundary, quota, audit (actor = plugin id + sponsor) and approval gates; plugins cannot choose the endpoint, read the key, or call the provider directly (iframe CSP and WASM no-network by default). Plugins that bring their own tools do so as **MCP connectors** (§8), listed and allow-listed like any other.

### 11. Offline and local models
- Server-routed AI works whenever the client reaches the server. On **desktop**, an optional "local model" mode lets the Tauri app call a loopback Ollama/llama.cpp directly (admin policy permitting): requests are buffered in a local audit journal, synced to the server audit log on reconnect. The web build shows « Disponible en ligne ». Offline never blocks non-AI paths.
- Small local models: N = 2, shorter contexts, no proactive hint chips by default.

### 12. Disabled by default
Fresh install: AI off, no AI route mounted, no AI UI rendered, no egress, MCP endpoint closed. Enabling is an admin action with a boundary declaration and writes an audit event. Per-space and per-user opt-outs (ghost text is opt-in per user).

## Measures (acceptance of this ADR → release gates)
1. **Zero egress when off**: integration test asserts no AI socket/DNS attempt with AI disabled; in `local` policy, an external endpoint is rejected.
2. **100 % attribution**: property test — every write by assistant/agent has `sponsor`, `tool`, `batch_id` in audit; one-action undo restores the previous state.
3. **Scope tests**: token with `read` cannot write; token for space A cannot read space B; user permission removal takes effect on the next call.
4. **Injection suite**: scripted payloads fail to trigger ungated out-of-scope writes.
5. **Latency** (local 7–8B model on reference hardware): first token ≤ 2 s p95; gateway overhead ≤ 50 ms p95 [ASSUMPTION].
6. **Offline desktop**: suggestion works with the network disabled and a local model; audit journal syncs after reconnect.
7. **Proposal conflict**: concurrent edit marks the proposal stale in 100 % of the convergence-test cases.
8. Memory/CPU: AI off adds < 1 MB to the server idle footprint and nothing to the client bundle budget (AI UI lazy-loaded, architecture §16).

## Consequences
- New crate `ubao-ai` (gateway, provider client, proposal store, MCP server adapter); new tables `ai_proposals`, `ai_tokens` (hashed), `ai_gate_decisions`; audit event schema extension; provenance mark in `wiro-model`; overlay layer for ghost state in the editor and canvas (small, lazy-loaded).
- Stories to add after acceptance (post-v1 EP15 "AI & agents"): gateway + settings, assistant panel, inline suggestions, canvas ghosts + variants, MCP server + tokens, approval gates + audit view, MCP client, offline local model. PRD FR8.3 loses its `[ASSUMPTION]` tag and gains an explicit scope (tools above); NFR-O1 reads "except AI unless a local model is configured".
- ADR-0011 `AI_*` env variables map to the provider config; ADR-0014 adds per-tenant provider and quotas; ADR-0012: AI features stay in the MIT core (they serve self-hosting), only per-tenant metering for resellers could be commercial.
- Risks: prompt-injection residual risk, small local models giving poor results (communicate expectations), MCP spec churn (pin spec version, adapter isolates it), support burden of providers (document tested matrix: Ollama, vLLM, one OpenAI-compatible).

## Open questions (maintainer)
1. Is AI (E10) kept post-v1 as in the epics, or is MCP server alone pulled into v1.x? (Recommendation: post-v1, MCP server first.)
2. Default retention of conversations: 0 days (recommended) or 30?
3. Should "apply directly" tokens exist at all, or must external agents always go through proposals? (Recommendation: allow only by explicit admin policy, off by default.)
4. Supported-provider matrix for v1 and whether an in-country hosted model is offered by partners.
5. Embeddings / semantic search: out of scope here (ADR-0007 owns search); confirm it stays out.

## Decision
_pending — to be decided by Jean Balin._
