import test from "node:test";
import assert from "node:assert/strict";
import { medianMetrics, gradeReport, validateReport } from "./report.mjs";
test("median + grading", () => {
  const runs = [58, 61, 60, 62, 59].map((f) => ({ fpsP50: f, fpsP95: 40, frameMs: { p50: 16, p95: 25, p99: 30 }, rssPeakMb: 500 }));
  const m = medianMetrics(runs);
  assert.equal(m.fpsP50, 60);
  const g = gradeReport(m, 500 * 1024, "desktop");
  assert.equal(g.grades.fpsP50, "go"); assert.equal(g.grades.wasmGzKb, "go"); assert.equal(g.grades.inputLatencyP95Ms, "n/a");
});
test("validator flags problems", () => {
  const p = validateReport({ format: "wiro-bench-report/1", runs: [1], scene: { checksum: "x", seed: 1 }, run: { buildProfile: "debug" } });
  assert.ok(p.includes("scene.checksum") && p.includes("run.buildProfile must be release") && p.some((x) => x.startsWith("fewer")));
});
