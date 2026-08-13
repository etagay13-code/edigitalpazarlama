// Desteklenen diller. tr = varsayılan (URL'de öneksiz), en/de önekli.
export const ADMIN_LOCALE_COOKIE = "admin_locale";

export const LOCALES = ["tr", "en", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

export function isLocale(x: string | undefined | null): x is Locale {
  return !!x && (LOCALES as readonly string[]).includes(x);
}

export function asLocale(x: string | undefined | null): Locale {
  return isLocale(x) ? x : DEFAULT_LOCALE;
}

// IP ülke kodundan varsayılan dil: Türkiye → tr, Almanca konuşulan ülkeler → de,
// diğer her yer → en. (Önceden Almanya da en'e düşüyordu.)
const DE_COUNTRIES = new Set(["DE", "AT", "CH", "LI", "LU"]);

export function localeFromCountry(country: string | null | undefined): Locale {
  if (!country) return DEFAULT_LOCALE;
  const c = country.toUpperCase();
  if (c === "TR") return "tr";
  if (DE_COUNTRIES.has(c)) return "de";
  return "en";
}

export const LOCALE_LABELS: Record<Locale, { label: string; flag: string }> = {
  tr: { label: "Türkçe", flag: "🇹🇷" },
  en: { label: "English", flag: "🇬🇧" },
  de: { label: "Deutsch", flag: "🇩🇪" },
};

// <html lang> ve og:locale için
export const OG_LOCALE: Record<Locale, string> = {
  tr: "tr_TR",
  en: "en_US",
  de: "de_DE",
};
