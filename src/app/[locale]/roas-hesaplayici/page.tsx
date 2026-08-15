import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { GradientBlobs } from "@/components/GradientBlob";
import { CTASection } from "@/components/CTASection";
import { RoasCalculator } from "@/components/RoasCalculator";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
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
  const t = getDict(locale).roasTool;
  return pageMeta({
    locale,
    internalPath: "/roas-hesaplayici",
    title: t.metaTitle,
    description: t.metaDesc,
  });
}

export default async function RoasToolPage({ params }: { params: { locale: string } }) {
  const locale = asLocale(params.locale);
  const t = getDict(locale);
  const brand = await getBrand(locale);
  const url = brand.url.replace(/\/$/, "") + localizeHref(locale, "/roas-hesaplayici");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: t.roasTool.title,
      description: t.roasTool.metaDesc,
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: locale,
      offers: { "@type": "Offer", price: "0", priceCurrency: locale === "tr" ? "TRY" : "EUR" },
      provider: { "@type": "Organization", name: brand.name, url: brand.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.roasTool.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="relative overflow-hidden pb-10 pt-12 sm:pt-20">
        <GradientBlobs />
        <div className="container-x">
          <SectionHeader
            eyebrow={t.roasTool.eyebrow}
            title={t.roasTool.title}
            description={t.roasTool.description}
          />
        </div>
      </section>

      <section className="section pt-2">
        <div className="container-x">
          <Reveal>
            <RoasCalculator locale={locale} dict={t.roasTool} currency={locale === "tr" ? "TRY" : "EUR"} />
          </Reveal>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-x">
          <SectionHeader eyebrow={t.faq.eyebrow} title={t.roasTool.faqTitle} />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            {t.roasTool.faq.map((f) => (
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

      <CTASection locale={locale} />
    </>
  );
}
