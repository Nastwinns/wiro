# ADR-0007 — Search on client (WASM/desktop) vs server

- Status: **proposed** (decision by Jean Balin)
- Date: 2026-11-10

## Context
NFR-O1 requires offline for all features, including global search across docs + canvas (P8). `architecture.md` assigns `tantivy` to the server and `wiro-search` to the client. Constraints: offline, multilingual (FR, Wolof, Hausa, Yoruba, Arabic — diacritics/tone marks, Arabic harakat/alef variants, RTL), web bundle ≤ 1.5 MB gz initial (NFR-P3), RAM < 600 MB total (NFR-P4), 4 GB laptops. Search ranges over text of docs (block tree), board text elements, titles, comments, database cells; permission-filtered.

## Options
| # | Option | Licence | Fit | Risk |
|---|---|---|---|---|
| A | `tantivy` server-side only; client has none | MIT | simple, powerful | **violates offline**; keep as server tier regardless |
| B | `tantivy` compiled to WASM on client | MIT | one engine everywhere | no official wasm target (mmap/threads/fs); large binary (MB-scale); heavy for 4 GB clients; needs custom `Directory` (RAM/OPFS) |
| C | Home-made inverted index in `wiro-search` (Rust, WASM + native), persisted via `wiro-storage` | ours (MIT) | tiny (target < 150 KB gz), full control over normalisation, incremental from CRDT ops | we maintain ranking/index format; limited to BM25 + prefix + light fuzzy |
| D | SQLite FTS5 (desktop via `rusqlite`/bundled SQLite; web via sqlite-wasm on OPFS) | SQLite public domain; `rusqlite` MIT | proven, persistent, one SQL store (desktop already SQLite per architecture) | FTS5 tokenizer `unicode61 remove_diacritics` covers Latin diacritics but Arabic/Yoruba tone handling needs custom tokenizer (C API only; harder in wasm build); sqlite-wasm adds ~0.8–1 MB; web OPFS needs worker + sync-access-handle support |
| E | MiniSearch (TS) | MIT | trivial, ~10 KB gz, custom `processTerm` | JS heap cost, index build on main thread/worker, separate from Rust model; fine as prototype |
| F | `tinysearch` / Bloom-filter static index | MIT | very small | static, no incremental, no ranking, built for static sites — unfit |
| G | Orama / FlexSearch | Apache-2.0 / Apache-2.0 | feature-rich JS | same JS-heap concerns as E; extra bundle |

## Recommendation
**Hybrid, shared normaliser:** C (`wiro-search`, Rust inverted index with BM25, prefix + edit-distance-1 fuzzy, per-page segments, updated incrementally from CRDT change events, persisted in the local store) on **all clients**, and `tantivy` (B excluded) on the **server** for cross-workspace/admin/large-corpus search. One crate `wiro-text-norm` (Unicode NFKD, strip combining marks selectively — keep Yoruba tone/dot-below as secondary key, fold Arabic alef/yaa/haa variants and harakat/tatweel, casefold, Hausa hooked letters ɓ ɗ ƙ ↔ b d k fallback) used by both so client and server agree. E is the allowed throw-away prototype for S1 if `wiro-search` slips. D is the fallback if C's ranking/persistence proves costly (desktop-only).
Use `icu`/`unicode-normalization` (MIT/Apache) and `unicode-segmentation` (MIT/Apache); `tantivy` is MIT, `rusqlite` MIT — compliant. Arabic stemming optional later.

## Measurement criteria (spike, ≤ 2 days, part of Story 0.5 follow-up)
Corpus: 5 000 pages / 5 M words, mixed FR/EN/Wolof/Hausa/Yoruba/Arabic (synthetic + Wikipedia dumps in those languages, CC-BY-SA data used only as test input, not shipped).
| Metric | Go |
|---|---|
| Query latency p95 (1–3 terms, prefix) | < 50 ms desktop M1 / < 150 ms Android M3 |
| Index build (full) | < 20 s on 5M words; incremental update < 20 ms/edit |
| Index RAM / on-disk | < 80 MB RAM; disk < 30 % of corpus text |
| WASM size gz | < 150 KB (C) — D/B rejected if > 600 KB |
| Recall on diacritic-insensitive test set (`é/e`, `ɓ/b`, `ọ̀/o`, Arabic variants) | ≥ 98 %; precision@10 ≥ MiniSearch baseline |
| Offline | works with network disabled, survives crash (R1) |

## Decision
_pending_

## Consequences
- New crate `wiro-text-norm` (shared client/server) and golden tests for the five languages.
- Server `tantivy` index is derived data; rebuilt from snapshots.
- Permission filtering: client index only holds data the user may read; server enforces on its results.
