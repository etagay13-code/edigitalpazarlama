"use client";

import { InlineEditor, type EditorField, type EditorItem } from "@/components/admin/InlineEditor";
import { SectionBodyEditor } from "@/components/admin/SectionBodyEditor";
import { create, update, remove } from "./actions";

const pageOptions = [
  { value: "home", label: "Anasayfa" },
  { value: "about", label: "Hakkımızda" },
  { value: "services", label: "Hizmetler" },
  { value: "portfolio", label: "Portfolyo" },
  { value: "contact", label: "İletişim" },
  { value: "global", label: "Genel (tüm sayfalar)" },
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

export function PagesEditor({ items }: { items: EditorItem[] }) {
  return (
    <InlineEditor
      items={items}
      fields={fields}
      actions={{ create, update, remove }}
      newItemDefaults={{ page_slug: "about", section_key: "", sort_order: 0 }}
      customFieldRender={(field, item) => {
        if (field.name === "body") {
          return (
            <SectionBodyEditor
              name="body"
              pageSlug={
                typeof item.page_slug === "string" ? item.page_slug : null
              }
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
  );
}

export { pageOptions };
