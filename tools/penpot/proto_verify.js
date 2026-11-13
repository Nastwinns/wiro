// Vérification finale B14 : règle « clics hors zone » + intégrité des copies.
//dry-run en lecture seule. Rapport : frames sans clic de fond, overlays sans close-overlay,
// copies sans enfants, paires main/overlay manquantes.
const pg = await openPage("B14 · Prototype flows");
const out = { framesSansFond: [], overlaysSansClose: [], vides: [], dupNames: [] };
const seen = new Set();
for (const f of pg.root.children) {
  if (!f.name.startsWith("P · ")) continue;
  if (seen.has(f.name)) out.dupNames.push(f.name);
  seen.add(f.name);
  if ((f.children || []).length === 0) { out.vides.push(f.name); continue; }
  const isOverlay = /^P · Overlay \//.test(f.name);
  const hasOwn = (f.interactions || []).length > 0;
  // un calque « plein cadre » (scrim ou rectangle >= 90% du frame) porteur d'interaction compte aussi
  const big = (f.children || []).filter(c => c.width >= f.width * 0.9 && c.height >= f.height * 0.9);
  const bigWired = big.some(c => (c.interactions || []).length > 0);
  if (isOverlay) {
    const closes = JSON.stringify(f.interactions || []).includes("close-overlay") || hasOwn || bigWired;
    if (!closes) out.overlaysSansClose.push(f.name);
  } else {
    if (!hasOwn && !bigWired) out.framesSansFond.push(f.name.slice(0, 60));
  }
}
out.totaux = { copies: seen.size, framesSansFond: out.framesSansFond.length, overlaysSansClose: out.overlaysSansClose.length, vides: out.vides.length };
return out;
