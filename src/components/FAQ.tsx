"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

type FaqItem = { question: string; answer: string };

export function FAQ({
  items,
  eyebrow = "Sık Sorulanlar",
  title = "Bilmek istediklerinin cevapları",
  description = "Aklında olup da burada cevabını bulamadığın bir soru varsa, iletişim sayfasından bize ulaşabilirsin.",
}: {
  items: FaqItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  if (items.length === 0) return null;
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          {items.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <div key={f.question}>
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:bg-white/[0.03]"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-white">{f.question}</span>
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 transition ${
                      isOpen ? "rotate-45 bg-violet-500/20 text-violet-200" : "text-white/60"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm leading-relaxed text-white/65">
                        {f.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
