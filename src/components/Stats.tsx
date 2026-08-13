import { Counter } from "./Counter";
import { Reveal } from "./Reveal";

export type StatItem = {
  label: string;
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

// Not: hardcoded fallback yok — etiketler dile göre DB'den (page_sections.stats) gelir.
// Veri yoksa bölüm hiç render edilmez ki yanlış dilde metin görünmesin.
export function Stats({ items }: { items?: StatItem[] | null }) {
  const stats = items ?? [];
  if (stats.length === 0) return null;
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
                  <span className="gradient-text-warm">
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
