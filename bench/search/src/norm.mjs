/**
 * Reference implementation (executable spec) of `wiro-text-norm` — ADR-0007.
 * The Rust crate MUST reproduce `golden/norm-golden.json` bit-for-bit.
 *
 * normalize(token) -> { primary, secondary }
 *   primary   : search key, maximally folded (diacritic/variant-insensitive). Used for recall.
 *   secondary : tone/dot-below-preserving key (Yoruba/Latin marks kept), used to rank exact-diacritic matches higher.
 *
 * Rules, applied in order (R1..R9):
 * R1 Unicode NFKD (compat + decomposition).
 * R2 Remove default-ignorable format chars: U+200B ZWSP, U+200C ZWNJ, U+200D ZWJ, U+200E/F LRM/RLM, U+202A-202E, U+2060, U+FEFF, U+00AD soft hyphen.
 * R3 Case-fold (full lower-casing + ß->ss, ſ->s, ς->σ); Turkic dotless-i is NOT special-cased (locale-independent).
 * R4 Punctuation: U+2019 U+2018 U+02BC U+02BB U+0060 U+00B4 -> ' (apostrophe kept inside tokens only if tokenizer keeps it; see tokenize).
 * R5 Arabic: delete harakat U+064B-U+0652, U+0653-U+065F, U+0670, tatweel U+0640, Quranic marks U+06D6-U+06ED;
 *    fold alef forms آ أ إ ٱ -> ا ; ى -> ي ; ئ -> ي ; ؤ -> و ; ة -> ه ; Persian/Urdu ی -> ي, ک -> ك;
 *    Arabic-Indic and Extended digits ٠-٩ ۰-۹ -> 0-9.
 *    (Hamza on seat is folded; bare ء kept.)
 * R6 Latin specials (identical in primary AND secondary, they are letters not marks):
 *    œ->oe, æ->ae, ø->o, đ->d, ł->l, ŋ->n, ɲ->n, ɛ->e, ɔ->o, ɨ->i, ʋ->v  (Wolof/Yoruba/Hausa/Fula alternates)
 * R7 Hausa hooked letters (primary only): ɓ->b, ɗ->d, ƙ->k, ƴ->y. Secondary keeps the original letter.
 * R8 primary: delete ALL combining marks Mn U+0300-U+036F (Latin); secondary: delete all EXCEPT
 *    U+0300 (grave), U+0301 (acute), U+0302, U+0304 (macron), U+030C (caron), U+0323 (dot below), U+0307 (dot above) — i.e. keep tone and subdot,
 *    but remove everything else (cedilla, diaeresis, tilde, ring, ...).  Then recompose to NFC (secondary only).
 * R9 Output both keys; empty after normalisation => token dropped.
 *
 * Non-goals (v1): stemming, Arabic root extraction, transliteration, language ID, stop words.
 */

const IGNORABLE = /[\u00AD\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g;
const APOS = /[\u2019\u2018\u02BC\u02BB\u0060\u00B4]/g;
const AR_DROP = /[\u064B-\u065F\u0670\u0640\u06D6-\u06ED]/g;
const AR_MAP = { "آ": "ا", "أ": "ا", "إ": "ا", "ٱ": "ا", "ى": "ي", "ئ": "ي", "ؤ": "و", "ة": "ه", "ی": "ي", "ک": "ك" };
const LATIN_MAP = { "œ": "oe", "æ": "ae", "ø": "o", "đ": "d", "ł": "l", "ŋ": "n", "ɲ": "n", "ɛ": "e", "ɔ": "o", "ɨ": "i", "ʋ": "v", "ß": "ss", "ſ": "s" };
const HAUSA_MAP = { "ɓ": "b", "ɗ": "d", "ƙ": "k", "ƴ": "y" };
const KEEP_MARKS = new Set(["\u0300", "\u0301", "\u0302", "\u0304", "\u030C", "\u0323", "\u0307"]);

const mapChars = (s, m) => s.replace(/[^\u0000-\u007F]/g, (c) => m[c] ?? c);

function arabicDigits(s) {
  return s.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (c) => String(c.codePointAt(0) - (c.codePointAt(0) >= 0x06F0 ? 0x06F0 : 0x0660)));
}

export function normalize(token) {
  // R1-R3. NB: lowercasing before NFKD would be equivalent; NFKD first keeps ligatures (ﬁ) expandable before folding.
  let s = token.normalize("NFKD").replace(IGNORABLE, "");
  s = s.toLowerCase().replace(/ς/g, "σ");
  s = s.replace(APOS, "'");
  // R5
  s = arabicDigits(s.replace(AR_DROP, ""));
  s = mapChars(s, AR_MAP);
  // R6
  s = mapChars(s, LATIN_MAP);
  // R8 marks (NFKD already decomposed; Hausa hooked letters have no decomposition, handled by R7)
  const secondaryD = [...s].filter((c) => !/\p{Mn}/u.test(c) || KEEP_MARKS.has(c) || /[\u0600-\u06FF]/.test(c)).join("");
  const secondary = mapChars(secondaryD, {}).normalize("NFC");
  const primary = mapChars([...s].filter((c) => !/[\u0300-\u036F]/.test(c)).join(""), HAUSA_MAP).normalize("NFC");
  return { primary, secondary };
}

/** Word tokenizer: split on anything that is not letter/number/mark, keeping inner apostrophes (l'école -> "l'ecole" and also "ecole" is NOT produced in v1). */
export function tokenize(text) {
  const out = [];
  const re = /[\p{L}\p{N}\p{M}\u200C\u200D]+(?:['’][\p{L}\p{N}\p{M}]+)*/gu;
  for (const m of text.matchAll(re)) out.push(m[0]);
  return out;
}

export function analyze(text) {
  return tokenize(text).map(normalize).filter((k) => k.primary.length > 0);
}
