"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { GradientBlobs } from "./GradientBlob";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-20 sm:pt-28">
      <GradientBlobs />
      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto flex flex-col items-center text-center"
        >
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            Yeni nesil 360° dijital ajans
          </span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-4xl h-display text-4xl font-semibold leading-[1.05] sm:text-6xl md:text-7xl"
          >
            A'dan Z'ye <span className="gradient-text">dijital büyüme</span>{" "}
            ortağınız
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl text-base text-white/65 sm:text-lg"
          >
            Reklam, SEO, sosyal medya, mobil uygulama ve SaaS geliştirme — markanızı
            büyütmek için ihtiyacınız olan her şey tek bir ekipte. Stratejiyi kuruyor,
            kreatifi üretiyor, performansı ölçüyor ve sürekli optimize ediyoruz.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Link href="/iletisim" className="btn-primary">
              Ücretsiz Teklif Al
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/hizmetler" className="btn-ghost">
              Hizmetleri İncele
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/45"
          >
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Şu an 6 yeni proje kabul ediyoruz
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              Ortalama 48 saat içinde teklif
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
