import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { normalize, tokenize, analyze } from "./norm.mjs";
const g = JSON.parse(readFileSync(new URL("../golden/norm-golden.json", import.meta.url), "utf8"));

test("golden normalisation cases", () => {
  for (const c of g.cases) {
    const input = c.in2 ?? c.in;
    const r = normalize(input);
    // golden secondary is stored NFD (marks escaped); the spec output is NFC
    assert.equal(r.primary, c.primary, `primary of ${JSON.stringify(input)}`);
    assert.equal(r.secondary.normalize("NFD"), c.secondary.normalize("NFD"), `secondary of ${JSON.stringify(input)}`);
  }
});
test("golden tokenizer", () => { for (const t of g.tokenize) assert.deepEqual(tokenize(t.in), t.tokens); });
test("equivalence classes share a primary key", () => {
  for (const cls of g.equivalence_classes) {
    const keys = new Set(cls.map((w) => normalize(w).primary));
    assert.equal(keys.size, 1, JSON.stringify(cls));
  }
});
test("NFC and NFD inputs are equivalent; idempotent", () => {
  for (const w of ["ọ̀rọ̀", "Éléphant", "ɓarna", "أحمد", "ṣé"]) {
    for (const f of ["NFC", "NFD", "NFKC"]) assert.deepEqual(normalize(w.normalize(f)), normalize(w));
    const n = normalize(w);
    assert.equal(normalize(n.primary).primary, n.primary);
  }
});
test("analyze drops empty tokens", () => assert.deepEqual(analyze("\u200B ـ"), []));
