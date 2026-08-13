import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "./Reveal";
import { Highlighted } from "./Highlight";
import { getBrand } from "@/lib/theme";
import { getPageSection } from "@/lib/data";
import { localizeHref } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

type CtaBody = {
  highlight?: string;
  primaryLabel?: string;
  primaryHref?: string;
};

export async function CTASection({ locale }: { locale: Locale }) {
  const [brand, section] = await Promise.all([
    getBrand(locale),
    getPageSection("global", "cta", locale),
  ]);

  const t = getDict(locale);
  const body = (section?.body as CtaBody | null) ?? {};
  // Metinler dile göre DB'den (page_sections: global/cta); sabit etiketler sözlükten.
  const eyebrow = section?.eyebrow || t.nav.contact;
  const title = section?.title || "";
  const highlight = body.highlight || "";
  const description = section?.description || "";
  const primaryLabel = body.primaryLabel || t.common.planCall;
  const primaryHref = localizeHref(locale, body.primaryHref || "/iletisim");

  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-10 sm:p-16">
            <div
              aria-hidden
              className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-500/30 blur-[120px]"
            />
            <div
              aria-hidden
              className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]"
            />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className="eyebrow">{eyebrow}</span>
                {title && (
                  <h3 className="mt-5 h-display text-3xl font-semibold leading-[1.1] sm:text-4xl md:text-5xl">
                    <Highlighted text={title} highlight={highlight} />
                  </h3>
                )}
                {description && <p className="mt-5 text-white/65">{description}</p>}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href={primaryHref} className="btn-primary">
                  {primaryLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a href={`mailto:${brand.email}`} className="btn-ghost">
                  <Mail className="h-4 w-4" />
                  {brand.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
