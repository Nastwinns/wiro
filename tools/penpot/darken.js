// Dark variant generator. Globals required: PAGE (page name), NAMES (exact names of LIGHT frames on that page).
// Clones each frame, remaps every fill/stroke/shadow colour light->dark by library token, renames Light->Dark, appends at the bottom of the page grid.
// Library has no dark component variants, so instance internals are remapped too (documented in docs/ux/design-status.md).
const pairs = {};
L.colors.forEach(c => { const full = (c.path ? c.path + "/" : "") + c.name; pairs[full.replace(/\s/g, "")] = c.color; });
const lookup = (a, b) => { const m = {}; for (const k of Object.keys(pairs)) { if (k.startsWith(a + "/")) { const t = k.slice(a.length + 1); const d = pairs[b + "/" + t]; if (d) (m[pairs[k].toUpperCase()] = m[pairs[k].toUpperCase()] || []).push([t, d]); } } return m; };
const tok = lookup("light", "dark");
// canvas tints
for (const k of Object.keys(pairs)) { if (k.startsWith("canvas/light/")) { const d = pairs["canvas/dark/" + k.slice(13)]; if (d) (tok[pairs[k].toUpperCase()] = tok[pairs[k].toUpperCase()] || []).push(["canvas/" + k.slice(13), d]); } }
const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const known = new Set(Object.values(pairs).map(v => v.toUpperCase()));
const nearCache = {};
// near-miss fallback: an unmapped colour within RGB distance 14 of a light token takes that token's dark pair (never touches exact dark/known tokens)
const near = (H) => { if (H in nearCache) return nearCache[H]; let best = null, bd = 14; if (/^#[0-9A-F]{6}$/.test(H) && !known.has(H)) { const c = rgb(H); for (const k of Object.keys(tok)) { const d = Math.hypot(...rgb(k).map((v, i) => v - c[i])); if (d < bd) { bd = d; best = k; } } } return nearCache[H] = best; };
const pick = (hex, isText) => { const H = (hex || "").toUpperCase(); let arr = tok[H]; if (!arr) { const nk = near(H); if (nk) arr = tok[nk]; } if (!arr) return null; const pref = isText ? ["text/", "status/", "accent/"] : ["bg/", "border/", "canvas/", "accent/", "status/", "text/"]; for (const p of pref) { const f = arr.find(x => x[0].startsWith(p)); if (f) return f[1]; } return arr[0][1]; };
const walk = (s, f) => { f(s); (s.children || []).forEach(c => walk(c, f)); };
const remap = (root) => { let n = 0; walk(root, s => {
  const isText = s.type === "text";
  try { if (Array.isArray(s.fills)) { const nf = s.fills.map(f => { if (f.fillColor) { const d = pick(f.fillColor, isText); if (d) { n++; return { ...f, fillColor: d }; } } return f; }); s.fills = nf; } } catch (e) {}
  try { if (Array.isArray(s.strokes)) { s.strokes = s.strokes.map(f => { if (f.strokeColor) { const d = pick(f.strokeColor, false); if (d) { n++; return { ...f, strokeColor: d }; } } return f; }); } } catch (e) {}
}); return n; };
const darkName = (nm) => /light/i.test(nm) ? nm.replace(/Light/, "Dark").replace(/light/, "dark") : /clair/i.test(nm) ? nm.replace(/Clair/, "Sombre").replace(/clair/, "sombre") : nm + " / Dark";
const pgx = await openPage(PAGE);
const out = [];
for (const nm of NAMES) {
  const src = pgx.root.children.find(c => c.name === nm);
  if (!src) { out.push("MISSING " + nm); continue; }
  const dn = darkName(nm);
  if (pgx.root.children.some(c => c.name === dn)) { out.push("EXISTS " + dn); continue; }
  const cl = src.clone(); cl.name = dn;
  const kids = pgx.root.children.filter(c => c.id !== cl.id);
  const bottom = Math.max(...kids.map(c => c.y + c.height));
  const cnt = pgx.root.children.filter(c => /dark|sombre/i.test(c.name) && c.y >= bottom - 1).length;
  cl.x = 0; cl.y = bottom + 100;
  const n = remap(cl);
  out.push(dn + " remapped=" + n + " ch=" + (cl.children || []).length);
}
await penpot.waitForLayoutUpdate();
return out;
