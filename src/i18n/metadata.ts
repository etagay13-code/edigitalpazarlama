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

// ── SERP sinirlari ──────────────────────────────────────────────────────────
// Google basligi ~60, aciklamayi ~160 karakterde kesiyor. Kok layout'taki
// `template: "%s · True EDigital Marketing"` her basliga 26 karakter ekliyordu
// ve 102 sayfanin 70'inde baslik kesiliyordu. Marka eki artik yalnizca
// SIGDIGINDA ekleniyor; sigmadiginda baslik kendi basina daha degerli.
const MARKA_EKI = " · True EDigital";
const BASLIK_SINIR = 60;
const ACIKLAMA_SINIR = 160;

function baslikKur(title: string): string {
  const t = title.trim();
  return t.length + MARKA_EKI.length <= BASLIK_SINIR ? t + MARKA_EKI : t;
}

/** Aciklamayi cumle, olmazsa kelime sinirinda kirpar — ortadan kesmez. */
function aciklamaKirp(description: string): string {
  const d = description.trim().replace(/\s+/g, " ");
  if (d.length <= ACIKLAMA_SINIR) return d;
  const pencere = d.slice(0, ACIKLAMA_SINIR);
  const cumle = Math.max(pencere.lastIndexOf(". "), pencere.lastIndexOf("! "), pencere.lastIndexOf("? "));
  if (cumle > 90) return pencere.slice(0, cumle + 1);
  const kelime = pencere.lastIndexOf(" ");
  return (kelime > 90 ? pencere.slice(0, kelime) : pencere).replace(/[,;:\-—]$/, "") + "…";
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
  // absolute: kok layout'un marka sablonunu devre disi birakir; eki burada
  // kosullu olarak kendimiz ekliyoruz.
  const baslik = title ? baslikKur(title) : null;
  const aciklama = description ? aciklamaKirp(description) : null;
  return {
    ...(baslik ? { title: { absolute: baslik } } : {}),
    ...(aciklama ? { description: aciklama } : {}),
    alternates: { canonical: path, languages: altLanguages(internalPath) },
    openGraph: {
      url: path,
      locale: OG_LOCALE[locale],
      // Next metadata'yı sığ birleştirir: sayfa openGraph tanımlarsa kök
      // layout'taki openGraph tamamen ezilir. Bu yüzden görsel burada da
      // verilmeli, yoksa alt sayfalarda og:image kayboluyor.
      images: [{ url: `/og/og-${locale}.jpg`, width: 1200, height: 630 }],
      ...(baslik ? { title: baslik } : {}),
      ...(aciklama ? { description: aciklama } : {}),
    },
  };
}
