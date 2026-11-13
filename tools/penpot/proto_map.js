// Carte des parcours + navigation transverse — B14. À lancer après la fin de tous les agents B14.
// 1) Construit le board « Carte des parcours » à (x=-2000, y=-1200), liste F1..F11 + F9b/c/d,
//    chaque ligne = texte cliquable -> navigate-to vers la frame de départ du flow.
// 2) Dans chaque copy P· qui contient une sidebar avec les textes exacts
//    (« Accueil », « Recherche », « Boîte de réception » | « Inbox », « Corbeille », « Réglages » ),
//    câble ces textes (cible = board parent cliquable) vers les frames de départ correspondantes
//    (uniquement si le calque n'a pas déjà d'interaction).
const pg = await openPage("B14 · Prototype flows");
const byName = (n) => pg.root.children.find(c => c.name === "P · " + n || c.name === n);
const STARTS = {
  "F1 Connexion et onboarding": "S-02.1 Sign in / 1440 / Light / Default",
  "F2 Accueil et board": "S-03.1 Home / 1440 / Light / Default",
  "F3 Atelier": "S-06.1 Workshop bar facilitator / 1440 / Light / Default",
  "F4 Doc, cadre live et partage": "S-04.1 Doc / 1440 / Light / Empty",
  "F5 Bases de données": "S-07.1 Vue tableau / 1440 / light / Défaut",
  "F6 Recherche et wiki": "S-08.3 Search / 1440 / Light / Default",
  "F7 Réglages et administration": "S-10.1 Account / 1440 / Light / Default",
  "F8 Administration serveur": "S-11.1 Overview / 1440 / Light",
  "F9 Extensions et migration": "S-16.1 Marketplace (web) / 1440 / Light",
  "F10 IA et agents": "S-15.1 Assistant / 1440 / Light / Empty + suggestions",
  "F11 États système": "S-12.1 Offline / Doc / 1440 / Light / Offline",
};
const out = [];
// --- 1) Carte
const CARD = "Carte des parcours";
let card = pg.root.children.find(c => c.name === CARD);
if (!card) {
  card = pg.createBoard(); card.name = CARD; card.x = -2400; card.y = -1200;
  card.resize(720, 150 * (Object.keys(STARTS).length + 1));
  card.fills = [{ fillColor: "#FAFAF7" }]; card BorderRadius = 16;
  const title = pg.createText(); title.name = "title"; title.characters = "Carte des parcours";
  title.fontFamilies = ["Inter Tight"]; title.fontSize = 24; title.fillStyle = "#1A1D1C";
  card.appendChild(title); title.x = 32; title.y = 24;
  const map0 = penpot.mappers.shape(card);
  let row = 1;
  for (const [flow, start] of Object.entries(STARTS)) {
    const t = pg.createText(); t.name = flow; t.characters = flow + " — " + start.split(" / ")[1];
    t.fontFamilies = ["Inter Tight"]; t.fontSize = 16; t.fillStyle = "#0B5D49";
    card.appendChild(t); t.x = 32; t.y = 72 + row * 44;
    const dest = byName(start);
    if (dest) { const el = t; el.addInteraction("click", { type: "navigate-to", destination: dest }); }
    else out.push("START MISSING " + start);
    row++;
  }
  out.push("carte: " + row + " lignes");
} else out.push("carte existe");
// --- 2) sidebar transverse dans les copies
const SIDE = { "Accueil": "F2 Accueil et board", "Recherche": "F6 Recherche et wiki", "Boîte de réception": "F7 Réglages et administration", "Corbeille": "F6 Recherche et wiki", "Paramètres": "F7 Réglages et administration" };
let wired = 0;
for (const f of pg.root.children) {
  if (!f.name.startsWith("P · ") || !f.width) continue;
  const texts = penpotUtils.findShapes(s => s.type === "text" && SIDE[s.characters], f);
  for (const t of texts) {
    const host = t.parent && t.parent.type === "board" && t.parent.id !== f.id ? t.parent : t;
    if ((host.interactions || []).length) continue;
    const dest = byName(STARTS[SIDE[t.characters]]);
    if (!dest) continue;
    host.addInteraction("click", { type: "navigate-to", destination: dest });
    wired++;
  }
}
out.push("sidebar liens: " + wired);
return out;
