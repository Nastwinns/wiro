import test from "node:test";
import assert from "node:assert/strict";
import { generateTrace, traceChecksum, TRACE_IDS } from "./traces.mjs";

test("traces are deterministic, sorted and within duration", () => {
  for (const id of TRACE_IDS) {
    const a = generateTrace(id), b = generateTrace(id);
    assert.equal(traceChecksum(a), traceChecksum(b));
    assert.ok(a.events.length > 0);
    for (let i = 1; i < a.events.length; i++) assert.ok(a.events[i].t >= a.events[i - 1].t);
    assert.ok(a.events.at(-1).t <= a.durationMs);
  }
});
test("zoom trace sweeps 5%..400%", () => {
  const z = generateTrace("zoom").events.map((e) => e.zoom);
  assert.ok(Math.min(...z) <= 0.051 && Math.max(...z) >= 3.99);
});
test("soak is 5 minutes", () => assert.equal(generateTrace("soak").durationMs, 300000));
