import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const s = JSON.parse(readFileSync(new URL("../scenarios.json", import.meta.url), "utf8"));
test("scenario ids unique and well-formed", () => {
  const ids = [...s.ime, ...s.ime_mid_composition_remote_edits, ...s.undo_redo, ...s.cursors, ...s.offline_concurrent].map((x) => x.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.length >= 25);
});
test("IME expectations are self-consistent (typed == expected) and cover 5 scripts", () => {
  for (const c of s.ime.filter((c) => c.type && c.expected)) assert.equal(c.type, c.expected, c.id);
  const langs = new Set(s.ime.map((c) => c.lang));
  for (const l of ["fr", "wo", "yo", "ha", "ar"]) assert.ok(langs.has(l), l);
});
test("decomposed and precomposed Yoruba variants are NFC-equal", () => {
  const v = s.ime.find((c) => c.id === "ime-yo-decomposed-vs-precomposed").variants;
  assert.equal(new Set(v.map((x) => x.normalize("NFC"))).size, 1);
});
