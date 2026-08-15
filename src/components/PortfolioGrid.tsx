"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dict } from "@/i18n/dictionaries";
import { localizeHref } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";

type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  description: string;
  metric: string | null;
  gradient: string | null;
  tags: string[];
};

export function PortfolioGrid({
  items,
  dict,
  locale,
  readLabel,
}: {
  items: Project[];
  dict: Dict["portfolio"];
  locale: Locale;
  readLabel: string;
}) {
  const ALL = dict.all;
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => set.add(p.category));
    return [ALL, ...Array.from(set).sort()];
  }, [items, ALL]);

  const [filter, setFilter] = useState<string>(ALL);

  const filtered = useMemo(
    () => (filter === ALL ? items : items.filter((p) => p.category === filter)),
    [filter, items, ALL],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
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
              <Link href={localizeHref(locale, `/portfolyo/${p.slug}`)} className="block">
              <div
                className={`relative h-44 bg-gradient-to-br ${p.gradient ?? "from-violet-500 to-indigo-500"}`}
              >
                <div className="absolute inset-0 bg-grid-faint bg-grid opacity-30 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-end p-5">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      {p.category}
                    </span>
                    {p.metric && (
                      <span className="font-display text-lg font-semibold text-white drop-shadow">
                        {p.metric}
                      </span>
                    )}
                  </div>
                </div>
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
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-200">
                  {readLabel}
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-white/50">
          {dict.empty}
        </p>
      )}
    </div>
  );
}
