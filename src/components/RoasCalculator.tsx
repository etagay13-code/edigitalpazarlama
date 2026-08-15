"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { track } from "@/lib/analytics";
import { localizeHref } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

type Props = { locale: Locale; dict: Dict["roasTool"]; currency: string };

const CURRENCY: Record<Locale, string> = { tr: "₺", en: "€", de: "€" };

export function RoasCalculator({ locale, dict }: Props) {
  const [spend, setSpend] = useState(50000);
  const [revenue, setRevenue] = useState(180000);
  const [margin, setMargin] = useState(45);
  const [touched, setTouched] = useState(false);

  const cur = CURRENCY[locale];

  const r = useMemo(() => {
    const roas = spend > 0 ? revenue / spend : 0;
    const breakEven = margin > 0 ? 100 / margin : 0;
    // Brüt kâr = ciro × marj; net katkı = brüt kâr − reklam harcaması
    const grossProfit = revenue * (margin / 100);
    const contribution = grossProfit - spend;
    const poas = spend > 0 ? grossProfit / spend : 0;
    // Başabaşa ulaşmak için gereken ek ciro
    const revenueNeeded = margin > 0 ? spend / (margin / 100) : 0;
    return { roas, breakEven, grossProfit, contribution, poas, revenueNeeded, healthy: roas >= breakEven };
  }, [spend, revenue, margin]);

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(Math.round(n));

  const onChange = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    if (!touched) {
      setTouched(true);
      track({ event: "calculator_use", tool: "roas", locale });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      {/* Girdiler */}
      <div className="card space-y-7">
        <Field
          label={dict.spend}
          value={spend}
          onChange={onChange(setSpend)}
          min={1000}
          max={1000000}
          step={1000}
          prefix={cur}
          format={fmt}
        />
        <Field
          label={dict.revenue}
          value={revenue}
          onChange={onChange(setRevenue)}
          min={1000}
          max={5000000}
          step={1000}
          prefix={cur}
          format={fmt}
        />
        <Field
          label={dict.margin}
          value={margin}
          onChange={onChange(setMargin)}
          min={5}
          max={90}
          step={1}
          suffix="%"
          format={(n) => String(n)}
          hint={dict.marginHint}
        />
      </div>

      {/* Sonuçlar */}
      <div className="space-y-4">
        <div
          className={`card border ${
            r.healthy ? "border-emerald-400/25 bg-emerald-500/[0.04]" : "border-rose-400/25 bg-rose-500/[0.04]"
          }`}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                {dict.yourRoas}
              </p>
              <p className="mt-2 font-display text-5xl font-semibold gradient-text">
                {r.roas.toFixed(2)}x
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                {dict.breakEven}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-white/85">
                {r.breakEven.toFixed(2)}x
              </p>
            </div>
          </div>

          <p
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
              r.healthy ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"
            }`}
          >
            {r.healthy ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {r.healthy ? dict.verdictGood : dict.verdictBad}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Stat label={dict.grossProfit} value={`${CURRENCY[locale]}${fmt(r.grossProfit)}`} />
          <Stat
            label={dict.contribution}
            value={`${r.contribution < 0 ? "−" : ""}${CURRENCY[locale]}${fmt(Math.abs(r.contribution))}`}
            tone={r.contribution >= 0 ? "good" : "bad"}
          />
          <Stat label={dict.poas} value={`${r.poas.toFixed(2)}x`} hint={dict.poasHint} />
          <Stat
            label={dict.revenueNeeded}
            value={`${CURRENCY[locale]}${fmt(r.revenueNeeded)}`}
            hint={dict.revenueNeededHint}
          />
        </div>

        <div className="card flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-sm text-sm text-white/60">{dict.ctaText}</p>
          <Link
            href={localizeHref(locale, "/iletisim")}
            className="btn-primary"
            onClick={() =>
              track({ event: "cta_click", label: "roas_calculator", location: "tool", locale })
            }
          >
            {dict.ctaButton}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  format,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  format: (n: number) => string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-white/75">{label}</span>
        <span className="font-display text-xl font-semibold text-white tabular-nums">
          {prefix}
          {format(value)}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-violet-400"
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/60"
        aria-label={label}
      />
      {hint && <span className="mt-2 block text-xs text-white/40">{hint}</span>}
    </label>
  );
}

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "good" | "bad";
}) {
  return (
    <div className="card">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{label}</p>
      <p
        className={`mt-2 font-display text-2xl font-semibold tabular-nums ${
          tone === "good" ? "text-emerald-300" : tone === "bad" ? "text-rose-300" : "text-white"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs leading-relaxed text-white/40">{hint}</p>}
    </div>
  );
}
