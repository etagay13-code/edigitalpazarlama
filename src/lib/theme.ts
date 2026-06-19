// Markayla ilgili tüm sabitler burada — tek noktadan değiştir, tüm site güncellensin.
export const brand = {
  name: "E - Digital Marketing",
  shortName: "E-Digital",
  founder: "Emre Tagay",
  tagline: "A'dan Z'ye Dijital Büyüme Ortağınız",
  description:
    "Reklamdan SEO'ya, mobil uygulamadan SaaS geliştirmeye kadar markanızı ölçeklendiren 360° dijital pazarlama ajansı.",
  url: "https://edigitalmarketing.com",
  email: "info@edigitalmarketing.com",
  phone: "+90 555 000 00 00",
  address: "İstanbul, Türkiye",
  socials: {
    instagram: "https://instagram.com/edigitalmarketing",
    linkedin: "https://linkedin.com/company/edigitalmarketing",
    twitter: "https://twitter.com/edigitalmkt",
    youtube: "https://youtube.com/@edigitalmarketing",
  },
  // Tek noktadan tema rengi — tailwind.config.ts ile uyumlu tut.
  colors: {
    bg: "#0A0A0B",
    accent: "#7C5CFF",
    accentSecondary: "#22D3EE",
  },
} as const;

export type Brand = typeof brand;
