# DESIGN.md

Design system of Wiro (placeholder name). Direction **"Malachite" — le luxe du calme**.

- Full charter: `docs/ux/brand-charter.md`
- Tokens (W3C DTCG, Penpot-importable): `design/tokens/tokens.json` → generated to `packages/tokens` (CSS vars + Rust consts)
- Screen specs: `docs/ux/screens/` · UX foundations: `docs/ux/ux-spec.md`
- Handoff to OpenCode + Penpot: `docs/ux/penpot-handoff.md`

## Rules for agents
1. Use tokens only — no raw hex in components.
2. One accent (malachite) per view; gold only for premium/ornament, never for actions.
3. Inter for UI, Fraunces max once per screen (display), JetBrains Mono for code.
4. Sentence case, no all-caps labels, no gradients, no glass, no nested cards.
5. WCAG 2.2 AA, visible focus, ≥32 px targets (44 touch), `prefers-reduced-motion`.
6. Design for 1366×768, 4 GB RAM laptops and slow networks first; test FR + EN strings (+30 % length).
7. Every screen ships its empty, loading, offline, error and read-only states.
