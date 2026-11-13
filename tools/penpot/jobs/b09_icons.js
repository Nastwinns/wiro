// Job penpot_group — page B09. L'agent états a retiré les icônes erronees (user-plus / plus,
// oublis de gabarit) sur S-09.5 Export / Progress seulement ; les frames Default Light et Dark
// les ont encore. Mirror : supprimer les descendants nommes exactement "user-plus" ou "plus".
{
  let n = 0; const where = [];
  for (const f of penpot.root.children) {
    if (!/^S-09\.5 Export \/ 1440 \/ (Light|Dark) \/ Default$/.test(f.name)) continue;
    const bad = penpotUtils.findShapes(s => s.type === "shape" && /^(user-plus|plus)$/.test(s.name || ""), f);
    bad.forEach(s => { s.remove(); n++; });
    if (bad.length) where.push(f.name + " x" + bad.length);
  }
  out = "S-09.5 Default icônes retirées: " + n + (where.length ? " (" + where.join(", ") + ")" : " — aucune trouvée, vérifier les noms de formes");
}
