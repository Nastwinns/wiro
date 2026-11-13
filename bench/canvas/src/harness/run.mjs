// Orchestrator skeleton. Real runs happen in a page (see ../../harness-page/README.md); this drives
// the replay loop against any object implementing the Backend contract, so the same logic is used
// by the in-page runner and by the Node self-test (null backend).
import { frameStats } from "../stats.mjs";
import { medianMetrics, gradeReport } from "./report.mjs";

export async function replay(backend, scene, trace, { now = () => performance.now() } = {}) {
  const t0 = now();
  const loadMs = (await backend.loadScene(scene)).loadMs;
  const deltas = [];
  const latencies = [];
  let sel = [];
  const tStart = now();
  let firstFrameMs = null;
  for (const ev of trace.events) {
    // NOTE: real harness paces on requestAnimationFrame to ev.t; the skeleton replays as fast as possible.
    if (ev.type === "view") backend.setView(ev);
    else if (ev.type === "select") sel = scene.objects.filter((o) => o.type !== "connector").slice(0, ev.count).map((o) => o.id);
    else if (ev.type === "drag") backend.dragObjects(sel, ev.dx, ev.dy);
    else if (ev.type === "key") { const tk = now(); backend.setText(-1, ev.key); await backend.renderFrame(); latencies.push(now() - tk); continue; }
    const f = await backend.renderFrame();
    if (firstFrameMs == null) firstFrameMs = now() - t0;
    deltas.push(f.dtMs);
  }
  const mem = await backend.memory();
  const fs = frameStats(deltas);
  latencies.sort((a, b) => a - b);
  return { ...fs, frameMs: fs.frameMs, inputLatencyP95Ms: latencies.length ? latencies[Math.ceil(0.95 * latencies.length) - 1] : null,
    firstFrameColdMs: firstFrameMs, firstFrameSceneLoadMs: loadMs, rssPeakMb: mem.rssMb ?? null, wasmLinearMemoryMb: mem.wasmMb ?? null, gpuMemoryMb: mem.gpuMb ?? null, wallMs: now() - tStart };
}

export async function runMatrixCell({ makeBackend, scene, sceneChecksum, variant, trace, traceChecksum, machine, runCount = 5, run }) {
  const runs = [];
  for (let i = 0; i < runCount; i++) { const b = makeBackend(); await b.init(null, { width: 1280, height: 720, dpr: 1 }); runs.push(await replay(b, scene, trace)); b.dispose(); }
  const b0 = makeBackend();
  const med = medianMetrics(runs);
  const { grades, overall } = gradeReport(med, b0.info.wasmGzBytes, machine.class ?? "desktop");
  return { format: "wiro-bench-report/1", run, machine, backend: b0.info,
    scene: { variant, layout: scene.layout, seed: scene.seed, checksum: sceneChecksum }, trace: { id: trace.id, checksum: traceChecksum },
    runs, median: med, ssimVsReference: null, grades, overall };
}
