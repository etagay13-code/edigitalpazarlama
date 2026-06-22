// Marka bilgileri için fallback (statik). Public site DB'den okuyan helper'lar kullanır.
// DB'de bir değer yoksa veya henüz seçilmediyse buraki değerler default olur.
import { getSiteSettingsPublic } from "@/lib/data";

export const brand = {
  name: "True EDigital Marketing",
  shortName: "True EDigital Marketing",
  founder: "Emre Tagay",
  tagline: "A'dan Z'ye Dijital Büyüme Ortağınız",
  description:
    "Reklamdan SEO'ya, mobil uygulamadan SaaS geliştirmeye kadar markanızı ölçeklendiren 360° dijital pazarlama ajansı.",
  url: "https://etruemarketing.com",
  email: "info@etruemarketing.com",
  phone: "+90 555 000 00 00",
  address: "İstanbul, Türkiye",
  socials: {
    instagram: "https://instagram.com/etruemarketing",
    linkedin: "https://linkedin.com/company/etruemarketing",
    twitter: "https://twitter.com/etruemarketing",
    youtube: "https://youtube.com/@etruemarketing",
  },
  colors: {
    bg: "#0A0A0B",
    accent: "#7C5CFF",
    accentSecondary: "#22D3EE",
  },
} as const;

export type Brand = typeof brand;

// Server component'ler için: DB'den brand info çeker, eksik field'ları hardcoded ile doldurur.
export async function getBrand() {
  try {
    const s = await getSiteSettingsPublic();
    if (!s) throw new Error("settings yok");
    return {
      name: s.brand_name || brand.name,
      shortName: s.brand_short_name || brand.shortName,
      founder: s.founder || brand.founder,
      tagline: s.tagline || brand.tagline,
      description: s.description || brand.description,
      url: s.url || brand.url,
      email: s.email || brand.email,
      phone: s.phone || brand.phone,
      address: s.address || brand.address,
      logoUrl: s.logo_url || null,
      faviconUrl: s.favicon_url || null,
      ogImageUrl: s.og_image_url || null,
      socials: {
        instagram: s.instagram_url || brand.socials.instagram,
        linkedin: s.linkedin_url || brand.socials.linkedin,
        twitter: s.twitter_url || brand.socials.twitter,
        youtube: s.youtube_url || brand.socials.youtube,
      },
      colors: {
        bg: s.color_bg || brand.colors.bg,
        accent: s.color_accent || brand.colors.accent,
        accentSecondary: s.color_accent_secondary || brand.colors.accentSecondary,
      },
      integrations: {
        ga4: s.ga4_measurement_id,
        gtm: s.gtm_container_id,
        searchConsole: s.search_console_verification,
        hotjar: s.hotjar_site_id,
        clarity: s.microsoft_clarity_id,
      },
    };
  } catch {
    // DB henüz hazır değilse fallback
    return {
      ...brand,
      logoUrl: null,
      faviconUrl: null,
      ogImageUrl: null,
      integrations: {
        ga4: null,
        gtm: null,
        searchConsole: null,
        hotjar: null,
        clarity: null,
      },
    };
  }
}

export type ResolvedBrand = Awaited<ReturnType<typeof getBrand>>;
