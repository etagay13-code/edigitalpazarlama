import type { MetadataRoute } from "next";
import { getBrand } from "@/lib/theme";
import { listServicesPublic, listBlogPostsPublic, listPortfolioProjectsPublic } from "@/lib/data";
import { LOCALES } from "@/i18n/config";
import { localizeHref } from "@/i18n/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brand, services, postsTr, postsEn, postsDe] = await Promise.all([
    getBrand(),
    listServicesPublic("tr"),
    listBlogPostsPublic("tr", 500),
    listBlogPostsPublic("en", 500),
    listBlogPostsPublic("de", 500),
  ]);
  // Vaka sayfaları: slug tüm dillerde aynı olduğu için ortak listeye girebilir
  const projects = await listPortfolioProjectsPublic("tr");
  const base = brand.url.replace(/\/$/, "");
  const now = new Date();

  const internalPaths = [
    "/",
    "/hakkimizda",
    "/hizmetler",
    "/portfolyo",
    "/iletisim",
    ...services.map((s) => `/hizmetler/${s.slug}`),
    ...projects.map((p) => `/portfolyo/${p.slug}`),
    "/blog",
    "/roas-hesaplayici",
  ];

  // Blog yazıları dil başına farklı slug taşıdığı için ortak listeye giremez;
  // her dil kendi adresleriyle ayrıca eklenir.
  const blogByLocale: Record<string, { slug: string; published_at: string | null }[]> = {
    tr: postsTr,
    en: postsEn,
    de: postsDe,
  };

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const path of internalPaths) {
      entries.push({
        url: base + localizeHref(locale, path),
        lastModified: now,
        changeFrequency: "monthly",
        priority: path === "/" ? 1 : path.startsWith("/hizmetler/") ? 0.8 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, base + localizeHref(l, path)]),
          ),
        },
      });
    }
  }
  for (const [locale, posts] of Object.entries(blogByLocale)) {
    for (const post of posts) {
      entries.push({
        url: base + localizeHref(locale as (typeof LOCALES)[number], `/blog/${post.slug}`),
        lastModified: post.published_at ? new Date(post.published_at) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
