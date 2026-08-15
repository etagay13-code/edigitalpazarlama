import { DEFAULT_LOCALE, type Locale } from "./config";

// İç (kanonik, Türkçe klasör adı) → dil başına dış URL kelimesi.
// Klasör adları repo'da Türkçe kalır; URL'ler bu haritayla yerelleştirilir.
export const SEGMENTS = {
  hizmetler: { tr: "hizmetler", en: "services", de: "leistungen" },
  hakkimizda: { tr: "hakkimizda", en: "about", de: "ueber-uns" },
  portfolyo: { tr: "portfolyo", en: "portfolio", de: "portfolio" },
  iletisim: { tr: "iletisim", en: "contact", de: "kontakt" },
  blog: { tr: "blog", en: "blog", de: "blog" },
  "roas-hesaplayici": { tr: "roas-hesaplayici", en: "roas-calculator", de: "roas-rechner" },
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
  },
  "reklam-yonetimi": {
    tr: "reklam-yonetimi",
    en: "ad-management",
    de: "anzeigenmanagement",
  },
  seo: { tr: "seo", en: "seo", de: "seo" },
  "mobil-uygulama-gelistirme": {
    tr: "mobil-uygulama-gelistirme",
    en: "mobile-app-development",
    de: "app-entwicklung",
  },
  "saas-proje-gelistirme": {
    tr: "saas-proje-gelistirme",
    en: "saas-development",
    de: "saas-entwicklung",
  },
  "sosyal-medya-yonetimi": {
    tr: "sosyal-medya-yonetimi",
    en: "social-media-management",
    de: "social-media-management",
  },
  "web-tasarim-gelistirme": {
    tr: "web-tasarim-gelistirme",
    en: "web-design-development",
    de: "webdesign-entwicklung",
  },
  "icerik-marka-stratejisi": {
    tr: "icerik-marka-stratejisi",
    en: "content-brand-strategy",
    de: "content-markenstrategie",
  },
} as const;

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
  if (segs[0] === "en" || segs[0] === "de") segs = segs.slice(1);
  if (segs.length > 0) segs[0] = externalToInternal(currentLocale, segs[0]);
  if (segs[0] === "hizmetler" && segs[1]) {
    segs[1] = serviceSlugToInternal(currentLocale, segs[1]);
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
  if (segs.length > 0) {
    segs[0] = internalToExternal(locale, segs[0]);
  }
  const body = segs.join("/");
  if (locale === DEFAULT_LOCALE) {
    return "/" + body;
  }
  return "/" + locale + (body ? "/" + body : "");
}
