#!/usr/bin/env node
// node src/gen-corpus.mjs --pages 5000 --words 1000 --seed 42 --out corpus
// Writes <out>/pages.jsonl, <out>/queries.json, <out>/manifest.json (with sha256). Deterministic.
import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { SEED, SYLLABLES, MIX } from "./lexicon.mjs";
import { tokenize, normalize } from "./norm.mjs";

function mulberry32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function buildVocab(lang, rnd, size) {
  const words = [...SEED[lang]];
  const syl = SYLLABLES[lang];
  const seen = new Set(words);
  for (let tries = 0; words.length < size && tries < size * 50; tries++) {
    const n = 1 + Math.floor(rnd() * 3);
    let w = "";
    for (let i = 0; i < n; i++) w += syl[Math.floor(rnd() * syl.length)];
    if (!seen.has(w)) { seen.add(w); words.push(w); }
  }
  return words; // index order == Zipf rank (seed words are the most frequent)
}
function zipfSampler(n, rnd, s = 1.05) {
  const cdf = new Float64Array(n); let acc = 0;
  for (let i = 0; i < n; i++) { acc += 1 / Math.pow(i + 1, s); cdf[i] = acc; }
  return () => { const x = rnd() * acc; let lo = 0, hi = n - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cdf[m] < x) lo = m + 1; else hi = m; } return lo; };
}

/** Remove diacritics the way a user without the right keyboard would (the "stripped" query form). */
export function strip(w) {
  return w.normalize("NFD").replace(/[\u0300-\u036F\u064B-\u065F\u0670\u0640]/g, "").replace(/[ɓɗƙƴ]/g, (c) => ({ "ɓ": "b", "ɗ": "d", "ƙ": "k", "ƴ": "y" })[c]).replace(/[ŋ]/g, "n").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ى/g, "ي");
}

export function generate({ pages = 5000, words = 1000, seed = 42, vocabSize = 2500 } = {}) {
  const rnd = mulberry32(seed);
  const langs = Object.keys(MIX);
  const vocab = Object.fromEntries(langs.map((l) => [l, buildVocab(l, rnd, vocabSize)]));
  const samp = Object.fromEntries(langs.map((l) => [l, zipfSampler(vocab[l].length, rnd)]));
  const docs = [];
  for (let id = 0; id < pages; id++) {
    // each page: one dominant language (70%) + secondary mix (30%), mimicking bilingual FR/Wolof/Arabic workspaces
    let x = rnd(), main = langs[0]; for (const l of langs) { if ((x -= MIX[l]) <= 0) { main = l; break; } }
    const toks = [];
    for (let i = 0; i < words; i++) { const l = rnd() < 0.7 ? main : langs[Math.floor(rnd() * langs.length)]; toks.push(vocab[l][samp[l]()]); }
    docs.push({ id, lang: main, title: toks.slice(0, 4).join(" "), text: toks.join(" ") });
  }
  return { docs, vocab };
}

export function makeQueries(docs, vocab, seed = 42, perLang = 40) {
  const rnd = mulberry32(seed + 1);
  const cache = new Map(); const key = (t) => cache.get(t) ?? (cache.set(t, normalize(t).primary), cache.get(t));
  const postings = new Map();
  for (const d of docs) for (const t of new Set(tokenize(d.text))) { const k = key(t); (postings.get(k) ?? postings.set(k, new Set()).get(k)).add(d.id); }
  const queries = [];
  for (const lang of Object.keys(vocab)) {
    // sample among diacritic-bearing words (stripped != original) that occur in the corpus
    const cand = vocab[lang].slice(0, 400).filter((w) => strip(w) !== w && postings.has(key(w)));
    for (let i = 0; i < perLang && cand.length; i++) {
      const w = cand[Math.floor(rnd() * cand.length)];
      const expected = [...postings.get(key(w))].sort((a, b) => a - b);
      queries.push({ lang, kind: "diacritic-insensitive", typed: strip(w), original: w, expected });
      queries.push({ lang, kind: "exact", typed: w, original: w, expected });
      const pre = [...w.normalize("NFC")].slice(0, 3).join("");
      if (pre.length === 3) { const pk = normalize(pre).primary; const exp = new Set(); for (const [k, s] of postings) if (k.startsWith(pk)) for (const id of s) exp.add(id); queries.push({ lang, kind: "prefix", typed: strip(pre), original: pre, expected: [...exp].sort((a, b) => a - b) }); }
    }
  }
  return queries;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = process.argv.slice(2); const f = (n, d) => { const i = a.indexOf(`--${n}`); return i >= 0 ? a[i + 1] : d; };
  const pages = +f("pages", 5000), words = +f("words", 1000), seed = +f("seed", 42), out = f("out", "corpus");
  const { docs, vocab } = generate({ pages, words, seed });
  mkdirSync(out, { recursive: true });
  const body = docs.map((d) => JSON.stringify(d)).join("\n") + "\n";
  writeFileSync(`${out}/pages.jsonl`, body);
  const q = makeQueries(docs, vocab, seed);
  writeFileSync(`${out}/queries.json`, JSON.stringify(q));
  const manifest = { generator: "bench/search/src/gen-corpus.mjs", seed, pages, wordsPerPage: words, totalWords: pages * words, queries: q.length, pagesSha256: createHash("sha256").update(body).digest("hex") };
  writeFileSync(`${out}/manifest.json`, JSON.stringify(manifest, null, 1));
  console.log(manifest);
}
