export function percentile(sorted, p) {
  if (!sorted.length) return null;
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil(p * sorted.length) - 1))];
}
/** frame deltas (ms) -> stats; dropped = frame > 25 ms (1.5 x 16.7). */
export function frameStats(deltas) {
  const s = [...deltas].sort((a, b) => a - b);
  const p50 = percentile(s, 0.5), p95 = percentile(s, 0.95), p99 = percentile(s, 0.99);
  return { frames: deltas.length, frameMs: { p50, p95, p99 }, fpsP50: p50 ? 1000 / p50 : null, fpsP95: p95 ? 1000 / p95 : null, droppedRatio: deltas.length ? deltas.filter((d) => d > 25).length / deltas.length : null };
}
/** Least-squares slope of RSS samples [{t,mb}] -> % growth over the run (soak leak check). */
export function memoryGrowthPct(samples) {
  if (samples.length < 2) return null;
  const n = samples.length, mx = samples.reduce((a, s) => a + s.t, 0) / n, my = samples.reduce((a, s) => a + s.mb, 0) / n;
  let num = 0, den = 0;
  for (const s of samples) { num += (s.t - mx) * (s.mb - my); den += (s.t - mx) ** 2; }
  const span = samples.at(-1).t - samples[0].t;
  return my ? ((den ? num / den : 0) * span / samples[0].mb) * 100 : null;
}
export const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; };
