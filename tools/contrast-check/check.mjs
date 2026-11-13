#!/usr/bin/env node
// Vérifie les paires de contraste déclarées dans tokens.json ($extensions["ubao.contrast"]).
// Usage: node check.mjs [tokens.json] [--out rapport.md]
import fs from 'node:fs';
const args = process.argv.slice(2);
const oi = args.indexOf('--out');
const out = oi >= 0 ? args.splice(oi, 2)[1] : null;
const file = args[0] || new URL('../../design/tokens/tokens.json', import.meta.url).pathname;
const tree = JSON.parse(fs.readFileSync(file, 'utf8'));

const leaves = {};
(function walk(n, p) {
  if (n && typeof n === 'object' && '$value' in n) { leaves[p.join('.')] = n; return; }
  for (const [k, v] of Object.entries(n || {})) if (!k.startsWith('$')) walk(v, [...p, k]);
})(tree, []);

function resolve(ref, depth = 0) {
  if (depth > 10) throw new Error('référence cyclique ' + ref);
  const m = /^\{(.+)\}$/.exec(ref);
  if (!m) return ref;
  const t = leaves[m[1]];
  if (!t) throw new Error('référence inconnue ' + ref);
  return resolve(t.$value, depth + 1);
}
const rgb = h => { h = h.replace('#', ''); if (h.length > 6) h = h.slice(0, 6); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); };
const lum = h => { const [r, g, b] = rgb(h).map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const rows = []; let fail = 0;
for (const [name, t] of Object.entries(leaves)) {
  const pairs = t.$extensions?.['ubao.contrast'];
  if (!pairs) continue;
  const fg = resolve(t.$value);
  for (const { against, min } of pairs) {
    const bg = resolve(against);
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) fail++;
    rows.push({ name, fg, against: against.replace(/[{}]/g, ''), bg, min, r, ok });
  }
}
let md = `# Rapport de contraste\n\nSource : \`${file.split('/design/')[1] ? 'design/' + file.split('/design/')[1] : file}\` · ${rows.length} paires · ${fail} échec(s)\n\n| Jeton | Valeur | Contre | Fond | Min | Ratio | |\n|---|---|---|---|---|---|---|\n`;
for (const x of rows) md += `| ${x.name} | ${x.fg} | ${x.against} | ${x.bg} | ${x.min} | ${x.r.toFixed(2)} | ${x.ok ? 'OK' : 'ÉCHEC'} |\n`;
if (out) fs.writeFileSync(out, md); else console.log(md);
if (fail) { console.error(`${fail} paire(s) sous le seuil`); process.exit(1); }
console.error('Tous les contrastes sont conformes.');
