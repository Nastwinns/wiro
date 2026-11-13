# ADR-0015 — Responsive web, no native mobile apps

- Status: accepted (2026-11-11, maintainer decision)
- Supersedes: ADR-0008 (mobile shell: Tauri 2 mobile / PWA / TWA) — status of 0008 becomes `superseded by 0015`

## Context
v1 targets were desktop + web + Tauri mobile apps. Solo capacity (~240–300 h) made the mobile apps the largest avoidable risk (store review, WebView perf on low-end Android, signing).

## Decision
Final product = **desktop client (Windows, macOS, Tauri 2) + web (self-hosted), both mandatory**. Phones and tablets are served by the **responsive web app** (design breakpoints 390 and 768; Penpot page B13). No native iOS/Android apps, no store submissions.

## Consequences (arch)
- Stories: 0.4 becomes desktop only; 0.4c (mobile measurements) is dropped; the low-end Android **browser** check is folded into 0.4b (bench canvas) as an extra device class.
- `wiro-storage`/`wiro-sync` still run native (desktop) and WASM (web/OPFS); no mobile native storage path (SQLite on mobile) is built.
- Distribution: desktop installers + self-hosted web; no App Store / Play / APK / TWA.

## Consequences
- EP12 becomes "Responsive web"; story 12.4 (store releases) dropped; story 0.4 is desktop only.
- Native-only features are out: OS share-target, Apple-Pencil-specific behaviour. Stylus/touch via browser pointer events.
- Canvas perf must be measured in low-end Android browsers (replaces the WebView spike).
- Scope is unchanged for users (they still reach Ubao from phones); only the delivery channel changes.
