// ADR-0004 go/no-go table, encoded. Machines: M1/M2/M5 = desktop-class, M3/M4 = mobile floor.
export const THRESHOLDS = {
  desktop: { fpsP50: [60, 45], fpsP95: [30, 24], inputLatencyP95Ms: [50, 80], firstFrameMs: [1500, 3000], rssMb: [600, 800], wasmGzKb: [600, 900], soakGrowthPct: [5, 10] },
  mobile:  { fpsP50: [40, 30], fpsP95: [30, 24], inputLatencyP95Ms: [50, 80], firstFrameMs: [1500, 3000], rssMb: [600, 800], wasmGzKb: [600, 900], soakGrowthPct: [5, 10] },
};
const HIGHER_IS_BETTER = new Set(["fpsP50", "fpsP95"]);
/** @returns "go"|"acceptable"|"no-go"|"n/a" */
export function grade(metric, value, klass = "desktop") {
  if (value == null || Number.isNaN(value)) return "n/a";
  const [go, ok] = THRESHOLDS[klass][metric];
  // 0.5 fps tolerance: a perfect 16.67 ms vsync reads as 59.99 fps
  if (HIGHER_IS_BETTER.has(metric)) return value >= go - 0.5 ? "go" : value >= ok - 0.5 ? "acceptable" : "no-go";
  // lower is better; ADR uses strict "<" for go and "<" for acceptable; wasm "no-go" is "> 900"
  return value < go ? "go" : value < ok ? "acceptable" : "no-go";
}
/** Gradient of a whole report: worst grade among graded metrics. */
export function overall(grades) {
  const v = Object.values(grades).filter((g) => g !== "n/a");
  return v.includes("no-go") ? "no-go" : v.includes("acceptable") ? "acceptable" : v.length ? "go" : "n/a";
}
