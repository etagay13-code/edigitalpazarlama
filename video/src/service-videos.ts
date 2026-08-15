// 8 hizmetin Instagram video içerikleri — site verisinden (kısa açıklama + özellikler).
export type Showcase = "ads" | "seo" | "social" | "web" | "list";

export type ServiceVideoConfig = {
  id: string; // kompozisyon id (boşluksuz)
  slug: string; // dosya adı
  title: string;
  highlight: string;
  short: string;
  showcase: Showcase;
  features: string[]; // list showcase için (4 madde)
  outroTitle: string;
  outroHighlight: string;
  cta: string;
};

export const SERVICE_VIDEOS: ServiceVideoConfig[] = [
  {
    id: "HizmetDijital360",
    slug: "hizmet-360-dijital-pazarlama",
    title: "360° Dijital Pazarlama",
    highlight: "360°",
    short: "Strateji, üretim ve performans tek çatı altında.",
    showcase: "list",
    features: [
      "Çok kanallı pazarlama planı (paid + organic)",
      "Marka konumlandırma & mesaj mimarisi",
      "Canlı performans dashboard'u",
      "Tek temsilciyle 360° koordinasyon",
    ],
    outroTitle: "Tüm dijitalini tek ekibe emanet et",
    outroHighlight: "tek ekibe",
    cta: "Ücretsiz Strateji Görüşmesi",
  },
  {
    id: "HizmetReklam",
    slug: "hizmet-reklam-yonetimi",
    title: "Reklam Yönetimi",
    highlight: "Reklam",
    short: "Google, Meta ve TikTok'ta performans odaklı medya satın alma.",
    showcase: "ads",
    features: [
      "Google, Meta & TikTok reklamları",
      "Dönüşüm takibi & GA4 kurulumu",
      "Haftalık kreatif iterasyonu",
      "Server-side Conversion API",
    ],
    outroTitle: "Reklam bütçen kazanca dönüşsün",
    outroHighlight: "kazanca",
    cta: "Ücretsiz Reklam Analizi",
  },
  {
    id: "HizmetSeo",
    slug: "hizmet-seo",
    title: "SEO",
    highlight: "SEO",
    short: "Teknik SEO, içerik ve link inşası ile sürdürülebilir trafik.",
    showcase: "seo",
    features: [
      "Teknik denetim & site içi SEO",
      "Anahtar kelime & içerik takvimi",
      "EEAT odaklı içerik üretimi",
      "Otorite oluşturan link inşası",
    ],
    outroTitle: "Google'da kalıcı olarak öne çık",
    outroHighlight: "öne çık",
    cta: "Ücretsiz SEO Analizi",
  },
  {
    id: "HizmetMobil",
    slug: "hizmet-mobil-uygulama",
    title: "Mobil Uygulama Geliştirme",
    highlight: "Mobil",
    short: "iOS ve Android için yüksek performanslı uygulamalar.",
    showcase: "list",
    features: [
      "UX araştırması & prototipleme",
      "React Native, Swift, Kotlin",
      "Push & in-app analytics",
      "App Store & Google Play yayını",
    ],
    outroTitle: "Fikrini cebe sığan bir ürüne çevir",
    outroHighlight: "ürüne",
    cta: "Ücretsiz Keşif Görüşmesi",
  },
  {
    id: "HizmetSaas",
    slug: "hizmet-saas-proje",
    title: "SaaS Proje Geliştirme",
    highlight: "SaaS",
    short: "Fikrinizi ölçeklenebilir bir ürüne dönüştürüyoruz.",
    showcase: "list",
    features: [
      "Ürün stratejisi & PMF danışmanlığı",
      "Next.js + Node.js + PostgreSQL",
      "Stripe ile abonelik & faturalama",
      "Multi-tenant mimari & admin panel",
    ],
    outroTitle: "Fikrini ölçeklenebilir ürüne dönüştür",
    outroHighlight: "ölçeklenebilir",
    cta: "Ücretsiz Ürün Görüşmesi",
  },
  {
    id: "HizmetSosyal",
    slug: "hizmet-sosyal-medya",
    title: "Sosyal Medya Yönetimi",
    highlight: "Sosyal",
    short: "Tutarlı bir marka sesi, ölçülebilir topluluk büyümesi.",
    showcase: "social",
    features: [
      "İçerik stratejisi & aylık takvim",
      "Reels, TikTok & Shorts üretimi",
      "Topluluk yönetimi & DM takibi",
      "Influencer & UGC iş birlikleri",
    ],
    outroTitle: "Markanı sosyalde büyütelim",
    outroHighlight: "büyütelim",
    cta: "Ücretsiz Strateji Görüşmesi",
  },
  {
    id: "HizmetWeb",
    slug: "hizmet-web-tasarim",
    title: "Web Tasarım & Geliştirme",
    highlight: "Web",
    short: "Dönüşüme odaklı, hızlı ve premium görünümlü web siteleri.",
    showcase: "web",
    features: [
      "Figma'da özel UI/UX tasarımı",
      "Next.js & headless CMS",
      "Lighthouse 95+ performans",
      "A/B test & CRO optimizasyonu",
    ],
    outroTitle: "Dönüşüm getiren bir site hak ediyorsun",
    outroHighlight: "site",
    cta: "Ücretsiz Site İncelemesi",
  },
  {
    id: "HizmetIcerik",
    slug: "hizmet-icerik-marka",
    title: "İçerik & Marka Stratejisi",
    highlight: "Marka",
    short: "Hatırlanan bir marka kimliği ve tutarlı bir hikaye.",
    showcase: "list",
    features: [
      "Marka kimliği & ton rehberi",
      "Konumlandırma & hikaye mimarisi",
      "Lansman & PR kampanyaları",
      "Naming & manifesto",
    ],
    outroTitle: "Hatırlanan bir marka inşa edelim",
    outroHighlight: "marka",
    cta: "Ücretsiz Marka Görüşmesi",
  },
];
