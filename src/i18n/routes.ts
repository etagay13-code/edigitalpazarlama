import { DEFAULT_LOCALE, type Locale } from "./config";

// İç (kanonik, Türkçe klasör adı) → dil başına dış URL kelimesi.
// Klasör adları repo'da Türkçe kalır; URL'ler bu haritayla yerelleştirilir.
export const SEGMENTS = {
  hizmetler: { tr: "hizmetler", en: "services", de: "leistungen" },
  hakkimizda: { tr: "hakkimizda", en: "about", de: "ueber-uns" },
  portfolyo: { tr: "portfolyo", en: "portfolio", de: "portfolio" },
  iletisim: { tr: "iletisim", en: "contact", de: "kontakt" },
} as const;

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

// Kanonik iç yoldan (örn. "/hizmetler/seo") dile uygun public href üretir.
// tr → öneksiz; en/de → önekli + ilk segment yerelleştirilmiş.
export function localizeHref(locale: Locale, internalPath: string): string {
  const segs = internalPath.split("/").filter(Boolean);
  if (segs.length > 0) {
    segs[0] = internalToExternal(locale, segs[0]);
  }
  const body = segs.join("/");
  if (locale === DEFAULT_LOCALE) {
    return "/" + body;
  }
  return "/" + locale + (body ? "/" + body : "");
}
