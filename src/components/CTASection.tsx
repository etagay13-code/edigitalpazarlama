import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Reveal } from "./Reveal";
import { brand } from "@/lib/theme";

export function CTASection() {
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
                <span className="eyebrow">İletişim</span>
                <h3 className="mt-5 h-display text-3xl font-semibold leading-[1.1] sm:text-4xl md:text-5xl">
                  Bir sonraki büyüme dönemini{" "}
                  <span className="gradient-text">birlikte planlayalım</span>
                </h3>
                <p className="mt-5 text-white/65">
                  Ücretsiz 30 dakikalık keşif görüşmesi. Hedeflerinizi konuşalım,
                  mevcut kanallarınıza dair somut bir aksiyon planı çıkaralım.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/iletisim" className="btn-primary">
                  Görüşme Planla
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
