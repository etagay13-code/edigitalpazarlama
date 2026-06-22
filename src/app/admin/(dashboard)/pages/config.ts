// Sayfa İçerikleri ekranı için ortak yapılandırma.
// "use client" YOK — hem server page.tsx hem client PagesEditor buradan okur.
// (Veri/dizileri client modülünden server'a import etmek çalışmaz; bu yüzden ayrı dosya.)
import type { EditorField } from "@/components/admin/InlineEditor";

export const pageOptions = [
  { value: "home", label: "Anasayfa" },
  { value: "about", label: "Hakkımızda" },
  { value: "services", label: "Hizmetler" },
  { value: "portfolio", label: "Portfolyo" },
  { value: "contact", label: "İletişim" },
  { value: "global", label: "Genel (tüm sayfalar)" },
];

export const fields: EditorField[] = [
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
