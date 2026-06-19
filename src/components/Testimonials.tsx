"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

type Testimonial = {
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  initials: string | null;
};

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  if (items.length === 0) return null;
  const t = items[i];
  const prev = () => setI((p) => (p - 1 + items.length) % items.length);
  const next = () => setI((p) => (p + 1) % items.length);

  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader
          eyebrow="Referanslar"
          title="Markalar bizimle ne anlatıyor?"
          description="Sayılar etkileyici olabilir; ama bir ajansla çalışmanın asıl değeri, müşterinin sabah uyandığında içinin rahat olmasıdır."
        />

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div className="card relative min-h-[280px] p-8 sm:p-10">
            <Quote className="absolute right-6 top-6 h-8 w-8 text-white/10" />
            <AnimatePresence mode="wait">
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
              >
                <p className="font-display text-xl leading-relaxed text-white/90 sm:text-2xl">
                  "{t.quote}"
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 font-display font-semibold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-sm text-white/55">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-2 lg:flex-col">
            <button
              onClick={prev}
              aria-label="Önceki referans"
              className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Sonraki referans"
              className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-1.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`${idx + 1}. referans`}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-8 bg-white" : "w-1.5 bg-white/25 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
