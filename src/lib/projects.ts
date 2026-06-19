export type Project = {
  slug: string;
  title: string;
  client: string;
  category: "Reklam" | "SEO" | "Mobil" | "SaaS" | "Web" | "Sosyal Medya";
  description: string;
  metric: string;
  gradient: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    slug: "lumen-cosmetics-roas",
    title: "Lumen Cosmetics — ROAS 4.8x",
    client: "Lumen Cosmetics",
    category: "Reklam",
    description:
      "Meta ve Google'da yeniden yapılandırılan funnel ve creative testing ile 6 ayda satışları 3.4 katına çıkardık.",
    metric: "ROAS 4.8x",
    gradient: "from-fuchsia-500 via-violet-500 to-indigo-500",
    tags: ["Meta Ads", "Google Ads", "CRO"],
  },
  {
    slug: "tessera-saas-mvp",
    title: "Tessera — 8 Haftada MVP",
    client: "Tessera",
    category: "SaaS",
    description:
      "Fikir aşamasından canlıya; Stripe abonelik, AI özetleme ve takım iş birliği özellikleriyle hazır bir SaaS ürünü.",
    metric: "8 hafta",
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    tags: ["Next.js", "Stripe", "OpenAI"],
  },
  {
    slug: "nordel-home-seo",
    title: "Nordel Home — Organik Trafikte 4.6x",
    client: "Nordel Home",
    category: "SEO",
    description:
      "Teknik SEO, konu kümeleri ve link inşası ile organik trafiği 9 ayda 4.6 katına çıkardık. Marka kelimelerinde 1. sıra.",
    metric: "+460%",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    tags: ["Technical SEO", "İçerik", "Linkbuilding"],
  },
  {
    slug: "voltra-mobility-app",
    title: "Voltra Mobility — Mobil Uygulama",
    client: "Voltra",
    category: "Mobil",
    description:
      "Elektrikli scooter operatörü için iOS & Android uygulaması. İlk 90 günde 50K+ indirme.",
    metric: "50K+ indirme",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    tags: ["React Native", "Maps SDK", "Stripe"],
  },
  {
    slug: "vera-moda-tiktok",
    title: "Vera Moda — TikTok Büyüme",
    client: "Vera Moda",
    category: "Sosyal Medya",
    description:
      "Sıfırdan kurgulanan TikTok stratejisi ve influencer iş birlikleri ile 3 ayda 180K organik takipçi.",
    metric: "+180K takipçi",
    gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
    tags: ["TikTok", "UGC", "Influencer"],
  },
  {
    slug: "greenly-foods-web",
    title: "Greenly Foods — E-ticaret Yeniden Tasarımı",
    client: "Greenly Foods",
    category: "Web",
    description:
      "Shopify Plus üzerine inşa edilen yeni alışveriş deneyimi ile dönüşüm oranı %42 arttı, sayfa hızı 1.8 saniyeye düştü.",
    metric: "Dönüşüm +%42",
    gradient: "from-lime-500 via-emerald-500 to-teal-500",
    tags: ["Shopify Plus", "CRO", "UX"],
  },
  {
    slug: "kavros-fintech-app",
    title: "Kavros — Fintech Mobil Uygulaması",
    client: "Kavros",
    category: "Mobil",
    description:
      "Bireysel yatırımcılar için portfolio takip uygulaması. App Store Türkiye finans kategorisinde Top 10.",
    metric: "Top 10",
    gradient: "from-indigo-500 via-violet-500 to-purple-500",
    tags: ["Swift", "Kotlin", "GraphQL"],
  },
  {
    slug: "altan-clinic-ads",
    title: "Altan Clinic — Lead Generation",
    client: "Altan Clinic",
    category: "Reklam",
    description:
      "Sağlık turizmi odaklı çok dilli kampanyalarla CPL %58 düşürüldü, aylık kalifiye lead sayısı 3 katına çıktı.",
    metric: "CPL -%58",
    gradient: "from-sky-500 via-cyan-500 to-blue-500",
    tags: ["Google Ads", "Meta", "Landing Page"],
  },
];

export const projectCategories = [
  "Tümü",
  "Reklam",
  "SEO",
  "Mobil",
  "SaaS",
  "Web",
  "Sosyal Medya",
] as const;
