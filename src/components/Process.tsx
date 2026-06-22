"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Stagger, fadeUp } from "./Reveal";
import { DynamicIcon } from "./DynamicIcon";
import { Compass } from "lucide-react";

export type ProcessStep = { icon?: string; title: string; desc: string };

const DEFAULT_STEPS: ProcessStep[] = [
  { icon: "Compass", title: "Keşif", desc: "Markanızı, rakiplerinizi ve hedef kitlenizi derinlemesine anlıyoruz. Mevcut datalarınızı analiz ediyoruz." },
  { icon: "Map", title: "Strateji", desc: "Hedeflerinize uygun kanalları, mesajları ve KPI'ları belirleyen 90 günlük yol haritasını çıkarıyoruz." },
  { icon: "Rocket", title: "Uygulama", desc: "Kreatif üretiminden teknik kuruluma kadar her şeyi tek çatı altında devreye alıyoruz." },
  { icon: "LineChart", title: "Optimizasyon", desc: "A/B testleri, bütçe yeniden dağıtımı ve haftalık iterasyonlarla performansı sürekli iyileştiriyoruz." },
  { icon: "FileText", title: "Raporlama", desc: "Şeffaf canlı dashboard ve aylık sunumlarla sonuçları sadelikle gösteriyoruz." },
];

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
  const list = steps && steps.length > 0 ? steps : DEFAULT_STEPS;
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader
          eyebrow={eyebrow || "Çalışma Süreci"}
          title={title || "Net adımlar, ölçülebilir sonuçlar"}
          description={
            description ||
            "Müşterilerimizle ilk konuşmadan ilk raporlamaya kadar her aşamayı netleştirdik. Sürprizler büyüyen kampanyalarda olur, süreçte değil."
          }
        />
        <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {list.map((s, i) => (
            <motion.div key={`${s.title}-${i}`} variants={fadeUp} className="card">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-semibold tracking-[0.2em] text-white/40">
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
    </section>
  );
}
