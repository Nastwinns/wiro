import test from "node:test";
import assert from "node:assert/strict";
import { generate, makeQueries, strip } from "./gen-corpus.mjs";
import { normalize, tokenize } from "./norm.mjs";

test("corpus deterministic", () => {
  const a = generate({ pages: 20, words: 50 }), b = generate({ pages: 20, words: 50 });
  assert.deepEqual(a.docs, b.docs);
});
test("all six scripts/languages present in a mid-size corpus", () => {
  const { docs } = generate({ pages: 300, words: 40 });
  const langs = new Set(docs.map((d) => d.lang));
  assert.equal(langs.size, 6);
  const all = docs.map((d) => d.text).join(" ");
  assert.match(all, /[\u0600-\u06FF]/); assert.match(all, /[ɓɗƙ]/); assert.match(all, /[ọẹṣ]/); assert.match(all, /ñ|ŋ/);
});
test("queries: stripped form retrieves everything the exact form does (recall 100% by construction)", () => {
  const { docs, vocab } = generate({ pages: 200, words: 80 });
  const qs = makeQueries(docs, vocab, 42, 10);
  assert.ok(qs.length > 30);
  for (const q of qs.filter((q) => q.kind === "diacritic-insensitive")) {
    assert.equal(normalize(strip(q.original)).primary, normalize(q.original).primary, q.original);
    assert.ok(q.expected.length > 0);
  }
});
test("tokenizer keeps Arabic words whole", () => assert.equal(tokenize("كَتَبَ الكتاب").length, 2));
