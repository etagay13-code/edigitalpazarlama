export type Industry = {
  name: string;
  description: string;
  highlights: string[];
};

export const industries: Industry[] = [
  {
    name: "E-ticaret & D2C",
    description:
      "Shopify, WooCommerce ve özel mağaza altyapılarıyla beslenen markalar için satış odaklı funnel'lar kuruyoruz.",
    highlights: ["+50 D2C markası", "ROAS odaklı"],
  },
  {
    name: "SaaS & Yazılım",
    description:
      "MRR büyütmek için lifecycle e-mail, ürün-led büyüme ve SEO + paid kombinasyonu.",
    highlights: ["ARR x3 vakaları", "Self-serve onboarding"],
  },
  {
    name: "Fintech",
    description:
      "Hassas reglüsyonlu sektörde yaratıcı kampanyalar — bireysel finanstan dijital cüzdana.",
    highlights: ["KYC funnel", "Trust-first kreatif"],
  },
  {
    name: "Sağlık & Sağlık Turizmi",
    description:
      "Estetik kliniklerden saç ekimine kadar çok dilli lead generation kampanyaları.",
    highlights: ["Çok dilli landing", "Lead kalitesi optimizasyonu"],
  },
  {
    name: "Eğitim & Kariyer",
    description:
      "Online kurslar, bootcamp'ler ve B2B eğitim platformları için satış funnel'ları.",
    highlights: ["Webinar funnel", "Topluluk kurma"],
  },
  {
    name: "B2B & Endüstri",
    description:
      "Uzun satış döngülü B2B markalar için LinkedIn, içerik pazarlaması ve ABM stratejileri.",
    highlights: ["ABM", "LinkedIn organic"],
  },
];

export type Tech = { name: string; category: string };
export const techStack: Tech[] = [
  { name: "Next.js", category: "Frontend" },
  { name: "React Native", category: "Mobil" },
  { name: "Node.js", category: "Backend" },
  { name: "PostgreSQL", category: "Veritabanı" },
  { name: "Vercel", category: "Hosting" },
  { name: "Cloudflare", category: "CDN/DNS" },
  { name: "Stripe", category: "Ödeme" },
  { name: "Supabase", category: "Backend-as-a-Service" },
  { name: "Google Ads", category: "Reklam" },
  { name: "Meta Ads", category: "Reklam" },
  { name: "TikTok Ads", category: "Reklam" },
  { name: "GA4", category: "Analytics" },
  { name: "Looker Studio", category: "Reporting" },
  { name: "Ahrefs", category: "SEO" },
  { name: "Semrush", category: "SEO" },
  { name: "Figma", category: "Tasarım" },
  { name: "Notion", category: "İş Birliği" },
  { name: "Linear", category: "Proje Yönetimi" },
  { name: "Slack", category: "İletişim" },
  { name: "OpenAI", category: "AI" },
  { name: "Anthropic", category: "AI" },
];
