// Prelude auto-prepended by tools/penpot_call.sh. Helpers over the Penpot plugin API.
const L = penpot.library.local;
const C = (n) => { const c = L.colors.find(x => (x.path ? x.path + "/" : "") + x.name === n || (x.path + " / " + x.name) === n); if (!c) throw new Error("color not found: " + n); return c; };
const hex = (n) => C(n).color;
const typo = (n) => { const t = L.typographies.find(x => x.name === n); if (!t) throw new Error("typo not found: " + n); return t; };
const comp = (n) => { const c = L.components.find(x => (x.path ? x.path + "/" : "") + x.name === n || x.name === n); if (!c) throw new Error("component not found: " + n); return c; };
const openPage = async (name) => { const p = penpotUtils.getPageByName(name); if (!p) throw new Error("page not found: " + name); await penpot.openPage(p); return p; };
// theme: "light" | "dark" -> semantic colour lookup, e.g. T.bg("app")
const mkTheme = (th) => ({ c: (k) => hex(th + " / " + k) });
const board = (parent, name, x, y, w, h, fill) => { const b = penpot.createBoard(); b.name = name; (parent || penpot.root).appendChild(b); b.x = x; b.y = y; b.resize(w, h); b.fills = fill ? [{ fillColor: fill, fillOpacity: 1 }] : []; return b; };
const rect = (parent, name, x, y, w, h, fill, r = 0, stroke) => { const s = penpot.createRectangle(); s.name = name; parent.appendChild(s); s.x = parent.x + x; s.y = parent.y + y; s.resize(w, h); s.fills = fill ? [{ fillColor: fill, fillOpacity: 1 }] : []; if (r) s.borderRadius = r; if (stroke) s.strokes = [{ strokeColor: stroke, strokeWidth: 1, strokeAlignment: "inner" }]; return s; };
const text = (parent, str, x, y, o = {}) => { const t = penpot.createText(str); parent.appendChild(t); t.x = parent.x + x; t.y = parent.y + y; if (o.typo) t.applyTypography(typo(o.typo)); if (o.size) t.fontSize = String(o.size); if (o.weight) t.fontWeight = String(o.weight); if (o.color) t.fills = [{ fillColor: o.color, fillOpacity: 1 }]; if (o.w) { t.resize(o.w, t.height); t.growType = "auto-height"; } if (o.align) t.align = o.align; t.name = o.name || str.slice(0, 40); return t; };
const inst = (parent, name, x, y) => { const i = comp(name).instance(); parent.appendChild(i); i.x = parent.x + x; i.y = parent.y + y; return i; };
const frameName = (id, name, vp, theme, state) => `${id} ${name} / ${vp} / ${theme}${state ? " / " + state : ""}`;
// next free slot in a page grid (frames laid out on 1600px columns, 1100px rows, 3 per row)
const slot = (page, w = 1440, h = 900) => { const n = page.root.children.filter(c => c.type === "board").length; return { x: (n % 3) * 1600, y: Math.floor(n / 3) * 1100 }; };
