"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Stagger, fadeUp } from "./Reveal";
import { DynamicIcon } from "./DynamicIcon";
import { Compass } from "lucide-react";

export type ProcessStep = { icon?: string; title: string; desc: string };

// Adımlar ve başlıklar dile göre DB'den gelir; veri yoksa bölüm render edilmez.
export function Process({
  eyebrow,
  title,
  description,
  steps,
}: {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  steps?: ProcessStep[] | null;
}) {
  const list = steps ?? [];
  if (list.length === 0) return null;
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader
          eyebrow={eyebrow ?? undefined}
          title={title ?? ""}
          description={description ?? undefined}
        />
        <div className="relative mt-12">
          {/* adımları birbirine bağlayan ince çizgi (masaüstü) */}
          <div
            aria-hidden
            className="absolute inset-x-[10%] top-7 hidden h-px bg-gradient-to-r from-transparent via-white/12 to-transparent lg:block"
          />
          <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {list.map((s, i) => (
              <motion.div key={`${s.title}-${i}`} variants={fadeUp} className="card">
                <div className="flex items-center justify-between">
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-ink-950 font-display text-xs font-semibold text-violet-200">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <DynamicIcon name={s.icon} fallback={Compass} className="h-5 w-5 text-violet-300" />
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.desc}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
