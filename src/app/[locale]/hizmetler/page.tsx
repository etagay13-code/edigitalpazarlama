import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, TrendingUp, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Reveal, Stagger } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { GradientBlobs } from "@/components/GradientBlob";
import { DynamicIcon } from "@/components/DynamicIcon";
import {
  listServicesPublic,
  listIndustriesPublic,
  listTechPublic,
  listFaqsPublic,
  listPageSectionsPublic,
  getPageSection,
} from "@/lib/data";
import { getBrand } from "@/lib/theme";
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
  const hero = await getPageSection("services", "hero", locale);
  return pageMeta({
    locale,
    internalPath: "/hizmetler",
    title: hero?.title,
    description: hero?.description,
  });
}

type SynergyItem = { icon?: string; title: string; desc: string };
type PricingItem = { title: string; range: string; desc: string; fits: string };

export default async function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = asLocale(params.locale);
  const t = getDict(locale);
  const [services, industries, techStack, brand, sections, serviceFaqs] =
    await Promise.all([
      listServicesPublic(locale),
      listIndustriesPublic(locale),
      listTechPublic(locale),
      getBrand(locale),
      listPageSectionsPublic("services", locale),
      listFaqsPublic("services", locale),
    ]);

  const sec = (key: string) => sections.find((s) => s.section_key === key) ?? null;

  const heroSection = sec("hero");
  const gridHeader = sec("grid_header");
  const gridBody =
    (gridHeader?.body as { intro?: string; linkLabel?: string; linkHref?: string } | null) ?? {};
  const industriesHeader = sec("industries_header");
  const techHeader = sec("tech_header");
  const faqHeader = sec("faq_header");

  const synergySection = sec("synergy");
  const pricingSection = sec("pricing");
  const synergyBenefits = ((synergySection?.body as { items?: SynergyItem[] } | null)?.items ?? []) as SynergyItem[];
  const pricingModels = ((pricingSection?.body as { items?: PricingItem[] } | null)?.items ?? []) as PricingItem[];
  const serviceItems = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    short: s.short,
    icon: s.icon,
    accent: s.accent,
  }));
  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-12 sm:pt-20">
        <GradientBlobs />
        <div className="container-x">
          <SectionHeader
            eyebrow={heroSection?.eyebrow || t.nav.services}
            title={heroSection?.title || ""}
            description={heroSection?.description || undefined}
          />
        </div>
      </section>

      {/* Hizmet Grid — her kart kendi detay sayfasına */}
      <section className="section pt-4">
        <div className="container-x">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-white/55">
              {gridBody.intro || t.servicesPage.gridIntro}
            </p>
            <Link
              href={localizeHref(locale, gridBody.linkHref || "/iletisim")}
              className="hidden text-sm font-medium text-white/70 transition hover:text-white sm:inline-flex sm:items-center sm:gap-1"
            >
              {gridBody.linkLabel || t.servicesPage.gridLink}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <ServicesGrid items={serviceItems} locale={locale} />
        </div>
      </section>

      {/* Sentez bölümü */}
      {synergyBenefits.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={synergySection?.eyebrow ?? undefined}
              title={synergySection?.title ?? ""}
              description={synergySection?.description ?? undefined}
            />
            <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {synergyBenefits.map((b) => (
                <Reveal key={b.title}>
                  <div className="card h-full">
                    <div className="icon-chip h-11 w-11">
                      <DynamicIcon name={b.icon} className="h-5 w-5 text-violet-300" />
                    </div>
                    <h4 className="mt-5 font-display text-lg font-semibold">
                      {b.title}
                    </h4>
                    <p className="mt-2 text-sm text-white/60">{b.desc}</p>
                  </div>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Sektörler */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow={industriesHeader?.eyebrow ?? undefined}
            title={industriesHeader?.title || ""}
            description={industriesHeader?.description || undefined}
          />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind) => (
              <Reveal key={ind.name}>
                <div className="card h-full">
                  <h4 className="font-display text-lg font-semibold">{ind.name}</h4>
                  <p className="mt-3 text-sm text-white/60">{ind.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {ind.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/55"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Teknoloji & Araçlar */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow={techHeader?.eyebrow ?? undefined}
            title={techHeader?.title || t.serviceDetail.toolsTitle}
            description={techHeader?.description || undefined}
          />
          <Reveal>
            <div className="mt-12 flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span
                  key={t.name}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/75 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  <Wrench className="h-3.5 w-3.5 text-violet-300" />
                  {t.name}
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/35 group-hover:text-white/55">
                    {t.category}
                  </span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Fiyatlandırma yaklaşımı */}
      {pricingModels.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={pricingSection?.eyebrow ?? undefined}
              title={pricingSection?.title ?? ""}
              description={pricingSection?.description ?? undefined}
            />
            <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
              {pricingModels.map((p) => (
                <Reveal key={p.title}>
                  <div className="card flex h-full flex-col">
                    <TrendingUp className="h-5 w-5 text-violet-300" />
                    <h4 className="mt-5 font-display text-xl font-semibold">
                      {p.title}
                    </h4>
                    <p className="mt-2 text-sm gradient-text font-display text-xl">
                      {p.range}
                    </p>
                    <p className="mt-4 text-sm text-white/60">{p.desc}</p>
                    <p className="mt-auto pt-6 text-xs uppercase tracking-[0.16em] text-white/40">
                      {t.servicesPage.fits}: {p.fits}
                    </p>
                  </div>
                </Reveal>
              ))}
            </Stagger>
            <Reveal delay={0.1}>
              <p className="mt-8 text-center text-sm text-white/50">
                {t.servicesPage.pricingNote}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Hizmet FAQ */}
      {serviceFaqs.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={faqHeader?.eyebrow || t.faq.eyebrow}
              title={faqHeader?.title || ""}
              description={faqHeader?.description || undefined}
            />
            <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {serviceFaqs.map((f) => (
                <details
                  key={f.id}
                  className="group p-6 transition hover:bg-white/[0.02]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-medium text-white">{f.question}</span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-white/60 transition group-open:rotate-45 group-open:bg-violet-500/20 group-open:text-violet-200">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{f.answer}</p>
                </details>
              ))}
            </div>
            <Reveal delay={0.1}>
              <p className="mt-8 text-center text-sm text-white/50">
                {t.servicesPage.moreQuestions}{" "}
                <a
                  className="text-white underline-offset-4 hover:underline"
                  href={`mailto:${brand.email}`}
                >
                  {brand.email}
                </a>
              </p>
            </Reveal>
          </div>
        </section>
      )}

      <CTASection locale={locale} />
    </>
  );
}
