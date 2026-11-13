// Deterministic scene generator, conforms to ADR-0004 "Scene generator" table.
import { createHash } from "node:crypto";
import { makeRng } from "./prng.mjs";
import { FR, WO, AR, YO, HA, EN } from "./text-pool.mjs";

export const WORLD = 20000;
export const SEED = 42;
export const SHARES = { sticky: 0.40, text: 0.15, shape: 0.15, connector: 0.20, image: 0.10 };
export const VARIANT_COUNTS = { "1k": 1000, "10k": 10000, "25k": 25000 };
const STICKY_COLORS = ["#FFE066", "#FFB3C1", "#B5E48C", "#A0C4FF", "#FFC6FF", "#FDFFB6"];
const FONTS = ["Inter", "Noto Naskh Arabic"]; // 2 fonts (ADR); Arabic runs use the second at render time if absent

const r2 = (n) => Math.round(n * 100) / 100;

/** Largest-remainder split so the shares sum exactly to count. */
export function typeCounts(count) {
  const keys = Object.keys(SHARES);
  const raw = keys.map((k) => SHARES[k] * count);
  const base = raw.map(Math.floor);
  let left = count - base.reduce((a, b) => a + b, 0);
  raw.map((v, i) => [v - base[i], i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).forEach(([, i]) => { if (left-- > 0) base[i]++; });
  return Object.fromEntries(keys.map((k, i) => [k, base[i]]));
}

function weighted(rng, pairs) { let x = rng.next(); for (const [v, p] of pairs) { if ((x -= p) < 0) return v; } return pairs.at(-1)[0]; }

function isRtl(s) { return /[\u0600-\u06FF]/.test(s); }

function makeText(rng, minChars, maxChars, allowRtl) {
  // ADR: FR/Wolof/Arabic mixed, ~10 % RTL
  const rtl = allowRtl && rng.chance(0.10);
  const pool = rtl ? AR : rng.chance(0.45) ? WO : rng.chance(0.07) ? YO : rng.chance(0.07) ? HA : rng.chance(0.08) ? EN : FR;
  const target = rng.int(minChars, maxChars);
  let s = rng.pick(pool);
  while (s.length < target) s += " " + rng.pick(pool);
  s = s.slice(0, Math.max(target, 1)).trim();
  return { text: s, rtl: isRtl(s) };
}

function makePositioner(rng, layout) {
  if (layout === "uniform") return (w, h) => [rng.range(0, WORLD - w), rng.range(0, WORLD - h)];
  const K = 24;
  const centers = Array.from({ length: K }, () => [rng.range(1500, WORLD - 1500), rng.range(1500, WORLD - 1500), rng.range(250, 900)]);
  return (w, h) => {
    const [cx, cy, s] = rng.pick(centers);
    const clamp = (v, m) => Math.min(Math.max(v, 0), WORLD - m);
    return [clamp(rng.normal(cx, s) - w / 2, w), clamp(rng.normal(cy, s) - h / 2, h)];
  };
}

/**
 * @param {{count?:number, layout?:"uniform"|"clustered", seed?:number}} o
 */
export function generateScene({ count = 10000, layout = "clustered", seed = SEED } = {}) {
  const rng = makeRng(seed);
  const place = makePositioner(rng, layout);
  const counts = typeCounts(count);
  // deterministic interleaved order of types
  const order = [];
  for (const [t, n] of Object.entries(counts)) for (let i = 0; i < n; i++) order.push(t);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng.next() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }

  const objects = [];
  const anchors = []; // indices of non-connector objects
  const pending = [];
  for (const type of order) {
    const id = objects.length + 1;
    const z = id;
    if (type === "sticky") {
      const w = rng.pick([160, 200, 240]), h = w;
      const [x, y] = place(w, h);
      const t = makeText(rng, 20, 60, true);
      objects.push({ id, type, z, x: r2(x), y: r2(y), w, h, color: rng.pick(STICKY_COLORS), shadow: true, text: t.text, rtl: t.rtl, fontSize: 16 });
    } else if (type === "text") {
      const fontSize = rng.pick([12, 14, 18, 24, 32, 48]);
      const lines = rng.int(1, 5);
      const t = makeText(rng, 12 * lines, 28 * lines, true);
      const w = r2(rng.range(160, 520)), h = r2(lines * fontSize * 1.3);
      const [x, y] = place(w, h);
      objects.push({ id, type, z, x: r2(x), y: r2(y), w, h, font: FONTS[rng.chance(0.5) ? 0 : 1], fontSize, lines, text: t.text, rtl: t.rtl });
    } else if (type === "shape") {
      const kind = rng.pick(["rect", "ellipse", "polygon"]);
      const w = r2(rng.range(60, 400)), h = r2(rng.range(60, 400));
      const [x, y] = place(w, h);
      const o = { id, type, z, x: r2(x), y: r2(y), w, h, kind, fill: rng.pick(STICKY_COLORS), stroke: "#1F2937", strokeWidth: rng.pick([1, 2, 4]) };
      if (kind === "polygon") o.sides = rng.int(3, 8);
      objects.push(o);
    } else if (type === "image") {
      const long = weighted(rng, [[256, 0.6], [384, 0.2], [512, 0.1], [768, 0.06], [1024, 0.04]]); // long side 256-1024 px
      const short = Math.round(long * rng.pick([1, 0.75, 0.5625]));
      const [w, h] = rng.chance(0.5) ? [long, short] : [short, long];
      const dw = r2(Math.min(w, 600) * rng.range(0.5, 1)), dh = r2(dw * h / w);
      const [x, y] = place(dw, dh);
      objects.push({ id, type, z, x: r2(x), y: r2(y), w: dw, h: dh, srcW: w, srcH: h, format: rng.chance(0.5) ? "jpeg" : "webp", decodedBytes: w * h * 4, pixelSeed: rng.int(0, 2 ** 31 - 1) });
    } else {
      pending.push(id);
      objects.push(null);
      continue;
    }
    anchors.push(id);
  }
  for (const id of pending) {
    const a = rng.pick(anchors);
    let b = rng.pick(anchors);
    if (b === a) b = anchors[(anchors.indexOf(a) + 1) % anchors.length];
    const route = rng.chance(0.5) ? "bezier" : "orthogonal";
    objects[id - 1] = { id, type: "connector", z: id, from: a, to: b, route, arrowHead: rng.pick(["triangle", "open", "none"]), arrowTail: rng.chance(0.2) ? "triangle" : "none", stroke: "#374151", strokeWidth: rng.pick([1, 2, 3]) };
  }
  return { format: "wiro-bench-scene/1", seed, layout, world: { w: WORLD, h: WORLD }, count, counts, objects };
}

/** Canonical serialisation: JSON with insertion-ordered keys, no whitespace. */
export const serialize = (scene) => JSON.stringify(scene);
export const checksum = (scene) => createHash("sha256").update(serialize(scene)).digest("hex");
