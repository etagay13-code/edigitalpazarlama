import { Check, X } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import type { Dict } from "@/i18n/dictionaries";

// "Tipik ajans vs True EDigital" premium karşılaştırma bölümü.
export function Comparison({ dict }: { dict: Dict["compare"] }) {
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader
          eyebrow={dict.eyebrow}
          title={dict.title}
          description={dict.description}
        />
        <Reveal>
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {/* Onlar */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8">
              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.16em] text-white/40">
                {dict.them}
              </p>
              <ul className="space-y-4">
                {dict.rows.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/55">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03]">
                      <X className="h-3 w-3 text-white/40" />
                    </span>
                    {r.them}
                  </li>
                ))}
              </ul>
            </div>

            {/* Biz — vurgulu */}
            <div className="relative overflow-hidden rounded-2xl border border-violet-400/25 bg-gradient-to-b from-violet-500/[0.08] to-white/[0.01] p-6 shadow-[0_30px_80px_-40px_rgba(124,92,255,0.6)] sm:p-8">
              <div
                aria-hidden
                className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent"
              />
              <p className="mb-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em]">
                <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  {dict.us}
                </span>
              </p>
              <ul className="space-y-4">
                {dict.rows.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/85">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-emerald-400/25 bg-emerald-500/10">
                      <Check className="h-3 w-3 text-emerald-300" />
                    </span>
                    {r.us}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
