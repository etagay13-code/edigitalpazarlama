import { createClient } from "@/lib/supabase/server";
import { InlineEditor, type EditorField } from "@/components/admin/InlineEditor";
import { SectionBodyEditor } from "@/components/admin/SectionBodyEditor";
import { create, update, remove } from "./actions";

export const metadata = { title: "Sayfa İçerikleri" };

const pageOptions = [
  { value: "home", label: "Anasayfa" },
  { value: "about", label: "Hakkımızda" },
  { value: "services", label: "Hizmetler" },
  { value: "portfolio", label: "Portfolyo" },
  { value: "contact", label: "İletişim" },
];

const fields: EditorField[] = [
  {
    name: "page_slug",
    label: "Sayfa",
    type: "select",
    options: pageOptions,
    required: true,
  },
  {
    name: "section_key",
    label: "Section key",
    required: true,
    monospace: true,
    placeholder: "values, culture, pricing, ...",
    hint: "Sayfada bu key ile referans edilir.",
  },
  { name: "eyebrow", label: "Üst başlık (eyebrow)", placeholder: "Değerlerimiz" },
  { name: "title", label: "Başlık", full: true, placeholder: "Bizi biz yapan altı disiplin" },
  {
    name: "description",
    label: "Açıklama",
    type: "textarea",
    rows: 3,
    full: true,
  },
  {
    name: "body",
    label: "İçerik (kartlar / liste)",
    type: "json",
    full: true,
  },
  { name: "sort_order", label: "Sıra", type: "number" },
];

export default async function PagesContentPage() {
  const supabase = await createClient();
  const { data: items = [] } = await supabase
    .from("page_sections")
    .select("*")
    .order("page_slug")
    .order("sort_order");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Sayfa İçerikleri</h1>
        <p className="text-sm text-white/55">
          Public sayfalardaki kart / liste içerikleri. Her bölümü buradan
          düzenleyince site otomatik güncellenir.
        </p>
      </header>
      <InlineEditor
        items={(items ?? []).map((i) => ({
          ...i,
          _title: `[${pageOptions.find((o) => o.value === i.page_slug)?.label ?? i.page_slug}] ${i.section_key}${i.title ? " — " + i.title : ""}`,
          _subtitle: (i.description ?? "").slice(0, 100),
        }))}
        fields={fields}
        actions={{ create, update, remove }}
        newItemDefaults={{ page_slug: "about", section_key: "", sort_order: 0 }}
        customFieldRender={(field, item) => {
          if (field.name === "body") {
            return (
              <SectionBodyEditor
                name="body"
                sectionKey={
                  typeof item.section_key === "string" ? item.section_key : null
                }
                initialBody={item.body}
              />
            );
          }
          return null;
        }}
      />
    </div>
  );
}
