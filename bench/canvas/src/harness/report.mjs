import { median } from "../stats.mjs";
import { grade, overall } from "./thresholds.mjs";

const NUM_KEYS = ["fpsP50", "fpsP95", "droppedRatio", "inputLatencyP95Ms", "firstFrameColdMs", "firstFrameWarmMs", "firstFrameSceneLoadMs", "rssPeakMb", "rssSteadyMb", "wasmLinearMemoryMb", "gpuMemoryMb", "soakGrowthPct"];

export function medianMetrics(runs) {
  const out = { frameMs: {} };
  for (const k of NUM_KEYS) { const v = runs.map((r) => r[k]).filter((x) => typeof x === "number"); out[k] = v.length ? median(v) : null; }
  for (const k of ["p50", "p95", "p99"]) { const v = runs.map((r) => r.frameMs?.[k]).filter((x) => typeof x === "number"); out.frameMs[k] = v.length ? median(v) : null; }
  return out;
}
export function gradeReport(med, wasmGzBytes, klass) {
  const g = {
    fpsP50: grade("fpsP50", med.fpsP50, klass), fpsP95: grade("fpsP95", med.fpsP95, klass),
    inputLatencyP95Ms: grade("inputLatencyP95Ms", med.inputLatencyP95Ms, klass),
    firstFrameMs: grade("firstFrameMs", med.firstFrameColdMs, klass),
    rssMb: grade("rssMb", med.rssPeakMb, klass),
    wasmGzKb: grade("wasmGzKb", wasmGzBytes == null ? null : wasmGzBytes / 1024, klass),
    soakGrowthPct: grade("soakGrowthPct", med.soakGrowthPct, klass),
  };
  return { grades: g, overall: overall(g) };
}
/** Minimal hand-rolled validator (no deps): returns list of problems. */
export function validateReport(r) {
  const p = [];
  if (r?.format !== "wiro-bench-report/1") p.push("format");
  for (const k of ["run", "machine", "backend", "scene", "trace", "runs", "median", "grades"]) if (!(k in (r ?? {}))) p.push(`missing ${k}`);
  if (r?.scene && !/^[0-9a-f]{64}$/.test(r.scene.checksum ?? "")) p.push("scene.checksum");
  if (r?.scene && r.scene.seed !== 42) p.push("scene.seed must be 42");
  if (r?.run && r.run.buildProfile !== "release") p.push("run.buildProfile must be release");
  if (Array.isArray(r?.runs) && r.runs.length < 5) p.push("fewer than 5 runs (ADR: median of 5)");
  if (r?.machine && !["M1", "M2", "M3", "M4", "M5"].includes(r.machine.id)) p.push("machine.id");
  return p;
}
