// Public veri fetcher'ları — service role client kullanır (cookies'siz, hızlı).
// Sadece "active=true" filtreli okuduğumuz için public-safe.
// Çok dilli: her fetcher locale alır; o dilde içerik yoksa 'tr'ye düşer (fallback).
import { unstable_cache } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db/types";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

type Tables = Database["public"]["Tables"];

// locale'de boşsa tr'ye düşen liste yardımcı
async function localeList<T>(
  fetchFor: (loc: Locale) => Promise<T[]>,
  locale: Locale,
): Promise<T[]> {
  const rows = await fetchFor(locale);
  if (rows.length > 0 || locale === DEFAULT_LOCALE) return rows;
  return fetchFor(DEFAULT_LOCALE);
}

export const listServicesPublic = unstable_cache(
  async (locale: Locale) => {
    const supabase = createServiceClient();
    const run = async (loc: Locale) => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .eq("locale", loc)
        .order("sort_order");
      return data ?? [];
    };
    return localeList(run, locale);
  },
  ["services-list", "i18n-v5"],
  { tags: ["services"], revalidate: 3600 },
);

export const getServiceBySlugPublic = unstable_cache(
  async (slug: string, locale: Locale) => {
    const supabase = createServiceClient();
    const fetchService = async (loc: Locale) => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .eq("locale", loc)
        .eq("active", true)
        .maybeSingle();
      return data;
    };
    let service = await fetchService(locale);
    if (!service && locale !== DEFAULT_LOCALE) service = await fetchService(DEFAULT_LOCALE);
    if (!service) return null;

    const [{ data: process = [] }, { data: faqs = [] }] = await Promise.all([
      supabase
        .from("service_process_steps")
        .select("*")
        .eq("service_id", service.id)
        .order("step_number"),
      supabase
        .from("service_faqs")
        .select("*")
        .eq("service_id", service.id)
        .order("sort_order"),
    ]);
    return { ...service, process: process ?? [], faqs: faqs ?? [] };
  },
  ["service-detail", "i18n-v5"],
  { tags: ["services"], revalidate: 3600 },
);

export const listPortfolioProjectsPublic = unstable_cache(
  async (locale: Locale) => {
    const supabase = createServiceClient();
    const run = async (loc: Locale) => {
      const { data } = await supabase
        .from("portfolio_projects")
        .select("*")
        .eq("active", true)
        .eq("locale", loc)
        .order("sort_order");
      return data ?? [];
    };
    return localeList(run, locale);
  },
  ["portfolio-list", "i18n-v5"],
  { tags: ["portfolio"], revalidate: 3600 },
);

export const getProjectBySlugPublic = unstable_cache(
  async (slug: string, locale: Locale) => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("slug", slug)
      .eq("locale", locale)
      .eq("active", true)
      .maybeSingle();
    return data;
  },
  ["portfolio-detail", "i18n-v5"],
  { tags: ["portfolio"], revalidate: 3600 },
);

export const listTestimonialsPublic = unstable_cache(
  async (locale: Locale) => {
    const supabase = createServiceClient();
    const run = async (loc: Locale) => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("active", true)
        .eq("locale", loc)
        .order("sort_order");
      return data ?? [];
    };
    return localeList(run, locale);
  },
  ["testimonials-list", "i18n-v5"],
  { tags: ["testimonials"], revalidate: 3600 },
);

export const listTeamPublic = unstable_cache(
  async (locale: Locale) => {
    const supabase = createServiceClient();
    const run = async (loc: Locale) => {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("active", true)
        .eq("locale", loc)
        .order("sort_order");
      return data ?? [];
    };
    return localeList(run, locale);
  },
  ["team-list", "i18n-v5"],
  { tags: ["team"], revalidate: 3600 },
);

export const listTimelinePublic = unstable_cache(
  async (locale: Locale) => {
    const supabase = createServiceClient();
    const run = async (loc: Locale) => {
      const { data } = await supabase
        .from("timeline_events")
        .select("*")
        .eq("active", true)
        .eq("locale", loc)
        .order("sort_order");
      return data ?? [];
    };
    return localeList(run, locale);
  },
  ["timeline-list", "i18n-v5"],
  { tags: ["timeline"], revalidate: 3600 },
);

/** Sektör (dikey) sayfaları — kendi sayfası olan, slug'lı kayıtlar. */
export const listSectorsPublic = unstable_cache(
  async (locale: Locale) => {
    const supabase = createServiceClient();
    const run = async (loc: Locale) => {
      const { data } = await supabase
        .from("industries")
        .select("*")
        .eq("active", true)
        .eq("locale", loc)
        .not("slug", "is", null)
        .order("sort_order");
      return data ?? [];
    };
    return localeList(run, locale);
  },
  ["sectors-list", "i18n-v5"],
  { tags: ["industries"], revalidate: 3600 },
);

export const getSectorBySlug = unstable_cache(
  async (slug: string, locale: Locale) => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("industries")
      .select("*")
      .eq("slug", slug)
      .eq("locale", locale)
      .eq("active", true)
      .maybeSingle();
    return data;
  },
  ["sector-detail", "i18n-v5"],
  { tags: ["industries"], revalidate: 3600 },
);

export const listIndustriesPublic = unstable_cache(
  async (locale: Locale) => {
    const supabase = createServiceClient();
    const run = async (loc: Locale) => {
      const { data } = await supabase
        .from("industries")
        .select("*")
        .eq("active", true)
        .eq("locale", loc)
        .order("sort_order");
      return data ?? [];
    };
    return localeList(run, locale);
  },
  ["industries-list", "i18n-v5"],
  { tags: ["industries"], revalidate: 3600 },
);

export const listTechPublic = unstable_cache(
  async (locale: Locale) => {
    const supabase = createServiceClient();
    const run = async (loc: Locale) => {
      const { data } = await supabase
        .from("tech_items")
        .select("*")
        .eq("locale", loc)
        .order("sort_order");
      return data ?? [];
    };
    return localeList(run, locale);
  },
  ["tech-list", "i18n-v5"],
  { tags: ["tech"], revalidate: 3600 },
);

export const listFaqsPublic = unstable_cache(
  async (scope: Tables["faqs"]["Row"]["scope"], locale: Locale) => {
    const supabase = createServiceClient();
    const run = async (loc: Locale) => {
      const { data } = await supabase
        .from("faqs")
        .select("*")
        .eq("scope", scope)
        .eq("active", true)
        .eq("locale", loc)
        .order("sort_order");
      return data ?? [];
    };
    return localeList(run, locale);
  },
  ["faqs-list", "i18n-v5"],
  { tags: ["faqs"], revalidate: 3600 },
);

export const listPageSectionsPublic = unstable_cache(
  async (page_slug: string, locale: Locale) => {
    const supabase = createServiceClient();
    const run = async (loc: Locale) => {
      const { data } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_slug", page_slug)
        .eq("locale", loc)
        .order("sort_order");
      return data ?? [];
    };
    return localeList(run, locale);
  },
  ["page-sections", "i18n-v5"],
  { tags: ["page_sections"], revalidate: 3600 },
);

// Tek section — locale'de yoksa tr'deki aynı section'a düşer.
export const getPageSection = async (
  page_slug: string,
  section_key: string,
  locale: Locale,
) => {
  const sections = await listPageSectionsPublic(page_slug, locale);
  const hit = sections.find((s) => s.section_key === section_key);
  if (hit) return hit;
  if (locale !== DEFAULT_LOCALE) {
    const trSections = await listPageSectionsPublic(page_slug, DEFAULT_LOCALE);
    return trSections.find((s) => s.section_key === section_key) ?? null;
  }
  return null;
};

export const listChatRulesPublic = unstable_cache(
  async (locale: Locale) => {
    const supabase = createServiceClient();
    const run = async (loc: Locale) => {
      const { data } = await supabase
        .from("chat_rules")
        .select("*")
        .eq("active", true)
        .eq("locale", loc)
        .order("sort_order");
      return data ?? [];
    };
    return localeList(run, locale);
  },
  ["chat-rules", "i18n-v5"],
  { tags: ["chat_rules"], revalidate: 3600 },
);

// ── Blog ────────────────────────────────────────────────────────────────────
// Not: Blog içeriği diğer tablolardan daha sık değişir (günde 2 yazı), bu yüzden
// revalidate süresi kısa tutuldu. Yayınlama sonrası admin revalidateTag("blog")
// çağırır; bu süre yalnızca emniyet ağıdır.

export const listBlogPostsPublic = unstable_cache(
  async (locale: Locale, limit = 24) => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug,title,excerpt,cover_url,cover_alt,tags,reading_min,published_at,group_id")
      .eq("locale", locale)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  },
  ["blog-list", "i18n-v5"],
  { tags: ["blog"], revalidate: 300 },
);

export const getBlogPostPublic = unstable_cache(
  async (slug: string, locale: Locale) => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("locale", locale)
      .eq("status", "published")
      .maybeSingle();
    return data;
  },
  ["blog-detail", "i18n-v6"],
  { tags: ["blog"], revalidate: 300 },
);

/**
 * Arşivlenmiş bir yazının yerine geçen yazının aynı dildeki slug'ı.
 *
 * Aynı arama niyetini hedefleyen yazılar birleştirildiğinde eskisi silinmez,
 * arşivlenip redirect_to ile yenisine bağlanır; burada o hedefin bu dildeki
 * karşılığı bulunur ki 301 kullanıcıyı kendi dilinde bırakabilsin.
 */
export const getBlogRedirect = unstable_cache(
  async (slug: string, locale: Locale) => {
    const supabase = createServiceClient();
    const { data: archived } = await supabase
      .from("blog_posts")
      .select("redirect_to,group_id")
      .eq("slug", slug)
      .eq("locale", locale)
      .eq("status", "archived")
      .maybeSingle();
    if (!archived?.redirect_to) return null;

    // Hedefin group_id'si üzerinden aynı dildeki sürümü bulunur; hedef yazının
    // kendisi başka bir dilde kayıtlıysa bile kullanıcı dilini kaybetmez.
    const { data: target } = await supabase
      .from("blog_posts")
      .select("group_id")
      .eq("id", archived.redirect_to)
      .maybeSingle();
    if (!target) return null;

    const { data: sameLocale } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("group_id", target.group_id)
      .eq("locale", locale)
      .eq("status", "published")
      .maybeSingle();
    return sameLocale?.slug ?? null;
  },
  ["blog-redirect", "i18n-v6"],
  { tags: ["blog"], revalidate: 300 },
);

/** Bir yazının diğer dillerdeki sürümleri — hreflang bağlantıları için. */
export const getBlogTranslations = unstable_cache(
  async (groupId: string) => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("locale,slug")
      .eq("group_id", groupId)
      .eq("status", "published");
    return data ?? [];
  },
  ["blog-translations", "i18n-v5"],
  { tags: ["blog"], revalidate: 300 },
);

/** Yazının altında gösterilecek diğer yazılar. */
export const listRelatedPosts = unstable_cache(
  async (locale: Locale, excludeSlug: string, limit = 3) => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("slug,title,excerpt,cover_url,reading_min,published_at")
      .eq("locale", locale)
      .eq("status", "published")
      .neq("slug", excludeSlug)
      .order("published_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  },
  ["blog-related", "i18n-v5"],
  { tags: ["blog"], revalidate: 300 },
);

export const getSiteSettingsPublic = unstable_cache(
  async () => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();
    return data;
  },
  // Not: keyParts'taki sürüm eki, önbelleği elle geçersiz kılmanın yolu.
  // Vercel'in veri önbelleği deploy'larda SIFIRLANMIYOR; içeriği doğrudan SQL
  // ile değiştirdiğimizde (admin panelinden değil) bu eki artırmak gerekiyor,
  // yoksa site 1 saat boyunca eski veriyi servis etmeye devam ediyor.
  ["site-settings", "i18n-v5"],
  { tags: ["site_settings"], revalidate: 3600 },
);

// Çevrilebilir marka alanları (tagline/description/address) — dil başına.
export const getSiteSettingsI18n = unstable_cache(
  async (locale: Locale) => {
    const supabase = createServiceClient();
    const pick = async (loc: Locale) => {
      const { data } = await supabase
        .from("site_settings_i18n")
        .select("*")
        .eq("locale", loc)
        .maybeSingle();
      return data;
    };
    return (await pick(locale)) ?? (await pick(DEFAULT_LOCALE));
  },
  ["site-settings-i18n", "i18n-v5"],
  { tags: ["site_settings"], revalidate: 3600 },
);
