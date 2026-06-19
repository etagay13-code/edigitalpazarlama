"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  Trash2,
  ArrowLeft,
  Plus,
  GripVertical,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  iconOptions,
  iconNames,
  gradientOptions,
  getIcon,
} from "@/lib/admin/icons-list";
import { createService, updateService, deleteService } from "../actions";
import type { ServiceWithChildren } from "@/lib/data/services";

type Step = { title: string; description: string };
type Faq = { question: string; answer: string };

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export function ServiceForm({
  service,
  mode,
}: {
  service?: ServiceWithChildren;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [icon, setIcon] = useState<string>(service?.icon ?? "Sparkles");
  const [accent, setAccent] = useState<string>(
    service?.accent ?? "from-violet-500 to-indigo-500",
  );
  const [active, setActive] = useState<boolean>(service?.active ?? true);
  const [process, setProcess] = useState<Step[]>(
    service?.process.map((s) => ({
      title: s.title,
      description: s.description,
    })) ?? [{ title: "", description: "" }],
  );
  const [faqs, setFaqs] = useState<Faq[]>(
    service?.faqs.map((f) => ({ question: f.question, answer: f.answer })) ?? [
      { question: "", answer: "" },
    ],
  );
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [deleting, setDeleting] = useState(false);

  const IconPreview = getIcon(icon);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "saving" });
    const fd = new FormData(e.currentTarget);
    fd.set("icon", icon);
    fd.set("accent", accent);
    fd.set("process_json", JSON.stringify(process));
    fd.set("faqs_json", JSON.stringify(faqs));
    if (active) fd.set("active", "on");
    else fd.delete("active");

    if (mode === "edit" && service) {
      const result = await updateService(service.id, fd);
      if (result.ok) {
        setStatus({ kind: "saved" });
        setTimeout(() => setStatus({ kind: "idle" }), 2500);
      } else {
        setStatus({
          kind: "error",
          message: result.error ?? "Bilinmeyen hata",
        });
      }
    } else {
      try {
        await createService(fd);
      } catch (e) {
        // createService redirect ile bitirebilir; redirect throw'u sayılmaz
        if (
          e instanceof Error &&
          !e.message.includes("NEXT_REDIRECT")
        ) {
          setStatus({ kind: "error", message: e.message });
        }
      }
    }
  };

  const handleDelete = async () => {
    if (!service) return;
    if (!confirm(`"${service.title}" silinsin mi? Bu işlem geri alınamaz.`))
      return;
    setDeleting(true);
    try {
      await deleteService(service.id);
    } catch (e) {
      if (e instanceof Error && !e.message.includes("NEXT_REDIRECT")) {
        alert(e.message);
        setDeleting(false);
      }
    }
  };

  const saving = status.kind === "saving";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="sticky top-[64px] z-20 -mx-5 -mt-8 mb-2 border-b border-white/[0.06] bg-ink-950/85 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/services"
              className="inline-flex items-center gap-2 text-xs text-white/55 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Hizmetler
            </Link>
            <ChevronRight className="h-3 w-3 text-white/30" />
            <div>
              <h1 className="font-display text-xl font-semibold">
                {mode === "create" ? "Yeni Hizmet" : service?.title}
              </h1>
              <p className="text-xs text-white/45">
                {mode === "create" ? "Sıfırdan yeni hizmet ekle" : `/hizmetler/${service?.slug}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            {mode === "edit" && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-white/65 transition hover:bg-rose-500/15 hover:text-rose-200 disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Sil
              </button>
            )}
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

      {/* Temel bilgiler */}
      <Section title="Temel bilgiler" description="Liste ve kart görünümünde kullanılır.">
        <Field label="Başlık *" name="title" defaultValue={service?.title} required />
        <Field
          label="Slug *"
          name="slug"
          defaultValue={service?.slug}
          required
          hint="URL'de görünür. ör: seo, reklam-yonetimi"
          monospace
        />
        <Field
          full
          label="Kısa açıklama (kart) *"
          name="short"
          defaultValue={service?.short}
          required
          hint="Grid kartlarında görünen tek satırlık cümle."
        />
        <Field
          full
          textarea
          rows={3}
          label="Açıklama *"
          name="description"
          defaultValue={service?.description}
          required
        />
      </Section>

      {/* Hero / Approach */}
      <Section
        title="Detay sayfası içerikleri"
        description="/hizmetler/[slug] detay sayfasında kullanılır."
      >
        <Field
          full
          textarea
          rows={2}
          label="Hero metni"
          name="hero"
          defaultValue={service?.hero ?? ""}
          hint="Detay sayfasının üstündeki büyük slogan."
        />
        <Field
          full
          textarea
          rows={4}
          label="Yaklaşım"
          name="approach"
          defaultValue={service?.approach ?? ""}
          hint="'Bu hizmeti nasıl ele alıyoruz' bölümünün uzun açıklaması."
        />
        <Field
          full
          textarea
          rows={3}
          label="Uzun açıklama (opsiyonel)"
          name="long_description"
          defaultValue={service?.long_description ?? ""}
        />
      </Section>

      {/* Kapsam ve çıktılar */}
      <Section
        title="Kapsam ve çıktılar"
        description="Her satıra bir madde yazın. Boş satırlar otomatik atılır."
      >
        <ListField
          label="Bullets (kapsam)"
          name="bullets"
          defaultValue={service?.bullets ?? []}
        />
        <ListField
          label="Çıktılar (deliverables)"
          name="deliverables"
          defaultValue={service?.deliverables ?? []}
        />
        <ListField
          label="Araçlar (tools)"
          name="tools"
          defaultValue={service?.tools ?? []}
        />
        <ListField
          label="Beklenebilir sonuçlar (outcomes)"
          name="outcomes"
          defaultValue={service?.outcomes ?? []}
        />
        <ListField
          label="Kimler için ideal"
          name="ideal_for"
          defaultValue={service?.ideal_for ?? []}
        />
        <ListField
          label="İlgili hizmet slug'ları"
          name="related_slugs"
          defaultValue={service?.related_slugs ?? []}
          hint="Slug'ları kullan: ör. seo, reklam-yonetimi"
          monospace
        />
      </Section>

      {/* Process Steps (nested) */}
      <Section
        title="Süreç adımları"
        description="Detay sayfasındaki 'İş başı yapışımızdan ilk sonuca' bölümü."
      >
        <div className="sm:col-span-2 space-y-3">
          {process.map((step, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-white/30" />
                <span className="font-display text-xs font-semibold text-violet-300">
                  Adım {i + 1}
                </span>
                <div className="ml-auto flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (i === 0) return;
                      const next = [...process];
                      [next[i - 1], next[i]] = [next[i], next[i - 1]];
                      setProcess(next);
                    }}
                    disabled={i === 0}
                    className="rounded-md px-2 py-1 text-xs text-white/55 hover:bg-white/[0.05] hover:text-white disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (i === process.length - 1) return;
                      const next = [...process];
                      [next[i + 1], next[i]] = [next[i], next[i + 1]];
                      setProcess(next);
                    }}
                    disabled={i === process.length - 1}
                    className="rounded-md px-2 py-1 text-xs text-white/55 hover:bg-white/[0.05] hover:text-white disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => setProcess(process.filter((_, j) => j !== i))}
                    className="rounded-md px-2 py-1 text-xs text-white/55 hover:bg-rose-500/15 hover:text-rose-200"
                    aria-label="Adımı sil"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <input
                placeholder="Adım başlığı"
                value={step.title}
                onChange={(e) => {
                  const next = [...process];
                  next[i] = { ...next[i], title: e.target.value };
                  setProcess(next);
                }}
                className="mb-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-400/60"
              />
              <textarea
                placeholder="Adım açıklaması"
                value={step.description}
                onChange={(e) => {
                  const next = [...process];
                  next[i] = { ...next[i], description: e.target.value };
                  setProcess(next);
                }}
                rows={2}
                className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-400/60"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setProcess([...process, { title: "", description: "" }])
            }
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-2 text-sm text-white/65 transition hover:border-violet-400/40 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Adım ekle
          </button>
        </div>
      </Section>

      {/* FAQs (nested) */}
      <Section
        title="Sık sorulan sorular"
        description="Detay sayfasının SSS bölümü."
      >
        <div className="sm:col-span-2 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="font-display text-xs font-semibold text-violet-300">
                  Soru {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}
                  className="ml-auto rounded-md px-2 py-1 text-xs text-white/55 hover:bg-rose-500/15 hover:text-rose-200"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <input
                placeholder="Soru"
                value={faq.question}
                onChange={(e) => {
                  const next = [...faqs];
                  next[i] = { ...next[i], question: e.target.value };
                  setFaqs(next);
                }}
                className="mb-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-400/60"
              />
              <textarea
                placeholder="Cevap"
                value={faq.answer}
                onChange={(e) => {
                  const next = [...faqs];
                  next[i] = { ...next[i], answer: e.target.value };
                  setFaqs(next);
                }}
                rows={3}
                className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-violet-400/60"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-2 text-sm text-white/65 transition hover:border-violet-400/40 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Soru ekle
          </button>
        </div>
      </Section>

      {/* Görsel & meta */}
      <Section title="Görünüm" description="İkon, gradient, sıralama ve yayın durumu.">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
            İkon
          </p>
          <div className="flex items-center gap-3">
            <div
              className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent}`}
            >
              <IconPreview className="h-5 w-5 text-white" />
            </div>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/60"
            >
              {iconNames.map((n) => (
                <option key={n} value={n} className="bg-ink-900">
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
            Gradient (aksan)
          </p>
          <select
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-400/60"
          >
            {gradientOptions.map((g) => (
              <option key={g.value} value={g.value} className="bg-ink-900">
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <Field
          label="Sıralama (sort_order)"
          name="sort_order"
          type="number"
          defaultValue={String(service?.sort_order ?? 0)}
          hint="Küçük olan üstte. Aynı sıradakiler alfabetik düşer."
        />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
            Yayın durumu
          </p>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 transition hover:bg-white/[0.05]">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 accent-violet-500"
            />
            <span className="text-sm text-white/85">
              Aktif{" "}
              <span className="text-white/45">
                (pasif olunca sitede görünmez)
              </span>
            </span>
          </label>
        </div>
      </Section>
    </form>
  );
}

/* ============================================================================
 * Helpers
 * ========================================================================== */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
          <Sparkles className="h-4 w-4 text-violet-300" />
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
  required,
  hint,
  type = "text",
  textarea,
  rows,
  full,
  monospace,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
  full?: boolean;
  monospace?: boolean;
}) {
  const cls = `w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/15 placeholder:text-white/30 ${
    monospace ? "font-mono" : ""
  }`;
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          rows={rows ?? 3}
          className={`${cls} resize-y`}
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          className={cls}
        />
      )}
      {hint && <p className="mt-1.5 text-[11px] text-white/40">{hint}</p>}
    </label>
  );
}

function ListField({
  label,
  name,
  defaultValue,
  hint,
  monospace,
}: {
  label: string;
  name: string;
  defaultValue: string[];
  hint?: string;
  monospace?: boolean;
}) {
  return (
    <Field
      textarea
      rows={Math.max(3, defaultValue.length)}
      label={label}
      name={name}
      defaultValue={defaultValue.join("\n")}
      hint={hint ?? "Her satıra bir madde."}
      monospace={monospace}
    />
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
        {status.message.slice(0, 60)}
      </span>
    );
  return null;
}
