// Desteklenen diller. tr = varsayılan (URL'de öneksiz), en/de/ru önekli.
export const ADMIN_LOCALE_COOKIE = "admin_locale";

export const LOCALES = ["tr", "en", "de", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

export function isLocale(x: string | undefined | null): x is Locale {
  return !!x && (LOCALES as readonly string[]).includes(x);
}

export function asLocale(x: string | undefined | null): Locale {
  return isLocale(x) ? x : DEFAULT_LOCALE;
}

// IP ülke kodundan varsayılan dil: Türkiye → tr, Almanca konuşulan ülkeler → de,
// Rusça konuşulan ülkeler → ru, diğer her yer → en. (Önceden Almanya da en'e düşüyordu.)
const DE_COUNTRIES = new Set(["DE", "AT", "CH", "LI", "LU"]);
const RU_COUNTRIES = new Set(["RU", "BY", "KZ", "KG", "UZ", "TJ", "AM"]);

export function localeFromCountry(country: string | null | undefined): Locale {
  if (!country) return DEFAULT_LOCALE;
  const c = country.toUpperCase();
  if (c === "TR") return "tr";
  if (DE_COUNTRIES.has(c)) return "de";
  if (RU_COUNTRIES.has(c)) return "ru";
  return "en";
}

export const LOCALE_LABELS: Record<Locale, { label: string; flag: string }> = {
  tr: { label: "Türkçe", flag: "🇹🇷" },
  en: { label: "English", flag: "🇬🇧" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  ru: { label: "Русский", flag: "🇷🇺" },
};

// <html lang> ve og:locale için
export const OG_LOCALE: Record<Locale, string> = {
  tr: "tr_TR",
  en: "en_US",
  de: "de_DE",
  ru: "ru_RU",
};
