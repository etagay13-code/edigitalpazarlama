// Instagram feed postları (1080×1350, 4:5) — içerik burada, tasarım Post.tsx'te.
// Her post tek bir "değer" veriyor: ya öğretiyor ya kanıt gösteriyor ya davet ediyor.

export type PostKind = "stat" | "list" | "compare" | "case" | "manifesto" | "cta";

export type PostData = {
  id: string; // kompozisyon id'si
  file: string; // çıktı dosya adı
  kind: PostKind;
  eyebrow: string;
  title: string;
  highlight?: string; // başlıkta gradient ile vurgulanacak kelime
  sub?: string;
  tint?: "violet" | "cyan" | "mix";

  // kind'a göre kullanılan alanlar
  stat?: { value: string; label: string; foot?: string };
  items?: string[]; // list
  numbered?: boolean;
  compare?: { badLabel: string; goodLabel: string; rows: { bad: string; good: string }[] };
  case?: { metric: string; from: string; to: string; note: string }[];
  cta?: string;
};

export const POSTS: PostData[] = [
  {
    id: "PostRoas",
    file: "01-roas-nedir",
    kind: "stat",
    tint: "violet",
    eyebrow: "Metrik Okulu",
    title: "ROAS tek başına yeterli değil",
    highlight: "yeterli",
    sub: "4x ROAS gösteren bir hesap, kâr etmiyor olabilir. Çünkü ROAS ciroyu ölçer, kârı değil. Kâr eşiğin: 1 ÷ brüt kâr marjı.",
    stat: { value: "2.5x", label: "%40 marjlı bir üründe başabaş ROAS", foot: "Altında kalan her kampanya para kaybettirir" },
  },
  {
    id: "PostMetrikler",
    file: "02-5-metrik",
    kind: "list",
    tint: "cyan",
    numbered: true,
    eyebrow: "Raporunda Olmalı",
    title: "Beğeni değil, bu 5 metrik",
    highlight: "5",
    sub: "Ajansın sana gösterdiği raporda bunlar yoksa, performansı değil aktiviteyi ölçüyorsun.",
    items: [
      "CAC — bir müşteri kazanmanın gerçek maliyeti",
      "LTV / CAC — sürdürülebilirlik oranı, hedef 3x+",
      "Dönüşüm oranı — trafiğin değil, sayfanın karnesi",
      "Katkılı gelir — kanalın gerçek payı",
      "Geri ödeme süresi — reklam parası kaç ayda döner",
    ],
  },
  {
    id: "PostAdsHata",
    file: "03-google-ads-hatalari",
    kind: "list",
    tint: "violet",
    numbered: true,
    eyebrow: "Bütçe Yakan Hatalar",
    title: "Google Ads'te en pahalı 3 hata",
    highlight: "3",
    sub: "Üçü de kolay düzelir; düzeltilmediğinde aylık bütçenin sessizce eriyen kısmıdır.",
    items: [
      "Marka aramasını performans sanmak — zaten senin olan tıklamaya para vermek",
      "Dönüşüm sinyali olmadan Performance Max açmak — algoritmayı kör uçurmak",
      "Negatif kelime listesi tutmamak — alakasız aramalara bütçe akıtmak",
    ],
  },
  {
    id: "PostSeo90",
    file: "04-seo-90-gun",
    kind: "list",
    tint: "cyan",
    numbered: true,
    eyebrow: "SEO Yol Haritası",
    title: "İlk 90 günde ne yapılır?",
    highlight: "90",
    sub: "SEO yavaş değil; sırasız yapıldığı için yavaş görünüyor. Doğru sıra şu:",
    items: [
      "0–30 gün — teknik denetim, indeksleme ve Core Web Vitals",
      "30–60 gün — arama niyetine göre içerik mimarisi ve iç linkleme",
      "60–90 gün — otorite bağlantıları ve ilk sıralama kazanımları",
    ],
  },
  {
    id: "PostVaka",
    file: "05-vaka-roas",
    kind: "case",
    tint: "violet",
    eyebrow: "Vaka Çalışması",
    title: "3 ayda ROAS 2.1x → 4.8x",
    highlight: "4.8x",
    sub: "Kozmetik markası. Bütçe artmadı — huni yeniden kuruldu, kreatif testi haftalık ritme bağlandı.",
    case: [
      { metric: "ROAS", from: "2.1x", to: "4.8x", note: "+%128" },
      { metric: "Edinme maliyeti", from: "₺312", to: "₺148", note: "-%53" },
      { metric: "Dönüşüm oranı", from: "%1.4", to: "%3.2", note: "+%129" },
    ],
  },
  {
    id: "PostKreatif",
    file: "06-kreatif-testi",
    kind: "list",
    tint: "cyan",
    eyebrow: "Meta Reklamları",
    title: "Kreatif artık en büyük hedefleme kaldıracı",
    highlight: "kreatif",
    sub: "Hedefleme seçenekleri daraldıkça algoritmaya verdiğin en güçlü sinyal kreatifin oldu. Haftalık test ritmi:",
    items: [
      "Her hafta 3 yeni kanca (hook), aynı teklif",
      "İlk 3 saniyeyi ayrı ölç — izlenme değil, tutma oranı",
      "Kazananı ölçekle, kaybedeni 72 saatte kapat",
      "UGC ile stüdyo çekimini aynı sette yarıştır",
    ],
  },
  {
    id: "PostCro",
    file: "07-donusum-checklist",
    kind: "list",
    tint: "violet",
    eyebrow: "E-ticaret Kontrol Listesi",
    title: "Trafiğin var, satışın yoksa",
    highlight: "satışın",
    sub: "Reklam bütçesini artırmadan önce bu beş maddeyi kapat. Genelde sorun trafikte değil, sayfada.",
    items: [
      "Mobilde ilk ekranda net teklif ve tek bir eylem",
      "Sepete ekleme sonrası sürpriz kargo bedeli yok",
      "Ürün sayfasında sosyal kanıt: yorum, video, kullanım",
      "3 saniyenin altında yüklenen görseller",
      "Misafir ödeme (üyeliksiz satın alma) açık",
    ],
  },
  {
    id: "PostNedenBiz",
    file: "08-neden-biz",
    kind: "compare",
    tint: "mix",
    eyebrow: "Farkımız",
    title: "Ayrı ajanslar yerine tek sinir sistemi",
    highlight: "tek",
    sub: "Her kanalın ayrı ajansta olduğu kurguda kayıp, kanalların arasında oluşur.",
    compare: {
      badLabel: "Tipik kurgu",
      goodLabel: "True EDigital",
      rows: [
        { bad: "Reklam, SEO, sosyal için ayrı ajanslar", good: "Tüm kanallar tek ekipte" },
        { bad: "Gösterim ve beğeni raporu", good: "Satış, lead ve ROAS raporu" },
        { bad: "Hesap junior'a devredilir", good: "Kurucu stratejide masada" },
        { bad: "Aylık değişim döngüsü", good: "48 saatte test, haftalık optimizasyon" },
      ],
    },
  },
  {
    id: "PostHizmetler",
    file: "09-hizmetler",
    kind: "manifesto",
    tint: "violet",
    eyebrow: "360° Dijital Ajans",
    title: "Reklamdan SaaS geliştirmeye, tek ekip",
    highlight: "tek ekip",
    sub: "Stratejiyi kuran, kreatifi üreten ve teknolojiyi geliştiren ekip aynı masada oturuyor. Kanallar arası kayıp bu yüzden sıfıra iniyor.",
    items: [
      "360° Dijital Pazarlama",
      "Reklam Yönetimi",
      "SEO",
      "Sosyal Medya Yönetimi",
      "Mobil Uygulama",
      "SaaS Geliştirme",
      "Web Tasarım & Geliştirme",
      "İçerik & Marka Stratejisi",
    ],
  },
  {
    id: "PostTeklif",
    file: "10-teklif-al",
    kind: "cta",
    tint: "cyan",
    eyebrow: "Yeni Dönem Kontenjanı",
    title: "Bu ay 6 yeni proje alıyoruz",
    highlight: "6",
    sub: "Ücretsiz 30 dakikalık keşif görüşmesinde mevcut kanallarını birlikte inceliyor, somut bir aksiyon planı çıkarıyoruz.",
    items: [
      "Ortalama 48 saat içinde teklif",
      "İlk 90 günde ölçülebilir iyileşme taahhüdü",
      "Sözleşmede olmayan vaat yok",
    ],
    cta: "Ücretsiz keşif görüşmesi",
  },
];
