// Standardise les noms de frames selon docs/ux/design-decisions.md §3.
// NE LANCER qu'après la fin des copies B14 (proto_copy est idempotent par nom de source).
// Globals: PAGES = ["B07 · Databases", ...] ou vide = toutes les pages SAUF B14 et A*.
// Règles: thème "light|dark|sombre|clair" -> "Light|Dark" ; ajout de " / Default" si segment
// d'état absent sur un frame qui commence par S-xx.y et a 3 segments ; sinon inchangé.
const SKIP = ["B14 · Prototype flows"];
const pages = (typeof PAGES !== "undefined" && PAGES.length ? PAGES : penpot.currentFile.pages.map(p => p.name)).filter(n => !SKIP.includes(n) && !/^[AB]\d|^00|^C /.test(n));
const fixTheme = s => s.replace(/ \/ (light|clair)( \/|$)/i, (m, a, b) => " / Light" + (b || "")).replace(/ \/ (dark|sombre)( \/|$)/i, (m, a, b) => " / Dark" + (b || ""));
const out = [];
for (const pn of pages) {
  const p = penpotUtils.getPageByName(pn); if (!p) { out.push("NOPAGE " + pn); continue; }
  await penpot.openPage(p);
  let n = 0;
  for (const f of p.root.children) {
    if (!/^[Ss]-?\d/.test(f.name)) continue;
    let name = f.name.replace(/^([Ss])-(\d)/, "S-$2");
    name = fixTheme(name);
    const segs = name.split(" / ");
    const viewport = segs.length > 1 && /^(390|768|1366|1440|1480|mobile|390x844)$/i.test(segs[1]);
    const hasTheme = segs.length > 2 && /^(Light|Dark)$/i.test(segs[2]);
    if (viewport && hasTheme && segs.length === 3 && !/Proto/i.test(name)) name = segs.slice(0, 3).join(" / ") + " / Default";
    if (name !== f.name) { const old = f.name; f.name = name; n++; if (out.length < 60) out.push(pn.split(" ")[0] + ": « " + old + " » -> « " + name + " »"); }
  }
  if (n) out.push("-- " + pn + ": " + n + " frames renommées");
}
return out;
