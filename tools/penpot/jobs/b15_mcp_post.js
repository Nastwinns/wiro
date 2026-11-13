// Job penpot_group (apres b15_mcp_pre.js + darken.js) — replace le dark regenere a la place
// de l'ancien (globales OLDX/OLDY conservees dans le meme appel plugin).
{
  const d = penpot.root.children.find(c => /^S-15\.7/.test(c.name) && /Dark/.test(c.name));
  if (!d) { out = "ERREUR: dark regenere introuvable"; }
  else {
    if (globalThis.OLDX !== null && globalThis.OLDX !== undefined) { d.x = globalThis.OLDX; d.y = globalThis.OLDY; }
    out = "S-15.7 Dark regenere (" + (d.children || []).length + " enfants) -> (" + Math.round(d.x) + "," + Math.round(d.y) + ")";
  }
}
