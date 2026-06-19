"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Stagger, fadeUp } from "./Reveal";
import { getIcon } from "@/lib/admin/icons-list";

type ServiceItem = {
  slug: string;
  title: string;
  short: string;
  icon: string;
  accent: string;
};

export function ServicesGrid({
  items,
  limit,
}: {
  items: ServiceItem[];
  limit?: number;
}) {
  const displayed = limit ? items.slice(0, limit) : items;
  return (
    <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {displayed.map((s) => {
        const Icon: LucideIcon = getIcon(s.icon) ?? Sparkles;
        return (
          <motion.div key={s.slug} variants={fadeUp}>
            <Link
              href={`/hizmetler/${s.slug}`}
              className="card group relative block h-full"
            >
              <div
                aria-hidden
                className={`absolute inset-x-0 -top-px h-px bg-gradient-to-r ${s.accent} opacity-0 transition group-hover:opacity-100`}
              />
              <div className="flex items-start justify-between">
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.accent} shadow-glow`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {s.short}
              </p>
            </Link>
          </motion.div>
        );
      })}
    </Stagger>
  );
}
