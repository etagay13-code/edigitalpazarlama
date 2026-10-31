// Sitemap'i elle üretiyoruz (Next'in sitemap.ts kuralı yerine), çünkü kural dosyası
// XSL stil bildirimi eklemeye izin vermiyor. İçerik birebir aynı; tek fark,
// tarayıcıda ham metin yığını yerine okunur bir tablo görünmesi.
// Google stil bildirimini yok sayar, yalnızca XML'i okur.
import { getBrand } from "@/lib/theme";
import {
  listServicesPublic,
  listBlogPostsPublic,
  listPortfolioProjectsPublic,
  listSectorsPublic,
} from "@/lib/data";
import { LOCALES, type Locale } from "@/i18n/config";
import { localizeHref } from "@/i18n/routes";

export const dynamic = "force-dynamic";

type Eintrag = {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
  alternates?: Record<string, string>;
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const [brand, services, postsTr, postsEn, postsDe, postsRu] = await Promise.all([
    getBrand(),
    listServicesPublic("tr"),
    listBlogPostsPublic("tr", 500),
    listBlogPostsPublic("en", 500),
    listBlogPostsPublic("de", 500),
    listBlogPostsPublic("ru", 500),
  ]);
  const projects = await listPortfolioProjectsPublic("tr");
  const sectors = await listSectorsPublic("tr");
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
    ...sectors.filter((s) => s.slug).map((s) => `/sektorler/${s.slug}`),
    "/blog",
    "/roas-hesaplayici",
    "/dijital-denetim",
  ];

  const blogByLocale: Record<string, { slug: string; published_at: string | null }[]> = {
    tr: postsTr,
    en: postsEn,
    de: postsDe,
    ru: postsRu,
  };

  const entries: Eintrag[] = [];
  for (const locale of LOCALES) {
    for (const path of internalPaths) {
      entries.push({
        url: base + localizeHref(locale, path),
        lastModified: now,
        changeFrequency: "monthly",
        priority: path === "/" ? 1 : path.startsWith("/hizmetler/") ? 0.8 : 0.7,
        alternates: Object.fromEntries(LOCALES.map((l) => [l, base + localizeHref(l, path)])),
      });
    }
  }
  for (const [locale, posts] of Object.entries(blogByLocale)) {
    for (const post of posts) {
      entries.push({
        url: base + localizeHref(locale as Locale, `/blog/${post.slug}`),
        lastModified: post.published_at ? new Date(post.published_at) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` +
    ` xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    entries
      .map((e) => {
        const alt = e.alternates
          ? Object.entries(e.alternates)
              .map(
                ([l, href]) =>
                  `\n    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(href)}"/>`,
              )
              .join("")
          : "";
        return (
          `  <url>\n` +
          `    <loc>${esc(e.url)}</loc>${alt}\n` +
          `    <lastmod>${e.lastModified.toISOString()}</lastmod>\n` +
          `    <changefreq>${e.changeFrequency}</changefreq>\n` +
          `    <priority>${e.priority}</priority>\n` +
          `  </url>`
        );
      })
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
