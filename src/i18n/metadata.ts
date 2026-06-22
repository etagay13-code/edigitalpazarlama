import type { Metadata } from "next";
import { LOCALES, OG_LOCALE, DEFAULT_LOCALE, type Locale } from "./config";
import { localizeHref } from "./routes";

// hreflang alternatifleri (x-default = tr) — Next metadataBase ile mutlaklaşır.
export function altLanguages(internalPath: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = localizeHref(l, internalPath);
  languages["x-default"] = localizeHref(DEFAULT_LOCALE, internalPath);
  return languages;
}

// Sayfa metadata'sı: localized canonical + hreflang + openGraph.
export function pageMeta(opts: {
  locale: Locale;
  internalPath: string;
  title?: string | null;
  description?: string | null;
}): Metadata {
  const { locale, internalPath, title, description } = opts;
  const path = localizeHref(locale, internalPath);
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { canonical: path, languages: altLanguages(internalPath) },
    openGraph: {
      url: path,
      locale: OG_LOCALE[locale],
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    },
  };
}
