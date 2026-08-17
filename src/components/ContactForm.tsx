"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { track } from "@/lib/analytics";

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const initial: FormState = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

type Errors = Partial<Record<keyof FormState, string>>;
type CF = Dict["contactForm"];

function validate(s: FormState, dict: CF): Errors {
  const errors: Errors = {};
  if (!s.name.trim() || s.name.trim().length < 2) errors.name = dict.errName;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) errors.email = dict.errEmail;
  if (s.phone && !/^[0-9+\s()-]{7,20}$/.test(s.phone)) errors.phone = dict.errPhone;
  if (!s.service) errors.service = dict.errService;
  if (!s.message.trim() || s.message.trim().length < 20)
    errors.message = dict.errMessage;
  return errors;
}

export function ContactForm({
  services,
  locale,
  dict,
}: {
  services: { slug: string; title: string }[];
  locale: Locale;
  dict: CF;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Bal küpü — botlar doldurur, insanlar göremez.
  const [trap, setTrap] = useState("");

  const onChange =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate(form, dict);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    track({ event: "form_start", form: "contact", locale });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website2: trap, locale }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { code?: string };
        const byCode: Record<string, string> = {
          name: dict.errName,
          email: dict.errEmail,
          message: dict.errMessage,
        };
        throw new Error((data.code && byCode[data.code]) || dict.errSubmit);
      }
      // Asıl dönüşüm olayı — GA4'te "generate_lead" olarak işaretlenmeli.
      track({ event: "generate_lead", form: "contact", service: form.service, locale });
      setSuccess(true);
      setForm(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.errSubmit);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="card flex flex-col items-center p-10 text-center"
          >
            <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-6 h-display text-2xl font-semibold">
              {dict.successTitle}
            </h3>
            <p className="mt-3 max-w-md text-white/60">{dict.successDesc}</p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="btn-ghost mt-8"
            >
              {dict.successAgain}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            noValidate
            className="card grid gap-5 p-8 sm:p-10"
          >
            {/* Bal küpü — botlar doldurur, insanlar göremez */}
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
            {error && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={dict.name}
                error={errors.name}
                input={
                  <input
                    type="text"
                    value={form.name}
                    onChange={onChange("name")}
                    placeholder={dict.namePlaceholder}
                    className="input"
                    required
                  />
                }
              />
              <Field
                label={dict.email}
                error={errors.email}
                input={
                  <input
                    type="email"
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder={dict.emailPlaceholder}
                    className="input"
                    required
                  />
                }
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label={dict.phone}
                error={errors.phone}
                input={
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={onChange("phone")}
                    placeholder={dict.phonePlaceholder}
                    className="input"
                  />
                }
              />
              <Field
                label={dict.service}
                error={errors.service}
                input={
                  <select
                    value={form.service}
                    onChange={onChange("service")}
                    className="input"
                    required
                  >
                    <option value="">{dict.serviceSelect}</option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="Diğer">{dict.serviceOther}</option>
                  </select>
                }
              />
            </div>

            <Field
              label={dict.message}
              error={errors.message}
              input={
                <textarea
                  value={form.message}
                  onChange={onChange("message")}
                  rows={5}
                  placeholder={dict.messagePlaceholder}
                  className="input resize-none"
                  required
                />
              }
            />

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/45">{dict.privacy}</p>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? dict.submitting : dict.submit}
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background-color: rgba(255, 255, 255, 0.03);
          padding: 12px 14px;
          font-size: 14px;
          color: white;
          outline: none;
          transition: border 0.2s, background 0.2s, box-shadow 0.2s;
        }
        :global(.input::placeholder) {
          color: rgba(255, 255, 255, 0.35);
        }
        :global(.input:focus) {
          border-color: rgba(124, 92, 255, 0.6);
          background-color: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.15);
        }
        :global(.input option) {
          background-color: #111113;
          color: white;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
        {label}
      </span>
      {input}
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </label>
  );
}
