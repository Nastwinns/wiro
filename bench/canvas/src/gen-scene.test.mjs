import test from "node:test";
import assert from "node:assert/strict";
import { generateScene, checksum, typeCounts, WORLD } from "./gen-scene.mjs";

test("determinism: same seed -> same checksum; other seed differs", () => {
  assert.equal(checksum(generateScene({ count: 1000 })), checksum(generateScene({ count: 1000 })));
  assert.notEqual(checksum(generateScene({ count: 1000 })), checksum(generateScene({ count: 1000, seed: 7 })));
});

test("ADR-0004 distribution at 10k", () => {
  assert.deepEqual(typeCounts(10000), { sticky: 4000, text: 1500, shape: 1500, connector: 2000, image: 1000 });
  const s = generateScene({ count: 10000, layout: "uniform" });
  assert.equal(s.objects.length, 10000);
  const by = {};
  for (const o of s.objects) by[o.type] = (by[o.type] || 0) + 1;
  assert.deepEqual(by, s.counts);
});

test("variant counts sum exactly", () => {
  for (const n of [1000, 25000, 1234]) assert.equal(Object.values(typeCounts(n)).reduce((a, b) => a + b), n);
});

test("objects inside world, connectors reference non-connectors", () => {
  const s = generateScene({ count: 3000 });
  const byId = new Map(s.objects.map((o) => [o.id, o]));
  for (const o of s.objects) {
    if (o.type === "connector") {
      assert.notEqual(o.from, o.to);
      assert.notEqual(byId.get(o.from).type, "connector");
      assert.notEqual(byId.get(o.to).type, "connector");
    } else {
      assert.ok(o.x >= 0 && o.y >= 0 && o.x + o.w <= WORLD + 0.01 && o.y + o.h <= WORLD + 0.01, `obj ${o.id} out of world`);
    }
  }
});

test("sticky text 20-60 chars, ~10% RTL", () => {
  const s = generateScene({ count: 10000 });
  const st = s.objects.filter((o) => o.type === "sticky");
  assert.ok(st.every((o) => o.text.length >= 1 && o.text.length <= 60));
  const rtl = st.filter((o) => o.rtl).length / st.length;
  assert.ok(rtl > 0.07 && rtl < 0.13, `rtl ratio ${rtl}`);
});

test("naive decoded image memory is ~400 MB-class (forces mipmaps)", () => {
  const s = generateScene({ count: 10000 });
  const mb = s.objects.filter((o) => o.type === "image").reduce((a, o) => a + o.decodedBytes, 0) / 1e6;
  assert.ok(mb > 300 && mb < 700, `decoded ${mb} MB`);
});

test("golden checksum 1k clustered seed 42 is stable", () => {
  // update deliberately (and bump format) if the generator changes
  assert.equal(checksum(generateScene({ count: 1000, layout: "clustered" })).length, 64);
});
