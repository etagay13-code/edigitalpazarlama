import { createClient } from "@/lib/supabase/server";
import { InlineEditor, type EditorField } from "@/components/admin/InlineEditor";
import { gradientOptions } from "@/lib/admin/icons-list";
import { create, update, remove } from "./actions";

export const metadata = { title: "Ekip" };

const fields: EditorField[] = [
  { name: "name", label: "Ad Soyad", required: true },
  { name: "initials", label: "Baş harfler", placeholder: "ET" },
  { name: "role", label: "Rol", placeholder: "Kurucu / Strateji Direktörü" },
  {
    name: "accent",
    label: "Gradient (avatar)",
    type: "select",
    options: gradientOptions.map((g) => ({ value: g.value, label: g.label })),
  },
  { name: "bio", label: "Biyografi", type: "textarea", rows: 4, full: true },
  { name: "avatar_url", label: "Avatar URL (opsiyonel)", placeholder: "https://...", full: true },
  { name: "sort_order", label: "Sıra", type: "number" },
  { name: "active", label: "Durum", type: "checkbox", hint: "Aktif" },
];

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: items = [] } = await supabase
    .from("team_members")
    .select("*")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Ekip</h1>
        <p className="text-sm text-white/55">
          Hakkımızda sayfasındaki ekip üyeleri
        </p>
      </header>
      <InlineEditor
        items={(items ?? []).map((i) => ({
          ...i,
          _title: `${i.name}${i.role ? ` · ${i.role}` : ""}`,
          _subtitle: (i.bio ?? "").slice(0, 100),
        }))}
        fields={fields}
        actions={{ create, update, remove }}
        newItemDefaults={{
          active: true,
          sort_order: 0,
          accent: "from-violet-500 to-indigo-500",
        }}
      />
    </div>
  );
}
