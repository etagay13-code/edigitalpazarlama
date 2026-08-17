import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Check } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal, Stagger } from "@/components/Reveal";
import { GradientBlobs } from "@/components/GradientBlob";
import { CTASection } from "@/components/CTASection";
import { JsonLd, FaqJsonLd } from "@/components/JsonLd";
import { getSectorBySlug, listSectorsPublic, listPortfolioProjectsPublic, listServicesPublic } from "@/lib/data";
import { getBrand } from "@/lib/theme";
import { asLocale, OG_LOCALE } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routes";
import { altLanguages } from "@/i18n/metadata";

type SectorBody = {
  challenges: { title: string; desc: string }[];
  approach: { title: string; desc: string }[];
  faq: { q: string; a: string }[];
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const locale = asLocale(params.locale);
  const s = await getSectorBySlug(params.slug, locale);
  if (!s) return { title: "404" };
  const internal = `/sektorler/${s.slug}`;
  return {
    title: s.meta_title || s.name,
    description: s.meta_desc || s.description || undefined,
    alternates: { canonical: localizeHref(locale, internal), languages: altLanguages(internal) },
    openGraph: {
      url: localizeHref(locale, internal),
      locale: OG_LOCALE[locale],
      title: s.meta_title || s.name,
      description: s.meta_desc || s.description || undefined,
      images: [{ url: `/og/og-${locale}.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function SectorPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = asLocale(params.locale);
  const t = getDict(locale);
  const sector = await getSectorBySlug(params.slug, locale);
  if (!sector) notFound();

  const [brand, projects, services, allSectors] = await Promise.all([
    getBrand(locale),
    listPortfolioProjectsPublic(locale),
    listServicesPublic(locale),
    listSectorsPublic(locale),
  ]);

  const body = (sector.body ?? { challenges: [], approach: [], faq: [] }) as SectorBody;
  // Bu sektörün gerçek vakaları — kategori eşleşmesiyle
  const cases = projects.filter((p) => p.category === sector.category);
  const others = allSectors.filter((s) => s.slug !== sector.slug).slice(0, 6);
  const siteBase = brand.url.replace(/\/$/, "");
  const url = siteBase + localizeHref(locale, `/sektorler/${sector.slug}`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: sector.name,
          description: sector.meta_desc || sector.description,
          serviceType: sector.category,
          areaServed: ["TR", "DE", "AT", "CH", "NL", "BE"],
          provider: { "@type": "Organization", name: brand.name, url: brand.url },
          url,
        }}
      />
      <FaqJsonLd items={body.faq.map((f) => ({ question: f.q, answer: f.a }))} />

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
            <span className="text-white/70">{t.sectors.eyebrow}</span>
          </nav>

          <Reveal>
            <span className="eyebrow">{t.sectors.eyebrow}</span>
            <h1 className="mt-6 h-display text-3xl font-semibold leading-[1.08] sm:text-4xl md:text-5xl">
              {sector.name}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">
              {sector.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {sector.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/65"
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={localizeHref(locale, "/dijital-denetim")} className="btn-primary">
                {t.audit.title}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={localizeHref(locale, "/iletisim")} className="btn-ghost">
                {t.common.planCall}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {body.challenges.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader eyebrow={t.sectors.challengeEyebrow} title={t.sectors.challengeTitle} />
            <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
              {body.challenges.map((ch) => (
                <Reveal key={ch.title}>
                  <div className="card h-full">
                    <h3 className="font-display text-lg font-semibold">{ch.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">{ch.desc}</p>
                  </div>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {body.approach.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader eyebrow={t.sectors.approachEyebrow} title={t.sectors.approachTitle} />
            <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {body.approach.map((a, i) => (
                <Reveal key={a.title}>
                  <div className="card h-full">
                    <span className="font-display text-xs font-semibold tracking-[0.2em] text-violet-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 font-display text-lg font-semibold">{a.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{a.desc}</p>
                  </div>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Bu sektördeki gerçek vakalar */}
      {cases.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader eyebrow={t.sectors.casesEyebrow} title={t.sectors.casesTitle} />
            <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
              {cases.map((p) => (
                <Reveal key={p.slug}>
                  <Link
                    href={localizeHref(locale, `/portfolyo/${p.slug}`)}
                    className="card group flex h-full flex-col gap-3"
                  >
                    <span className="text-xs uppercase tracking-[0.16em] text-white/40">
                      {p.client}
                    </span>
                    <h3 className="font-display text-lg font-semibold leading-snug text-white">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/55">{p.description}</p>
                    <ArrowUpRight className="mt-auto h-4 w-4 text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </Link>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Bu sektörde verilen hizmetler */}
      <section className="section">
        <div className="container-x">
          <SectionHeader eyebrow={t.nav.services} title={t.sectors.servicesTitle} />
          <div className="mt-10 flex flex-wrap gap-2.5">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={localizeHref(locale, `/hizmetler/${s.slug}`)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/75 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
              >
                <Check className="h-3.5 w-3.5 text-violet-300" />
                {s.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {body.faq.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader eyebrow={t.faq.eyebrow} title={t.sectors.faqTitle} />
            <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {body.faq.map((f) => (
                <details key={f.q} className="group p-6 transition hover:bg-white/[0.02]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-medium text-white">{f.q}</span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-white/60 transition group-open:rotate-45 group-open:bg-violet-500/20 group-open:text-violet-200">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Diğer sektörler — iç linkleme */}
      {others.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              {t.sectors.otherTitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {others.map((s) => (
                <Link
                  key={s.slug}
                  href={localizeHref(locale, `/sektorler/${s.slug}`)}
                  className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white/60 transition hover:text-white"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection locale={locale} />
    </>
  );
}
