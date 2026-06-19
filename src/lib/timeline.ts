export type TimelineEvent = {
  year: string;
  title: string;
  description: string;
};

export const timeline: TimelineEvent[] = [
  {
    year: "2015",
    title: "İlk e-ticaret deneyimi",
    description:
      "Emre Tagay, kendi kurduğu e-ticaret markasıyla dijital pazarlama dünyasına girer. Google Ads ve Meta Ads üzerinde ilk hipotezleri test eder.",
  },
  {
    year: "2017",
    title: "Freelance dönemi",
    description:
      "Aldığı sonuçların başka markaların da işine yarayabileceğini fark eder. Freelance olarak 12 markaya pazarlama danışmanlığı verir.",
  },
  {
    year: "2019",
    title: "E - Digital Marketing kuruluyor",
    description:
      "Performans pazarlaması ile teknoloji geliştirmeyi tek çatı altında birleştiren ajans kurulur. İlk yılda 8 müşteri.",
  },
  {
    year: "2021",
    title: "Ekip büyür, SaaS departmanı açılır",
    description:
      "Pazarlama ekibinin yanına yazılım geliştirme departmanı eklenir. İlk SaaS müşterilerimize MVP geliştiriyoruz.",
  },
  {
    year: "2023",
    title: "Mobil uygulama bölümü",
    description:
      "React Native ve native mobil geliştirme yetenekleri ile bölüm açılır. İlk yılda 6 mobil uygulama yayına alınır.",
  },
  {
    year: "2024",
    title: "AI entegrasyonları",
    description:
      "OpenAI ve Anthropic entegrasyonları ile müşteri SaaS ürünlerine AI özellikleri ekleriz. Yeni nesil pazarlama otomasyonları devreye girer.",
  },
  {
    year: "2026",
    title: "Bugün",
    description:
      "İstanbul merkezli 14 kişilik ekip, 60+ aktif müşteri, 320'den fazla tamamlanmış proje. Pazarlama ile teknolojinin kesişimindeki konumumuzu sağlamlaştırıyoruz.",
  },
];

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  initials: string;
  accent: string;
};

export const team: TeamMember[] = [
  {
    name: "Emre Tagay",
    role: "Kurucu & Strateji Direktörü",
    bio: "10+ yıllık dijital pazarlama deneyimi. Her yeni projeye doğrudan dahil olur, ilk strateji görüşmesini bizzat yürütür.",
    initials: "ET",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    name: "Deniz Aydın",
    role: "Performans Pazarlama Lideri",
    bio: "Google Ads ve Meta Ads üzerine uzmanlık. Yönettiği bütçe aylık 5M TL+. Sertifikalı Google Premier Partner.",
    initials: "DA",
    accent: "from-pink-500 to-rose-500",
  },
  {
    name: "Mehmet Kaya",
    role: "Teknoloji Lideri",
    bio: "10 yıllık full-stack geliştirme deneyimi. Next.js ve React Native ile ölçeklenebilir ürünler kurar.",
    initials: "MK",
    accent: "from-cyan-500 to-blue-500",
  },
  {
    name: "Zeynep Şahin",
    role: "Kreatif Direktör",
    bio: "Geçmişte ajans dünyasında 8 yıl. Markaların görsel kimliğini, ton rehberini ve kampanya kreatifini yönetir.",
    initials: "ZŞ",
    accent: "from-amber-500 to-orange-500",
  },
  {
    name: "Burak Yıldız",
    role: "SEO ve İçerik Lideri",
    bio: "Teknik SEO ve link inşası uzmanı. EEAT prensiplerine sadık içerik stratejileri tasarlar.",
    initials: "BY",
    accent: "from-emerald-500 to-cyan-500",
  },
  {
    name: "Asya Demir",
    role: "Müşteri İlişkileri Lideri",
    bio: "Müşteri başarısı (CS) odaklı. Her hesap için ayrı bir başarı planı, haftalık iletişim ritmi, şeffaf raporlama.",
    initials: "AD",
    accent: "from-rose-500 to-fuchsia-500",
  },
];
