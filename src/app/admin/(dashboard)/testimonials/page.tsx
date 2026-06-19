import { createClient } from "@/lib/supabase/server";
import { InlineEditor, type EditorField } from "@/components/admin/InlineEditor";
import { create, update, remove } from "./actions";

export const metadata = { title: "Yorumlar" };

const fields: EditorField[] = [
  { name: "name", label: "Ad Soyad", required: true },
  { name: "initials", label: "Baş harfler", placeholder: "ET" },
  { name: "role", label: "Rol" },
  { name: "company", label: "Şirket" },
  { name: "quote", label: "Yorum", type: "textarea", rows: 4, required: true, full: true },
  { name: "sort_order", label: "Sıra", type: "number" },
  { name: "active", label: "Durum", type: "checkbox", hint: "Aktif" },
];

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const { data: items = [] } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Müşteri Yorumları</h1>
        <p className="text-sm text-white/55">
          Anasayfa ve portfolyo sayfasında görünen referanslar
        </p>
      </header>
      <InlineEditor
        items={(items ?? []).map((i) => ({
          ...i,
          _title: `${i.name}${i.company ? ` · ${i.company}` : ""}`,
          _subtitle: i.quote.slice(0, 100) + (i.quote.length > 100 ? "…" : ""),
        }))}
        fields={fields}
        actions={{ create, update, remove }}
        newItemDefaults={{ active: true, sort_order: 0 }}
      />
    </div>
  );
}
