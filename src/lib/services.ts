import type { LucideIcon } from "lucide-react";
import {
  Globe2,
  Megaphone,
  Search,
  Smartphone,
  Layers,
  Share2,
  Code2,
  PenTool,
} from "lucide-react";

export type ProcessStep = { title: string; description: string };
export type ServiceFAQ = { q: string; a: string };

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  longDescription?: string;
  hero: string;
  approach: string;
  bullets: string[];
  deliverables: string[];
  tools: string[];
  process: ProcessStep[];
  outcomes: string[];
  idealFor: string[];
  faq: ServiceFAQ[];
  relatedSlugs: string[];
  icon: LucideIcon;
  accent: string;
};

export const services: Service[] = [
  {
    slug: "360-dijital-pazarlama",
    title: "360° Dijital Pazarlama",
    short: "Strateji, üretim ve performans tek çatı altında.",
    description:
      "Markanızın dijital varlığını uçtan uca yönetiriz. Pazarlama planlamasından kreatif üretime, medya satın almadan veriye dayalı optimizasyona kadar tek bir ekip, tek bir hesap planı.",
    longDescription:
      "Çoğu marka, ajans değişimini büyürken yapar — büyürken ek katmana ihtiyaç duyduğunu fark eder. Biz bu noktayı baştan kapatıyoruz. Sosyal medyadan SEO'ya, web sitesinden reklam yönetimine kadar tüm kanallar tek bir stratejinin parçası.",
    hero: "Birden çok ajansla değil, tek bir ortakla büyüyün. 360° pazarlama, markanızın tüm dijital varlığını tek bir vizyon altında birleştirir; siloları yıkar, hızı katlar.",
    approach:
      "Pazarlama bütünsel bir oyundur: bir kanalda yapılan iyileştirme, diğer kanaldan dönen müşteriyi etkiler. Biz markanızı tek bir 'sinir sistemi' olarak modelliyoruz. Reklam ekibi, SEO ekibi ve sosyal medya ekibi aynı strateji belgesinden, aynı KPI setinden, aynı kreatif kütüphanesinden çalışır. Her kanal birbirini besler, hiçbiri diğerinden bağımsız değildir. Sonuç: marka tutarlılığı + verimlilik + her noktada anlamlı veri.",
    bullets: [
      "Marka konumlandırma ve mesaj mimarisi",
      "Çok kanallı pazarlama planı (paid + organic + CRM)",
      "Aylık performans raporu ve canlı dashboard",
      "Tek müşteri temsilcisiyle 360° koordinasyon",
      "Kanal-spesifik kreatif paketleri",
      "Atfetme (attribution) modeli kurulumu",
    ],
    deliverables: [
      "90 günlük strateji belgesi",
      "Kanal-bazlı KPI seti",
      "Aylık kreatif paket",
      "Looker Studio dashboard",
      "Aylık performans sunumu",
    ],
    tools: ["GA4", "Meta Business Suite", "Google Ads", "Looker Studio", "Notion", "Figma", "Slack"],
    process: [
      { title: "Keşif & Audit", description: "Mevcut tüm kanallarınızı, hesaplarınızı ve dataları derinlemesine analiz ederiz. İlk 2 hafta." },
      { title: "Strateji", description: "90 günlük yol haritası, kanal mix'i ve KPI hedefleri belirlenir. 3. hafta." },
      { title: "Üretim", description: "Kreatif, içerik ve teknik kurulumlar paralel devreye girer. 4-6. hafta." },
      { title: "Optimizasyon", description: "Haftalık test-öğren-uygula döngüsü. Devamlı." },
      { title: "Raporlama", description: "Aylık detay sunumu + canlı dashboard. Şeffaf rakamlar." },
    ],
    outcomes: ["Tek müşteri temsilcisi", "Tek strateji belgesi", "+%30 ortalama verim artışı", "Aylık şeffaf rapor"],
    idealFor: ["Aylık reklam bütçesi ₺150K+", "Birden fazla kanalda kayboluyorum diyenler", "Birden çok ajansla uğraşmaktan yorulmuş ekipler"],
    faq: [
      { q: "Mevcut ajansımdan geçiş süreci nasıl?", a: "Önce 2-3 haftalık paralel devir süreci. Mevcut ajansınızla iletişim kuruyor, hesapları, verileri ve süregelen kampanyaları sorunsuz alıyoruz. Sıfır kesinti." },
      { q: "İçeride bir pazarlama ekibim varsa hala bu hizmeti alabilir miyim?", a: "Elbette. Çoğu müşterimiz iç pazarlama ekibinin uzantısı olarak çalıştığımız modeli tercih ediyor. Haftalık sync, ortak board'lar ve net sorumluluk paylaşımı ile sürtüşmesiz işliyor." },
      { q: "Kaç kişilik bir ekip benim hesabıma bakacak?", a: "Tipik olarak 1 hesap müdürü + 3-5 uzman (reklam, SEO, kreatif, sosyal medya, vb.) ekibinizle aktif çalışır. Hesap büyüklüğüne göre genişler." },
    ],
    relatedSlugs: ["reklam-yonetimi", "seo", "sosyal-medya-yonetimi"],
    icon: Globe2,
    accent: "from-violet-500 to-indigo-500",
  },
  {
    slug: "reklam-yonetimi",
    title: "Reklam Yönetimi",
    short: "Google, Meta ve TikTok'ta performans odaklı medya satın alma.",
    description:
      "Bütçenizden maksimum geri dönüş alan, sürekli test edilen ve optimize edilen reklam kampanyaları kurguluyoruz. Her tıklamayı satın almaya, her gösterimi marka değerine çeviriyoruz.",
    longDescription:
      "Reklam, bilim ve sanatın kesiştiği noktadır. Doğru hedef kitleyi bulmak veridir; onlara doğru mesajı vermek yaratıcılıktır.",
    hero: "Bütçenizi ısrarla harcayan değil, ısrarla geri getiren reklam yönetimi. Google, Meta ve TikTok'ta veriyle yönetilen, kreatifle güçlendirilen performans kampanyaları.",
    approach:
      "İyi bir reklam hesabı 3 şeyin kesiştiği yerdir: doğru kitle, doğru kreatif, doğru ölçüm. Birinde sorun varsa diğer ikisi kurtaramaz. Biz üç tarafı da aynı odaya alıyoruz — medya satın alma uzmanlarımız, kreatif ekibimiz ve analytics ekibimiz aynı toplantıdan çıkar. 14 gün içinde anlamlı patern görmüyorsak stratejiyi değiştirmekten çekinmiyoruz. Yorgun kreatif sendromuna karşı sürekli yeni iterasyonlar; sızdıran funnel'a karşı server-side conversion API ve net attribution.",
    bullets: [
      "Google Ads (Arama, PMax, YouTube, Display)",
      "Meta Ads (Facebook & Instagram funnel)",
      "TikTok Ads ve creator partnerships",
      "Dönüşüm takibi, GA4 ve attribution kurulumu",
      "Haftalık kreatif iterasyonu",
      "Server-side conversion API kurulumu",
    ],
    deliverables: [
      "Reklam funnel mimarisi",
      "Haftalık kreatif iterasyonu",
      "Server-side conversion API kurulumu",
      "Bütçe planı ve tahmin modelleri",
      "Aylık performans raporu",
    ],
    tools: ["Google Ads", "Meta Ads Manager", "TikTok Ads Manager", "Triple Whale", "Hyros", "GA4"],
    process: [
      { title: "Hesap Audit", description: "Mevcut hesaplar, kreatifler ve dönüşüm takibi denetimi. Sızıntı noktaları belirlenir." },
      { title: "Test Planı", description: "Hipotezler, hedef kitleler ve kreatif konseptleri için 30 günlük test planı." },
      { title: "Lansman", description: "Funnel'lar kurulur, kreatifler üretilir, kampanyalar canlıya alınır." },
      { title: "Optimizasyon", description: "Günlük bütçe yönetimi, haftalık kreatif yenileme, ölçeklendirme." },
      { title: "Ölçek", description: "Kazanan kombinasyonlar bütçe artışıyla ölçeklenir." },
    ],
    outcomes: ["ROAS 4x+", "CPA -%35 ortalama", "Haftalık 3-5 yeni kreatif", "Server-side tracking"],
    idealFor: ["E-ticaret markaları", "Lead generation iş modelleri", "Aylık reklam bütçesi ₺75K+"],
    faq: [
      { q: "Mevcut reklam hesaplarımı nasıl alacaksınız?", a: "Google ve Meta Business Manager üzerinden hesap erişimi alıyoruz. Hesap sahipliği sizde kalır, biz sadece manager erişimiyle çalışırız. Sözleşme bittiğinde erişim kesilir." },
      { q: "İlk ay sonuç bekleyebilir miyim?", a: "İlk 30 gün öğrenme dönemidir. Anlamlı performans iyileşmesi tipik olarak 45-90 gün arasında başlar. İstisna: önemli kreatif veya yapısal sorunlar varsa daha hızlı görünür." },
      { q: "Kreatif üretimi dahil mi?", a: "Evet. Aylık belirli sayıda statik görsel ve video kreatif retainer'a dahildir. Ekstra ihtiyaçlar için net fiyatlandırma." },
      { q: "Reklam bütçesi nasıl yönetilir?", a: "Reklam bütçesi doğrudan kendi reklam hesaplarınızdan harcanır — biz sadece yönetiriz. Şeffaflık tam." },
    ],
    relatedSlugs: ["360-dijital-pazarlama", "web-tasarim-gelistirme", "icerik-marka-stratejisi"],
    icon: Megaphone,
    accent: "from-pink-500 to-rose-500",
  },
  {
    slug: "seo",
    title: "SEO",
    short: "Teknik SEO, içerik ve link inşası ile sürdürülebilir trafik.",
    description:
      "Reklam bağımlılığını azaltan, uzun vadeli organik büyüme. Site mimarisinden Core Web Vitals'a, konu kümelerinden uluslararası SEO'ya kadar büyük resmi görüyoruz.",
    longDescription:
      "SEO'nun kısa yolu yok ama yanlış yolu çok. 'İçerik üretelim, sonra göreceğiz' yaklaşımı yerine biz net hedeflerle çalışıyoruz.",
    hero: "Reklamı kapattığınızda da gelmeye devam eden trafik. Teknik SEO, kullanıcı niyetine göre içerik mimarisi ve gerçek otorite linkleriyle sürdürülebilir organik büyüme.",
    approach:
      "SEO bir sprint değil maraton; ama doğru kurgulanmış maratonlar tahmin edilebilir hızla ilerler. İlk 30 günde 120+ sayfalık teknik audit ve rakip analizi yapıyoruz. Sonra kullanıcı niyetine göre yapılandırılmış konu kümeleri kuruyoruz — her içerik bir trafik hedefiyle, bir dönüşüm hedefiyle çıkıyor. Link inşası tarafında PBN, fiverr ve link satışından uzağız; gerçek dijital PR ve içerik amplifikasyonu yapıyoruz. EEAT prensiplerine uygun, AI'a karşı dayanıklı, gerçek otorite kuran içerik üretiyoruz.",
    bullets: [
      "Teknik denetim ve site içi optimizasyon",
      "Anahtar kelime araştırması ve içerik takvimi",
      "EEAT odaklı içerik üretimi (TR & EN)",
      "Otorite oluşturan link inşası",
      "Core Web Vitals optimizasyonu",
      "İç linkleme ve cluster mimarisi",
    ],
    deliverables: [
      "120 sayfalık teknik audit raporu",
      "Aylık 8-12 SEO içerik",
      "Aylık 6-15 otorite linki",
      "Aylık ranking raporu",
      "Content cluster mimarisi",
    ],
    tools: ["Ahrefs", "Semrush", "Screaming Frog", "Search Console", "Surfer SEO", "Sitebulb"],
    process: [
      { title: "Teknik Audit", description: "Site mimarisi, indexlenme, hız ve Core Web Vitals kapsamlı denetimi." },
      { title: "Anahtar Kelime & Strateji", description: "Niyet-odaklı kümeleme, rakip analizi ve içerik takvimi." },
      { title: "Teknik İyileştirme", description: "On-page SEO, schema, internal linking ve teknik düzeltmeler." },
      { title: "İçerik & Link", description: "Aylık içerik + dijital PR ve otorite link inşası." },
      { title: "İzleme & İterasyon", description: "Aylık rank takibi, içerik güncellemeleri ve genişleme." },
    ],
    outcomes: ["Organik trafik 3-5x", "Top 3'te 50+ kelime", "Yıllık 100+ içerik", "Sürdürülebilir büyüme"],
    idealFor: ["B2B SaaS", "İçerik bağımlı e-ticaret", "Yerel hizmet markaları", "Sağlık & finans (YMYL)"],
    faq: [
      { q: "İlk sonuçları ne zaman göreceğim?", a: "Teknik iyileştirmelerin etkisi 4-8 hafta içinde Search Console'da görünmeye başlar. İçerik sıralamaları 3-6 ay, otorite kelimelerde 6-12 ay arasında oturur." },
      { q: "AI içerik mi yazıyorsunuz?", a: "Tamamen değil. İçerik araştırma, taslak ve düzenleme aşamalarında AI'dan yararlanıyoruz ama her yayın insan tarafından yeniden yazılıyor ve doğrulanıyor. EEAT olmadan ranking yok." },
      { q: "Link inşası riskli değil mi?", a: "Biz black-hat tekniklerden uzağız. Sadece dijital PR, misafir yazarlık ve içerik amplifikasyonu yapıyoruz. PBN ve link satın alma kullanmıyoruz." },
      { q: "Mevcut içeriklerimi optimize ediyor musunuz?", a: "Evet, content refresh denilen bu süreç en hızlı kazanım yollarından biri. Audit aşamasında öncelikli refresh adaylarını belirliyoruz." },
    ],
    relatedSlugs: ["icerik-marka-stratejisi", "web-tasarim-gelistirme", "360-dijital-pazarlama"],
    icon: Search,
    accent: "from-emerald-500 to-cyan-500",
  },
  {
    slug: "mobil-uygulama-gelistirme",
    title: "Mobil Uygulama Geliştirme",
    short: "iOS ve Android için yüksek performanslı uygulamalar.",
    description:
      "Fikirden yayına; React Native ve native teknolojilerle ölçeklenebilir, mağaza onayına hazır mobil uygulamalar geliştiriyoruz. Tasarımdan analytics kurulumuna kadar tek elden.",
    hero: "Mağazada onay alan, kullanıcının sevdiği, ölçeklendirilebilir mobil uygulamalar. Fikrinizi 8-16 hafta içinde yayında bir ürüne dönüştürüyoruz.",
    approach:
      "Mobil uygulama 'yapmak' kolay; mağazada kalıcı olmasını sağlamak zor. App Store onay süreçlerini, push notification stratejisini, onboarding optimizasyonunu ve App Store Optimization'ı (ASO) ilk günden mimariye dahil ediyoruz. React Native ile hız ve maliyet avantajı, ihtiyaç olduğunda native bridge'ler. Crash izleme, analytics ve kullanıcı geri bildirim mekanizmaları default olarak gelir. Sonuç: sadece kod değil, büyümeye hazır bir mobil ürün.",
    bullets: [
      "UX araştırması ve prototipleme",
      "React Native, Swift, Kotlin",
      "Push notification & in-app analytics",
      "App Store ve Google Play yayın yönetimi",
      "ASO ve organik büyüme kurulumu",
      "Backend & API entegrasyonları",
    ],
    deliverables: [
      "Figma'da yüksek detaylı prototip",
      "iOS ve Android binary'leri",
      "Mağaza listing kreatifleri",
      "Crash & analytics dashboard kurulumu",
      "Yayın sonrası 30 günlük bakım",
    ],
    tools: ["React Native", "Swift", "Kotlin", "Firebase", "RevenueCat", "Sentry", "Mixpanel"],
    process: [
      { title: "Keşif & UX", description: "Hedef kullanıcı, jobs-to-be-done ve flow haritalama." },
      { title: "Prototip", description: "Figma'da etkileşimli prototip, kullanıcı testleri." },
      { title: "Geliştirme", description: "2 haftalık sprintlerle yayına yakın bir ürün." },
      { title: "Beta", description: "TestFlight ve internal testing, son düzenlemeler." },
      { title: "Yayın & ASO", description: "Mağaza onayı, listing optimizasyonu ve lansman." },
    ],
    outcomes: ["Mağaza onayı %100", "Tipik 8-16 hafta", "Crash-free rate 99.5%+", "Analytics ilk günden"],
    idealFor: ["Startup MVP'leri", "Mevcut markaların mobile genişlemesi", "Servis sektörü dijital ürünleri"],
    faq: [
      { q: "React Native mi native mi?", a: "Çoğu durumda React Native; geliştirme süresi yarıya iner, tek codebase iki platforma yayınlanır. Yoğun grafik veya donanım gerektiren senaryolarda native öneriyoruz." },
      { q: "Mağaza red yer mi?", a: "Şu ana kadar yönettiğimiz tüm uygulamalar onaylandı. Red gelirse onay alana kadar düzeltmeler retainer kapsamındadır." },
      { q: "Sürdürme/bakım sonrası nasıl?", a: "Yayın sonrası 30 günlük destek dahildir. Sonrasında aylık bakım/feature retainer'ı tanımlanır." },
    ],
    relatedSlugs: ["saas-proje-gelistirme", "web-tasarim-gelistirme", "reklam-yonetimi"],
    icon: Smartphone,
    accent: "from-cyan-500 to-blue-500",
  },
  {
    slug: "saas-proje-gelistirme",
    title: "SaaS Proje Geliştirme",
    short: "Fikrinizi ölçeklenebilir bir ürüne dönüştürüyoruz.",
    description:
      "MVP'den enterprise mimariye, abonelik altyapısından AI entegrasyonlarına kadar modern SaaS ürünleri inşa ediyoruz. Next.js, Node, Postgres ve bulut tabanlı altyapı uzmanlığı.",
    hero: "Sadece kod değil, ölçeklenebilir bir iş modeli. MVP'den enterprise'a, abonelik altyapısından AI entegrasyonlarına kadar modern SaaS ürünleri.",
    approach:
      "SaaS girişimleri için 'kodu ne kadar hızlı yazıyorsunuz' yanlış sorudur. Doğru soru: 'ürün-pazar uyumunu ne kadar hızlı bulabiliriz?'. Biz hızlı kod yazıyoruz çünkü hızlı iterasyon için. Müşteri görüşmelerine katılıyoruz, metrikleri ürün ekibiyle birlikte takip ediyoruz, ölçekleme problemlerini erkenden tahmin ediyoruz. SaaS bir teknoloji değil bir iş modelidir; bu yüzden teknik kararlar her zaman finansal kararlardır. Stripe entegrasyonu ilk günden, multi-tenant mimari, OpenAI/Anthropic entegrasyonları ve growth-ready altyapı standart paketin parçası.",
    bullets: [
      "Ürün stratejisi & PMF danışmanlığı",
      "Next.js + Node.js + PostgreSQL stack",
      "Stripe ile abonelik ve faturalandırma",
      "OpenAI / Anthropic AI entegrasyonları",
      "Multi-tenant mimari",
      "Auth, role yönetimi ve admin paneli",
    ],
    deliverables: [
      "Ürün mimarisi belgesi",
      "Sprint bazlı yayın",
      "Stripe + analytics + auth kurulumu",
      "Ürün ekibine devir paketi",
      "Otomatik deploy pipeline",
    ],
    tools: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Vercel", "Supabase", "OpenAI", "Anthropic"],
    process: [
      { title: "Discovery", description: "İş modeli, kullanıcı segmentleri ve teknik gereksinimler." },
      { title: "Mimari", description: "Veri modeli, multi-tenancy, scalability ve security baseline." },
      { title: "Sprint Geliştirme", description: "2 haftalık sprintlerle iteratif yayın." },
      { title: "Beta & Iterasyon", description: "İlk kullanıcılar, ürün analitiği, hızlı iterasyon." },
      { title: "Yayın & Devir", description: "Production lansman ve ürün ekibine devir paketi." },
    ],
    outcomes: ["MVP 8-12 hafta", "Stripe ilk günden", "Multi-tenant hazır", "AI-ready altyapı"],
    idealFor: ["Yeni başlayan SaaS girişimleri", "Mevcut markaların SaaS ürün lansmanı", "Pilot deneyim isteyen şirketler"],
    faq: [
      { q: "Kaynak kodu kime ait?", a: "Tamamen size. GitHub organizasyonunuz üzerinden çalışırız, fikri mülkiyet ilk günden sizdedir." },
      { q: "Bizim geliştirici ekibimize devredilebilir mi?", a: "Evet, bu standart süreçtir. Devir paketi içinde dokümantasyon, onboarding ve 4 haftalık paralel destek bulunur." },
      { q: "AI özellikler nasıl entegre oluyor?", a: "OpenAI ve Anthropic API'leri başta olmak üzere LLM'leri ürün akışlarına gömüyoruz: özetleme, sınıflandırma, search, agentic flow'lar." },
    ],
    relatedSlugs: ["mobil-uygulama-gelistirme", "web-tasarim-gelistirme", "icerik-marka-stratejisi"],
    icon: Layers,
    accent: "from-indigo-500 to-violet-500",
  },
  {
    slug: "sosyal-medya-yonetimi",
    title: "Sosyal Medya Yönetimi",
    short: "Tutarlı bir marka sesi, ölçülebilir topluluk büyümesi.",
    description:
      "Sadece içerik üretmiyoruz; topluluk inşa ediyoruz. Trend takibi, format testleri ve müşteri ile aktif diyaloglarla markanızı dijitalde canlı tutuyoruz.",
    hero: "Takipçi sayısı değil, etkileşim derinliği. Trend duyarlı, marka sesi tutarlı bir sosyal medya yönetimi.",
    approach:
      "Sosyal medya bir yayın değil bir diyalog kanalıdır. Markanız adına paylaşılan her içeriğin altında ne yazıldığını, hangi DM'lere kaç saniyede dönüldüğünü, hangi trende kaç saat içinde adapte olunduğunu önemsiyoruz. İçeriği üreten ekiple toplulukla konuşan ekip aynı kişiler — çünkü en iyi içerik, takipçilerin sorduğu sorulardan doğar. Reels, TikTok ve YouTube Shorts üretiminde dahili stüdyomuz; influencer ve UGC iş birliklerinde tek elden yönetim.",
    bullets: [
      "İçerik stratejisi ve aylık takvim",
      "Reels, TikTok ve YouTube Shorts üretimi",
      "Topluluk yönetimi ve DM takibi",
      "Influencer ve UGC iş birlikleri",
      "Trend ve format testleri",
      "Aylık performans paneli",
    ],
    deliverables: [
      "Aylık 18-24 video içerik",
      "Topluluk yönetimi (mesai içi)",
      "Aylık 2-4 influencer iş birliği",
      "Aylık performans paneli",
      "Trend rapor bülteni",
    ],
    tools: ["Later", "Notion", "CapCut Pro", "Premiere Pro", "Brand24", "Sprout Social"],
    process: [
      { title: "Ses & Strateji", description: "Marka sesi, format mix'i ve aylık tema kurgusu." },
      { title: "İçerik Üretimi", description: "Çekim, kurgu ve yayın planı." },
      { title: "Yayın & Etkileşim", description: "Optimal saat planlaması, hızlı yorum ve DM yönetimi." },
      { title: "Influencer İş Birliği", description: "Doğru creator'larla brief, prodüksiyon ve raporlama." },
      { title: "Optimizasyon", description: "Trend testleri, kazanan formatların ölçeklenmesi." },
    ],
    outcomes: ["Aylık 18-24 video", "İlk yanıt < 30 dk", "Influencer iş birliği", "Format A/B testleri"],
    idealFor: ["D2C markaları", "Hizmet sektörü", "Eğitim & wellness markaları"],
    faq: [
      { q: "Çekimleri kim yapıyor?", a: "İçeriğinin doğasına göre: kendi stüdyomuzda çekim, UGC üreticilerle iş birliği veya marka tarafında çekilen ham içeriklerin kurgulanması." },
      { q: "Hangi platformlarda çalışıyorsunuz?", a: "Öncelik: Instagram, TikTok, YouTube Shorts. LinkedIn, X ve Threads ihtiyaca göre eklenir." },
      { q: "Topluluk yönetimi saatleri?", a: "Hafta içi 09:00-19:00 arası aktif yönetim. Acil durumlar için 7/24 nöbetçi sistemimiz var." },
    ],
    relatedSlugs: ["icerik-marka-stratejisi", "reklam-yonetimi", "360-dijital-pazarlama"],
    icon: Share2,
    accent: "from-fuchsia-500 to-pink-500",
  },
  {
    slug: "web-tasarim-gelistirme",
    title: "Web Tasarım & Geliştirme",
    short: "Dönüşüme odaklı, hızlı ve premium görünümlü web siteleri.",
    description:
      "Sadece estetik değil; sayfa hızı, SEO ve dönüşüm oranı için tasarlanmış kurumsal web siteleri ve landing page'ler. Next.js ile performans, Figma ile kusursuz tasarım.",
    hero: "Sayfa hızı 95+, dönüşüm oranı yüksek, mobilde mükemmel. Markanızın dijital ofisini Next.js ile yeniden inşa ediyoruz.",
    approach:
      "Bir web sitesi şirketinin dijital ofisidir. Yavaşsa, kötü görünüyorsa veya mobilde işlemiyorsa marka algısı zedelenir. Biz web sitelerini bir 'tasarım' problemi gibi değil, 'satış sorumlusu' gibi düşünüyoruz: her bölüm bir ikna görevi yapmalı, her CTA bir aksiyona götürmeli. Figma'da gerçek tasarım sistemi, Next.js ile production-ready codebase, Lighthouse 95+ performans ve sıfır CLS standart. CMS olarak Sanity veya Strapi entegrasyonu — içerik ekibiniz teknik bilgi gerektirmeden günceller.",
    bullets: [
      "Figma'da özel UI/UX tasarımı",
      "Next.js & headless CMS (Sanity/Strapi)",
      "Lighthouse 95+ performans hedefi",
      "A/B test altyapısı ve CRO optimizasyonu",
      "Çok dilli yapı",
      "Analytics & heatmap kurulumu",
    ],
    deliverables: [
      "Figma tasarım sistemi",
      "Production-ready Next.js codebase",
      "CMS eğitimi",
      "Aylık CRO raporu",
      "Analytics & heatmap kurulumu",
    ],
    tools: ["Next.js", "Figma", "Sanity", "Strapi", "Vercel", "Cloudflare", "PostHog"],
    process: [
      { title: "Discovery & Wireframe", description: "Hedef kitle, sayfa mimarisi ve wireframe." },
      { title: "Tasarım", description: "Figma'da yüksek detay UI, tasarım sistemi." },
      { title: "Geliştirme", description: "Next.js + CMS entegrasyonu, performans optimizasyonu." },
      { title: "QA & Yayın", description: "Cross-browser testler, accessibility ve canlı." },
      { title: "İterasyon", description: "Heatmap, A/B test ve aylık CRO iyileştirmeleri." },
    ],
    outcomes: ["Lighthouse 95+", "Tipik 4-8 hafta", "CMS-ready", "Dönüşüm odaklı"],
    idealFor: ["Kurumsal yenileme", "Lansman öncesi", "Landing page kütüphanesi gerekenler"],
    faq: [
      { q: "Mevcut sitemi yenileyebilir misiniz?", a: "Evet. Mevcut sitenin SEO değerini koruyarak yenileme yapıyoruz — 301 yönlendirmeler, içerik aktarımı ve teknik SEO migration süreci dahil." },
      { q: "Hangi CMS'i öneriyorsunuz?", a: "İçerik yoğunluğu fazla ise Sanity, daha klasik bir admin paneli için Strapi. Wordpress'ten uzağız (performans ve güvenlik gerekçesiyle)." },
      { q: "Hosting nereden?", a: "Vercel veya Cloudflare öneriyoruz — sıfır config, sıfır downtime, global edge network." },
    ],
    relatedSlugs: ["seo", "saas-proje-gelistirme", "icerik-marka-stratejisi"],
    icon: Code2,
    accent: "from-amber-500 to-orange-500",
  },
  {
    slug: "icerik-marka-stratejisi",
    title: "İçerik & Marka Stratejisi",
    short: "Hatırlanan bir marka kimliği ve tutarlı bir hikaye.",
    description:
      "Logodan tonalite rehberine, lansman kampanyasından yıllık içerik vizyonuna kadar markanızın dijital DNA'sını tasarlıyoruz. Rakamların arkasındaki ruhu inşa ediyoruz.",
    hero: "Müşterilerin sizi tanıdığında ne hissettiğini tasarlıyoruz. Logo, ton, mesaj, kampanya — bir markanın hatırlanmasını sağlayan tüm görsel ve sözel kimlik.",
    approach:
      "Marka, müşterinin marka adınızı duymadan hatırladığı her şeydir: ses tonunuz, görsel diliniz, müşteri hizmetlerinde nasıl davrandığınız. Bunu tek tek belgeleyip, ölçeklenebilir bir marka kitabı haline getiriyoruz. Sonra bu kitabı yaşayan bir şey olarak güncel tutuyoruz — çünkü statik bir marka rehberi değil, dinamik bir marka kültürü oluşturmak istiyoruz. Konumlandırmadan kampanyaya, naming'den manifestoya kadar markanızın dijital DNA'sını birlikte inşa ediyoruz.",
    bullets: [
      "Marka kimliği & ton rehberi",
      "Konumlandırma ve hikaye mimarisi",
      "Lansman ve PR kampanyaları",
      "Yıllık içerik vizyonu ve takvim",
      "Naming ve manifesto",
      "Kampanya konsept geliştirme",
    ],
    deliverables: [
      "70+ sayfalık marka kitabı",
      "Görsel ve sözel ton rehberi",
      "Lansman kampanyası planı",
      "Yıllık içerik temaları",
      "Naming önerileri",
    ],
    tools: ["Figma", "Notion", "Adobe Suite", "Brandpad", "Frontify"],
    process: [
      { title: "Marka Sorgulama", description: "İçeriden ve dışarıdan marka algısı araştırması." },
      { title: "Konumlandırma", description: "Pazardaki yeriniz, hikayeniz ve manifesto." },
      { title: "Kimlik Tasarımı", description: "Logo, renk, tipografi ve görsel sistem." },
      { title: "Marka Kitabı", description: "70+ sayfalık yaşayan rehber." },
      { title: "Lansman", description: "İçerik ve kampanya planı ile pazara çıkış." },
    ],
    outcomes: ["Marka kitabı", "Lansman kampanyası", "Tutarlı ses tonu", "Yıllık içerik vizyonu"],
    idealFor: ["Yeniden konumlanan markalar", "Yeni kurulan girişimler", "Marka tutarsızlığından yorulanlar"],
    faq: [
      { q: "Logo tasarımı dahil mi?", a: "Evet. Logo, renk paleti, tipografi ve görsel sistem tamamı dahildir. Mevcut bir logoyu yenilemek de yapılabilir." },
      { q: "Marka kitabı neye benziyor?", a: "70-120 sayfa arası, hem yazılı hem görsel bir rehber. Logo kullanımı, renk, tipografi, ses tonu, içerik kuralları, do/don't örnekleri." },
      { q: "Yeniden konumlandırma süresi?", a: "Tipik 8-12 hafta. Araştırma fazı uzun sürebilir; yaratım ve uygulama daha hızlı." },
    ],
    relatedSlugs: ["sosyal-medya-yonetimi", "web-tasarim-gelistirme", "seo"],
    icon: PenTool,
    accent: "from-rose-500 to-amber-500",
  },
];
