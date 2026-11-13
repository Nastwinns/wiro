// Job penpot_group — page "B11 · Server admin". Libellé de nav « Abonnement » -> « Licence »
// (tranche design-status 2026-11-13 : lever l'ambiguite avec « Abonnement et factures » de B10).
// Cible : uniquement les textes de la navigation laterale (cadres S-11.x), pas le contenu
// du frame S-11.5 lui-meme (dont le titre peut rester « Abonnement » si c'est le titre de page ?
// Non : la spec 11 appelle l'ecran « Subscription/Licence » -> on renomme aussi le titre H1).
// Idempotent : ne fait rien si « Licence » deja en place.
{
  let n = 0;
  const frames = penpot.root.children.filter(c => c.type === "board" && /^S-11\./.test(c.name));
  for (const f of frames) {
    penpotUtils.findShapes(s => s.type === "text" && s.characters === "Abonnement", f).forEach(s => {
      s.characters = "Licence"; n++;
    });
  }
  out = "B11 Abonnement->Licence: " + n;
}
