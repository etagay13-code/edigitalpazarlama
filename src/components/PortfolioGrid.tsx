"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, projectCategories } from "@/lib/projects";

export function PortfolioGrid() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("Tümü");

  const filtered = useMemo(
    () =>
      filter === "Tümü"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {projectCategories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              filter === c
                ? "border-white/20 bg-white/10 text-white"
                : "border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.article
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="card group overflow-hidden p-0"
            >
              <div className={`relative h-44 bg-gradient-to-br ${p.gradient}`}>
                <div className="absolute inset-0 bg-grid-faint bg-grid opacity-30 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-end p-5">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      {p.category}
                    </span>
                    <span className="font-display text-lg font-semibold text-white drop-shadow">
                      {p.metric}
                    </span>
                  </div>
                </div>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                  {p.client}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-white/60">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/55"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-white/50">
          Bu kategoride henüz paylaşılacak bir proje yok.
        </p>
      )}
    </div>
  );
}
