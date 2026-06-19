// Sayfa İçerikleri (page_sections) için section_key başına body şeması.
// SectionBodyEditor bu şemaya bakarak input alanlarını render eder.

export type ItemFieldType = "text" | "textarea" | "icon" | "number";

export type ItemFieldDef = {
  name: string;
  label: string;
  type?: ItemFieldType;
  placeholder?: string;
};

export type SectionSchema = {
  itemLabel: string;
  newItemTemplate: Record<string, unknown>;
  fields: ItemFieldDef[];
};

// Kullanılabilir ikonlar — DynamicIcon ICON_MAP ile senkronize tut.
export const ICON_NAMES = [
  "Award",
  "BarChart3",
  "Briefcase",
  "CalendarClock",
  "CheckCircle2",
  "ClipboardList",
  "Coffee",
  "Compass",
  "Crosshair",
  "Eye",
  "Gauge",
  "Globe",
  "HeartHandshake",
  "Layers",
  "Lightbulb",
  "Lock",
  "MessageCircle",
  "MessageSquare",
  "Quote",
  "Rocket",
  "ShieldCheck",
  "Sparkles",
  "Target",
  "TrendingUp",
  "Trophy",
  "Users",
  "Wrench",
  "Zap",
] as const;

const iconTitleDesc: ItemFieldDef[] = [
  { name: "icon", label: "İkon", type: "icon" },
  { name: "title", label: "Başlık", placeholder: "Sahiplenme" },
  { name: "desc", label: "Açıklama", type: "textarea", placeholder: "Kısa açıklama..." },
];

const titleDesc: ItemFieldDef[] = [
  { name: "title", label: "Başlık" },
  { name: "desc", label: "Açıklama", type: "textarea" },
];

export const SECTION_SCHEMAS: Record<string, SectionSchema> = {
  // about
  values: {
    itemLabel: "Değer",
    newItemTemplate: { icon: "Sparkles", title: "", desc: "" },
    fields: iconTitleDesc,
  },
  culture: {
    itemLabel: "Kültür kartı",
    newItemTemplate: { icon: "Coffee", title: "", desc: "" },
    fields: iconTitleDesc,
  },
  recognitions: {
    itemLabel: "Sertifika / Ödül",
    newItemTemplate: { title: "", year: "" },
    fields: [
      { name: "title", label: "Başlık", placeholder: "Google Premier Partner" },
      { name: "year", label: "Yıl / Açıklama", placeholder: "2023, 2024, 2025" },
    ],
  },
  why: {
    itemLabel: "Sebep",
    newItemTemplate: { title: "", desc: "" },
    fields: titleDesc,
  },

  // services
  synergy: {
    itemLabel: "Avantaj",
    newItemTemplate: { icon: "Layers", title: "", desc: "" },
    fields: iconTitleDesc,
  },
  pricing: {
    itemLabel: "Fiyat modeli",
    newItemTemplate: { title: "", range: "", desc: "", fits: "" },
    fields: [
      { name: "title", label: "Model adı", placeholder: "Retainer Model" },
      { name: "range", label: "Fiyat aralığı", placeholder: "₺45.000 — ₺120.000 / ay" },
      { name: "desc", label: "Açıklama", type: "textarea" },
      { name: "fits", label: "Kimler için uygun", placeholder: "E-ticaret, SaaS, hizmet markaları" },
    ],
  },

  // contact
  process: {
    itemLabel: "Adım",
    newItemTemplate: { icon: "ClipboardList", title: "", desc: "", time: "" },
    fields: [
      { name: "icon", label: "İkon", type: "icon" },
      { name: "title", label: "Başlık" },
      { name: "desc", label: "Açıklama", type: "textarea" },
      { name: "time", label: "Süre etiketi", placeholder: "0 – 48 saat" },
    ],
  },
  guarantees: {
    itemLabel: "Garanti",
    newItemTemplate: { icon: "ShieldCheck", title: "", desc: "" },
    fields: iconTitleDesc,
  },

  // portfolio
  stats: {
    itemLabel: "Rakam",
    newItemTemplate: { label: "", to: 0, suffix: "", prefix: "", decimals: 0 },
    fields: [
      { name: "label", label: "Etiket", placeholder: "Tamamlanan kampanya" },
      { name: "to", label: "Sayı", type: "number", placeholder: "320" },
      { name: "prefix", label: "Önek (opsiyonel)", placeholder: "₺" },
      { name: "suffix", label: "Sonek", placeholder: "+" },
      { name: "decimals", label: "Ondalık", type: "number", placeholder: "0" },
    ],
  },
  testimonials_summary: {
    itemLabel: "Müşteri yorumu",
    newItemTemplate: { quote: "", name: "", role: "" },
    fields: [
      { name: "quote", label: "Alıntı", type: "textarea" },
      { name: "name", label: "Ad Soyad", placeholder: "Onur Şahin" },
      { name: "role", label: "Unvan / Şirket", placeholder: "Kurucu Ortak · Greenly Foods" },
    ],
  },
};

// Basit string array tutan section'lar (her item düz string).
export const STRING_LIST_SECTIONS = new Set(["sectors"]);

// items[] yapısına uymayan, kompleks/özel body'ler. Bunlar için JSON textarea fallback.
export const COMPLEX_SECTIONS = new Set(["featured_case"]);

export function getSchema(sectionKey: string | undefined): SectionSchema | null {
  if (!sectionKey) return null;
  return SECTION_SCHEMAS[sectionKey] ?? null;
}
