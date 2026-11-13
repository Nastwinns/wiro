// Interaction helpers for the prototype page. Prelude only defines functions; the calling script uses them.
// L(frameName, triggerText, action...) examples:
//   await wire(PG, "P · S-03.1 Home / 1440 / Light / Default", {text: "Importer"}, {type: "navigate-to", to: "P · S-02.6 Import / 1440 / Light / Step 1 Source"});
//   await wire(PG, from, {text: "Partager"}, {type: "open-overlay", to: "P · Overlay / Share dialog", relative: true, modal: true});
//   {type: "close-overlay"} | {type: "previous-screen"}
const PGNAME = "B14 · Prototype flows";
const byName = (pg, n) => pg.root.children.find(c => c.name === n);
const textShape = (frame, sel) => penpotUtils.findShape(s => (sel.text && s.type === "text" && s.characters.trim() === sel.text) || (sel.textRe && s.type === "text" && sel.textRe.test(s.characters)) || (sel.name && s.name === sel.name), frame);
// the clickable shape = nearest board ancestor that is not the frame itself (button/row), else the shape itself
const clickable = (frame, s) => { let c = s; while (c.parent && c.parent.id !== frame.id && c.parent.type === "board" && c.width < frame.width * 0.9) { if (c.type === "board") break; c = c.parent; } return c; };
const wire = async (pg, fromName, sel, act, trig = "click") => {
  const from = byName(pg, fromName); if (!from) return "NO FROM " + fromName;
  const t = textShape(from, sel); if (!t) return "NO TRIGGER " + JSON.stringify(sel) + " in " + fromName;
  const el = sel.self ? t : clickable(from, t);
  let action;
  if (act.type === "navigate-to") { const d = byName(pg, act.to); if (!d) return "NO DEST " + act.to; action = { type: "navigate-to", destination: d }; }
  else if (act.type === "open-overlay") { const d = byName(pg, act.to); if (!d) return "NO DEST " + act.to; action = { type: "open-overlay", destination: d, relativeTo: act.relative ? el : undefined, position: act.position || "bottom-left", closeWhenClickOutside: true, addBackgroundOverlay: !!act.modal }; }
  else if (act.type === "close-overlay") action = { type: "close-overlay" };
  else action = { type: "previous-screen" };
  el.addInteraction(trig, action);
  return "OK " + fromName.slice(0, 40) + " :: " + (sel.text || sel.name) + " -> " + (act.to || act.type);
};
