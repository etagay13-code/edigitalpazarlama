import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { GradientBlobs } from "@/components/GradientBlob";
import { Reveal } from "@/components/Reveal";
import { asLocale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routes";

// Dönüşümün ayrı bir URL'de ölçülmesi için teşekkür sayfası.
// Reklam platformlarında hedef URL olarak bu adres kullanılır.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ThankYouPage({ params }: { params: { locale: string } }) {
  const locale = asLocale(params.locale);
  const t = getDict(locale);

  return (
    <section className="relative flex min-h-[72vh] items-center overflow-hidden py-24">
      <GradientBlobs />
      <div className="container-x">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h1 className="mt-8 h-display text-3xl font-semibold sm:text-4xl">
              {t.thanks.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/65">{t.thanks.description}</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={localizeHref(locale, "/blog")} className="btn-primary">
                {t.thanks.readBlog}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={localizeHref(locale, "/roas-hesaplayici")} className="btn-ghost">
                {t.thanks.tryTool}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
