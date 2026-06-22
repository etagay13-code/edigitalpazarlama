import { createClient } from "@/lib/supabase/server";
import { getAdminLocale } from "@/lib/admin/locale";
import { InlineEditor, type EditorField } from "@/components/admin/InlineEditor";
import { create, update, remove } from "./actions";

export const metadata = { title: "Zaman Çizelgesi" };

const fields: EditorField[] = [
  { name: "year", label: "Yıl", required: true, placeholder: "2024" },
  { name: "sort_order", label: "Sıra", type: "number" },
  { name: "title", label: "Başlık", required: true, full: true },
  { name: "description", label: "Açıklama", type: "textarea", rows: 3, required: true, full: true },
  { name: "active", label: "Durum", type: "checkbox", hint: "Aktif" },
];

export default async function TimelinePage() {
  const supabase = await createClient();
  const locale = await getAdminLocale();
  const { data: items = [] } = await supabase
    .from("timeline_events")
    .select("*")
    .eq("locale", locale)
    .order("sort_order");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Zaman Çizelgesi</h1>
        <p className="text-sm text-white/55">
          Hakkımızda sayfasındaki yol haritası
        </p>
      </header>
      <InlineEditor
        items={(items ?? []).map((i) => ({
          ...i,
          _title: `${i.year} — ${i.title}`,
          _subtitle:
            i.description.slice(0, 100) + (i.description.length > 100 ? "…" : ""),
        }))}
        fields={fields}
        actions={{ create, update, remove }}
        newItemDefaults={{ active: true, sort_order: 0 }}
      />
    </div>
  );
}
