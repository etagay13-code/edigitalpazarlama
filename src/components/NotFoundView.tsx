import Link from "next/link";
import { ArrowUpRight, Home } from "lucide-react";
import { GradientBlobs } from "@/components/GradientBlob";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routes";

// 404 içeriği — hem kök (eşleşmeyen URL) hem de [locale] segmenti için ortak.
export function NotFoundView({ locale }: { locale: Locale }) {
  const t = getDict(locale).notFound;
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden py-24">
      <GradientBlobs />
      <div className="container-x text-center">
        <p className="font-display text-[8rem] font-semibold leading-none sm:text-[12rem]">
          <span className="gradient-text">404</span>
        </p>
        <h1 className="mt-4 h-display text-3xl font-semibold sm:text-4xl">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-white/60">{t.desc}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={localizeHref(locale, "/")} className="btn-primary">
            <Home className="h-4 w-4" />
            {t.home}
          </Link>
          <Link href={localizeHref(locale, "/iletisim")} className="btn-ghost">
            {t.contact}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
