import { createClient } from "@/lib/supabase/server";
import { getAdminLocale } from "@/lib/admin/locale";
import { InlineEditor, type EditorField } from "@/components/admin/InlineEditor";
import { gradientOptions } from "@/lib/admin/icons-list";
import { create, update, remove } from "./actions";

export const metadata = { title: "Portfolyo" };

const categoryOptions = [
  { value: "Reklam", label: "Reklam" },
  { value: "SEO", label: "SEO" },
  { value: "Mobil", label: "Mobil" },
  { value: "SaaS", label: "SaaS" },
  { value: "Web", label: "Web" },
  { value: "Sosyal Medya", label: "Sosyal Medya" },
];

const fields: EditorField[] = [
  { name: "title", label: "Proje başlığı", required: true },
  { name: "slug", label: "Slug", required: true, monospace: true, hint: "URL'de kullanılır" },
  { name: "client", label: "Müşteri", required: true },
  { name: "category", label: "Kategori", type: "select", options: categoryOptions, required: true },
  { name: "metric", label: "Öne çıkan metrik", placeholder: "ROAS 4.8x" },
  { name: "gradient", label: "Gradient (kart arkaplan)", type: "select", options: gradientOptions.map(g => ({ value: g.value, label: g.label })) },
  { name: "description", label: "Açıklama", type: "textarea", rows: 3, required: true, full: true },
  { name: "tags", label: "Etiketler", type: "array", rows: 3, full: true, hint: "Her satıra bir etiket" },
  { name: "image_url", label: "Görsel URL (opsiyonel)", full: true, placeholder: "https://..." },
  { name: "sort_order", label: "Sıra", type: "number" },
  { name: "active", label: "Durum", type: "checkbox", hint: "Aktif" },
];

export default async function PortfolioPage() {
  const supabase = await createClient();
  const locale = await getAdminLocale();
  const { data: items = [] } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("locale", locale)
    .order("sort_order");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Portfolyo</h1>
        <p className="text-sm text-white/55">
          Çalışmalarımız sayfasındaki vakalar
        </p>
      </header>
      <InlineEditor
        items={(items ?? []).map((i) => ({
          ...i,
          _title: `${i.title} — ${i.client ?? ""}`,
          _subtitle: `[${i.category}] ${(i.description ?? "").slice(0, 80)}`,
        }))}
        fields={fields}
        actions={{ create, update, remove }}
        newItemDefaults={{
          active: true,
          sort_order: 0,
          category: "Reklam",
          gradient: "from-violet-500 to-indigo-500",
          tags: [],
        }}
      />
    </div>
  );
}
