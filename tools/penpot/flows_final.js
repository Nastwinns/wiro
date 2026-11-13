// Consolidation FINALE des flows B14 — à lancer quand PLUS AUCUN agent n'écrit sur B14.
// Le renommage `flow.name` est cassé dans le plugin (renomme un autre flow) : on fait
// delete + recreate. Les « Flow N » automatiques créés par addInteraction sont supprimés.
// Les sous-flows F9b/F9c/F9d sont conservés (départs distincts).
const pg = await openPage("B14 · Prototype flows");
const STARTS = [
  ["F1 Connexion et onboarding", /^P · S-02\.1 Sign in/],
  ["F2 Accueil et board", /^P · S-03\.1 Home \/ 1440 \/ Light \/ Default$/],
  ["F3 Atelier", /^P · S-06\.1 Workshop bar facilitator/],
  ["F4 Doc, cadre live et partage", /^P · S-04\.1 Doc \/ 1440 \/ Light \/ Empty$/],
  ["F5 Bases de données", /^P · S-07\.1 Vue tableau/],
  ["F6 Recherche et wiki", /^P · S-08\.3 Search/],
  ["F7 Réglages et administration", /^P · S-10\.1 Account/],
  ["F8 Administration serveur", /^P · S-11\.1 Overview/],
  ["F9 Extensions et migration", /^P · S-16\.1 Marketplace/],
  ["F9b Extension en cours", /^P · S-16\.4 Extension en cours/],
  ["F9c Import hub", /^P · S-16\.8 Import hub/],
  ["F9d Import depuis l'onboarding", /^P · S-02\.6 Import/],
  ["F10 IA et agents", /^P · S-15\.1 Assistant.*Empty/],
  ["F11 États système", /^P · S-12\.1 Offline/],
];
const KEEP = new Map(); const DROP = [];
for (const fl of pg.flows) {
  const sn = (fl.startingBoard && fl.startingBoard.name) || "";
  const hit = STARTS.find(([, re]) => re.test(sn));
  if (hit && !KEEP.has(hit[0]) && fl.name === hit[0]) KEEP.set(hit[0], fl);
  else DROP.push(fl);
}
for (const fl of DROP) { try { pg.removeFlow(fl.id); } catch (e) {} }
const created = [];
for (const [name, re] of STARTS) {
  if (KEEP.has(name)) continue;
  const start = pg.root.children.find(c => re.test(c.name));
  if (!start) { created.push("MANQUANT " + name + " (frame de départ absente)"); continue; }
  pg.createFlow(name, start); created.push("créé " + name);
}
return {
  gardes: [...KEEP.keys()].sort(),
  supprimes: DROP.length,
  creationOuECarts: created,
  etatFinal: pg.flows.map(f => f.name).sort(),
};
