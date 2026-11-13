// Original seed vocabulary (written for this bench; high-frequency everyday words, no copied corpus).
// Synthetic words are produced from per-language syllable inventories so vocab size reaches realistic levels.
export const SEED = {
  fr: ["élève", "école", "été", "garçon", "cœur", "réunion", "équipe", "à", "où", "très", "déjà", "façade", "forêt", "hôpital", "maçon", "projet", "décision", "priorité", "réseau", "énergie", "sénégal", "d'accord", "problème", "mère", "frère", "marché", "paiement", "lundi", "sécurité", "données"],
  en: ["meeting", "team", "project", "network", "decision", "priority", "budget", "document", "naive", "cafe", "resume", "market", "payment", "security", "data", "review", "plan", "task", "board", "note"],
  wo: ["jàmm", "jërëjëf", "ñaata", "bëgg", "xaalis", "kër", "ndimbal", "mbir", "liggéey", "tefes", "dëkk", "ŋaan", "móol", "wóor", "fexe", "ñu", "dafa", "gëna", "sàmm", "ndaw", "bokk", "jàng", "ñam", "yàlla", "nit"],
  ha: ["ɓarna", "ɗan", "ƙasa", "ƙoƙari", "ƴa", "ɗalibai", "kuɗi", "aiki", "gida", "ƙauye", "ɗaki", "ɓoye", "ƙarfi", "mutum", "yaro", "rana", "ruwa", "kasuwa", "makaranta", "ɗaya"],
  yo: ["ọ̀rọ̀", "ṣé", "ẹ̀ṣẹ̀", "iṣẹ́", "ọmọ", "ẹ̀kọ́", "ọjà", "ilé", "ọ̀nà", "àwọn", "ṣùgbọ́n", "owó", "ọ̀rẹ́", "ìlú", "ẹ̀rọ", "àkókò", "ọ̀pọ̀", "ẹ̀bùn", "pàdé", "ọ̀la"],
  ar: ["كتاب", "مدرسة", "أحمد", "إسلام", "مؤتمر", "مشروع", "ميزانية", "اجتماع", "الفريق", "قرار", "مراجعة", "جدول", "تحديث", "ملف", "سؤال", "مفتوح", "شركة", "عمل", "يوم", "الخميس", "كَتَبَ", "مُدَرِّس", "علىٰ", "آخر", "إلى"],
};
export const SYLLABLES = {
  fr: ["ba", "re", "mi", "tion", "ça", "é", "lo", "ve", "or", "ti", "gé", "nè", "ou", "tra", "ment", "pla", "ré", "se", "dé", "cô"],
  en: ["ba", "re", "ing", "tion", "ver", "ten", "ly", "pro", "ex", "con", "man", "ter", "ous", "al", "est"],
  wo: ["ba", "ñu", "dëk", "ŋa", "jàm", "xa", "bët", "gu", "ñi", "mb", "ndi", "fa", "su", "mó", "lé", "àq"],
  ha: ["ɓa", "ɗa", "ƙa", "ƴa", "ma", "ki", "ru", "sa", "ta", "ɗan", "ƙo", "ya", "ra", "na", "da"],
  yo: ["ọ̀", "ṣẹ", "ẹ̀", "ọ́", "bà", "lé", "jí", "ọ", "ẹ", "kú", "wá", "ṣà", "pọ̀", "lọ́", "ìl", "àk"],
  ar: ["كت", "مد", "رس", "ال", "أح", "مد", "إس", "لام", "مؤ", "تمر", "شر", "كة", "عم", "ل", "يو", "م", "ئس", "ؤل"],
};
export const MIX = { fr: 0.28, en: 0.20, wo: 0.15, ha: 0.10, yo: 0.10, ar: 0.17 };
