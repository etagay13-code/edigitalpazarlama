import { TrendingUp, ArrowUpRight } from "lucide-react";
import type { Dict } from "@/i18n/dictionaries";

// Hero altında "gerçek ürün" hissi veren dekoratif kampanya paneli.
// Çoğunlukla görsel; etiketler dile göre dict.dashboard'dan gelir.
export function DashboardMockup({ dict }: { dict: Dict["dashboard"] }) {
  const kpis = [
    { label: dict.revenue, value: "₺1.1M", delta: "+38%" },
    { label: dict.roas, value: "4.8x", delta: "+0.9" },
    { label: dict.conversions, value: "6.4K", delta: "+24%" },
    { label: dict.cpa, value: "₺178", delta: "−32%" },
  ];
  const channels = [
    { name: "Meta Ads", pct: 82 },
    { name: "Google Ads", pct: 68 },
    { name: "SEO", pct: 54 },
    { name: "E-mail", pct: 33 },
  ];

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* arkada yumuşak parlama */}
      <div
        aria-hidden
        className="absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[2rem] bg-violet-600/10 blur-3xl"
      />
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
        {/* pencere çubuğu */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="h-3 w-3 rounded-full bg-white/15" />
            <span className="h-3 w-3 rounded-full bg-white/15" />
          </div>
          <span className="font-display text-sm font-medium text-white/70">
            {dict.title}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {dict.label}
          </span>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1.6fr_1fr]">
          {/* sol: KPI + grafik */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {kpis.map((k) => (
                <div
                  key={k.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                >
                  <p className="text-[11px] uppercase tracking-wide text-white/45">
                    {k.label}
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-white">
                    {k.value}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300">
                    <ArrowUpRight className="h-3 w-3" />
                    {k.delta}
                  </p>
                </div>
              ))}
            </div>

            {/* alan grafiği */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs text-white/55">
                  <TrendingUp className="h-3.5 w-3.5 text-violet-300" />
                  {dict.traffic}
                </span>
              </div>
              <svg viewBox="0 0 320 110" className="h-28 w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c5cff" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#7c5cff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7c5cff" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                {[22, 50, 78].map((y) => (
                  <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(255,255,255,0.05)" />
                ))}
                <path
                  d="M0 92 L40 80 L80 84 L120 60 L160 64 L200 40 L240 44 L280 22 L320 18 L320 110 L0 110 Z"
                  fill="url(#area)"
                />
                <path
                  d="M0 92 L40 80 L80 84 L120 60 L160 64 L200 40 L240 44 L280 22 L320 18"
                  fill="none"
                  stroke="url(#line)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="320" cy="18" r="3.5" fill="#38bdf8" />
              </svg>
            </div>
          </div>

          {/* sağ: kanal dağılımı */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="mb-4 text-xs uppercase tracking-wide text-white/45">
              {dict.channels}
            </p>
            <div className="space-y-3.5">
              {channels.map((ch) => (
                <div key={ch.name}>
                  <div className="mb-1.5 flex items-center justify-between text-xs text-white/65">
                    <span>{ch.name}</span>
                    <span className="text-white/40">{ch.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                      style={{ width: `${ch.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
