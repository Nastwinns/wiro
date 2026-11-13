import test from "node:test";
import assert from "node:assert/strict";
import { grade, overall } from "./thresholds.mjs";
test("grades", () => {
  assert.equal(grade("fpsP50", 60), "go");
  assert.equal(grade("fpsP50", 50), "acceptable");
  assert.equal(grade("fpsP50", 44), "no-go");
  assert.equal(grade("fpsP50", 35, "mobile"), "acceptable");
  assert.equal(grade("rssMb", 599), "go");
  assert.equal(grade("rssMb", 800), "no-go");
  assert.equal(grade("firstFrameMs", null), "n/a");
  assert.equal(overall({ a: "go", b: "acceptable", c: "n/a" }), "acceptable");
});
