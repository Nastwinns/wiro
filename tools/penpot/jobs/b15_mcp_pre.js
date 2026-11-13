// Job penpot_group — page B15. Était attendu : le Dark de S-15.7 (0,9600) est la version
// COURTE, périmée depuis que le Light (4800,0, h=1680) a reçu « Clients connectés » + snippets.
// Ce job supprime le dark court en mémorisant sa position, puis prépare les globales de
// darken.js (fichier suivant du groupe) pour régénérer le dark complet a la meme position.
{
  const old = penpot.root.children.find(c => /^S-15\.7/.test(c.name) && /Dark/.test(c.name));
  globalThis.OLDX = old ? old.x : null;
  globalThis.OLDY = old ? old.y : null;
  const removed = old ? old.name : "aucun dark existant";
  if (old) old.remove();
  globalThis.PAGE = "B15 · IA & agents (MCP)";
  globalThis.NAMES = ["S-15.7 Settings MCP / 1440 / Light"];
  out = "S-15.7 dark court supprime: " + removed + " — darken prepare";
}
