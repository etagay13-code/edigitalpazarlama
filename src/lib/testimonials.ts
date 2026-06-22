export type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Selin Aksoy",
    role: "Pazarlama Direktörü",
    company: "Lumen Cosmetics",
    quote:
      "True EDigital Marketing ile çalıştığımız 6 ayda ROAS'ımız 2.1'den 4.8'e çıktı. En etkileyici olan şey rakamlar değil, ekip dinamiği — markamızı bizim kadar sahipleniyorlar.",
    initials: "SA",
  },
  {
    name: "Kerem Doğan",
    role: "Kurucu",
    company: "Tessera SaaS",
    quote:
      "MVP'mizi 8 haftada yayınladılar. Sadece kod yazmadılar; ürün stratejisinden onboarding flow'una kadar gerçek bir teknoloji ortağı gibi davrandılar.",
    initials: "KD",
  },
  {
    name: "Beyza Yılmaz",
    role: "E-ticaret Müdürü",
    company: "Nordel Home",
    quote:
      "SEO ekibi gerçek anlamda farkı gösterdi. 9 ay içinde organik trafiğimiz 4.6 katına çıktı, marka kelimelerimizde 1. sıradayız ve bu trafik artık satışa dönüşüyor.",
    initials: "BY",
  },
  {
    name: "Mert Çelik",
    role: "CEO",
    company: "Voltra Mobility",
    quote:
      "Mobil uygulamamızın yayın süreci stresli olabilirdi ama True EDigital Marketing tüm süreci yönetti. App Store onayından ilk 50K indirmeye kadar yanımızdaydılar.",
    initials: "MÇ",
  },
  {
    name: "Asya Pamir",
    role: "Marka Müdürü",
    company: "Vera Moda",
    quote:
      "TikTok ve Reels stratejimizi sıfırdan kurguladılar. 3 ayda 180K organik takipçi kazandık ve influencer iş birliklerimiz şimdi içeriden yönetiliyor.",
    initials: "AP",
  },
  {
    name: "Onur Şahin",
    role: "Kurucu Ortak",
    company: "Greenly Foods",
    quote:
      "Şeffaf raporlama, hızlı iletişim ve doğru beklenti yönetimi. Ajans değişimi yaparken aradığımız her şeyi tek bir yerde bulduk.",
    initials: "OŞ",
  },
];
