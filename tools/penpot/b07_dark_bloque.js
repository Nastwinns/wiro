// B07 — la variante Dark de S-07.2 Kanban n'a pas la colonne « Bloqué » que le Light a reçu
// (tranche 2026-11-13 : colonne Bloqué obligatoire, spec 07). À lancer quand le plugin est libre.
// Méthode : duplique la colonne « En cours » du Dark, renomme en « Bloqué », met une carte
// « Soumis à validation » avec puce warning ; sinon signale pour construction manuelle.
const p = penpotUtils.getPageByName("B07 · Databases");
await penpot.openPage(p);
const dark = p.root.children.find(c => /^S-07\.2 Kanban \/ 1440 \/ [Dd]ark/.test(c.name));
if (!dark) return "frame dark introuvable";
const texts = penpotUtils.findShapes(s => s.type === "text", dark).map(s => s.characters);
if (texts.includes("Bloqué")) return "déjà fait";
const enCours = penpotUtils.findShapes(s => s.type === "text" && s.characters === "En cours", dark)[0];
if (!enCours) return "colonne En cours introuvable dans le dark — construction manuelle nécessaire";
// remonter au board-colonne parent (largeur ~ 260-320)
let col = enCours; while (col.parent && col.parent !== dark && !(col.width > 200 && col.height > 400)) col = col.parent;
if (col === dark) return "colonne non isolable — manuel";
const clone = col.clone(); dark.appendChild(clone);
clone.x = col.x + col.width + 24; clone.y = col.y;
const ct = penpotUtils.findShapes(s => s.type === "text" && s.characters === "En cours", clone);
if (ct.length === 0) { clone.remove(); return "clone sans titre — manuel"; }
ct[0].characters = "Bloqué";
// carte unique : garder la 1re carte, renommer, retirer les autres
const cards = clone.children.filter(c => c !== ct[0] && (c.height || 0) > 40 && (c.height || 0) < col.height / 2);
if (cards.length > 1) cards.slice(1).forEach(c => c.remove());
if (cards[0]) { const ctexts = penpotUtils.findShapes(s => s.type === "text", cards[0]); if (ctexts[0]) ctexts[0].characters = "Budget refondu — validation requise"; }
await penpot.waitForLayoutUpdate();
return "colonne Bloqué ajoutée au dark (x=" + Math.round(clone.x) + ")";
