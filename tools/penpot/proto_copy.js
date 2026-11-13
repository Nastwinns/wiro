// Copy frames from their source pages onto the prototype page, leaving the sources untouched.
// Globals: COPIES = [{src: "<page name>", name: "<exact frame name>", x, y, as?: "<new name>"}], DST = "B14 · Prototype flows"
// Method: clone on source page -> turn the CLONE into a component -> instance on DST -> detach -> delete clone's main + component.
const out = [];
const dstP = penpotUtils.getPageByName(DST);
for (const c of COPIES) {
  const srcP = penpotUtils.getPageByName(c.src);
  await penpot.openPage(dstP);
  const newName = c.as || ("P · " + c.name);
  if (dstP.root.children.some(k => k.name === newName)) { out.push("EXISTS " + newName); continue; }
  await penpot.openPage(srcP);
  const f = srcP.root.children.find(k => k.name === c.name);
  if (!f) { out.push("MISSING " + c.src + " :: " + c.name); continue; }
  const cl = f.clone();
  const cmp = penpot.library.local.createComponent([cl]);
  const main = cmp.mainInstance();
  await penpot.openPage(dstP);
  const cp = cmp.instance(); dstP.root.appendChild(cp);
  cp.x = c.x; cp.y = c.y; cp.detach(); cp.name = newName;
  await penpot.waitForLayoutUpdate();
  const info = newName + " ch=" + (cp.children || []).length + " " + Math.round(cp.width) + "x" + Math.round(cp.height);
  await penpot.openPage(srcP);
  main.remove(); try { cmp.remove(); } catch (e) {}
  out.push(info);
}
return out;
