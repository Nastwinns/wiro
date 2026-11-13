/**
 * Backend contract for the ADR-0004 bench. The *real* backends live in the browser/webview
 * (Rust->WASM for B/C/D, TS for E) and implement this same contract on the page side;
 * this Node-side module defines the shape, the registry, and a `null` backend that
 * exercises the whole pipeline without drawing (used for CI/self-test).
 *
 * @typedef {Object} BackendInfo
 * @property {string} id            "B"|"C"|"D"|"E"|"null"
 * @property {string} name          e.g. "vello_gpu"
 * @property {string} gfxApi        "webgl2"|"webgpu"|"cpu"|"canvas2d"
 * @property {string} [adapter]     GL_RENDERER / adapter string
 * @property {number} [wasmGzBytes]
 *
 * @typedef {Object} FrameSample    { t:number(ms), dtMs:number, drawMs?:number }
 *
 * @typedef {Object} Backend
 * @property {BackendInfo} info
 * @property {(canvas:any, opts:{width:number,height:number,dpr:number,forceApi?:string})=>Promise<void>} init
 * @property {(scene:object)=>Promise<{loadMs:number}>} loadScene           scene = wiro-bench-scene/1
 * @property {(view:{cx:number,cy:number,zoom:number})=>void} setView
 * @property {()=>Promise<FrameSample>} renderFrame                          draw one frame, resolves after present
 * @property {(ids:number[],dx:number,dy:number)=>void} dragObjects
 * @property {(id:number,text:string)=>void} setText
 * @property {()=>Promise<{rssMb?:number,wasmMb?:number,gpuMb?:number}>} memory
 * @property {()=>Promise<Uint8Array>} screenshotRgba                        for SSIM vs reference (vello_cpu = C)
 * @property {()=>void} dispose
 */

export const BACKENDS = {
  B: { name: "vello_gpu", gfxApi: "webgl2|webgpu", crate: "vello_gpu (Apache-2.0/MIT)" },
  C: { name: "vello_cpu", gfxApi: "cpu", crate: "vello_cpu (Apache-2.0/MIT) + ImageData upload, tiles/dirty rects" },
  D: { name: "wgpu_custom", gfxApi: "webgl2|webgpu", crate: "wgpu (MIT/Apache-2.0) + own instanced renderer" },
  E: { name: "canvas2d_baseline", gfxApi: "canvas2d", crate: "browser Canvas2D (baseline only, not a product path)" },
};

/** Null backend: fakes a constant 16.7 ms frame; proves orchestration + report plumbing. */
export function createNullBackend() {
  let n = 0;
  return {
    info: { id: "null", name: "null", gfxApi: "none" },
    async init() {}, async loadScene(s) { n = s.objects.length; return { loadMs: 0 }; },
    setView() {}, async renderFrame() { return { t: 0, dtMs: 16.67, drawMs: 0 }; },
    dragObjects() {}, setText() {},
    async memory() { return { rssMb: 50 + n / 1000 }; },
    async screenshotRgba() { return new Uint8Array(4); }, dispose() {},
  };
}
