-- ============================================================================
-- İlk seed: hardcoded content → DB
-- Idempotent: ON CONFLICT ile çift çalıştırma güvenli
-- ============================================================================

-- ---------- SERVICES ----------
insert into services (slug, title, short, description, long_description, hero, approach, bullets, deliverables, tools, outcomes, ideal_for, related_slugs, icon, accent, sort_order)
values
('360-dijital-pazarlama', '360° Dijital Pazarlama', 'Strateji, üretim ve performans tek çatı altında.',
'Markanızın dijital varlığını uçtan uca yönetiriz. Pazarlama planlamasından kreatif üretime, medya satın almadan veriye dayalı optimizasyona kadar tek bir ekip, tek bir hesap planı.',
'Çoğu marka, ajans değişimini büyürken yapar — büyürken ek katmana ihtiyaç duyduğunu fark eder. Biz bu noktayı baştan kapatıyoruz. Sosyal medyadan SEO''ya, web sitesinden reklam yönetimine kadar tüm kanallar tek bir stratejinin parçası.',
'Birden çok ajansla değil, tek bir ortakla büyüyün. 360° pazarlama, markanızın tüm dijital varlığını tek bir vizyon altında birleştirir; siloları yıkar, hızı katlar.',
'Pazarlama bütünsel bir oyundur: bir kanalda yapılan iyileştirme, diğer kanaldan dönen müşteriyi etkiler. Biz markanızı tek bir ''sinir sistemi'' olarak modelliyoruz. Reklam ekibi, SEO ekibi ve sosyal medya ekibi aynı strateji belgesinden, aynı KPI setinden, aynı kreatif kütüphanesinden çalışır.',
ARRAY['Marka konumlandırma ve mesaj mimarisi','Çok kanallı pazarlama planı (paid + organic + CRM)','Aylık performans raporu ve canlı dashboard','Tek müşteri temsilcisiyle 360° koordinasyon','Kanal-spesifik kreatif paketleri','Atfetme (attribution) modeli kurulumu'],
ARRAY['90 günlük strateji belgesi','Kanal-bazlı KPI seti','Aylık kreatif paket','Looker Studio dashboard','Aylık performans sunumu'],
ARRAY['GA4','Meta Business Suite','Google Ads','Looker Studio','Notion','Figma','Slack'],
ARRAY['Tek müşteri temsilcisi','Tek strateji belgesi','+%30 ortalama verim artışı','Aylık şeffaf rapor'],
ARRAY['Aylık reklam bütçesi ₺150K+','Birden fazla kanalda kayboluyorum diyenler','Birden çok ajansla uğraşmaktan yorulmuş ekipler'],
ARRAY['reklam-yonetimi','seo','sosyal-medya-yonetimi'],
'Globe2', 'from-violet-500 to-indigo-500', 1),

('reklam-yonetimi', 'Reklam Yönetimi', 'Google, Meta ve TikTok''ta performans odaklı medya satın alma.',
'Bütçenizden maksimum geri dönüş alan, sürekli test edilen ve optimize edilen reklam kampanyaları kurguluyoruz. Her tıklamayı satın almaya, her gösterimi marka değerine çeviriyoruz.',
'Reklam, bilim ve sanatın kesiştiği noktadır. Doğru hedef kitleyi bulmak veridir; onlara doğru mesajı vermek yaratıcılıktır.',
'Bütçenizi ısrarla harcayan değil, ısrarla geri getiren reklam yönetimi. Google, Meta ve TikTok''ta veriyle yönetilen, kreatifle güçlendirilen performans kampanyaları.',
'İyi bir reklam hesabı 3 şeyin kesiştiği yerdir: doğru kitle, doğru kreatif, doğru ölçüm. 14 gün içinde anlamlı patern görmüyorsak stratejiyi değiştirmekten çekinmiyoruz.',
ARRAY['Google Ads (Arama, PMax, YouTube, Display)','Meta Ads (Facebook & Instagram funnel)','TikTok Ads ve creator partnerships','Dönüşüm takibi, GA4 ve attribution kurulumu','Haftalık kreatif iterasyonu','Server-side conversion API kurulumu'],
ARRAY['Reklam funnel mimarisi','Haftalık kreatif iterasyonu','Server-side conversion API kurulumu','Bütçe planı ve tahmin modelleri','Aylık performans raporu'],
ARRAY['Google Ads','Meta Ads Manager','TikTok Ads Manager','Triple Whale','Hyros','GA4'],
ARRAY['ROAS 4x+','CPA -%35 ortalama','Haftalık 3-5 yeni kreatif','Server-side tracking'],
ARRAY['E-ticaret markaları','Lead generation iş modelleri','Aylık reklam bütçesi ₺75K+'],
ARRAY['360-dijital-pazarlama','web-tasarim-gelistirme','icerik-marka-stratejisi'],
'Megaphone', 'from-pink-500 to-rose-500', 2),

('seo', 'SEO', 'Teknik SEO, içerik ve link inşası ile sürdürülebilir trafik.',
'Reklam bağımlılığını azaltan, uzun vadeli organik büyüme. Site mimarisinden Core Web Vitals''a, konu kümelerinden uluslararası SEO''ya kadar büyük resmi görüyoruz.',
'SEO''nun kısa yolu yok ama yanlış yolu çok. Net hedeflerle çalışıyoruz.',
'Reklamı kapattığınızda da gelmeye devam eden trafik. Teknik SEO, kullanıcı niyetine göre içerik mimarisi ve gerçek otorite linkleriyle sürdürülebilir organik büyüme.',
'SEO bir sprint değil maraton; ama doğru kurgulanmış maratonlar tahmin edilebilir hızla ilerler. EEAT prensiplerine uygun, AI''a karşı dayanıklı, gerçek otorite kuran içerik üretiyoruz.',
ARRAY['Teknik denetim ve site içi optimizasyon','Anahtar kelime araştırması ve içerik takvimi','EEAT odaklı içerik üretimi (TR & EN)','Otorite oluşturan link inşası','Core Web Vitals optimizasyonu','İç linkleme ve cluster mimarisi'],
ARRAY['120 sayfalık teknik audit raporu','Aylık 8-12 SEO içerik','Aylık 6-15 otorite linki','Aylık ranking raporu','Content cluster mimarisi'],
ARRAY['Ahrefs','Semrush','Screaming Frog','Search Console','Surfer SEO','Sitebulb'],
ARRAY['Organik trafik 3-5x','Top 3''te 50+ kelime','Yıllık 100+ içerik','Sürdürülebilir büyüme'],
ARRAY['B2B SaaS','İçerik bağımlı e-ticaret','Yerel hizmet markaları','Sağlık & finans (YMYL)'],
ARRAY['icerik-marka-stratejisi','web-tasarim-gelistirme','360-dijital-pazarlama'],
'Search', 'from-emerald-500 to-cyan-500', 3),

('mobil-uygulama-gelistirme', 'Mobil Uygulama Geliştirme', 'iOS ve Android için yüksek performanslı uygulamalar.',
'Fikirden yayına; React Native ve native teknolojilerle ölçeklenebilir, mağaza onayına hazır mobil uygulamalar geliştiriyoruz. Tasarımdan analytics kurulumuna kadar tek elden.',
NULL,
'Mağazada onay alan, kullanıcının sevdiği, ölçeklendirilebilir mobil uygulamalar. Fikrinizi 8-16 hafta içinde yayında bir ürüne dönüştürüyoruz.',
'Mobil uygulama ''yapmak'' kolay; mağazada kalıcı olmasını sağlamak zor. App Store onay süreçlerini, push notification stratejisini, onboarding optimizasyonunu ve ASO''yu ilk günden mimariye dahil ediyoruz.',
ARRAY['UX araştırması ve prototipleme','React Native, Swift, Kotlin','Push notification & in-app analytics','App Store ve Google Play yayın yönetimi','ASO ve organik büyüme kurulumu','Backend & API entegrasyonları'],
ARRAY['Figma''da yüksek detaylı prototip','iOS ve Android binary''leri','Mağaza listing kreatifleri','Crash & analytics dashboard kurulumu','Yayın sonrası 30 günlük bakım'],
ARRAY['React Native','Swift','Kotlin','Firebase','RevenueCat','Sentry','Mixpanel'],
ARRAY['Mağaza onayı %100','Tipik 8-16 hafta','Crash-free rate 99.5%+','Analytics ilk günden'],
ARRAY['Startup MVP''leri','Mevcut markaların mobile genişlemesi','Servis sektörü dijital ürünleri'],
ARRAY['saas-proje-gelistirme','web-tasarim-gelistirme','reklam-yonetimi'],
'Smartphone', 'from-cyan-500 to-blue-500', 4),

('saas-proje-gelistirme', 'SaaS Proje Geliştirme', 'Fikrinizi ölçeklenebilir bir ürüne dönüştürüyoruz.',
'MVP''den enterprise mimariye, abonelik altyapısından AI entegrasyonlarına kadar modern SaaS ürünleri inşa ediyoruz. Next.js, Node, Postgres ve bulut tabanlı altyapı uzmanlığı.',
NULL,
'Sadece kod değil, ölçeklenebilir bir iş modeli. MVP''den enterprise''a, abonelik altyapısından AI entegrasyonlarına kadar modern SaaS ürünleri.',
'SaaS girişimleri için ''kodu ne kadar hızlı yazıyorsunuz'' yanlış sorudur. Doğru soru: ''ürün-pazar uyumunu ne kadar hızlı bulabiliriz?''. Stripe entegrasyonu ilk günden, multi-tenant mimari, OpenAI/Anthropic entegrasyonları ve growth-ready altyapı standart paketin parçası.',
ARRAY['Ürün stratejisi & PMF danışmanlığı','Next.js + Node.js + PostgreSQL stack','Stripe ile abonelik ve faturalandırma','OpenAI / Anthropic AI entegrasyonları','Multi-tenant mimari','Auth, role yönetimi ve admin paneli'],
ARRAY['Ürün mimarisi belgesi','Sprint bazlı yayın','Stripe + analytics + auth kurulumu','Ürün ekibine devir paketi','Otomatik deploy pipeline'],
ARRAY['Next.js','Node.js','PostgreSQL','Stripe','Vercel','Supabase','OpenAI','Anthropic'],
ARRAY['MVP 8-12 hafta','Stripe ilk günden','Multi-tenant hazır','AI-ready altyapı'],
ARRAY['Yeni başlayan SaaS girişimleri','Mevcut markaların SaaS ürün lansmanı','Pilot deneyim isteyen şirketler'],
ARRAY['mobil-uygulama-gelistirme','web-tasarim-gelistirme','icerik-marka-stratejisi'],
'Layers', 'from-indigo-500 to-violet-500', 5),

('sosyal-medya-yonetimi', 'Sosyal Medya Yönetimi', 'Tutarlı bir marka sesi, ölçülebilir topluluk büyümesi.',
'Sadece içerik üretmiyoruz; topluluk inşa ediyoruz. Trend takibi, format testleri ve müşteri ile aktif diyaloglarla markanızı dijitalde canlı tutuyoruz.',
NULL,
'Takipçi sayısı değil, etkileşim derinliği. Trend duyarlı, marka sesi tutarlı bir sosyal medya yönetimi.',
'Sosyal medya bir yayın değil bir diyalog kanalıdır. İçeriği üreten ekiple toplulukla konuşan ekip aynı kişiler — çünkü en iyi içerik, takipçilerin sorduğu sorulardan doğar.',
ARRAY['İçerik stratejisi ve aylık takvim','Reels, TikTok ve YouTube Shorts üretimi','Topluluk yönetimi ve DM takibi','Influencer ve UGC iş birlikleri','Trend ve format testleri','Aylık performans paneli'],
ARRAY['Aylık 18-24 video içerik','Topluluk yönetimi (mesai içi)','Aylık 2-4 influencer iş birliği','Aylık performans paneli','Trend rapor bülteni'],
ARRAY['Later','Notion','CapCut Pro','Premiere Pro','Brand24','Sprout Social'],
ARRAY['Aylık 18-24 video','İlk yanıt < 30 dk','Influencer iş birliği','Format A/B testleri'],
ARRAY['D2C markaları','Hizmet sektörü','Eğitim & wellness markaları'],
ARRAY['icerik-marka-stratejisi','reklam-yonetimi','360-dijital-pazarlama'],
'Share2', 'from-fuchsia-500 to-pink-500', 6),

('web-tasarim-gelistirme', 'Web Tasarım & Geliştirme', 'Dönüşüme odaklı, hızlı ve premium görünümlü web siteleri.',
'Sadece estetik değil; sayfa hızı, SEO ve dönüşüm oranı için tasarlanmış kurumsal web siteleri ve landing page''ler.',
NULL,
'Sayfa hızı 95+, dönüşüm oranı yüksek, mobilde mükemmel. Markanızın dijital ofisini Next.js ile yeniden inşa ediyoruz.',
'Bir web sitesi şirketinin dijital ofisidir. Biz web sitelerini bir ''tasarım'' problemi gibi değil, ''satış sorumlusu'' gibi düşünüyoruz: her bölüm bir ikna görevi yapmalı, her CTA bir aksiyona götürmeli.',
ARRAY['Figma''da özel UI/UX tasarımı','Next.js & headless CMS (Sanity/Strapi)','Lighthouse 95+ performans hedefi','A/B test altyapısı ve CRO optimizasyonu','Çok dilli yapı','Analytics & heatmap kurulumu'],
ARRAY['Figma tasarım sistemi','Production-ready Next.js codebase','CMS eğitimi','Aylık CRO raporu','Analytics & heatmap kurulumu'],
ARRAY['Next.js','Figma','Sanity','Strapi','Vercel','Cloudflare','PostHog'],
ARRAY['Lighthouse 95+','Tipik 4-8 hafta','CMS-ready','Dönüşüm odaklı'],
ARRAY['Kurumsal yenileme','Lansman öncesi','Landing page kütüphanesi gerekenler'],
ARRAY['seo','saas-proje-gelistirme','icerik-marka-stratejisi'],
'Code2', 'from-amber-500 to-orange-500', 7),

('icerik-marka-stratejisi', 'İçerik & Marka Stratejisi', 'Hatırlanan bir marka kimliği ve tutarlı bir hikaye.',
'Logodan tonalite rehberine, lansman kampanyasından yıllık içerik vizyonuna kadar markanızın dijital DNA''sını tasarlıyoruz.',
NULL,
'Müşterilerin sizi tanıdığında ne hissettiğini tasarlıyoruz. Logo, ton, mesaj, kampanya — bir markanın hatırlanmasını sağlayan tüm görsel ve sözel kimlik.',
'Marka, müşterinin marka adınızı duymadan hatırladığı her şeydir. Bunu tek tek belgeleyip, ölçeklenebilir bir marka kitabı haline getiriyoruz.',
ARRAY['Marka kimliği & ton rehberi','Konumlandırma ve hikaye mimarisi','Lansman ve PR kampanyaları','Yıllık içerik vizyonu ve takvim','Naming ve manifesto','Kampanya konsept geliştirme'],
ARRAY['70+ sayfalık marka kitabı','Görsel ve sözel ton rehberi','Lansman kampanyası planı','Yıllık içerik temaları','Naming önerileri'],
ARRAY['Figma','Notion','Adobe Suite','Brandpad','Frontify'],
ARRAY['Marka kitabı','Lansman kampanyası','Tutarlı ses tonu','Yıllık içerik vizyonu'],
ARRAY['Yeniden konumlanan markalar','Yeni kurulan girişimler','Marka tutarsızlığından yorulanlar'],
ARRAY['sosyal-medya-yonetimi','web-tasarim-gelistirme','seo'],
'PenTool', 'from-rose-500 to-amber-500', 8)
on conflict (slug) do nothing;

-- ---------- SERVICE PROCESS STEPS ----------
-- 360-dijital-pazarlama
insert into service_process_steps (service_id, step_number, title, description)
select id, n, t, d from services s
cross join lateral (values
  (1, 'Keşif & Audit', 'Mevcut tüm kanallarınızı, hesaplarınızı ve dataları derinlemesine analiz ederiz. İlk 2 hafta.'),
  (2, 'Strateji', '90 günlük yol haritası, kanal mix''i ve KPI hedefleri belirlenir. 3. hafta.'),
  (3, 'Üretim', 'Kreatif, içerik ve teknik kurulumlar paralel devreye girer. 4-6. hafta.'),
  (4, 'Optimizasyon', 'Haftalık test-öğren-uygula döngüsü. Devamlı.'),
  (5, 'Raporlama', 'Aylık detay sunumu + canlı dashboard. Şeffaf rakamlar.')
) as steps(n, t, d)
where s.slug = '360-dijital-pazarlama'
on conflict do nothing;

insert into service_process_steps (service_id, step_number, title, description)
select id, n, t, d from services s
cross join lateral (values
  (1, 'Hesap Audit', 'Mevcut hesaplar, kreatifler ve dönüşüm takibi denetimi. Sızıntı noktaları belirlenir.'),
  (2, 'Test Planı', 'Hipotezler, hedef kitleler ve kreatif konseptleri için 30 günlük test planı.'),
  (3, 'Lansman', 'Funnel''lar kurulur, kreatifler üretilir, kampanyalar canlıya alınır.'),
  (4, 'Optimizasyon', 'Günlük bütçe yönetimi, haftalık kreatif yenileme, ölçeklendirme.'),
  (5, 'Ölçek', 'Kazanan kombinasyonlar bütçe artışıyla ölçeklenir.')
) as steps(n, t, d)
where s.slug = 'reklam-yonetimi'
on conflict do nothing;

insert into service_process_steps (service_id, step_number, title, description)
select id, n, t, d from services s
cross join lateral (values
  (1, 'Teknik Audit', 'Site mimarisi, indexlenme, hız ve Core Web Vitals kapsamlı denetimi.'),
  (2, 'Anahtar Kelime & Strateji', 'Niyet-odaklı kümeleme, rakip analizi ve içerik takvimi.'),
  (3, 'Teknik İyileştirme', 'On-page SEO, schema, internal linking ve teknik düzeltmeler.'),
  (4, 'İçerik & Link', 'Aylık içerik + dijital PR ve otorite link inşası.'),
  (5, 'İzleme & İterasyon', 'Aylık rank takibi, içerik güncellemeleri ve genişleme.')
) as steps(n, t, d)
where s.slug = 'seo'
on conflict do nothing;

insert into service_process_steps (service_id, step_number, title, description)
select id, n, t, d from services s
cross join lateral (values
  (1, 'Keşif & UX', 'Hedef kullanıcı, jobs-to-be-done ve flow haritalama.'),
  (2, 'Prototip', 'Figma''da etkileşimli prototip, kullanıcı testleri.'),
  (3, 'Geliştirme', '2 haftalık sprintlerle yayına yakın bir ürün.'),
  (4, 'Beta', 'TestFlight ve internal testing, son düzenlemeler.'),
  (5, 'Yayın & ASO', 'Mağaza onayı, listing optimizasyonu ve lansman.')
) as steps(n, t, d)
where s.slug = 'mobil-uygulama-gelistirme'
on conflict do nothing;

insert into service_process_steps (service_id, step_number, title, description)
select id, n, t, d from services s
cross join lateral (values
  (1, 'Discovery', 'İş modeli, kullanıcı segmentleri ve teknik gereksinimler.'),
  (2, 'Mimari', 'Veri modeli, multi-tenancy, scalability ve security baseline.'),
  (3, 'Sprint Geliştirme', '2 haftalık sprintlerle iteratif yayın.'),
  (4, 'Beta & Iterasyon', 'İlk kullanıcılar, ürün analitiği, hızlı iterasyon.'),
  (5, 'Yayın & Devir', 'Production lansman ve ürün ekibine devir paketi.')
) as steps(n, t, d)
where s.slug = 'saas-proje-gelistirme'
on conflict do nothing;

insert into service_process_steps (service_id, step_number, title, description)
select id, n, t, d from services s
cross join lateral (values
  (1, 'Ses & Strateji', 'Marka sesi, format mix''i ve aylık tema kurgusu.'),
  (2, 'İçerik Üretimi', 'Çekim, kurgu ve yayın planı.'),
  (3, 'Yayın & Etkileşim', 'Optimal saat planlaması, hızlı yorum ve DM yönetimi.'),
  (4, 'Influencer İş Birliği', 'Doğru creator''larla brief, prodüksiyon ve raporlama.'),
  (5, 'Optimizasyon', 'Trend testleri, kazanan formatların ölçeklenmesi.')
) as steps(n, t, d)
where s.slug = 'sosyal-medya-yonetimi'
on conflict do nothing;

insert into service_process_steps (service_id, step_number, title, description)
select id, n, t, d from services s
cross join lateral (values
  (1, 'Discovery & Wireframe', 'Hedef kitle, sayfa mimarisi ve wireframe.'),
  (2, 'Tasarım', 'Figma''da yüksek detay UI, tasarım sistemi.'),
  (3, 'Geliştirme', 'Next.js + CMS entegrasyonu, performans optimizasyonu.'),
  (4, 'QA & Yayın', 'Cross-browser testler, accessibility ve canlı.'),
  (5, 'İterasyon', 'Heatmap, A/B test ve aylık CRO iyileştirmeleri.')
) as steps(n, t, d)
where s.slug = 'web-tasarim-gelistirme'
on conflict do nothing;

insert into service_process_steps (service_id, step_number, title, description)
select id, n, t, d from services s
cross join lateral (values
  (1, 'Marka Sorgulama', 'İçeriden ve dışarıdan marka algısı araştırması.'),
  (2, 'Konumlandırma', 'Pazardaki yeriniz, hikayeniz ve manifesto.'),
  (3, 'Kimlik Tasarımı', 'Logo, renk, tipografi ve görsel sistem.'),
  (4, 'Marka Kitabı', '70+ sayfalık yaşayan rehber.'),
  (5, 'Lansman', 'İçerik ve kampanya planı ile pazara çıkış.')
) as steps(n, t, d)
where s.slug = 'icerik-marka-stratejisi'
on conflict do nothing;

-- ---------- SERVICE FAQs ----------
insert into service_faqs (service_id, question, answer, sort_order)
select s.id, q, a, n from services s
cross join lateral (values
  (1, 'Mevcut ajansımdan geçiş süreci nasıl?', 'Önce 2-3 haftalık paralel devir süreci. Mevcut ajansınızla iletişim kuruyor, hesapları, verileri ve süregelen kampanyaları sorunsuz alıyoruz. Sıfır kesinti.'),
  (2, 'İçeride bir pazarlama ekibim varsa hala bu hizmeti alabilir miyim?', 'Elbette. Çoğu müşterimiz iç pazarlama ekibinin uzantısı olarak çalıştığımız modeli tercih ediyor.'),
  (3, 'Kaç kişilik bir ekip benim hesabıma bakacak?', 'Tipik olarak 1 hesap müdürü + 3-5 uzman (reklam, SEO, kreatif, sosyal medya, vb.) ekibinizle aktif çalışır.')
) as faqs(n, q, a)
where s.slug = '360-dijital-pazarlama'
on conflict do nothing;

insert into service_faqs (service_id, question, answer, sort_order)
select s.id, q, a, n from services s
cross join lateral (values
  (1, 'Mevcut reklam hesaplarımı nasıl alacaksınız?', 'Google ve Meta Business Manager üzerinden hesap erişimi alıyoruz. Hesap sahipliği sizde kalır.'),
  (2, 'İlk ay sonuç bekleyebilir miyim?', 'İlk 30 gün öğrenme dönemidir. Anlamlı performans iyileşmesi tipik olarak 45-90 gün arasında başlar.'),
  (3, 'Kreatif üretimi dahil mi?', 'Evet. Aylık belirli sayıda statik görsel ve video kreatif retainer''a dahildir.'),
  (4, 'Reklam bütçesi nasıl yönetilir?', 'Reklam bütçesi doğrudan kendi reklam hesaplarınızdan harcanır — biz sadece yönetiriz. Şeffaflık tam.')
) as faqs(n, q, a)
where s.slug = 'reklam-yonetimi'
on conflict do nothing;

insert into service_faqs (service_id, question, answer, sort_order)
select s.id, q, a, n from services s
cross join lateral (values
  (1, 'İlk sonuçları ne zaman göreceğim?', 'Teknik iyileştirmelerin etkisi 4-8 hafta içinde Search Console''da görünmeye başlar. İçerik sıralamaları 3-6 ay, otorite kelimelerde 6-12 ay arasında oturur.'),
  (2, 'AI içerik mi yazıyorsunuz?', 'Tamamen değil. AI''dan yararlanıyoruz ama her yayın insan tarafından yeniden yazılıyor ve doğrulanıyor.'),
  (3, 'Link inşası riskli değil mi?', 'Biz black-hat tekniklerden uzağız. Sadece dijital PR, misafir yazarlık ve içerik amplifikasyonu yapıyoruz.'),
  (4, 'Mevcut içeriklerimi optimize ediyor musunuz?', 'Evet, content refresh denilen bu süreç en hızlı kazanım yollarından biri.')
) as faqs(n, q, a)
where s.slug = 'seo'
on conflict do nothing;

insert into service_faqs (service_id, question, answer, sort_order)
select s.id, q, a, n from services s
cross join lateral (values
  (1, 'React Native mi native mi?', 'Çoğu durumda React Native; geliştirme süresi yarıya iner, tek codebase iki platforma yayınlanır.'),
  (2, 'Mağaza red yer mi?', 'Şu ana kadar yönettiğimiz tüm uygulamalar onaylandı. Red gelirse onay alana kadar düzeltmeler retainer kapsamındadır.'),
  (3, 'Sürdürme/bakım sonrası nasıl?', 'Yayın sonrası 30 günlük destek dahildir. Sonrasında aylık bakım/feature retainer''ı tanımlanır.')
) as faqs(n, q, a)
where s.slug = 'mobil-uygulama-gelistirme'
on conflict do nothing;

insert into service_faqs (service_id, question, answer, sort_order)
select s.id, q, a, n from services s
cross join lateral (values
  (1, 'Kaynak kodu kime ait?', 'Tamamen size. GitHub organizasyonunuz üzerinden çalışırız, fikri mülkiyet ilk günden sizdedir.'),
  (2, 'Bizim geliştirici ekibimize devredilebilir mi?', 'Evet, bu standart süreçtir. Devir paketi içinde dokümantasyon, onboarding ve 4 haftalık paralel destek bulunur.'),
  (3, 'AI özellikler nasıl entegre oluyor?', 'OpenAI ve Anthropic API''leri başta olmak üzere LLM''leri ürün akışlarına gömüyoruz.')
) as faqs(n, q, a)
where s.slug = 'saas-proje-gelistirme'
on conflict do nothing;

insert into service_faqs (service_id, question, answer, sort_order)
select s.id, q, a, n from services s
cross join lateral (values
  (1, 'Çekimleri kim yapıyor?', 'İçeriğinin doğasına göre: kendi stüdyomuzda çekim, UGC üreticilerle iş birliği veya marka tarafında çekilen ham içeriklerin kurgulanması.'),
  (2, 'Hangi platformlarda çalışıyorsunuz?', 'Öncelik: Instagram, TikTok, YouTube Shorts. LinkedIn, X ve Threads ihtiyaca göre eklenir.'),
  (3, 'Topluluk yönetimi saatleri?', 'Hafta içi 09:00-19:00 arası aktif yönetim. Acil durumlar için 7/24 nöbetçi sistemimiz var.')
) as faqs(n, q, a)
where s.slug = 'sosyal-medya-yonetimi'
on conflict do nothing;

insert into service_faqs (service_id, question, answer, sort_order)
select s.id, q, a, n from services s
cross join lateral (values
  (1, 'Mevcut sitemi yenileyebilir misiniz?', 'Evet. Mevcut sitenin SEO değerini koruyarak yenileme yapıyoruz — 301 yönlendirmeler, içerik aktarımı dahil.'),
  (2, 'Hangi CMS''i öneriyorsunuz?', 'İçerik yoğunluğu fazla ise Sanity, daha klasik bir admin paneli için Strapi.'),
  (3, 'Hosting nereden?', 'Vercel veya Cloudflare öneriyoruz — sıfır config, sıfır downtime, global edge network.')
) as faqs(n, q, a)
where s.slug = 'web-tasarim-gelistirme'
on conflict do nothing;

insert into service_faqs (service_id, question, answer, sort_order)
select s.id, q, a, n from services s
cross join lateral (values
  (1, 'Logo tasarımı dahil mi?', 'Evet. Logo, renk paletinin tamamı dahildir. Mevcut bir logoyu yenilemek de yapılabilir.'),
  (2, 'Marka kitabı neye benziyor?', '70-120 sayfa arası, hem yazılı hem görsel bir rehber.'),
  (3, 'Yeniden konumlandırma süresi?', 'Tipik 8-12 hafta. Araştırma fazı uzun sürebilir; yaratım ve uygulama daha hızlı.')
) as faqs(n, q, a)
where s.slug = 'icerik-marka-stratejisi'
on conflict do nothing;

-- ---------- PORTFOLIO PROJECTS ----------
insert into portfolio_projects (slug, title, client, category, description, metric, gradient, tags, sort_order) values
('lumen-cosmetics-roas','Lumen Cosmetics — ROAS 4.8x','Lumen Cosmetics','Reklam','Meta ve Google''da yeniden yapılandırılan funnel ve creative testing ile 6 ayda satışları 3.4 katına çıkardık.','ROAS 4.8x','from-fuchsia-500 via-violet-500 to-indigo-500',ARRAY['Meta Ads','Google Ads','CRO'],1),
('tessera-saas-mvp','Tessera — 8 Haftada MVP','Tessera','SaaS','Fikir aşamasından canlıya; Stripe abonelik, AI özetleme ve takım iş birliği özellikleriyle hazır bir SaaS ürünü.','8 hafta','from-cyan-500 via-blue-500 to-indigo-500',ARRAY['Next.js','Stripe','OpenAI'],2),
('nordel-home-seo','Nordel Home — Organik Trafikte 4.6x','Nordel Home','SEO','Teknik SEO, konu kümeleri ve link inşası ile organik trafiği 9 ayda 4.6 katına çıkardık.','+460%','from-emerald-500 via-teal-500 to-cyan-500',ARRAY['Technical SEO','İçerik','Linkbuilding'],3),
('voltra-mobility-app','Voltra Mobility — Mobil Uygulama','Voltra','Mobil','Elektrikli scooter operatörü için iOS & Android uygulaması. İlk 90 günde 50K+ indirme.','50K+ indirme','from-amber-500 via-orange-500 to-rose-500',ARRAY['React Native','Maps SDK','Stripe'],4),
('vera-moda-tiktok','Vera Moda — TikTok Büyüme','Vera Moda','Sosyal Medya','Sıfırdan kurgulanan TikTok stratejisi ve influencer iş birlikleri ile 3 ayda 180K organik takipçi.','+180K takipçi','from-rose-500 via-pink-500 to-fuchsia-500',ARRAY['TikTok','UGC','Influencer'],5),
('greenly-foods-web','Greenly Foods — E-ticaret Yeniden Tasarımı','Greenly Foods','Web','Shopify Plus üzerine inşa edilen yeni alışveriş deneyimi ile dönüşüm oranı %42 arttı.','Dönüşüm +%42','from-lime-500 via-emerald-500 to-teal-500',ARRAY['Shopify Plus','CRO','UX'],6),
('kavros-fintech-app','Kavros — Fintech Mobil Uygulaması','Kavros','Mobil','Bireysel yatırımcılar için portfolio takip uygulaması. App Store Türkiye finans kategorisinde Top 10.','Top 10','from-indigo-500 via-violet-500 to-purple-500',ARRAY['Swift','Kotlin','GraphQL'],7),
('altan-clinic-ads','Altan Clinic — Lead Generation','Altan Clinic','Reklam','Sağlık turizmi odaklı çok dilli kampanyalarla CPL %58 düşürüldü.','CPL -%58','from-sky-500 via-cyan-500 to-blue-500',ARRAY['Google Ads','Meta','Landing Page'],8)
on conflict (slug) do nothing;

-- ---------- TESTIMONIALS ----------
insert into testimonials (name, role, company, quote, initials, sort_order) values
('Selin Aksoy','Pazarlama Direktörü','Lumen Cosmetics','E-Digital ile çalıştığımız 6 ayda ROAS''ımız 2.1''den 4.8''e çıktı. En etkileyici olan şey rakamlar değil, ekip dinamiği — markamızı bizim kadar sahipleniyorlar.','SA',1),
('Kerem Doğan','Kurucu','Tessera SaaS','MVP''mizi 8 haftada yayınladılar. Sadece kod yazmadılar; ürün stratejisinden onboarding flow''una kadar gerçek bir teknoloji ortağı gibi davrandılar.','KD',2),
('Beyza Yılmaz','E-ticaret Müdürü','Nordel Home','SEO ekibi gerçek anlamda farkı gösterdi. 9 ay içinde organik trafiğimiz 4.6 katına çıktı, marka kelimelerimizde 1. sıradayız.','BY',3),
('Mert Çelik','CEO','Voltra Mobility','Mobil uygulamamızın yayın süreci stresli olabilirdi ama E-Digital tüm süreci yönetti. App Store onayından ilk 50K indirmeye kadar yanımızdaydılar.','MÇ',4),
('Asya Pamir','Marka Müdürü','Vera Moda','TikTok ve Reels stratejimizi sıfırdan kurguladılar. 3 ayda 180K organik takipçi kazandık.','AP',5),
('Onur Şahin','Kurucu Ortak','Greenly Foods','Şeffaf raporlama, hızlı iletişim ve doğru beklenti yönetimi. Ajans değişimi yaparken aradığımız her şeyi tek bir yerde bulduk.','OŞ',6)
on conflict do nothing;

-- ---------- TEAM ----------
insert into team_members (name, role, bio, initials, accent, sort_order) values
('Emre Tagay','Kurucu & Strateji Direktörü','10+ yıllık dijital pazarlama deneyimi. Her yeni projeye doğrudan dahil olur, ilk strateji görüşmesini bizzat yürütür.','ET','from-violet-500 to-indigo-500',1),
('Deniz Aydın','Performans Pazarlama Lideri','Google Ads ve Meta Ads üzerine uzmanlık. Yönettiği bütçe aylık 5M TL+. Sertifikalı Google Premier Partner.','DA','from-pink-500 to-rose-500',2),
('Mehmet Kaya','Teknoloji Lideri','10 yıllık full-stack geliştirme deneyimi. Next.js ve React Native ile ölçeklenebilir ürünler kurar.','MK','from-cyan-500 to-blue-500',3),
('Zeynep Şahin','Kreatif Direktör','Geçmişte ajans dünyasında 8 yıl. Markaların görsel kimliğini, ton rehberini ve kampanya kreatifini yönetir.','ZŞ','from-amber-500 to-orange-500',4),
('Burak Yıldız','SEO ve İçerik Lideri','Teknik SEO ve link inşası uzmanı. EEAT prensiplerine sadık içerik stratejileri tasarlar.','BY','from-emerald-500 to-cyan-500',5),
('Asya Demir','Müşteri İlişkileri Lideri','Müşteri başarısı (CS) odaklı. Her hesap için ayrı bir başarı planı, haftalık iletişim ritmi, şeffaf raporlama.','AD','from-rose-500 to-fuchsia-500',6)
on conflict do nothing;

-- ---------- TIMELINE ----------
insert into timeline_events (year, title, description, sort_order) values
('2015','İlk e-ticaret deneyimi','Emre Tagay, kendi kurduğu e-ticaret markasıyla dijital pazarlama dünyasına girer.',1),
('2017','Freelance dönemi','Aldığı sonuçların başka markaların da işine yarayabileceğini fark eder. Freelance olarak 12 markaya pazarlama danışmanlığı verir.',2),
('2019','E - Digital Marketing kuruluyor','Performans pazarlaması ile teknoloji geliştirmeyi tek çatı altında birleştiren ajans kurulur. İlk yılda 8 müşteri.',3),
('2021','Ekip büyür, SaaS departmanı açılır','Pazarlama ekibinin yanına yazılım geliştirme departmanı eklenir. İlk SaaS müşterilerimize MVP geliştiriyoruz.',4),
('2023','Mobil uygulama bölümü','React Native ve native mobil geliştirme yetenekleri ile bölüm açılır.',5),
('2024','AI entegrasyonları','OpenAI ve Anthropic entegrasyonları ile müşteri SaaS ürünlerine AI özellikleri ekleriz.',6),
('2026','Bugün','İstanbul merkezli 14 kişilik ekip, 60+ aktif müşteri, 320''den fazla tamamlanmış proje.',7)
on conflict do nothing;

-- ---------- INDUSTRIES ----------
insert into industries (name, description, highlights, sort_order) values
('E-ticaret & D2C','Shopify, WooCommerce ve özel mağaza altyapılarıyla beslenen markalar için satış odaklı funnel''lar kuruyoruz.',ARRAY['+50 D2C markası','ROAS odaklı'],1),
('SaaS & Yazılım','MRR büyütmek için lifecycle e-mail, ürün-led büyüme ve SEO + paid kombinasyonu.',ARRAY['ARR x3 vakaları','Self-serve onboarding'],2),
('Fintech','Hassas reglüsyonlu sektörde yaratıcı kampanyalar — bireysel finanstan dijital cüzdana.',ARRAY['KYC funnel','Trust-first kreatif'],3),
('Sağlık & Sağlık Turizmi','Estetik kliniklerden saç ekimine kadar çok dilli lead generation kampanyaları.',ARRAY['Çok dilli landing','Lead kalitesi optimizasyonu'],4),
('Eğitim & Kariyer','Online kurslar, bootcamp''ler ve B2B eğitim platformları için satış funnel''ları.',ARRAY['Webinar funnel','Topluluk kurma'],5),
('B2B & Endüstri','Uzun satış döngülü B2B markalar için LinkedIn, içerik pazarlaması ve ABM stratejileri.',ARRAY['ABM','LinkedIn organic'],6)
on conflict do nothing;

-- ---------- TECH ITEMS ----------
insert into tech_items (name, category, sort_order) values
('Next.js','Frontend',1),('React Native','Mobil',2),('Node.js','Backend',3),('PostgreSQL','Veritabanı',4),
('Vercel','Hosting',5),('Cloudflare','CDN/DNS',6),('Stripe','Ödeme',7),('Supabase','Backend-as-a-Service',8),
('Google Ads','Reklam',9),('Meta Ads','Reklam',10),('TikTok Ads','Reklam',11),('GA4','Analytics',12),
('Looker Studio','Reporting',13),('Ahrefs','SEO',14),('Semrush','SEO',15),('Figma','Tasarım',16),
('Notion','İş Birliği',17),('Linear','Proje Yönetimi',18),('Slack','İletişim',19),
('OpenAI','AI',20),('Anthropic','AI',21)
on conflict do nothing;

-- ---------- FAQS (anasayfa scope) ----------
insert into faqs (scope, question, answer, sort_order) values
('home','Hangi sektörlerde çalışıyorsunuz?','E-ticaret, SaaS, sağlık, fintech, eğitim ve B2B hizmetler başta olmak üzere geniş bir yelpazede çalışıyoruz.',1),
('home','Sözleşme süresi minimum ne kadar?','Reklam yönetimi ve SEO gibi süreklilik isteyen hizmetlerde 3 ay minimum çalışma öneriyoruz.',2),
('home','Raporlamayı nasıl yapıyorsunuz?','Her müşterimiz için canlı bir Looker Studio dashboard''u kuruyoruz.',3),
('home','Kreatifleri kim üretiyor?','Reklam görselleri, video kurguları ve sosyal medya içerikleri için kendi bünyemizde sanat yönetmenleri, motion designer ve copywriter''larımız var.',4),
('home','Mevcut ekibimle nasıl entegre olursunuz?','Şirket içi pazarlama veya teknoloji ekibinizle bir uzantı gibi çalışıyoruz.',5),
('home','Fiyatlandırma modeliniz nasıl?','Reklam yönetiminde bütçenizin yüzdesi + sabit yönetim ücreti, SEO ve içerikte aylık retainer modelleriyle çalışıyoruz.',6)
on conflict do nothing;

-- ---------- PAGE SECTIONS (about) ----------
-- Hakkımızda sayfasının dinamik section'ları.
-- body.items: [{ icon, title, desc }] veya [{ title, year }] vb.
insert into page_sections (page_slug, section_key, eyebrow, title, description, body, sort_order) values
(
  'about','values','Değerlerimiz','Bizi biz yapan altı disiplin',
  'Bir ekip kültürü kelimelerden değil, günlük kararlardan oluşur. İşte bizim her sabah masaya getirdiğimiz altı disiplin.',
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('icon','Sparkles','title','Sahiplenme','desc','Müşterimizin işine kendi işimiz gibi yaklaşıyoruz. Sorumluluk parantezler arasında kalmıyor; sonuçlarla ölçülüyor.'),
    jsonb_build_object('icon','ShieldCheck','title','Şeffaflık','desc','Bütçe, performans ve süreçler her zaman açık. Sürprizler kampanya optimizasyonlarında olur, fatura kalemlerinde değil.'),
    jsonb_build_object('icon','Gauge','title','Hız','desc','Bir testin sonucu birkaç gün içinde elimizde olur. Yavaş ajans çağı geride kaldı; hız bizim için bir disiplin.'),
    jsonb_build_object('icon','Users','title','Uzmanlık','desc','Generalist değil, uzman. Reklam, SEO, geliştirme, içerik — her alan kendi içinde ustalaşmış ekiplerce yönetiliyor.'),
    jsonb_build_object('icon','HeartHandshake','title','Uzun Vade','desc','Tek kampanyalık iş ortaklığı kurmuyoruz. 3 ay ya da 3 yıl, hedefimiz markanızın sürdürülebilir büyümesi.'),
    jsonb_build_object('icon','Lightbulb','title','Yaratıcılık','desc','Data güzeldir, ama yaratıcılık olmadan bir şey ifade etmez. İkisi bir araya geldiğinde markalar fark yaratır.')
  )),
  10
),
(
  'about','culture','İçeriden bir bakış','Ofisimizde nasıl çalışıyoruz?',
  'Çalışan deneyiminin müşteri deneyimini doğrudan etkilediğine inanıyoruz. Bu yüzden ekibimizin çalışma şartlarını ciddiye alıyoruz.',
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('icon','Coffee','title','Async-first çalışma kültürü','desc','Toplantıyı gerçekten gerektiren konular için toplantı yapıyoruz. Geri kalanı Notion ve Slack üzerinden async ilerliyor.'),
    jsonb_build_object('icon','Trophy','title','Sonuç odaklı, mesai odaklı değil','desc','9-6 değil; hedef-deadline modeli. Ekibimiz hibrit çalışıyor, ofise gelmek tercih, zorunluluk değil.'),
    jsonb_build_object('icon','Award','title','Sürekli öğrenme bütçesi','desc','Her ekip arkadaşımıza yıllık kurs, konferans ve kitap bütçesi sağlıyoruz. Bilgi yaşlanır, biz tazelemekten yorulmuyoruz.'),
    jsonb_build_object('icon','Briefcase','title','Anonim müşteri geri bildirimi','desc','Müşteri NPS skorlarını üçer aylık ölçüyoruz. Düşen skorlar ekip OKR''larında doğrudan etki yapıyor.')
  )),
  20
),
(
  'about','recognitions','Sertifikalar','Sektörel onaylar ve tanınırlık',
  'Ödüller işin merkezi değil ama dış doğrulamaya değer veriyoruz. İşte hesaplarımızı yöneten platformların ve sektörün bizi nasıl tanıdığı.',
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('title','Google Premier Partner','year','2023, 2024, 2025, 2026'),
    jsonb_build_object('title','Meta Business Partner','year','2022 – devam ediyor'),
    jsonb_build_object('title','Clutch Top B2B','year','Türkiye 2024, 2025'),
    jsonb_build_object('title','Awwwards Honorable Mention','year','2 web projesi (2024)'),
    jsonb_build_object('title','Mağaza onayı','year','%100 başarı (mobil uyg.)'),
    jsonb_build_object('title','Ortalama müşteri NPS','year','9.2 / 10')
  )),
  30
),
(
  'about','why','Neden Biz?','Bizi diğerlerinden ayıran dört şey',
  'Pazarlama sektörü kalabalık. Markaların neden bizi tercih ettiğini, müşterilerimizin sözlerinden değil, çalışma modelimizden anlatmayı tercih ediyoruz.',
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('title','Tek bir ekipten 360°','desc','Reklam, SEO, sosyal medya, web ve mobil geliştirme için ayrı ajanslarla uğraşmak yerine her şeyi tek bir noktada koordine ediyoruz. İletişim sürtüşmesi sıfır, hız maksimum.'),
    jsonb_build_object('title','Performansa bağlı raporlama','desc','Aylık raporlar markanın gerçek hedefleriyle eşleşir. Beğeni ve gösterim sayıları değil; satış, lead ve ROAS gibi gerçek metrikler.'),
    jsonb_build_object('title','Kurucunun doğrudan dahil olması','desc','Junior''lara devredilmeyen, kurucu Emre Tagay''ın stratejik kararlarda doğrudan rol aldığı bir çalışma modeli.'),
    jsonb_build_object('title','Teknoloji + Pazarlama hibrit DNA''sı','desc','SaaS ve mobil uygulama geliştirebildiğimiz için pazarlama kampanyaları teknik altyapıyı da düşünür. Bu kombinasyon, ajansların büyük çoğunluğunda yok.')
  )),
  40
)
on conflict (page_slug, section_key) do update set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  description = excluded.description,
  body = excluded.body,
  sort_order = excluded.sort_order;
