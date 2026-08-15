import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal, Stagger } from "@/components/Reveal";
import { GradientBlobs } from "@/components/GradientBlob";
import { CTASection } from "@/components/CTASection";
import { listBlogPostsPublic } from "@/lib/data";
import { asLocale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routes";
import { pageMeta } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = asLocale(params.locale);
  const t = getDict(locale).blog;
  return pageMeta({
    locale,
    internalPath: "/blog",
    title: t.title,
    description: t.description,
  });
}

function formatDate(value: string | null, locale: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage({ params }: { params: { locale: string } }) {
  const locale = asLocale(params.locale);
  const t = getDict(locale).blog;
  const posts = await listBlogPostsPublic(locale);

  const [featured, ...rest] = posts;

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-12 sm:pt-20">
        <GradientBlobs />
        <div className="container-x">
          <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="section pt-0">
          <div className="container-x">
            <p className="text-white/50">{t.empty}</p>
          </div>
        </section>
      ) : (
        <>
          {/* Öne çıkan yazı — geniş kart */}
          <section className="section pt-4">
            <div className="container-x">
              <Reveal>
                <Link
                  href={localizeHref(locale, `/blog/${featured.slug}`)}
                  className="card group grid gap-0 overflow-hidden p-0 md:grid-cols-[1.1fr_1fr]"
                >
                  <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px]">
                    {featured.cover_url ? (
                      <Image
                        src={featured.cover_url}
                        alt={featured.cover_alt ?? featured.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 55vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        priority
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-violet-500/30 to-cyan-500/20" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center gap-4 p-8 sm:p-10">
                    <div className="flex items-center gap-3 text-xs text-white/45">
                      <span>{formatDate(featured.published_at, locale)}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {featured.reading_min} {t.readingSuffix}
                      </span>
                    </div>
                    <h2 className="h-display text-2xl font-semibold leading-snug sm:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-white/60">{featured.excerpt}</p>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-violet-200">
                      {t.readMore}
                      <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </div>
          </section>

          {/* Diğer yazılar */}
          {rest.length > 0 && (
            <section className="section pt-0">
              <div className="container-x">
                <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p) => (
                    <Reveal key={p.slug}>
                      <Link
                        href={localizeHref(locale, `/blog/${p.slug}`)}
                        className="card group flex h-full flex-col overflow-hidden p-0"
                      >
                        <div className="relative aspect-[16/9]">
                          {p.cover_url ? (
                            <Image
                              src={p.cover_url}
                              alt={p.cover_alt ?? p.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 33vw"
                              className="object-cover transition duration-700 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-violet-500/25 to-cyan-500/15" />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col gap-3 p-6">
                          <div className="flex items-center gap-3 text-xs text-white/40">
                            <span>{formatDate(p.published_at, locale)}</span>
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              {p.reading_min} {t.readingSuffix}
                            </span>
                          </div>
                          <h3 className="font-display text-lg font-semibold leading-snug text-white">
                            {p.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-white/55">{p.excerpt}</p>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </Stagger>
              </div>
            </section>
          )}
        </>
      )}

      <CTASection locale={locale} />
    </>
  );
}
