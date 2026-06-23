import { createClient } from "@/lib/supabase/server";
import { getAdminLocale } from "@/lib/admin/locale";
import { InlineEditor, type EditorField } from "@/components/admin/InlineEditor";
import { create, update, remove } from "./actions";

export const metadata = { title: "Chatbot" };

const fields: EditorField[] = [
  {
    name: "question",
    label: "Soru / Etiket",
    required: true,
    full: true,
    hint: "Sohbet açıldığında hızlı öneri olarak da görünür.",
  },
  {
    name: "keywords",
    label: "Anahtar kelimeler (her satıra bir tane)",
    type: "textarea",
    rows: 4,
    full: true,
    hint: "Kullanıcının mesajında bu kelimelerden biri geçerse bu cevap verilir. Ne kadar çok eş anlamlı eklersen o kadar iyi.",
  },
  {
    name: "answer",
    label: "Cevap",
    type: "textarea",
    rows: 5,
    required: true,
    full: true,
  },
  { name: "sort_order", label: "Sıra", type: "number" },
  { name: "active", label: "Durum", type: "checkbox", hint: "Aktif" },
];

export default async function ChatRulesPage() {
  const supabase = await createClient();
  const locale = await getAdminLocale();
  const { data: items = [] } = await supabase
    .from("chat_rules")
    .select("*")
    .eq("locale", locale)
    .order("sort_order");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Chatbot</h1>
        <p className="text-sm text-white/55">
          Soru-cevap kuralları — bot cevapları yapay zekâ olmadan buradan alır.
          Kullanıcının yazdığı kelimeler anahtar kelimelerle eşleşirse ilgili
          cevap gösterilir.
        </p>
      </header>
      <InlineEditor
        items={(items ?? []).map((i) => ({
          ...i,
          keywords: Array.isArray(i.keywords) ? i.keywords.join("\n") : "",
          _title: i.question,
          _subtitle: i.answer.slice(0, 100) + (i.answer.length > 100 ? "…" : ""),
        }))}
        fields={fields}
        actions={{ create, update, remove }}
        newItemDefaults={{ active: true, sort_order: 0 }}
      />
    </div>
  );
}
