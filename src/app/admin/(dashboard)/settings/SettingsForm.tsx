"use client";

import { useState, useRef } from "react";
import {
  Save,
  Upload,
  Loader2,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
  Palette,
  Building2,
  Phone,
  AtSign,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { saveSettings } from "./actions";
import { useToast } from "@/components/admin/Toast";
import type { SiteSettings } from "@/lib/data/settings";

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [logoUrl, setLogoUrl] = useState(settings.logo_url ?? "");
  const [faviconUrl, setFaviconUrl] = useState(settings.favicon_url ?? "");
  const [ogImageUrl, setOgImageUrl] = useState(settings.og_image_url ?? "");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const { success, error } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const uploadImage = async (
    file: File,
    setter: (url: string) => void,
    prefix: string,
  ) => {
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("public-assets")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
      if (uploadError) throw new Error(uploadError.message);

      const {
        data: { publicUrl },
      } = supabase.storage.from("public-assets").getPublicUrl(path);
      setter(publicUrl);
    } catch (e) {
      setStatus({
        kind: "error",
        message:
          e instanceof Error ? e.message : "Görsel yüklenirken hata oluştu.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "saving" });
    const fd = new FormData(e.currentTarget);
    fd.set("logo_url", logoUrl);
    fd.set("favicon_url", faviconUrl);
    fd.set("og_image_url", ogImageUrl);

    const result = await saveSettings(fd);
    if (result.ok) {
      setStatus({ kind: "saved" });
      success("Değişiklikler kaydedildi");
      setTimeout(() => setStatus({ kind: "idle" }), 2500);
    } else {
      setStatus({ kind: "error", message: result.error ?? "Bilinmeyen hata" });
      error(result.error ?? "Kaydedilemedi");
    }
  };

  const saving = status.kind === "saving";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {/* Sticky save bar */}
      <div className="sticky top-[64px] z-20 -mx-5 -mt-8 mb-2 border-b border-white/[0.06] bg-ink-950/85 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">Site Ayarları</h1>
            <p className="text-xs text-white/45">
              Marka, iletişim ve görsel ayarları
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

      {/* Marka */}
      <Section
        icon={<Building2 className="h-5 w-5 text-violet-300" />}
        title="Marka"
        description="Sitenin başlığında, footer'da, OG meta'da kullanılan marka bilgileri."
      >
        <Field
          label="Marka adı *"
          name="brand_name"
          defaultValue={settings.brand_name}
          required
        />
        <Field
          label="Kısa ad"
          name="brand_short_name"
          defaultValue={settings.brand_short_name ?? ""}
          placeholder="True EDigital Marketing"
        />
        <Field
          label="Kurucu"
          name="founder"
          defaultValue={settings.founder ?? ""}
          placeholder="Emre Tagay"
        />
        <Field
          label="Slogan"
          name="tagline"
          defaultValue={settings.tagline ?? ""}
          placeholder="A'dan Z'ye Dijital Büyüme Ortağınız"
        />
        <Field
          full
          textarea
          rows={3}
          label="Açıklama (meta description için)"
          name="description"
          defaultValue={settings.description ?? ""}
          placeholder="Markanızı 360° yönetiyoruz..."
        />
      </Section>

      {/* İletişim */}
      <Section
        icon={<Phone className="h-5 w-5 text-violet-300" />}
        title="İletişim"
        description="Footer'da ve iletişim sayfasında gösterilen bilgiler."
      >
        <Field
          label="Site URL"
          name="url"
          defaultValue={settings.url ?? ""}
          placeholder="https://etruemarketing.com"
          type="url"
        />
        <Field
          label="E-posta *"
          name="email"
          defaultValue={settings.email}
          required
          type="email"
          placeholder="info@..."
          icon={<AtSign className="h-4 w-4 text-white/45" />}
        />
        <Field
          label="Telefon"
          name="phone"
          defaultValue={settings.phone ?? ""}
          placeholder="+90 555 000 00 00"
        />
        <Field
          label="Adres"
          name="address"
          defaultValue={settings.address ?? ""}
          placeholder="İstanbul, Türkiye"
        />
      </Section>

      {/* Sosyal Medya */}
      <Section
        icon={<Instagram className="h-5 w-5 text-violet-300" />}
        title="Sosyal Medya"
        description="Footer ve iletişim sayfasında gösterilen sosyal medya linkleri."
      >
        <Field
          label="Instagram"
          name="instagram_url"
          defaultValue={settings.instagram_url ?? ""}
          type="url"
          placeholder="https://instagram.com/..."
          icon={<Instagram className="h-4 w-4 text-white/45" />}
        />
        <Field
          label="LinkedIn"
          name="linkedin_url"
          defaultValue={settings.linkedin_url ?? ""}
          type="url"
          placeholder="https://linkedin.com/company/..."
          icon={<Linkedin className="h-4 w-4 text-white/45" />}
        />
        <Field
          label="X / Twitter"
          name="twitter_url"
          defaultValue={settings.twitter_url ?? ""}
          type="url"
          placeholder="https://twitter.com/..."
          icon={<Twitter className="h-4 w-4 text-white/45" />}
        />
        <Field
          label="YouTube"
          name="youtube_url"
          defaultValue={settings.youtube_url ?? ""}
          type="url"
          placeholder="https://youtube.com/..."
          icon={<Youtube className="h-4 w-4 text-white/45" />}
        />
      </Section>

      {/* Görseller */}
      <Section
        icon={<ImageIcon className="h-5 w-5 text-violet-300" />}
        title="Görseller"
        description="Logo, favicon ve sosyal medya paylaşım görseli (OG image)."
      >
        <div className="full col-span-full grid gap-5 sm:grid-cols-3">
          <ImageUpload
            label="Logo"
            hint="Önerilen: 600x600 PNG/JPG (siyah arka plan ok)"
            url={logoUrl}
            onUpload={(f) => uploadImage(f, setLogoUrl, "logo")}
            onClear={() => setLogoUrl("")}
            previewClass="bg-ink-950"
          />
          <ImageUpload
            label="Favicon"
            hint="Önerilen: 64x64 SVG/PNG"
            url={faviconUrl}
            onUpload={(f) => uploadImage(f, setFaviconUrl, "favicon")}
            onClear={() => setFaviconUrl("")}
            previewClass="bg-ink-950"
          />
          <ImageUpload
            label="OG Image"
            hint="Sosyal paylaşım — 1200x630 önerilir"
            url={ogImageUrl}
            onUpload={(f) => uploadImage(f, setOgImageUrl, "og")}
            onClear={() => setOgImageUrl("")}
            previewClass="bg-gradient-to-br from-violet-500/20 to-cyan-500/20"
          />
        </div>
      </Section>

      {/* Renkler */}
      <Section
        icon={<Palette className="h-5 w-5 text-violet-300" />}
        title="Renkler"
        description="Markanın aksan renkleri. Public site refactor sonrası canlıya yansıyacak (Faz 4)."
      >
        <ColorField
          label="Arka plan (bg)"
          name="color_bg"
          defaultValue={settings.color_bg ?? "#0A0A0B"}
        />
        <ColorField
          label="Aksan rengi"
          name="color_accent"
          defaultValue={settings.color_accent ?? "#7C5CFF"}
        />
        <ColorField
          label="İkincil aksan"
          name="color_accent_secondary"
          defaultValue={settings.color_accent_secondary ?? "#22D3EE"}
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card">
      <div className="mb-6 flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
          {icon}
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <p className="mt-0.5 text-sm text-white/55">{description}</p>
        </div>
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
  required,
  type = "text",
  textarea,
  rows,
  full,
  icon,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  textarea?: boolean;
  rows?: number;
  full?: boolean;
  icon?: React.ReactNode;
}) {
  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/15 placeholder:text-white/30";
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
        {label}
      </span>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
        {textarea ? (
          <textarea
            name={name}
            defaultValue={defaultValue}
            placeholder={placeholder}
            required={required}
            rows={rows ?? 3}
            className={`${inputClass} resize-y`}
          />
        ) : (
          <input
            name={name}
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            required={required}
            className={`${inputClass} ${icon ? "pl-9" : ""}`}
          />
        )}
      </div>
    </label>
  );
}

function ColorField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2">
        <input
          type="color"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
        />
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent font-mono text-sm text-white outline-none"
          pattern="^#[0-9A-Fa-f]{6}$"
        />
      </div>
    </label>
  );
}

function ImageUpload({
  label,
  hint,
  url,
  onUpload,
  onClear,
  previewClass = "bg-ink-900",
}: {
  label: string;
  hint: string;
  url: string;
  onUpload: (file: File) => void | Promise<void>;
  onClear: () => void;
  previewClass?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
        {label}
      </p>
      <div
        className={`relative aspect-square overflow-hidden rounded-2xl border border-white/[0.08] ${previewClass}`}
      >
        {url ? (
          <Image
            src={url}
            alt={label}
            fill
            unoptimized
            className="object-contain"
          />
        ) : (
          <div className="grid h-full place-items-center text-white/30">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>
      <p className="mt-2 text-[11px] text-white/40">{hint}</p>
      <div className="mt-3 flex gap-2">
        <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-white/[0.07]">
          <Upload className="h-3.5 w-3.5" />
          {url ? "Değiştir" : "Yükle"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
        {url && (
          <button
            type="button"
            onClick={onClear}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition hover:bg-rose-500/15 hover:text-rose-200"
            aria-label="Kaldır"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
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
