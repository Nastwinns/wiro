#!/usr/bin/env node
// Reference harness for ADR-0007 criteria. An engine = { name, build(docs), query(typed, {prefix}) -> number[], memoryMb?() }.
// Ships with the "reference" engine (naive inverted index over wiro-text-norm reference) so the metrics pipeline is validated;
// the dev agent adds adapters: minisearch (npm, MIT), wiro-search (WASM), sqlite-fts5, tantivy-server.
import { readFileSync, existsSync } from "node:fs";
import { generate, makeQueries } from "./gen-corpus.mjs";
import { analyze, normalize } from "./norm.mjs";

export function referenceEngine() {
  const idx = new Map();
  return {
    name: "reference-js",
    build(docs) { for (const d of docs) for (const k of new Set(analyze(d.text).map((x) => x.primary))) (idx.get(k) ?? idx.set(k, []).get(k)).push(d.id); },
    query(typed, { prefix = false } = {}) {
      const k = normalize(typed).primary; const out = new Set();
      if (!prefix) return idx.get(k) ?? [];
      for (const [t, ids] of idx) if (t.startsWith(k)) for (const i of ids) out.add(i);
      return [...out];
    },
    memoryMb: () => process.memoryUsage().heapUsed / 1e6,
  };
}
const CORPUS = process.env.CORPUS ?? "corpus";
const pct = (xs, p) => { const s = [...xs].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)]; };

export function evaluate(engine, docs, queries) {
  const t0 = performance.now(); engine.build(docs); const buildMs = performance.now() - t0;
  const lat = [], rec = [];
  for (const q of queries) {
    const t = performance.now(); const got = new Set(engine.query(q.typed, { prefix: q.kind === "prefix" })); lat.push(performance.now() - t);
    const exp = q.expected; rec.push(exp.length ? exp.filter((i) => got.has(i)).length / exp.length : 1);
  }
  const recallBy = {};
  queries.forEach((q, i) => { (recallBy[q.kind] ??= []).push(rec[i]); });
  return { engine: engine.name, docs: docs.length, buildMs, latencyP50Ms: pct(lat, 0.5), latencyP95Ms: pct(lat, 0.95), recall: Object.fromEntries(Object.entries(recallBy).map(([k, v]) => [k, v.reduce((a, b) => a + b, 0) / v.length])), memoryMb: engine.memoryMb?.() };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let docs, queries;
  if (existsSync(`${CORPUS}/pages.jsonl`)) { docs = readFileSync(`${CORPUS}/pages.jsonl`, "utf8").trim().split("\n").map((l) => JSON.parse(l)); queries = JSON.parse(readFileSync(`${CORPUS}/queries.json`, "utf8")); }
  else { const g = generate({ pages: 300, words: 200 }); docs = g.docs; queries = makeQueries(docs, g.vocab); }
  console.log(JSON.stringify(evaluate(referenceEngine(), docs, queries), null, 1));
}
