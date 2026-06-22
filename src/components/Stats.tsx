import { Counter } from "./Counter";
import { Reveal } from "./Reveal";

export type StatItem = {
  label: string;
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

const DEFAULT_STATS: StatItem[] = [
  { label: "Yönetilen reklam bütçesi", to: 18, prefix: "₺", suffix: "M+", decimals: 0 },
  { label: "Tamamlanan kampanya", to: 320, suffix: "+", decimals: 0 },
  { label: "Ortalama ROAS", to: 4.6, suffix: "x", decimals: 1 },
  { label: "Mutlu müşteri", to: 64, suffix: "+", decimals: 0 },
];

export function Stats({ items }: { items?: StatItem[] | null }) {
  const stats = items && items.length > 0 ? items : DEFAULT_STATS;
  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="relative bg-ink-900/60 p-8 transition hover:bg-ink-800/60"
              >
                <div className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                  <span className="gradient-text">
                    <Counter
                      to={s.to}
                      prefix={s.prefix ?? ""}
                      suffix={s.suffix ?? ""}
                      decimals={s.decimals ?? 0}
                    />
                  </span>
                </div>
                <p className="mt-3 text-sm text-white/55">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
