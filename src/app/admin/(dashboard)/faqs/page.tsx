import { createClient } from "@/lib/supabase/server";
import { getAdminLocale } from "@/lib/admin/locale";
import { InlineEditor, type EditorField } from "@/components/admin/InlineEditor";
import { create, update, remove } from "./actions";

export const metadata = { title: "SSS" };

const scopeOptions = [
  { value: "home", label: "Anasayfa" },
  { value: "services", label: "Hizmetler sayfası" },
  { value: "contact", label: "İletişim sayfası" },
  { value: "about", label: "Hakkımızda" },
  { value: "portfolio", label: "Portfolyo" },
];

const fields: EditorField[] = [
  { name: "scope", label: "Hangi sayfa?", type: "select", options: scopeOptions, required: true },
  { name: "sort_order", label: "Sıra", type: "number" },
  { name: "question", label: "Soru", required: true, full: true },
  { name: "answer", label: "Cevap", type: "textarea", rows: 4, required: true, full: true },
  { name: "active", label: "Durum", type: "checkbox", hint: "Aktif" },
];

export default async function FaqsPage() {
  const supabase = await createClient();
  const locale = await getAdminLocale();
  const { data: items = [] } = await supabase
    .from("faqs")
    .select("*")
    .eq("locale", locale)
    .order("scope")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">SSS</h1>
        <p className="text-sm text-white/55">
          Sık sorulan sorular — her soru bir sayfaya bağlanır
        </p>
      </header>
      <InlineEditor
        items={(items ?? []).map((i) => ({
          ...i,
          _title: `[${scopeOptions.find((o) => o.value === i.scope)?.label ?? i.scope}] ${i.question}`,
          _subtitle:
            i.answer.slice(0, 100) + (i.answer.length > 100 ? "…" : ""),
        }))}
        fields={fields}
        actions={{ create, update, remove }}
        newItemDefaults={{ active: true, sort_order: 0, scope: "home" }}
      />
    </div>
  );
}
