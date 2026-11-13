import test from "node:test";
import assert from "node:assert/strict";
import { generateScene, checksum } from "../gen-scene.mjs";
import { generateTrace, traceChecksum } from "../traces.mjs";
import { createNullBackend } from "./backend.mjs";
import { runMatrixCell } from "./run.mjs";
import { validateReport } from "./report.mjs";

test("null backend end-to-end produces a schema-valid report", async () => {
  const scene = generateScene({ count: 1000 });
  const trace = generateTrace("typing", { durationMs: 3000 });
  const rep = await runMatrixCell({ makeBackend: createNullBackend, scene, sceneChecksum: checksum(scene), variant: "1k", trace, traceChecksum: traceChecksum(trace),
    machine: { id: "M5", os: "selftest", webview: "none", gfxApiForced: "auto", class: "desktop" }, run: { id: "selftest", date: "1970-01-01", gitSha: "none", buildProfile: "release" } });
  assert.deepEqual(validateReport(rep), []);
  assert.equal(rep.grades.fpsP50, "go");
});
