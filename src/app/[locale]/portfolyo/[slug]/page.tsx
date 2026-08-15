import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, Clock, Trophy } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal, Stagger } from "@/components/Reveal";
import { GradientBlobs } from "@/components/GradientBlob";
import { CTASection } from "@/components/CTASection";
import { JsonLd } from "@/components/JsonLd";
import { getProjectBySlugPublic, listPortfolioProjectsPublic } from "@/lib/data";
import { getBrand } from "@/lib/theme";
import { asLocale, OG_LOCALE } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routes";
import { altLanguages } from "@/i18n/metadata";
import type { CaseStudy } from "@/lib/blog/case-study";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = asLocale(params.locale);
  const project = await getProjectBySlugPublic(params.slug, locale);
  if (!project) return { title: "404" };

  const internal = `/portfolyo/${project.slug}`;
  const path = localizeHref(locale, internal);
  return {
    title: project.meta_title || project.title,
    description: project.meta_desc || project.description,
    alternates: { canonical: path, languages: altLanguages(internal) },
    openGraph: {
      type: "article",
      url: path,
      locale: OG_LOCALE[locale],
      title: project.meta_title || project.title,
      description: project.meta_desc || project.description,
      images: [{ url: `/og/og-${locale}.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = asLocale(params.locale);
  const t = getDict(locale);
  const project = await getProjectBySlugPublic(params.slug, locale);
  if (!project) notFound();

  const [brand, all] = await Promise.all([
    getBrand(locale),
    listPortfolioProjectsPublic(locale),
  ]);

  const cs = (project.case_study ?? null) as CaseStudy | null;
  const others = all.filter((p) => p.slug !== project.slug).slice(0, 3);
  const siteBase = brand.url.replace(/\/$/, "");
  const url = siteBase + localizeHref(locale, `/portfolyo/${project.slug}`);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.meta_desc || project.description,
      about: project.category,
      inLanguage: locale,
      url,
      creator: { "@type": "Organization", name: brand.name, url: brand.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.nav.home, item: siteBase + localizeHref(locale, "/") },
        { "@type": "ListItem", position: 2, name: t.nav.portfolio, item: siteBase + localizeHref(locale, "/portfolyo") },
        { "@type": "ListItem", position: 3, name: project.title, item: url },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-8 sm:pt-14">
        <GradientBlobs />
        <div className="container-x relative">
          <nav
            aria-label={t.serviceDetail.breadcrumbAria}
            className="mb-10 flex items-center gap-2 text-sm text-white/45"
          >
            <Link href={localizeHref(locale, "/")} className="hover:text-white">
              {t.nav.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={localizeHref(locale, "/portfolyo")} className="hover:text-white">
              {t.nav.portfolio}
            </Link>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <span className="eyebrow">{project.category}</span>
              <h1 className="mt-6 h-display text-3xl font-semibold leading-[1.08] sm:text-4xl md:text-5xl">
                {project.title}
              </h1>
              <p className="mt-6 text-lg text-white/70">{project.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <aside className="card space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                    {t.caseStudy.client}
                  </p>
                  <p className="mt-1.5 font-display text-xl font-semibold text-white">
                    {project.client}
                  </p>
                </div>
                {cs?.duration && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                      {t.caseStudy.duration}
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-2 text-white/80">
                      <Clock className="h-4 w-4 text-violet-300" />
                      {cs.duration}
                    </p>
                  </div>
                )}
                {project.metric && (
                  <div className="rounded-2xl border border-violet-400/25 bg-violet-500/[0.08] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                      {t.caseStudy.headline}
                    </p>
                    <p className="mt-2 font-display text-3xl font-semibold gradient-text">
                      {project.metric}
                    </p>
                  </div>
                )}
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {cs && (
        <>
          {/* Durum + yaklaşım */}
          <section className="section pt-4">
            <div className="container-x grid gap-10 lg:grid-cols-2">
              <Reveal>
                <div className="card h-full">
                  <span className="eyebrow">{t.caseStudy.challenge}</span>
                  <p className="mt-5 leading-relaxed text-white/70">{cs.challenge}</p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="card h-full">
                  <span className="eyebrow">{t.caseStudy.approach}</span>
                  <p className="mt-5 leading-relaxed text-white/70">{cs.approach}</p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Adımlar */}
          {cs.steps.length > 0 && (
            <section className="section">
              <div className="container-x">
                <SectionHeader eyebrow={t.caseStudy.processEyebrow} title={t.caseStudy.processTitle} />
                <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                  {cs.steps.map((step, i) => (
                    <Reveal key={step.title}>
                      <div className="card h-full">
                        <span className="font-display text-xs font-semibold tracking-[0.2em] text-violet-300">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">{step.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </Stagger>
              </div>
            </section>
          )}

          {/* Sonuçlar */}
          {cs.results.length > 0 && (
            <section className="section">
              <div className="container-x">
                <SectionHeader eyebrow={t.caseStudy.resultsEyebrow} title={t.caseStudy.resultsTitle} />
                <Reveal>
                  <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] sm:grid-cols-3">
                    {cs.results.map((r) => (
                      <div key={r.label} className="bg-ink-900/60 p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                          {r.label}
                        </p>
                        <p className="mt-4 font-display text-3xl font-semibold gradient-text sm:text-4xl">
                          {r.value}
                        </p>
                        {r.note && <p className="mt-3 text-sm text-white/55">{r.note}</p>}
                      </div>
                    ))}
                  </div>
                </Reveal>
              </div>
            </section>
          )}

          {/* Teslim edilenler */}
          {cs.deliverables.length > 0 && (
            <section className="section">
              <div className="container-x">
                <SectionHeader eyebrow={t.caseStudy.deliverablesEyebrow} title={t.caseStudy.deliverablesTitle} />
                <div className="mt-10 grid gap-3 md:grid-cols-2">
                  {cs.deliverables.map((d) => (
                    <Reveal key={d}>
                      <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-violet-500/20">
                          <Check className="h-3.5 w-3.5 text-violet-200" />
                        </span>
                        <span className="text-sm text-white/75">{d}</span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Diğer vakalar */}
      {others.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader eyebrow={t.caseStudy.otherEyebrow} title={t.caseStudy.otherTitle} />
            <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
              {others.map((p) => (
                <Reveal key={p.slug}>
                  <Link
                    href={localizeHref(locale, `/portfolyo/${p.slug}`)}
                    className="card group flex h-full flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.16em] text-white/40">
                        {p.category}
                      </span>
                      {p.metric && (
                        <span className="inline-flex items-center gap-1.5 font-display text-sm font-semibold gradient-text">
                          <Trophy className="h-3.5 w-3.5 text-violet-300" />
                          {p.metric}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-semibold leading-snug text-white">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/55">{p.description}</p>
                    <ArrowUpRight className="mt-auto h-4 w-4 text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </Link>
                </Reveal>
              ))}
            </Stagger>

            <div className="mt-10">
              <Link
                href={localizeHref(locale, "/portfolyo")}
                className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.caseStudy.backToList}
              </Link>
            </div>
          </div>
        </section>
      )}

      <CTASection locale={locale} />
    </>
  );
}
