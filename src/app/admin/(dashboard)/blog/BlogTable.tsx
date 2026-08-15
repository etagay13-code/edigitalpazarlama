"use client";

import { useState, useTransition } from "react";
import { Check, ExternalLink, Loader2, Sparkles, Trash2, Undo2 } from "lucide-react";
import { publishPost, unpublishPost, removePost, generateNow } from "./actions";

type Row = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  status: string;
  source: string;
  reading_min: number;
  cover_url: string | null;
  created_at: string;
  published_at: string | null;
  previewHref: string;
  translationCount: number;
};

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
}

export function BlogTable({ drafts, published }: { drafts: Row[]; published: Row[] }) {
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const run = (id: string | null, fn: () => Promise<{ ok: boolean; error?: string; warning?: string }>) => {
    setBusyId(id);
    setMsg(null);
    startTransition(async () => {
      const res = await fn();
      setBusyId(null);
      if (!res.ok) setMsg({ type: "err", text: res.error ?? "İşlem başarısız." });
      else if (res.warning) setMsg({ type: "err", text: `Yayınlandı ama: ${res.warning}` });
      else setMsg({ type: "ok", text: "Tamam." });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => run("new", generateNow)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/[0.08] disabled:opacity-50"
        >
          {busyId === "new" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-violet-300" />}
          Şimdi bir yazı üret
        </button>
        {msg && (
          <span className={`text-sm ${msg.type === "ok" ? "text-emerald-300" : "text-rose-300"}`}>
            {msg.text}
          </span>
        )}
      </div>

      <Section title="Onay bekleyen" empty="Onay bekleyen yazı yok.">
        {drafts.map((p) => (
          <Card key={p.id} row={p} busy={busyId === p.id && pending}>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(p.id, () => publishPost(p.id))}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 px-3.5 py-2 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              Yayınla + çevir
            </button>
            <IconBtn onClick={() => run(p.id, () => removePost(p.id))} disabled={pending} title="Sil">
              <Trash2 className="h-3.5 w-3.5" />
            </IconBtn>
          </Card>
        ))}
      </Section>

      <Section title="Yayında" empty="Henüz yayınlanmış yazı yok.">
        {published.map((p) => (
          <Card key={p.id} row={p} busy={busyId === p.id && pending}>
            <IconBtn onClick={() => run(p.id, () => unpublishPost(p.id))} disabled={pending} title="Yayından kaldır">
              <Undo2 className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn onClick={() => run(p.id, () => removePost(p.id))} disabled={pending} title="Sil (çevirilerle birlikte)">
              <Trash2 className="h-3.5 w-3.5" />
            </IconBtn>
          </Card>
        ))}
      </Section>
    </div>
  );
}

function Section({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const items = Array.isArray(children) ? children : [children];
  const has = items.filter(Boolean).length > 0;
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{title}</h2>
      {has ? <div className="space-y-2">{children}</div> : <p className="text-sm text-white/35">{empty}</p>}
    </section>
  );
}

function Card({
  row,
  busy,
  children,
}: {
  row: Row;
  busy: boolean;
  children: React.ReactNode;
}) {
  return (
    <article className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div
        className="h-14 w-20 shrink-0 rounded-lg bg-gradient-to-br from-violet-500/30 to-cyan-500/20 bg-cover bg-center"
        style={row.cover_url ? { backgroundImage: `url(${row.cover_url})` } : undefined}
      />
      <div className="min-w-[240px] flex-1">
        <p className="font-medium text-white">{row.title}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-white/45">{row.excerpt}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-white/35">
          <span>{fmt(row.published_at ?? row.created_at)}</span>
          <span>· {row.reading_min} dk</span>
          {row.translationCount > 0 && (
            <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-emerald-300">
              +{row.translationCount} çeviri
            </span>
          )}
          {row.source === "deepseek" && (
            <span className="rounded-full bg-violet-400/10 px-2 py-0.5 text-violet-200">otomatik</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={row.previewHref}
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/55 transition hover:bg-white/[0.06] hover:text-white"
          title="Önizle"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        {busy ? <Loader2 className="h-4 w-4 animate-spin text-white/50" /> : children}
      </div>
    </article>
  );
}

function IconBtn({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/55 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-40"
    >
      {children}
    </button>
  );
}
