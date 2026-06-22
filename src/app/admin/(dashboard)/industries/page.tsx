import { createClient } from "@/lib/supabase/server";
import { getAdminLocale } from "@/lib/admin/locale";
import { InlineEditor, type EditorField } from "@/components/admin/InlineEditor";
import { create, update, remove } from "./actions";

export const metadata = { title: "Sektörler" };

const fields: EditorField[] = [
  { name: "name", label: "Sektör adı", required: true },
  { name: "sort_order", label: "Sıra", type: "number" },
  { name: "description", label: "Açıklama", type: "textarea", rows: 3, full: true },
  { name: "highlights", label: "Vurgular", type: "array", rows: 3, full: true, hint: "Her satıra bir vurgu" },
  { name: "active", label: "Durum", type: "checkbox", hint: "Aktif" },
];

export default async function IndustriesPage() {
  const supabase = await createClient();
  const locale = await getAdminLocale();
  const { data: items = [] } = await supabase
    .from("industries")
    .select("*")
    .eq("locale", locale)
    .order("sort_order");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Sektörler</h1>
        <p className="text-sm text-white/55">
          Hizmetler ve portfolyo sayfasında listelenir
        </p>
      </header>
      <InlineEditor
        items={(items ?? []).map((i) => ({
          ...i,
          _title: i.name,
          _subtitle: (i.description ?? "").slice(0, 100),
        }))}
        fields={fields}
        actions={{ create, update, remove }}
        newItemDefaults={{ active: true, sort_order: 0, highlights: [] }}
      />
    </div>
  );
}
