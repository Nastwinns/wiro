// Replayable input traces (ADR-0004 "Scripted interactions"). Time in ms from trace start,
// viewport in world coordinates; events sampled at 120 Hz so replay is frame-rate independent.
import { createHash } from "node:crypto";
import { makeRng } from "./prng.mjs";
import { WORLD } from "./gen-scene.mjs";

export const TRACE_IDS = ["pan", "zoom", "drag", "typing", "soak"];
const HZ = 120;
const r3 = (n) => Math.round(n * 1000) / 1000;
const KEYS = ["é", "è", "à", "ñ", "ŋ", "ó", "ë", "ẹ", "ọ", "ṣ", "ɓ", "ɗ", "ƙ", "a", "b", "c", " ", "م", "ر", "ح", "ب", "ا"];

export function generateTrace(id, { seed = 42, durationMs } = {}) {
  const rng = makeRng(seed + TRACE_IDS.indexOf(id) * 1009);
  const dur = durationMs ?? (id === "soak" ? 300000 : 60000);
  const events = [];
  const step = 1000 / HZ;
  const view = (t, zoom) => {
    const k = t / dur;
    return { cx: r3(WORLD / 2 + 7000 * Math.sin(2 * Math.PI * 3 * k)), cy: r3(WORLD / 2 + 7000 * Math.sin(2 * Math.PI * 2 * k + 1)), zoom };
  };
  const zoomSweep = (k, cycles) => r3(0.05 * Math.pow(80, (1 - Math.cos(2 * Math.PI * cycles * k)) / 2)); // 5 %..400 %
  if (id === "pan") {
    for (let t = 0; t < dur; t += step) events.push({ t: r3(t), type: "view", ...view(t, 1) });
  } else if (id === "zoom") {
    for (let t = 0; t < dur; t += step) events.push({ t: r3(t), type: "view", cx: WORLD / 2, cy: WORLD / 2, zoom: zoomSweep(t / dur, 3) });
  } else if (id === "drag") {
    events.push({ t: 0, type: "select", count: 100, rule: "100 non-connector ids nearest viewport centre" });
    for (let t = step; t < dur; t += step) {
      const k = t / dur;
      events.push({ t: r3(t), type: "view", ...view(t, r3(0.5 + 0.4 * Math.sin(2 * Math.PI * 4 * k))) });
      events.push({ t: r3(t), type: "drag", dx: r3(6 * Math.cos(2 * Math.PI * 5 * k)), dy: r3(6 * Math.sin(2 * Math.PI * 5 * k)) });
    }
  } else if (id === "typing") {
    events.push({ t: 0, type: "view", cx: WORLD / 2, cy: WORLD / 2, zoom: 1 });
    events.push({ t: 100, type: "edit-start", target: "nearest-sticky-to-centre" });
    for (let t = 500; t < dur; t += rng.range(110, 230)) {
      if (rng.chance(0.1)) events.push({ t: r3(t), type: "key", key: "Backspace" });
      else events.push({ t: r3(t), type: "key", key: rng.pick(KEYS) });
    }
  } else if (id === "soak") {
    // 20 s phases: pan / zoom / drag / typing
    for (let t = 0; t < dur; t += step) {
      const phase = Math.floor(t / 20000) % 4, k = (t % 20000) / 20000;
      if (phase === 0) events.push({ t: r3(t), type: "view", ...view(t, 1) });
      else if (phase === 1) events.push({ t: r3(t), type: "view", cx: WORLD / 2, cy: WORLD / 2, zoom: zoomSweep(k, 2) });
      else if (phase === 2) events.push({ t: r3(t), type: "drag", dx: r3(4 * Math.cos(k * 20)), dy: r3(4 * Math.sin(k * 20)) });
      else if (rng.chance(0.03)) events.push({ t: r3(t), type: "key", key: rng.pick(KEYS) });
    }
  } else throw new Error(`unknown trace ${id}`);
  return { format: "wiro-bench-trace/1", id, seed, durationMs: dur, hz: HZ, events };
}
export const traceChecksum = (tr) => createHash("sha256").update(JSON.stringify(tr)).digest("hex");
