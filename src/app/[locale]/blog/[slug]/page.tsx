import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, ChevronRight, Clock } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { GradientBlobs } from "@/components/GradientBlob";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import {
  getBlogPostPublic,
  getBlogTranslations,
  listRelatedPosts,
} from "@/lib/data";
import { getBrand } from "@/lib/theme";
import { asLocale, LOCALES, OG_LOCALE, DEFAULT_LOCALE } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routes";

// Yazılar sık eklendiği için sayfalar istek anında üretilir; unstable_cache
// katmanı zaten tekrarlayan sorguları karşılıyor.
export const dynamic = "force-dynamic";

/**
 * hreflang: yazının diğer dillerdeki sürümleri farklı slug taşır, bu yüzden
 * genel altLanguages() yerine grup üzerinden gerçek adresler kullanılır.
 */
async function alternatesFor(groupId: string, currentLocale: string, currentSlug: string) {
  const rows = await getBlogTranslations(groupId);
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    const hit = rows.find((r) => r.locale === l);
    const slug = hit?.slug ?? (l === currentLocale ? currentSlug : null);
    if (slug) languages[l] = localizeHref(l, `/blog/${slug}`);
  }
  const def = rows.find((r) => r.locale === DEFAULT_LOCALE);
  if (def) languages["x-default"] = localizeHref(DEFAULT_LOCALE, `/blog/${def.slug}`);
  return languages;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = asLocale(params.locale);
  const post = await getBlogPostPublic(params.slug, locale);
  if (!post) return { title: "404" };

  const path = localizeHref(locale, `/blog/${post.slug}`);
  const languages = await alternatesFor(post.group_id, locale, post.slug);

  return {
    title: post.meta_title || post.title,
    description: post.meta_desc || post.excerpt,
    alternates: { canonical: path, languages },
    openGraph: {
      type: "article",
      url: path,
      locale: OG_LOCALE[locale],
      title: post.meta_title || post.title,
      description: post.meta_desc || post.excerpt,
      publishedTime: post.published_at ?? undefined,
      images: post.cover_url ? [{ url: post.cover_url, width: 1200, height: 675 }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = asLocale(params.locale);
  const t = getDict(locale);
  const post = await getBlogPostPublic(params.slug, locale);
  if (!post) notFound();

  const [brand, related] = await Promise.all([
    getBrand(locale),
    listRelatedPosts(locale, post.slug),
  ]);

  const siteBase = brand.url.replace(/\/$/, "");
  const url = siteBase + localizeHref(locale, `/blog/${post.slug}`);
  const published = post.published_at
    ? new Date(post.published_at).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.meta_desc || post.excerpt,
      image: post.cover_url ? [post.cover_url] : undefined,
      datePublished: post.published_at,
      dateModified: post.updated_at,
      inLanguage: locale,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: brand.name, url: brand.url },
      publisher: {
        "@type": "Organization",
        name: brand.name,
        url: brand.url,
        logo: brand.logoUrl ? { "@type": "ImageObject", url: brand.logoUrl } : undefined,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.nav.home, item: siteBase + localizeHref(locale, "/") },
        { "@type": "ListItem", position: 2, name: t.blog.nav, item: siteBase + localizeHref(locale, "/blog") },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <article>
        <section className="relative overflow-hidden pb-10 pt-8 sm:pt-14">
          <GradientBlobs />
          <div className="container-x relative">
            <nav
              aria-label={t.serviceDetail.breadcrumbAria}
              className="mb-8 flex items-center gap-2 text-sm text-white/45"
            >
              <Link href={localizeHref(locale, "/")} className="hover:text-white">
                {t.nav.home}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={localizeHref(locale, "/blog")} className="hover:text-white">
                {t.blog.nav}
              </Link>
            </nav>

            <div className="mx-auto max-w-3xl">
              <Reveal>
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/45">
                  <span>{published}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {post.reading_min} {t.blog.readingSuffix}
                  </span>
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-white/55"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="mt-5 h-display text-3xl font-semibold leading-[1.12] sm:text-4xl md:text-5xl">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="mt-5 text-lg leading-relaxed text-white/65">{post.excerpt}</p>
                )}
              </Reveal>
            </div>
          </div>
        </section>

        {post.cover_url && (
          <section className="pb-4">
            <div className="container-x">
              <Reveal>
                <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-3xl border border-white/[0.08]">
                  <Image
                    src={post.cover_url}
                    alt={post.cover_alt ?? post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-cover"
                    priority
                  />
                </div>
              </Reveal>
            </div>
          </section>
        )}

        <section className="section pt-10">
          <div className="container-x">
            <div
              className="prose-post mx-auto max-w-3xl"
              dangerouslySetInnerHTML={{ __html: post.content_html }}
            />

            <div className="mx-auto mt-14 max-w-3xl border-t border-white/[0.08] pt-8">
              <Link
                href={localizeHref(locale, "/blog")}
                className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.blog.backToList}
              </Link>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="section pt-0">
            <div className="container-x">
              <h2 className="h-display text-2xl font-semibold">{t.blog.related}</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Reveal key={r.slug}>
                    <Link
                      href={localizeHref(locale, `/blog/${r.slug}`)}
                      className="card group flex h-full flex-col gap-3"
                    >
                      <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
                        <Clock className="h-3.5 w-3.5" />
                        {r.reading_min} {t.blog.readingSuffix}
                      </span>
                      <h3 className="font-display text-lg font-semibold leading-snug text-white">
                        {r.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/55">{r.excerpt}</p>
                      <ArrowUpRight className="mt-auto h-4 w-4 text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <CTASection locale={locale} />
    </>
  );
}
