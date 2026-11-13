// Nettoyage structurel B15/B13 (relevé par l'audit B12-B16). À lancer quand le plugin est libre.
// 1) B15 contient des frames S-10.8/10.9/10.10/10.11 (mal placées, font doublon avec B10).
//    -> les déplacer vers B10 via createComponent->instance->detach (page active globale).
//       On ne déplace que celles DONT B10 n'a pas déjà un frame du même nom.
// 2) B15 : supprimer les 4 calques texte orphelins à la racine (légendes « S-15.x … » hors board).
// 3) B13 : les frames « S-15.9 Assistant mobile » appartiennent à B15 -> déplacer vers B15.
const D = (from) => penpotUtils.getPageByName(from);
const out = [];
async function moveShapes(shapes, toPage) {
  for (const s of shapes) {
    const cmp = penpot.library.local.createComponent([s]);
    const main = cmp.mainInstance();
    await penpot.openPage(toPage);
    const cp = cmp.instance(); toPage.root.appendChild(cp);
    cp.detach();
    cp.name = s.name; cp.x = s.x; cp.y = s.y;
    await penpot.waitForLayoutUpdate();
    main.remove(); try { cmp.remove(); } catch (e) {}
  }
}
// --- 1) S-10.x hors B15 -> B10
{
  const b15 = D("B15 · IA & agents (MCP)"); await penpot.openPage(b15);
  const b10 = D("B10 · Settings & admin");
  await penpot.openPage(b10);
  const have = new Set(b10.root.children.map(c => c.name));
  await penpot.openPage(b15);
  const toMove = b15.root.children.filter(c => /^S-10\.\d/.test(c.name) && !have.has(c.name));
  if (toMove.length) { await moveShapes(toMove, b10); out.push("B15->B10: " + toMove.map(c => c.name.slice(0, 24)).join(" | ")); }
  const dups = b15.root.children.filter(c => /^S-10\.\d/.test(c.name) && have.has(c.name));
  for (const d of dups) {
    await penpot.openPage(b10);
    const orig = b10.root.children.find(c => c.name === d.name);
    const sig = f => JSON.stringify((f.children || []).map(c => c.name));
    await penpot.openPage(b15);
    if (orig && sig(orig) === sig(d)) { d.remove(); out.push("B15 dup supprimé: " + d.name.slice(0, 30)); }
    else out.push("B15 garde « " + d.name.slice(0, 40) + " » (contenu diffère de B10)");
  }
  // restants S-10.x
  const rest = b15.root.children.filter(c => /^S-10\.\d/.test(c.name)).map(c => c.name.slice(0, 40));
  out.push("B15 S-10 restants: " + (rest.length ? rest.join(" | ") : "aucun"));
  // --- 2) orphelins texte racine B15
  const orph = b15.root.children.filter(c => c.type === "text");
  orph.forEach(c => c.remove());
  out.push("B15 orphelins texte supprimés: " + orph.length);
  // repositionnement des frames qui se chevauchaient: S-10.8 Light etc. étant partis, rien à faire de plus
}
// --- 3) S-15.9 mobile B13 -> B15
{
  const b13 = D("B13 · Responsive web (390 / 768)"); await penpot.openPage(b13);
  const mob = b13.root.children.filter(c => /^S-15\.9/.test(c.name));
  if (mob.length) {
    const b15 = D("B15 · IA & agents (MCP)");
    await penpot.openPage(b15);
    let ymax = 0; b15.root.children.forEach(c => { if (c.y + c.height > ymax) ymax = c.y + c.height; });
    await moveShapes(mob, b15);
    await penpot.openPage(b15);
    b15.root.children.filter(c => /^S-15\.9/.test(c.name)).forEach((c, i) => { c.x = (i % 3) * 600; c.y = ymax + 200 + Math.floor(i / 3) * 1000; });
    out.push("B13->B15: " + mob.map(c => c.name.slice(0, 30)).join(" | "));
  } else out.push("B13: aucun S-15.9");
}
return out;
