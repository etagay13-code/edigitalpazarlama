import { createClient } from "@/lib/supabase/server";
import { getAdminLocale } from "@/lib/admin/locale";
import { InlineEditor, type EditorField } from "@/components/admin/InlineEditor";
import { create, update, remove } from "./actions";

export const metadata = { title: "Tech Stack" };

const fields: EditorField[] = [
  { name: "name", label: "Araç adı", required: true, placeholder: "Next.js" },
  { name: "category", label: "Kategori", placeholder: "Frontend / Reklam / vb." },
  { name: "sort_order", label: "Sıra", type: "number" },
];

export default async function TechPage() {
  const supabase = await createClient();
  const locale = await getAdminLocale();
  const { data: items = [] } = await supabase
    .from("tech_items")
    .select("*")
    .eq("locale", locale)
    .order("sort_order");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Tech Stack</h1>
        <p className="text-sm text-white/55">
          Hizmetler sayfasındaki araç chip'leri
        </p>
      </header>
      <InlineEditor
        items={(items ?? []).map((i) => ({
          ...i,
          _title: i.name,
          _subtitle: i.category ?? "",
        }))}
        fields={fields}
        actions={{ create, update, remove }}
        newItemDefaults={{ sort_order: 0 }}
      />
    </div>
  );
}
