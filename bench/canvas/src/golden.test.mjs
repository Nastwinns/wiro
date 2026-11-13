import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { generateScene, checksum, VARIANT_COUNTS } from "./gen-scene.mjs";
import { generateTrace, traceChecksum, TRACE_IDS } from "./traces.mjs";

const golden = JSON.parse(readFileSync(new URL("../scenes/CHECKSUMS.json", import.meta.url), "utf8"));

test("scene checksums match CHECKSUMS.json (all variants)", () => {
  for (const [k, sum] of Object.entries(golden.scenes)) {
    const [v, layout] = k.split("-");
    assert.equal(checksum(generateScene({ count: VARIANT_COUNTS[v], layout })), sum, k);
  }
});
test("trace checksums match CHECKSUMS.json", () => {
  for (const id of TRACE_IDS) assert.equal(traceChecksum(generateTrace(id)), golden.traces[id], id);
});
test("committed example scene matches its checksum", () => {
  const raw = readFileSync(new URL("../scenes/example-1k-clustered-seed42.json", import.meta.url), "utf8");
  assert.equal(checksum(JSON.parse(raw)), golden.scenes["1k-clustered"]);
});
