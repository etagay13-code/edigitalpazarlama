import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { GradientBlobs } from "@/components/GradientBlob";
import { AuditForm } from "@/components/AuditForm";
import { Reveal } from "@/components/Reveal";
import { asLocale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMeta } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = asLocale(params.locale);
  const t = getDict(locale).audit;
  return pageMeta({
    locale,
    internalPath: "/dijital-denetim",
    title: t.metaTitle,
    description: t.metaDesc,
  });
}

export default async function AuditPage({ params }: { params: { locale: string } }) {
  const locale = asLocale(params.locale);
  const t = getDict(locale).audit;

  return (
    <>
      <section className="relative overflow-hidden pb-8 pt-12 sm:pt-20">
        <GradientBlobs />
        <div className="container-x">
          <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />
        </div>
      </section>

      <section className="section pt-4">
        <div className="container-x grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
          <Reveal>
            <AuditForm locale={locale} dict={t} />
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="card space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                {t.eyebrow}
              </p>
              <ul className="space-y-3.5">
                {t.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-white/75">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/20">
                      <Check className="h-3 w-3 text-violet-200" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="border-t border-white/[0.08] pt-5 text-sm leading-relaxed text-white/55">
                {t.promise}
              </p>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
