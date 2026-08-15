import { Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { GradientBlobs } from "./GradientBlob";
import { Highlighted } from "./Highlight";
import type { Dict } from "@/i18n/dictionaries";

export type HeroProps = {
  dict: Dict["common"] & { services: string };
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  note1?: string;
  note2?: string;
};

// İçerik (başlık, açıklama, notlar) dile göre DB'den gelir; sadece buton
// etiketleri gibi sabit UI metinleri sözlükten karşılanır — hardcoded TR yok.
// Server component + CSS animasyon: framer yok, içerik ilk boyamada görünür (mobil için hızlı).
export function Hero(props: HeroProps) {
  const { dict } = props;
  const c = {
    eyebrow: "",
    title: "",
    highlight: "",
    description: "",
    primaryLabel: dict.getQuoteFree,
    primaryHref: "/iletisim",
    secondaryLabel: dict.services,
    secondaryHref: "/hizmetler",
    note1: "",
    note2: "",
    ...clean(props),
  };

  return (
    <section className="relative overflow-hidden pb-24 pt-20 sm:pt-28">
      <GradientBlobs video />
      <div className="container-x relative">
        <div className="mx-auto flex flex-col items-center text-center">
          {c.eyebrow && (
            <span className="eyebrow fade-up">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              {c.eyebrow}
            </span>
          )}

          <h1
            className="fade-up mt-6 max-w-4xl h-display text-4xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl"
            style={{ animationDelay: "0.06s" }}
          >
            <Highlighted text={c.title} highlight={c.highlight} />
          </h1>

          <p
            className="fade-up mt-6 max-w-2xl text-base text-white/65 sm:text-lg"
            style={{ animationDelay: "0.14s" }}
          >
            {c.description}
          </p>

          <div
            className="fade-up mt-9 flex flex-col items-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.22s" }}
          >
            <Link href={c.primaryHref} className="btn-primary">
              {c.primaryLabel}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            {c.secondaryLabel && (
              <Link href={c.secondaryHref} className="btn-ghost">
                {c.secondaryLabel}
              </Link>
            )}
          </div>

          {(c.note1 || c.note2) && (
            <div
              className="fade-up mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/45"
              style={{ animationDelay: "0.3s" }}
            >
              {c.note1 && (
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {c.note1}
                </span>
              )}
              {c.note2 && (
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  {c.note2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type HeroText = Omit<HeroProps, "dict">;

function clean(props: HeroProps): HeroText {
  const out: Record<string, string> = {};
  (Object.keys(props) as (keyof HeroProps)[]).forEach((k) => {
    if (k === "dict") return;
    const v = props[k];
    if (typeof v !== "string" || v.trim() === "") return;
    out[k] = v;
  });
  return out as HeroText;
}
