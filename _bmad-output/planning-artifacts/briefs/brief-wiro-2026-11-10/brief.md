---
title: "Product Brief: Ubao (candidate name; working name Wiro)"
status: draft-complete (coaching round 1 answered) — review by Jean
created: 2026-11-10
updated: 2026-11-10
---

# Product Brief: Ubao *(candidate name — "board" in Swahili, pending native-speaker & trademark validation)*

## Executive Summary
Ubao is an open-source (MIT) workspace where African teams write, draw, plan and decide together: Notion-style docs and a Miro-style infinite canvas in one product, fast on modest hardware, fully usable offline, and deployable on sovereign infrastructure. It targets tech startups/SMEs (self-serve Team Cloud hosted in Africa) and public administrations (sovereign subscription delivered with certified local integrators).

Why now: Kenya (Cloud Policy 2025, government OSPO March 2026) and Nigeria (NITDA 2026 guideline, Galaxy Backbone sovereign-cloud PPP) are turning data residency and open source into procurement rules, while incumbents bill in USD by card, lag on big boards, and treat offline as an afterthought.

## The Problem
- Startups pay Notion + Miro in USD by card (card penetration < 4 % in many markets), on slow, expensive data (~$5/GB), with tools that freeze on large boards (Miro advises < 5k objects) and lose work on crash (AFFiNE issue #14006).
- Administrations must keep data in-country; Miro offers no on-prem; Collaboard/Conceptboard are European, proprietary and priced in euros; AFFiNE's server is separately licensed with self-host limits.
- Teams juggle docs, whiteboards and planning across 3–5 tools.

## The Solution
One app (desktop Windows/macOS via Tauri, self-hosted web, **iOS/Android apps in v1**), local-first on a Rust core (Loro CRDT), with four launch use cases done excellently: workshops/retros, product spec + diagram, planning/steering, knowledge base. Server = single Rust binary + PostgreSQL, docker compose / Helm / air-gapped.

## What Makes This Different (honest)
1. **Founder advantage:** network of African startups and decision-makers in several countries + 7 years of DevOps/platform expertise (Kubernetes RKE2, GitOps, air-gapped) — sovereignty is delivered, not promised.
2. **100 % MIT including the server + local-first** — unlike AFFiNE (separate server licence), Collaboard/Conceptboard (proprietary), Miro (cloud only).
3. Performance budget as a product requirement (60 fps @ 10k objects on entry hardware).
Not a moat: price alone (Cynoia shows it) — execution speed and trust are.

## Who This Serves
- Startups/SMEs (founder, CTO, product lead) — first pilots from Jean's network.
- Administrations (DSI) — first pilots via decision-makers in Jean's network, delivered with local integrators.
- Facilitators, contributors and guests (no account).

## Success Criteria (6 months after v1) — decided "ambitious"
- 20 paying teams across ≥ 3 countries.
- 3 sovereign pilots signed (≥ 2 countries), ≥ 1 converted to an annual subscription.
- 3 000 GitHub stars; contributors from ≥ 5 African countries.
- Zero data-loss incidents; crash-free sessions ≥ 99.5 %.

## Business model — decided
100 % MIT + subscription (LTS, SLA, security advisories, compliance/tender pack, hosting) + certified partner network (partners keep services revenue, 20–30 % margin on resold subscriptions). Team Cloud ≈ **2 000 FCFA / editor / month**, pack 10 editors 20 000 FCFA, guests free; hosted first in **Senegal (Orange Business/Sonatel), Côte d'Ivoire (Raxio), Kenya (IXAfrica/ADC)**.

## Scope
- Long-term: AFFiNE + Collaboard parity (docs + canvas + enterprise/sovereign) — not reduced.
- v1 (first sellable): UC1–UC4, desktop + web + **Tauri mobile apps**, FR/EN, SSO/audit, compose/Helm/air-gapped, admin console.
- After v1: AI (BYO model), Swahili first community locale (then others), Miro import, LAN sync, multi-tenant partner mode, mobile-money billing.

## Constraints
Solo founder + AI agents, 20 h+/week (CDI in parallel; trial period until end Jan 2027); clean-room; MIT-compatible deps only.

## Go-to-market
Build in public from now (public repo), X demo routine + LinkedIn for decision-makers; pilots from personal network; partner programme for tenders.

## Legal
Operating entity in Africa or Mauritius (holding) — country/structure to choose with counsel (ADR-0009).

## Vision
The default sovereign workspace for African institutions and builders — and proof that a world-class collaboration tool can be built from and for the continent.
