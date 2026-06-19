"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { DynamicIcon } from "@/components/DynamicIcon";
import {
  COMPLEX_SECTIONS,
  ICON_NAMES,
  STRING_LIST_SECTIONS,
  getSchema,
  type ItemFieldDef,
} from "@/lib/admin/section-schemas";

type Body = unknown;

type Props = {
  name: string; // hidden input name (e.g. "body")
  sectionKey: string | null | undefined;
  initialBody: Body;
};

// items array'i veya string array veya kompleks objeyi destekler.
export function SectionBodyEditor({ name, sectionKey, initialBody }: Props) {
  const schema = getSchema(sectionKey ?? undefined);
  const isStringList = sectionKey ? STRING_LIST_SECTIONS.has(sectionKey) : false;
  const isComplex = sectionKey ? COMPLEX_SECTIONS.has(sectionKey) : false;

  // Kompleks veya tanınmayan section_key → JSON textarea fallback
  if (!schema && !isStringList) {
    return (
      <JsonFallback name={name} initialBody={initialBody} complex={isComplex} />
    );
  }

  if (isStringList) {
    return <StringListEditor name={name} initialBody={initialBody} />;
  }

  return <ItemsEditor name={name} schema={schema!} initialBody={initialBody} />;
}

// ----------------------------------------------------------------------------
// Items array editor (object item'lı section'lar için)
// ----------------------------------------------------------------------------

type ItemRecord = Record<string, unknown>;

function ItemsEditor({
  name,
  schema,
  initialBody,
}: {
  name: string;
  schema: NonNullable<ReturnType<typeof getSchema>>;
  initialBody: Body;
}) {
  const initialItems = useMemo<ItemRecord[]>(() => {
    const body = initialBody as { items?: unknown } | null;
    if (body && Array.isArray(body.items)) {
      return body.items.filter(
        (x): x is ItemRecord => x !== null && typeof x === "object",
      );
    }
    return [];
  }, [initialBody]);

  const [items, setItems] = useState<ItemRecord[]>(initialItems);

  const update = (i: number, key: string, value: unknown) => {
    setItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)),
    );
  };

  const add = () =>
    setItems((prev) => [...prev, { ...schema.newItemTemplate }]);

  const remove = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    setItems((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <input
        type="hidden"
        name={name}
        value={JSON.stringify({ items })}
        readOnly
      />

      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-white/45">
          Henüz {schema.itemLabel.toLowerCase()} yok. Aşağıdan ekleyebilirsin.
        </div>
      )}

      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              {schema.itemLabel} #{i + 1}
            </span>
            <div className="flex items-center gap-1">
              <IconBtn
                title="Yukarı"
                onClick={() => move(i, -1)}
                disabled={i === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </IconBtn>
              <IconBtn
                title="Aşağı"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </IconBtn>
              <IconBtn
                title="Sil"
                onClick={() => remove(i)}
                danger
              >
                <Trash2 className="h-4 w-4" />
              </IconBtn>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {schema.fields.map((f) => (
              <ItemField
                key={f.name}
                field={f}
                value={item[f.name]}
                onChange={(v) => update(i, f.name, v)}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white"
      >
        <Plus className="h-4 w-4" />
        {schema.itemLabel} ekle
      </button>
    </div>
  );
}

function ItemField({
  field,
  value,
  onChange,
}: {
  field: ItemFieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const cls =
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05] placeholder:text-white/30";

  const labelEl = (
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
      {field.label}
    </span>
  );

  const isFull = field.type === "textarea";

  if (field.type === "icon") {
    const v = typeof value === "string" ? value : "";
    return (
      <label className="block">
        {labelEl}
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04]">
            <DynamicIcon name={v} className="h-4 w-4 text-violet-300" />
          </div>
          <select
            value={v}
            onChange={(e) => onChange(e.target.value)}
            className={cls}
          >
            <option value="" className="bg-ink-900">
              (ikon yok)
            </option>
            {ICON_NAMES.map((n) => (
              <option key={n} value={n} className="bg-ink-900">
                {n}
              </option>
            ))}
          </select>
        </div>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className={`block ${isFull ? "sm:col-span-2" : ""}`}>
        {labelEl}
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={3}
          className={`${cls} resize-y`}
        />
      </label>
    );
  }

  if (field.type === "number") {
    const num = typeof value === "number" ? value : Number(value ?? 0);
    return (
      <label className="block">
        {labelEl}
        <input
          type="number"
          value={Number.isFinite(num) ? num : 0}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={field.placeholder}
          step="any"
          className={cls}
        />
      </label>
    );
  }

  return (
    <label className="block">
      {labelEl}
      <input
        type="text"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={cls}
      />
    </label>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`grid h-7 w-7 place-items-center rounded-lg border transition disabled:opacity-30 ${
        danger
          ? "border-red-400/20 text-red-300 hover:border-red-400/50 hover:bg-red-500/10"
          : "border-white/10 text-white/60 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// ----------------------------------------------------------------------------
// String list editor (her item düz string — örn. portfolio/sectors)
// ----------------------------------------------------------------------------

function StringListEditor({
  name,
  initialBody,
}: {
  name: string;
  initialBody: Body;
}) {
  const initial = useMemo<string[]>(() => {
    const body = initialBody as { items?: unknown } | null;
    if (body && Array.isArray(body.items)) {
      return body.items.filter((x): x is string => typeof x === "string");
    }
    return [];
  }, [initialBody]);

  const [text, setText] = useState(initial.join("\n"));
  const items = text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2">
      <input
        type="hidden"
        name={name}
        value={JSON.stringify({ items })}
        readOnly
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder={"E-ticaret\nSaaS\nFintech\n..."}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05] placeholder:text-white/30"
      />
      <p className="text-[11px] text-white/40">
        Her satıra bir madde yaz. Boş satırlar atılır. ({items.length} madde)
      </p>
    </div>
  );
}

// ----------------------------------------------------------------------------
// JSON fallback (kompleks / tanınmayan section'lar için)
// ----------------------------------------------------------------------------

function JsonFallback({
  name,
  initialBody,
  complex,
}: {
  name: string;
  initialBody: Body;
  complex: boolean;
}) {
  const initialText =
    initialBody == null
      ? ""
      : typeof initialBody === "string"
        ? initialBody
        : JSON.stringify(initialBody, null, 2);

  const [text, setText] = useState(initialText);

  return (
    <div className="space-y-2">
      <textarea
        name={name}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={14}
        spellCheck={false}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05] placeholder:text-white/30"
      />
      <p className="text-[11px] text-amber-300/70">
        {complex
          ? "Bu section'ın yapısı özel olduğu için JSON düzenleyicide kalıyor."
          : "Bu section_key için yapılandırılmış editör yok — JSON modunda düzenleniyor."}
      </p>
    </div>
  );
}
