// Sayfa İçerikleri (page_sections) için section body şemaları.
// SectionBodyEditor bu şemalara bakarak kullanıcı dostu input alanları render eder.
//
// Üç tür şema var:
//   1) Liste şeması (SECTION_SCHEMAS)      → body = { items: [ {...}, ... ] }
//   2) String liste (STRING_LIST_SECTIONS) → body = { items: ["...", ...] }
//   3) Obje şeması (OBJECT_SCHEMAS)         → body = { alan: değer, ... } (sabit alanlar)
//
// Arama page_slug'a duyarlı: önce "page:key", yoksa düz "key" denenir.
// Böylece "hero" anasayfada zengin, diğer sayfalarda sadece başlık olabilir.

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

// Sabit alanlı (liste olmayan) section'lar için.
export type ObjectSchema = {
  fields: ItemFieldDef[]; // boş ise sadece üstteki Başlık/Açıklama alanları kullanılır
  note?: string;
};

// Kullanılabilir ikonlar — DynamicIcon ICON_MAP ile senkronize tut.
export const ICON_NAMES = [
  "Award",
  "BarChart3",
  "Briefcase",
  "Building2",
  "CalendarClock",
  "CheckCircle2",
  "ClipboardList",
  "Clock",
  "Coffee",
  "Compass",
  "Crosshair",
  "Eye",
  "FileText",
  "Gauge",
  "Globe",
  "HeartHandshake",
  "Layers",
  "Lightbulb",
  "LineChart",
  "Lock",
  "Mail",
  "Map",
  "MapPin",
  "MessageCircle",
  "MessageSquare",
  "Phone",
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

// ----------------------------------------------------------------------------
// Liste şemaları (body.items = [ {...} ])
// ----------------------------------------------------------------------------
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
  story: {
    itemLabel: "Paragraf",
    newItemTemplate: { text: "" },
    fields: [{ name: "text", label: "Metin", type: "textarea", placeholder: "Paragraf metni..." }],
  },
  mission_vision: {
    itemLabel: "Kart (Misyon/Vizyon/Vaad)",
    newItemTemplate: { icon: "Target", title: "", desc: "" },
    fields: iconTitleDesc,
  },

  // home
  workflow: {
    itemLabel: "Adım",
    newItemTemplate: { icon: "Compass", title: "", desc: "" },
    fields: iconTitleDesc,
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
  channels: {
    itemLabel: "İletişim kanalı",
    newItemTemplate: { icon: "Mail", label: "", bind: "", value: "", href: "", hint: "" },
    fields: [
      { name: "icon", label: "İkon", type: "icon" },
      { name: "label", label: "Etiket", placeholder: "E-posta" },
      {
        name: "bind",
        label: "Site Ayarları'na bağla",
        placeholder: "email / phone / address (boş = düz değer)",
      },
      { name: "value", label: "Değer (bind boşsa)", placeholder: "Hafta içi 09:00 — 18:30" },
      { name: "href", label: "Link (opsiyonel)", placeholder: "https://... veya boş" },
      { name: "hint", label: "Alt not", placeholder: "En hızlı yanıt" },
    ],
  },
  office: {
    itemLabel: "Ofis satırı",
    newItemTemplate: { icon: "MapPin", text: "" },
    fields: [
      { name: "icon", label: "İkon", type: "icon" },
      { name: "text", label: "Metin", placeholder: "İstanbul — Maslak Plaza, Kat 7" },
    ],
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

// ----------------------------------------------------------------------------
// Obje şemaları (body = sabit alanlar). Anahtar "page:key" veya düz "key".
// ----------------------------------------------------------------------------
const ctaFields: ItemFieldDef[] = [
  { name: "highlight", label: "Vurgulanan kelime(ler)", placeholder: "birlikte planlayalım" },
  { name: "primaryLabel", label: "Buton metni", placeholder: "Görüşme Planla" },
  { name: "primaryHref", label: "Buton linki", placeholder: "/iletisim" },
];

export const OBJECT_SCHEMAS: Record<string, ObjectSchema> = {
  "home:hero": {
    fields: [
      { name: "highlight", label: "Vurgulanan kelime(ler)", placeholder: "dijital büyüme" },
      { name: "primaryLabel", label: "1. Buton metni", placeholder: "Ücretsiz Teklif Al" },
      { name: "primaryHref", label: "1. Buton linki", placeholder: "/iletisim" },
      { name: "secondaryLabel", label: "2. Buton metni", placeholder: "Hizmetleri İncele" },
      { name: "secondaryHref", label: "2. Buton linki", placeholder: "/hizmetler" },
      { name: "note1", label: "Not 1", placeholder: "Şu an 6 yeni proje kabul ediyoruz" },
      { name: "note2", label: "Not 2", placeholder: "Ortalama 48 saat içinde teklif" },
    ],
  },
  "home:services_header": {
    fields: [
      { name: "linkLabel", label: "Bağlantı metni", placeholder: "Tüm hizmetler" },
      { name: "linkHref", label: "Bağlantı linki", placeholder: "/hizmetler" },
    ],
  },
  "services:grid_header": {
    fields: [
      { name: "intro", label: "Üst not", placeholder: "Detayları görmek için bir hizmete tıkla" },
      { name: "linkLabel", label: "Bağlantı metni", placeholder: "Hangisi sana uygun?" },
      { name: "linkHref", label: "Bağlantı linki", placeholder: "/iletisim" },
    ],
  },
  "global:cta": { fields: ctaFields },
  "portfolio:invite": { fields: ctaFields },

  // Sadece başlık/açıklama kullanan hero/başlık section'ları:
  "home:hero_badge": { fields: [] },
  "about:hero": { fields: [], note: "Bu bölüm sadece üstteki Üst başlık / Başlık / Açıklama alanlarını kullanır." },
  "services:hero": { fields: [], note: "Bu bölüm sadece üstteki Üst başlık / Başlık / Açıklama alanlarını kullanır." },
  "portfolio:hero": { fields: [], note: "Bu bölüm sadece üstteki Üst başlık / Başlık / Açıklama alanlarını kullanır." },
  "contact:hero": { fields: [], note: "Bu bölüm sadece üstteki Üst başlık / Başlık / Açıklama alanlarını kullanır." },
};

// Tüm "sadece başlık" türündeki section_key'ler (header-only). Bunlar için body editörü
// kullanıcıya "ek alan yok" notu gösterir.
const HEADER_ONLY_KEYS = new Set([
  "timeline_header",
  "team_header",
  "industries_header",
  "tech_header",
  "faq_header",
  "projects_header",
]);

// ----------------------------------------------------------------------------
// String liste tutan section'lar (her item düz string).
// ----------------------------------------------------------------------------
export const STRING_LIST_SECTIONS = new Set(["sectors", "home:brand_strip"]);

// items[] yapısına uymayan, kompleks/özel body'ler. Bunlar için JSON textarea fallback.
export const COMPLEX_SECTIONS = new Set(["featured_case"]);

// ----------------------------------------------------------------------------
// Çözümleyiciler (page_slug duyarlı, düz key'e fallback)
// ----------------------------------------------------------------------------
function keys(page: string | undefined, key: string | undefined): string[] {
  if (!key) return [];
  return page ? [`${page}:${key}`, key] : [key];
}

export function getSchema(
  page: string | undefined,
  key: string | undefined,
): SectionSchema | null {
  for (const k of keys(page, key)) {
    if (SECTION_SCHEMAS[k]) return SECTION_SCHEMAS[k];
  }
  return null;
}

export function getObjectSchema(
  page: string | undefined,
  key: string | undefined,
): ObjectSchema | null {
  for (const k of keys(page, key)) {
    if (OBJECT_SCHEMAS[k]) return OBJECT_SCHEMAS[k];
  }
  if (key && HEADER_ONLY_KEYS.has(key)) {
    return { fields: [], note: "Bu bölüm sadece üstteki Başlık/Açıklama alanlarını kullanır." };
  }
  return null;
}

export function isStringListSection(
  page: string | undefined,
  key: string | undefined,
): boolean {
  return keys(page, key).some((k) => STRING_LIST_SECTIONS.has(k));
}

export function isComplexSection(key: string | undefined): boolean {
  return key ? COMPLEX_SECTIONS.has(key) : false;
}
