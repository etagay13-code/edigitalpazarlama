"use client";

import { useState } from "react";
import {
  Save,
  Loader2,
  Check,
  AlertCircle,
  Trash2,
  Plus,
  Pencil,
  X,
} from "lucide-react";

export type EditorField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "array" | "checkbox" | "color" | "json";
  rows?: number;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  full?: boolean;
  monospace?: boolean;
  hint?: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

export type EditorItem = {
  id: string;
  _title: string;
  _subtitle?: string;
} & Record<string, unknown>;

type Actions = {
  create: (data: FormData) => Promise<{ ok: boolean; error?: string }>;
  update: (
    id: string,
    data: FormData,
  ) => Promise<{ ok: boolean; error?: string }>;
  remove: (id: string) => Promise<{ ok: boolean; error?: string }>;
};

export function InlineEditor({
  items,
  fields,
  actions,
  newItemDefaults = {},
  emptyHint = "Henüz öğe yok. '+ Yeni' ile başla.",
}: {
  items: EditorItem[];
  fields: EditorField[];
  actions: Actions;
  newItemDefaults?: Record<string, unknown>;
  emptyHint?: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="space-y-3">
      {showNew && (
        <ItemRow
          item={{ id: "__new__", ...newItemDefaults } as EditorItem}
          fields={fields}
          mode="create"
          onCreate={actions.create}
          onCancel={() => setShowNew(false)}
        />
      )}

      <button
        type="button"
        onClick={() => setShowNew((v) => !v)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white/65 transition hover:border-violet-400/40 hover:text-white"
      >
        {showNew ? (
          <>
            <X className="h-4 w-4" /> İptal
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" /> Yeni Ekle
          </>
        )}
      </button>

      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          fields={fields}
          mode={editingId === item.id ? "edit" : "view"}
          onEdit={() => setEditingId(item.id)}
          onCancel={() => setEditingId(null)}
          onUpdate={actions.update}
          onDelete={actions.remove}
        />
      ))}

      {items.length === 0 && !showNew && (
        <p className="py-12 text-center text-sm text-white/45">{emptyHint}</p>
      )}
    </div>
  );
}

function ItemRow({
  item,
  fields,
  mode,
  onEdit,
  onCancel,
  onCreate,
  onUpdate,
  onDelete,
}: {
  item: EditorItem;
  fields: EditorField[];
  mode: "view" | "edit" | "create";
  onEdit?: () => void;
  onCancel?: () => void;
  onCreate?: (data: FormData) => Promise<{ ok: boolean; error?: string }>;
  onUpdate?: (
    id: string,
    data: FormData,
  ) => Promise<{ ok: boolean; error?: string }>;
  onDelete?: (id: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [deleting, setDeleting] = useState(false);

  if (mode === "view") {
    const title = item._title ?? "—";
    const subtitle = item._subtitle;
    return (
      <div className="card flex items-center gap-4 py-4">
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium text-white">{title}</p>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-white/55">{subtitle}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/75 transition hover:bg-white/[0.07] hover:text-white"
        >
          <Pencil className="h-3 w-3" />
          Düzenle
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ kind: "saving" });
    const fd = new FormData(e.currentTarget);
    // Checkbox-able fields need explicit handling
    fields.forEach((f) => {
      if (f.type === "checkbox" && fd.get(f.name) !== "on") {
        fd.set(f.name, "false");
      } else if (f.type === "checkbox") {
        fd.set(f.name, "true");
      }
    });

    const result =
      mode === "create"
        ? await onCreate?.(fd)
        : await onUpdate?.(item.id, fd);

    if (result?.ok) {
      setStatus({ kind: "saved" });
      if (mode === "edit") setTimeout(() => onCancel?.(), 600);
      if (mode === "create") {
        onCancel?.();
      }
    } else {
      setStatus({
        kind: "error",
        message: result?.error ?? "Bilinmeyen hata",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu öğe silinsin mi?")) return;
    setDeleting(true);
    const result = await onDelete?.(item.id);
    if (!result?.ok) {
      alert(result?.error ?? "Silinemedi");
      setDeleting(false);
    }
  };

  const saving = status.kind === "saving";

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <FieldRenderer key={field.name} field={field} item={item} />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-4">
        <StatusBadge status={status} />
        <div className="flex items-center gap-2">
          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/65 transition hover:bg-rose-500/15 hover:text-rose-200 disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
              Sil
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/65 transition hover:bg-white/[0.07] hover:text-white"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {mode === "create" ? "Ekle" : "Kaydet"}
          </button>
        </div>
      </div>
    </form>
  );
}

function FieldRenderer({
  field,
  item,
}: {
  field: EditorField;
  item: EditorItem;
}) {
  const raw = item[field.name];
  const defaultValue = raw == null ? "" : String(raw);
  const cls = `w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/15 placeholder:text-white/30 ${
    field.monospace ? "font-mono" : ""
  }`;

  return (
    <label className={`block ${field.full ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
        {field.label}
      </span>
      {field.type === "textarea" ? (
        <textarea
          name={field.name}
          defaultValue={defaultValue}
          rows={field.rows ?? 3}
          required={field.required}
          placeholder={field.placeholder}
          className={`${cls} resize-y`}
        />
      ) : field.type === "select" ? (
        <select
          name={field.name}
          defaultValue={defaultValue}
          required={field.required}
          className={cls}
        >
          {field.options?.map((o) => (
            <option key={o.value} value={o.value} className="bg-ink-900">
              {o.label}
            </option>
          ))}
        </select>
      ) : field.type === "checkbox" ? (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
          <input
            type="checkbox"
            name={field.name}
            defaultChecked={raw === true || raw === "true"}
            className="h-4 w-4 accent-violet-500"
          />
          <span className="text-sm text-white/75">{field.hint ?? "Aktif"}</span>
        </label>
      ) : field.type === "color" ? (
        <ColorPickerInput name={field.name} defaultValue={defaultValue} />
      ) : field.type === "array" ? (
        <textarea
          name={field.name}
          defaultValue={
            Array.isArray(raw) ? (raw as string[]).join("\n") : defaultValue
          }
          rows={field.rows ?? 3}
          placeholder={field.placeholder ?? "Her satıra bir madde"}
          className={`${cls} resize-y`}
        />
      ) : field.type === "json" ? (
        <textarea
          name={field.name}
          defaultValue={
            raw == null ? "" : typeof raw === "string" ? raw : JSON.stringify(raw, null, 2)
          }
          rows={field.rows ?? 14}
          placeholder={field.placeholder ?? '{"items": [...]}'}
          className={`${cls} resize-y font-mono`}
          spellCheck={false}
        />
      ) : (
        <input
          name={field.name}
          type={field.type ?? "text"}
          defaultValue={defaultValue}
          required={field.required}
          placeholder={field.placeholder}
          className={cls}
        />
      )}
      {field.hint && field.type !== "checkbox" && (
        <p className="mt-1.5 text-[11px] text-white/40">{field.hint}</p>
      )}
    </label>
  );
}

function ColorPickerInput({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: string;
}) {
  const [val, setVal] = useState(defaultValue || "#7C5CFF");
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2">
      <input
        type="color"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="h-10 w-12 cursor-pointer rounded-lg border-0 bg-transparent"
      />
      <input
        type="text"
        name={name}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="flex-1 bg-transparent font-mono text-sm text-white outline-none"
      />
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status.kind === "saved")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200">
        <Check className="h-3 w-3" />
        Tamam
      </span>
    );
  if (status.kind === "error")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-500/10 px-2.5 py-1 text-xs text-rose-200">
        <AlertCircle className="h-3 w-3" />
        {status.message.slice(0, 60)}
      </span>
    );
  return null;
}
