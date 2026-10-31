import { DEFAULT_LOCALE, type Locale } from "./config";

// İç (kanonik, Türkçe klasör adı) → dil başına dış URL kelimesi.
// Klasör adları repo'da Türkçe kalır; URL'ler bu haritayla yerelleştirilir.
export const SEGMENTS = {
  hizmetler: { tr: "hizmetler", en: "services", de: "leistungen", ru: "uslugi" },
  hakkimizda: { tr: "hakkimizda", en: "about", de: "ueber-uns", ru: "o-nas" },
  portfolyo: { tr: "portfolyo", en: "portfolio", de: "portfolio", ru: "portfolio" },
  iletisim: { tr: "iletisim", en: "contact", de: "kontakt", ru: "kontakty" },
  blog: { tr: "blog", en: "blog", de: "blog", ru: "blog" },
  "roas-hesaplayici": { tr: "roas-hesaplayici", en: "roas-calculator", de: "roas-rechner", ru: "roas-kalkulyator" },
  "dijital-denetim": { tr: "dijital-denetim", en: "digital-audit", de: "digital-audit", ru: "tsifrovoy-audit" },
  tesekkurler: { tr: "tesekkurler", en: "thank-you", de: "danke", ru: "spasibo" },
  sektorler: { tr: "sektorler", en: "industries", de: "branchen", ru: "otrasli" },
  "gizlilik-politikasi": { tr: "gizlilik-politikasi", en: "privacy-policy", de: "datenschutz", ru: "politika-konfidentsialnosti" },
  kunye: { tr: "kunye", en: "imprint", de: "impressum", ru: "rekvizity" },
} as const;

// Hizmet slug'ları da dile göre yerelleştirilir. Kanonik (iç) slug DB'deki
// Türkçe slug'tır; DB'ye dokunulmaz, çeviri sadece URL katmanında yapılır —
// ilk segmentteki (hizmetler/services/leistungen) yaklaşımın aynısı.
// Haritada olmayan slug (admin'den eklenen yeni hizmet) olduğu gibi geçer.
export const SERVICE_SLUGS = {
  "360-dijital-pazarlama": {
    tr: "360-dijital-pazarlama",
    en: "360-digital-marketing",
    de: "360-digitales-marketing",
    ru: "360-tsifrovoy-marketing",
  },
  "reklam-yonetimi": {
    tr: "reklam-yonetimi",
    en: "ad-management",
    de: "anzeigenmanagement",
    ru: "upravlenie-reklamoy",
  },
  seo: { tr: "seo", en: "seo", de: "seo", ru: "seo" },
  "mobil-uygulama-gelistirme": {
    tr: "mobil-uygulama-gelistirme",
    en: "mobile-app-development",
    de: "app-entwicklung",
    ru: "razrabotka-mobilnykh-prilozheniy",
  },
  "saas-proje-gelistirme": {
    tr: "saas-proje-gelistirme",
    en: "saas-development",
    de: "saas-entwicklung",
    ru: "razrabotka-saas",
  },
  "sosyal-medya-yonetimi": {
    tr: "sosyal-medya-yonetimi",
    en: "social-media-management",
    de: "social-media-management",
    ru: "smm",
  },
  "web-tasarim-gelistirme": {
    tr: "web-tasarim-gelistirme",
    en: "web-design-development",
    de: "webdesign-entwicklung",
    ru: "veb-dizayn-i-razrabotka",
  },
  "icerik-marka-stratejisi": {
    tr: "icerik-marka-stratejisi",
    en: "content-brand-strategy",
    de: "content-markenstrategie",
    ru: "kontent-i-brend-strategiya",
  },
} as const;

// Sektör slug'ları da dile göre yerelleşir (hizmet slug'larıyla aynı desen).
export const SECTOR_SLUGS = {
  "saglik-turizmi": { tr: "saglik-turizmi", en: "health-tourism", de: "gesundheitstourismus", ru: "meditsinskiy-turizm" },
  eticaret: { tr: "eticaret", en: "e-commerce", de: "e-commerce", ru: "e-commerce" },
  "yerel-hizmet": { tr: "yerel-hizmet", en: "local-services", de: "lokale-dienstleistungen", ru: "lokalnye-uslugi" },
  hukuk: { tr: "hukuk", en: "legal", de: "recht", ru: "yuridicheskie-uslugi" },
  nakliyat: { tr: "nakliyat", en: "moving", de: "umzug", ru: "pereezdy" },
  endustri: { tr: "endustri", en: "industry", de: "industrie", ru: "promyshlennost" },
  stk: { tr: "stk", en: "non-profit", de: "non-profit", ru: "nko" },
} as const;

type SectorKey = keyof typeof SECTOR_SLUGS;
const SECTOR_KEYS = Object.keys(SECTOR_SLUGS) as SectorKey[];

export function sectorSlugToInternal(locale: Locale, ext: string): string {
  const hit = SECTOR_KEYS.find((k) => SECTOR_SLUGS[k][locale] === ext);
  return hit ?? ext;
}

export function sectorSlugToExternal(locale: Locale, internal: string): string {
  const seg = SECTOR_SLUGS[internal as SectorKey];
  return seg ? seg[locale] : internal;
}

type ServiceKey = keyof typeof SERVICE_SLUGS;
const SERVICE_KEYS = Object.keys(SERVICE_SLUGS) as ServiceKey[];

// Dış hizmet slug'ı → kanonik (DB) slug.
export function serviceSlugToInternal(locale: Locale, ext: string): string {
  const hit = SERVICE_KEYS.find((k) => SERVICE_SLUGS[k][locale] === ext);
  return hit ?? ext;
}

// Kanonik slug → dile uygun dış slug.
export function serviceSlugToExternal(locale: Locale, internal: string): string {
  const seg = SERVICE_SLUGS[internal as ServiceKey];
  return seg ? seg[locale] : internal;
}

export type InternalSegment = keyof typeof SEGMENTS;
const INTERNAL_KEYS = Object.keys(SEGMENTS) as InternalSegment[];

// Dış URL kelimesi → iç kanonik segment (middleware rewrite için).
export function externalToInternal(locale: Locale, ext: string): string {
  const hit = INTERNAL_KEYS.find((k) => SEGMENTS[k][locale] === ext);
  return hit ?? ext;
}

// İç kanonik segment → dış URL kelimesi.
export function internalToExternal(locale: Locale, internal: string): string {
  const seg = SEGMENTS[internal as InternalSegment];
  return seg ? seg[locale] : internal;
}

// Mevcut public pathname'i (örn. "/en/services/seo") kanonik iç yola çevirir
// ("/hizmetler/seo"). Dil değiştirici bunu kullanıp hedef dile localize eder.
export function toInternalPath(currentLocale: Locale, pathname: string): string {
  let segs = pathname.split("/").filter(Boolean);
  if (segs[0] === "en" || segs[0] === "de" || segs[0] === "ru") segs = segs.slice(1);
  if (segs.length > 0) segs[0] = externalToInternal(currentLocale, segs[0]);
  if (segs[0] === "hizmetler" && segs[1]) {
    segs[1] = serviceSlugToInternal(currentLocale, segs[1]);
  }
  if (segs[0] === "sektorler" && segs[1]) {
    segs[1] = sectorSlugToInternal(currentLocale, segs[1]);
  }
  return "/" + segs.join("/");
}

// Kanonik iç yoldan (örn. "/hizmetler/seo") dile uygun public href üretir.
// tr → öneksiz; en/de → önekli + ilk segment yerelleştirilmiş.
export function localizeHref(locale: Locale, internalPath: string): string {
  const segs = internalPath.split("/").filter(Boolean);
  if (segs[0] === "hizmetler" && segs[1]) {
    segs[1] = serviceSlugToExternal(locale, segs[1]);
  }
  if (segs[0] === "sektorler" && segs[1]) {
    segs[1] = sectorSlugToExternal(locale, segs[1]);
  }
  if (segs.length > 0) {
    segs[0] = internalToExternal(locale, segs[0]);
  }
  const body = segs.join("/");
  if (locale === DEFAULT_LOCALE) {
    return "/" + body;
  }
  return "/" + locale + (body ? "/" + body : "");
}
