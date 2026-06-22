"use client";

import { useState } from "react";
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  BarChart3,
  Tag,
  ShieldCheck,
  Flame,
  Activity,
  Mail,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { saveIntegrations } from "./actions";
import { useToast } from "@/components/admin/Toast";
import type { SiteSettings } from "@/lib/data/settings";
import type { SiteSecrets } from "@/lib/data/secrets";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export function IntegrationsForm({
  settings,
  secrets,
}: {
  settings: SiteSettings;
  secrets: SiteSecrets;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [showResendKey, setShowResendKey] = useState(false);
  const [clearResendKey, setClearResendKey] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "saving" });
    const fd = new FormData(e.currentTarget);
    if (clearResendKey) fd.set("resend_api_key_clear", "1");

    const result = await saveIntegrations(fd);
    if (result.ok) {
      setStatus({ kind: "saved" });
      setClearResendKey(false);
      success("Değişiklikler kaydedildi");
      setTimeout(() => setStatus({ kind: "idle" }), 2500);
    } else {
      setStatus({ kind: "error", message: result.error ?? "Bilinmeyen hata" });
      error(result.error ?? "Kaydedilemedi");
    }
  };

  const saving = status.kind === "saving";
  const hasResendKey = Boolean(secrets.resend_api_key);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="sticky top-[64px] z-20 -mx-5 -mt-8 mb-2 border-b border-white/[0.06] bg-ink-950/85 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">
              Entegrasyonlar
            </h1>
            <p className="text-xs text-white/45">
              Analytics, Tag Manager, Search Console ve mail
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Kaydediliyor" : "Kaydet"}
            </button>
          </div>
        </div>
      </div>

      {/* Google Analytics 4 */}
      <Section
        icon={<BarChart3 className="h-5 w-5 text-violet-300" />}
        title="Google Analytics 4"
        description="Ölçüm kimliği ile tüm sayfalarda gtag.js otomatik yüklenir (Faz 4)."
        link={{
          label: "GA4 → Yönetim → Veri akışları → Ölçüm Kimliği",
          url: "https://analytics.google.com",
        }}
      >
        <Field
          label="Measurement ID"
          name="ga4_measurement_id"
          defaultValue={settings.ga4_measurement_id ?? ""}
          placeholder="G-XXXXXXXXXX"
          monospace
        />
      </Section>

      {/* GTM */}
      <Section
        icon={<Tag className="h-5 w-5 text-violet-300" />}
        title="Google Tag Manager"
        description="GTM container ID ile head + body snippet'ları otomatik eklenir."
        link={{
          label: "GTM Konsolu",
          url: "https://tagmanager.google.com",
        }}
      >
        <Field
          label="Container ID"
          name="gtm_container_id"
          defaultValue={settings.gtm_container_id ?? ""}
          placeholder="GTM-XXXXXXX"
          monospace
        />
      </Section>

      {/* Search Console */}
      <Section
        icon={<ShieldCheck className="h-5 w-5 text-violet-300" />}
        title="Google Search Console"
        description="HTML tag yöntemi için meta content değerini buraya yapıştır."
        link={{
          label: "Search Console → Mülkiyet doğrulama",
          url: "https://search.google.com/search-console",
        }}
      >
        <Field
          full
          label="Verification content"
          name="search_console_verification"
          defaultValue={settings.search_console_verification ?? ""}
          placeholder="abc123def456..."
          hint={
            'Search Console <meta name="google-site-verification" content="..."> içeriğindeki content değeri.'
          }
          monospace
        />
      </Section>

      {/* Hotjar + Clarity */}
      <Section
        icon={<Flame className="h-5 w-5 text-violet-300" />}
        title="Heatmap & Session Recording"
        description="Opsiyonel — boş bırakırsan yüklenmez."
      >
        <Field
          label="Hotjar Site ID"
          name="hotjar_site_id"
          defaultValue={settings.hotjar_site_id ?? ""}
          placeholder="3xxxxxxx"
          monospace
        />
        <Field
          label="Microsoft Clarity ID"
          name="microsoft_clarity_id"
          defaultValue={settings.microsoft_clarity_id ?? ""}
          placeholder="abcdef1234"
          monospace
        />
      </Section>

      {/* Resend / Mail */}
      <Section
        icon={<Mail className="h-5 w-5 text-violet-300" />}
        title="E-posta (Resend)"
        description="İletişim formu mailleri Resend üzerinden gider. Ücretsiz plan: 3.000 mail/ay."
        link={{
          label: "Resend → API Keys",
          url: "https://resend.com/api-keys",
        }}
      >
        <div className="sm:col-span-2">
          <label className="block">
            <span className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              <span>Resend API Key</span>
              {hasResendKey && !clearResendKey && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-200 normal-case tracking-normal">
                  <ShieldCheck className="h-3 w-3" />
                  Kayıtlı
                </span>
              )}
            </span>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showResendKey ? "text" : "password"}
                  name="resend_api_key"
                  defaultValue={
                    hasResendKey && !clearResendKey ? "••••••••••••••••" : ""
                  }
                  placeholder="re_..."
                  autoComplete="off"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 pr-10 font-mono text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/15"
                  onFocus={(e) => {
                    if (e.target.value.startsWith("•")) e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowResendKey((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-lg text-white/45 hover:text-white"
                  aria-label={showResendKey ? "Gizle" : "Göster"}
                >
                  {showResendKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {hasResendKey && (
                <button
                  type="button"
                  onClick={() => setClearResendKey((v) => !v)}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition ${
                    clearResendKey
                      ? "border-rose-400/30 bg-rose-500/15 text-rose-200"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:bg-rose-500/15 hover:text-rose-200"
                  }`}
                  aria-label="Key'i sil"
                  title="Key'i sil"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-white/40">
              {clearResendKey
                ? "Kaydet'e basınca key silinecek (✕ ile geri al)."
                : hasResendKey
                  ? "Yeni bir key yazmazsan mevcut korunur."
                  : "resend.com/api-keys → 'Create API Key' → tam izin → kopyala-yapıştır."}
            </p>
          </label>
        </div>

        <Field
          label="From Email"
          name="resend_from_email"
          defaultValue={secrets.resend_from_email ?? ""}
          placeholder="hello@your-domain.com"
          type="email"
          hint="Doğrulanmış domain yoksa onboarding@resend.dev kullan."
        />
        <Field
          label="Mesajlar nereye gelsin?"
          name="contact_form_to_email"
          defaultValue={secrets.contact_form_to_email ?? ""}
          placeholder="info@etruemarketing.com"
          type="email"
          hint="Boşsa yine de DB'ye kaydedilir (Mesajlar inbox)."
        />
      </Section>
    </form>
  );
}

/* ============================================================================
 * Helpers
 * ========================================================================== */

function Section({
  icon,
  title,
  description,
  children,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  link?: { label: string; url: string };
}) {
  return (
    <section className="card">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
            {icon}
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            <p className="mt-0.5 text-sm text-white/55">{description}</p>
          </div>
        </div>
        {link && (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/[0.07] hover:text-white sm:inline-flex"
          >
            <ExternalLink className="h-3 w-3" />
            {link.label}
          </a>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  full,
  hint,
  monospace,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  full?: boolean;
  hint?: string;
  monospace?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/15 placeholder:text-white/30 ${
          monospace ? "font-mono" : ""
        }`}
      />
      {hint && <p className="mt-1.5 text-[11px] text-white/40">{hint}</p>}
    </label>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status.kind === "saved")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
        <Check className="h-3.5 w-3.5" />
        Kaydedildi
      </span>
    );
  if (status.kind === "error")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-200">
        <AlertCircle className="h-3.5 w-3.5" />
        {status.message.slice(0, 50)}
      </span>
    );
  return null;
}
