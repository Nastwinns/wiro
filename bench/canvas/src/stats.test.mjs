import test from "node:test";
import assert from "node:assert/strict";
import { frameStats, percentile, memoryGrowthPct, median } from "./stats.mjs";
test("percentile", () => assert.equal(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0.95), 10));
test("frameStats 60fps", () => { const f = frameStats(Array(100).fill(16.67)); assert.ok(Math.abs(f.fpsP50 - 60) < 0.1); assert.equal(f.droppedRatio, 0); });
test("memoryGrowth", () => assert.ok(Math.abs(memoryGrowthPct([{ t: 0, mb: 100 }, { t: 100, mb: 105 }, { t: 200, mb: 110 }]) - 10) < 1e-9));
test("median", () => assert.equal(median([3, 1, 2]), 2));
