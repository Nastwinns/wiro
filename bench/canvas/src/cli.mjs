#!/usr/bin/env node
// Usage:
//   node src/cli.mjs gen [--variant 1k|10k|25k] [--layout clustered|uniform] [--out scenes/x.json]
//   node src/cli.mjs traces [--out traces/]
//   node src/cli.mjs run --backend null [--variant 1k] [--trace pan] [--runs 5] [--machine M5]
//   node src/cli.mjs validate reports/*.json
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { generateScene, checksum, serialize, VARIANT_COUNTS } from "./gen-scene.mjs";
import { generateTrace, traceChecksum, TRACE_IDS } from "./traces.mjs";
import { createNullBackend, BACKENDS } from "./harness/backend.mjs";
import { runMatrixCell } from "./harness/run.mjs";
import { validateReport } from "./harness/report.mjs";

const [cmd, ...rest] = process.argv.slice(2);
const flag = (n, d) => { const i = rest.indexOf(`--${n}`); return i >= 0 ? rest[i + 1] : d; };
const write = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s); };

if (cmd === "gen") {
  const variant = flag("variant", "10k"), layout = flag("layout", "clustered");
  const s = generateScene({ count: VARIANT_COUNTS[variant], layout });
  const out = flag("out", `scenes/scene-${variant}-${layout}-seed42.json`);
  write(out, serialize(s));
  console.log(`${out} sha256=${checksum(s)} objects=${s.objects.length}`);
} else if (cmd === "traces") {
  const dir = flag("out", "traces");
  for (const id of TRACE_IDS) { const t = generateTrace(id); write(`${dir}/${id}.json`, JSON.stringify(t)); console.log(`${dir}/${id}.json sha256=${traceChecksum(t)} events=${t.events.length}`); }
} else if (cmd === "run") {
  const be = flag("backend", "null");
  if (be !== "null") { console.error(`Backend ${be} (${BACKENDS[be]?.name}) runs inside a webview/browser page; see docs/architecture/spikes/spike-0.4b-canvas-bench.md §5. Only --backend null runs in Node.`); process.exit(2); }
  const variant = flag("variant", "1k");
  const scene = generateScene({ count: VARIANT_COUNTS[variant], layout: flag("layout", "clustered") });
  const trace = generateTrace(flag("trace", "pan"), { durationMs: 5000 });
  const rep = await runMatrixCell({ makeBackend: createNullBackend, scene, sceneChecksum: checksum(scene), variant, trace, traceChecksum: traceChecksum(trace), runCount: Number(flag("runs", 5)),
    machine: { id: flag("machine", "M5"), os: process.platform, webview: "node", gfxApiForced: "auto", class: "desktop" }, run: { id: `null-${Date.now()}`, date: new Date().toISOString(), gitSha: "unknown", buildProfile: "release" } });
  const out = flag("out", "reports/selftest-null.json"); write(out, JSON.stringify(rep, null, 2)); console.log(`${out} overall=${rep.overall} problems=${JSON.stringify(validateReport(rep))}`);
} else if (cmd === "validate") {
  let bad = 0;
  for (const f of rest) { const p = validateReport(JSON.parse(readFileSync(f, "utf8"))); if (p.length) { bad++; console.log(`${f}: ${p.join("; ")}`); } else console.log(`${f}: ok`); }
  process.exit(bad ? 1 : 0);
} else { console.error("commands: gen | traces | run | validate"); process.exit(1); }
