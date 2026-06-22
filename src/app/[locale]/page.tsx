import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/Hero";
import { BrandStrip } from "@/components/BrandStrip";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Stats, type StatItem } from "@/components/Stats";
import { Process, type ProcessStep } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTASection } from "@/components/CTASection";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { DashboardMockup } from "@/components/DashboardMockup";
import { Comparison } from "@/components/Comparison";
import { getDict } from "@/i18n/dictionaries";
import {
  listServicesPublic,
  listTestimonialsPublic,
  listFaqsPublic,
  listPageSectionsPublic,
} from "@/lib/data";
import type { Metadata } from "next";
import { asLocale } from "@/i18n/config";
import { localizeHref } from "@/i18n/routes";
import { pageMeta } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return pageMeta({ locale: asLocale(params.locale), internalPath: "/" });
}

type HeroBody = {
  highlight?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  note1?: string;
  note2?: string;
};

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = asLocale(params.locale);
  const t = getDict(locale);
  const [services, testimonials, faqs, sections] = await Promise.all([
    listServicesPublic(locale),
    listTestimonialsPublic(locale),
    listFaqsPublic("home", locale),
    listPageSectionsPublic("home", locale),
  ]);

  const sec = (key: string) => sections.find((s) => s.section_key === key) ?? null;

  const heroSection = sec("hero");
  const heroBody = (heroSection?.body as HeroBody | null) ?? {};

  const brandSection = sec("brand_strip");
  const brands = ((brandSection?.body as { items?: string[] } | null)?.items ?? []) as string[];

  const servicesHeader = sec("services_header");
  const servicesHeaderBody =
    (servicesHeader?.body as { linkLabel?: string; linkHref?: string } | null) ?? {};

  const statsSection = sec("stats");
  const statItems = ((statsSection?.body as { items?: StatItem[] } | null)?.items ?? []) as StatItem[];

  const workflowSection = sec("workflow");
  const workflowSteps = ((workflowSection?.body as { items?: ProcessStep[] } | null)?.items ?? []) as ProcessStep[];

  const serviceItems = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    short: s.short,
    icon: s.icon,
    accent: s.accent,
  }));

  return (
    <>
      <Hero
        eyebrow={heroSection?.eyebrow ?? undefined}
        title={heroSection?.title ?? undefined}
        description={heroSection?.description ?? undefined}
        highlight={heroBody.highlight}
        primaryLabel={heroBody.primaryLabel}
        primaryHref={localizeHref(locale, heroBody.primaryHref || "/iletisim")}
        secondaryLabel={heroBody.secondaryLabel}
        secondaryHref={localizeHref(locale, heroBody.secondaryHref || "/hizmetler")}
        note1={heroBody.note1}
        note2={heroBody.note2}
      />
      <section className="relative pb-4 pt-2 sm:pb-8">
        <div className="container-x">
          <Reveal>
            <DashboardMockup dict={t.dashboard} />
          </Reveal>
        </div>
      </section>

      <BrandStrip label={brandSection?.title} brands={brands} />

      <section className="section">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              eyebrow={servicesHeader?.eyebrow || "Hizmetler"}
              title={servicesHeader?.title || "Markanızı büyütecek tüm uzmanlıklar"}
              description={
                servicesHeader?.description ||
                "Reklamdan SEO'ya, mobil uygulamadan SaaS geliştirmeye — markanız büyüdükçe ihtiyaç duyacağınız her hizmet kendi içinde uzmanlaşmış ekiplerle sunuluyor."
              }
            />
            <Reveal delay={0.2}>
              <Link href={localizeHref(locale, servicesHeaderBody.linkHref || "/hizmetler")} className="btn-ghost">
                {servicesHeaderBody.linkLabel || "Tüm hizmetler"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-12">
            <ServicesGrid items={serviceItems} limit={6} locale={locale} />
          </div>
        </div>
      </section>

      <Stats items={statItems} />
      <Process
        eyebrow={workflowSection?.eyebrow}
        title={workflowSection?.title}
        description={workflowSection?.description}
        steps={workflowSteps}
      />
      <Comparison dict={t.compare} />
      <Testimonials items={testimonials} />
      <FAQ items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <CTASection locale={locale} />
    </>
  );
}
