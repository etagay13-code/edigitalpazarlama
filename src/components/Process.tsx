"use client";

import { Compass, Map, Rocket, LineChart, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Stagger, fadeUp } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Keşif",
    desc: "Markanızı, rakiplerinizi ve hedef kitlenizi derinlemesine anlıyoruz. Mevcut datalarınızı analiz ediyoruz.",
    icon: Compass,
  },
  {
    n: "02",
    title: "Strateji",
    desc: "Hedeflerinize uygun kanalları, mesajları ve KPI'ları belirleyen 90 günlük yol haritasını çıkarıyoruz.",
    icon: Map,
  },
  {
    n: "03",
    title: "Uygulama",
    desc: "Kreatif üretiminden teknik kuruluma kadar her şeyi tek çatı altında devreye alıyoruz.",
    icon: Rocket,
  },
  {
    n: "04",
    title: "Optimizasyon",
    desc: "A/B testleri, bütçe yeniden dağıtımı ve haftalık iterasyonlarla performansı sürekli iyileştiriyoruz.",
    icon: LineChart,
  },
  {
    n: "05",
    title: "Raporlama",
    desc: "Şeffaf canlı dashboard ve aylık sunumlarla sonuçları sadelikle gösteriyoruz.",
    icon: FileText,
  },
];

export function Process() {
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader
          eyebrow="Çalışma Süreci"
          title="Net adımlar, ölçülebilir sonuçlar"
          description="Müşterilerimizle ilk konuşmadan ilk raporlamaya kadar her aşamayı netleştirdik. Sürprizler büyüyen kampanyalarda olur, süreçte değil."
        />
        <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.n} variants={fadeUp} className="card">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-semibold tracking-[0.2em] text-white/40">
                    {s.n}
                  </span>
                  <Icon className="h-5 w-5 text-violet-300" />
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.desc}</p>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
