"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { localizeHref } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

// Çok adımlı denetim formu.
//
// Neden tek sayfalık uzun form değil: 9 alanı aynı anda görmek terk oranını
// yükseltiyor. Adım adım ilerleyince her ekranda tek karar var ve ilk adım
// (yalnızca site adresi) neredeyse sürtünmesiz — kullanıcı başladıktan sonra
// tamamlama olasılığı belirgin şekilde artıyor.

type Step = 0 | 1 | 2 | 3;

type FormState = {
  website: string;
  sector: string;
  channels: string[];
  budget: string;
  goal: string;
  name: string;
  email: string;
  phone: string;
};

const initial: FormState = {
  website: "",
  sector: "",
  channels: [],
  budget: "",
  goal: "",
  name: "",
  email: "",
  phone: "",
};

export function AuditForm({ locale, dict }: { locale: Locale; dict: Dict["audit"] }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [started, setStarted] = useState(false);
  // Bal küpü: ekranda görünmeyen ama botların doldurduğu alan.
  const [trap, setTrap] = useState("");

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError(null);
    if (!started) {
      setStarted(true);
      track({ event: "form_start", form: "audit", locale });
    }
  };

  const toggleChannel = (c: string) =>
    set("channels", form.channels.includes(c) ? form.channels.filter((x) => x !== c) : [...form.channels, c]);

  const canAdvance =
    step === 0 ? form.website.trim().length > 3 && form.sector !== ""
    : step === 1 ? form.channels.length > 0 && form.budget !== ""
    : step === 2 ? form.goal.trim().length > 9
    : form.name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const next = () => {
    if (!canAdvance) {
      setError(dict.errRequired);
      return;
    }
    setStep((s) => Math.min(3, s + 1) as Step);
  };

  const submit = async () => {
    if (!canAdvance) {
      setError(dict.errRequired);
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "audit",
          website2: trap,
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.sector,
          locale,
          // Sunucu tarafında mesaj gövdesine dönüştürülür; ham veri payload'da kalır
          payload: {
            website: form.website,
            sector: form.sector,
            channels: form.channels,
            budget: form.budget,
            goal: form.goal,
          },
          message: `${dict.summaryWebsite}: ${form.website}\n${dict.summarySector}: ${form.sector}\n${dict.summaryChannels}: ${form.channels.join(", ")}\n${dict.summaryBudget}: ${form.budget}\n${dict.summaryGoal}: ${form.goal}`,
        }),
      });
      if (!res.ok) throw new Error();
      track({ event: "generate_lead", form: "audit", service: form.sector, locale });
      router.push(localizeHref(locale, "/tesekkurler"));
    } catch {
      setError(dict.errSubmit);
      setSending(false);
    }
  };

  const steps = [dict.step1, dict.step2, dict.step3, dict.step4];

  return (
    <div className="card p-0">
      {/* İlerleme */}
      <div className="border-b border-white/[0.07] px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-3">
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                    style={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                  />
                </div>
                <span
                  className={`hidden text-xs sm:block ${i === step ? "text-white" : "text-white/40"}`}
                >
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-8 sm:px-8">
        {/* Bal küpü — ekran okuyucudan ve klavyeden de gizli */}
        <input
          type="text"
          name="website2"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {step === 0 && (
              <>
                <Field label={dict.website} hint={dict.websiteHint}>
                  <input
                    type="text"
                    inputMode="url"
                    autoFocus
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="ornek.com"
                    className={inputCls}
                  />
                </Field>
                <Field label={dict.sector}>
                  <Chips
                    options={dict.sectors}
                    selected={[form.sector]}
                    onSelect={(v) => set("sector", v)}
                  />
                </Field>
              </>
            )}

            {step === 1 && (
              <>
                <Field label={dict.channels} hint={dict.channelsHint}>
                  <Chips options={dict.channelOptions} selected={form.channels} onSelect={toggleChannel} multi />
                </Field>
                <Field label={dict.budget}>
                  <Chips options={dict.budgetOptions} selected={[form.budget]} onSelect={(v) => set("budget", v)} />
                </Field>
              </>
            )}

            {step === 2 && (
              <Field label={dict.goal} hint={dict.goalHint}>
                <textarea
                  autoFocus
                  rows={5}
                  value={form.goal}
                  onChange={(e) => set("goal", e.target.value)}
                  placeholder={dict.goalPlaceholder}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            )}

            {step === 3 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={dict.name}>
                  <input
                    type="text"
                    autoFocus
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label={dict.email}>
                  <input
                    type="email"
                    inputMode="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label={dict.phone} full>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <p className="mt-5 text-sm text-rose-300">{error}</p>}

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
            disabled={step === 0 || sending}
            className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white disabled:invisible"
          >
            <ArrowLeft className="h-4 w-4" />
            {dict.back}
          </button>

          {step < 3 ? (
            <button type="button" onClick={next} className="btn-primary">
              {dict.next}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={sending} className="btn-primary">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {sending ? dict.sending : dict.submit}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-violet-400/60 placeholder:text-white/30";

function Field({
  label,
  hint,
  full,
  children,
}: {
  label: string;
  hint?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-sm font-medium text-white/80">{label}</span>
      {children}
      {hint && <span className="mt-2 block text-xs text-white/40">{hint}</span>}
    </label>
  );
}

function Chips({
  options,
  selected,
  onSelect,
  multi,
}: {
  options: readonly string[];
  selected: string[];
  onSelect: (v: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(o)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              on
                ? "border-violet-400/60 bg-violet-500/15 text-white"
                : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white"
            }`}
          >
            {multi && on && <Check className="mr-1.5 inline h-3.5 w-3.5" />}
            {o}
          </button>
        );
      })}
    </div>
  );
}
