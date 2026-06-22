// Navigasyon route'ları — etiketler dile göre sözlükten (dict.nav) gelir.
// `internal` kanonik (Türkçe) yoldur; href localizeHref ile dile göre üretilir.
export const navLinks = [
  { key: "home", internal: "/" },
  { key: "about", internal: "/hakkimizda" },
  { key: "services", internal: "/hizmetler" },
  { key: "portfolio", internal: "/portfolyo" },
  { key: "contact", internal: "/iletisim" },
] as const;

export type NavKey = (typeof navLinks)[number]["key"];
