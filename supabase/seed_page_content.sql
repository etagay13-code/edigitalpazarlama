-- ============================================================================
-- EK SAYFA İÇERİKLERİ (page_sections)
-- Daha önce kodda sabit (hardcoded) olan bölümleri admin'den düzenlenebilir
-- yapmak için ekler. Yeni section_key'ler oldukları için "do nothing" kullanır:
-- böylece tekrar çalıştırmak admin'den yapılmış düzenlemeleri EZMEZ.
--
-- Kullanım:  npm run db:migrate -- supabase/seed_page_content.sql
-- ============================================================================

insert into page_sections (page_slug, section_key, eyebrow, title, description, body, sort_order) values

-- ---------------------------------------------------------------- HOME ------
(
  'home','hero','Yeni nesil 360° dijital ajans','A''dan Z''ye dijital büyüme ortağınız',
  'Reklam, SEO, sosyal medya, mobil uygulama ve SaaS geliştirme — markanızı büyütmek için ihtiyacınız olan her şey tek bir ekipte. Stratejiyi kuruyor, kreatifi üretiyor, performansı ölçüyor ve sürekli optimize ediyoruz.',
  jsonb_build_object(
    'highlight','dijital büyüme',
    'primaryLabel','Ücretsiz Teklif Al','primaryHref','/iletisim',
    'secondaryLabel','Hizmetleri İncele','secondaryHref','/hizmetler',
    'note1','Şu an 6 yeni proje kabul ediyoruz',
    'note2','Ortalama 48 saat içinde teklif'
  ),
  10
),
(
  'home','brand_strip','Birlikte büyüdüğümüz markalar',null,null,
  jsonb_build_object('items', jsonb_build_array(
    'LUMEN','TESSERA','NORDEL','VOLTRA','VERA MODA','GREENLY','KAVROS','ALTAN CLINIC'
  )),
  20
),
(
  'home','services_header','Hizmetler','Markanızı büyütecek tüm uzmanlıklar',
  'Reklamdan SEO''ya, mobil uygulamadan SaaS geliştirmeye — markanız büyüdükçe ihtiyaç duyacağınız her hizmet kendi içinde uzmanlaşmış ekiplerle sunuluyor.',
  jsonb_build_object('linkLabel','Tüm hizmetler','linkHref','/hizmetler'),
  30
),
(
  'home','stats',null,null,null,
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('label','Yönetilen reklam bütçesi','to',18,'prefix','₺','suffix','M+','decimals',0),
    jsonb_build_object('label','Tamamlanan kampanya','to',320,'suffix','+','decimals',0),
    jsonb_build_object('label','Ortalama ROAS','to',4.6,'suffix','x','decimals',1),
    jsonb_build_object('label','Mutlu müşteri','to',64,'suffix','+','decimals',0)
  )),
  40
),
(
  'home','workflow','Çalışma Süreci','Net adımlar, ölçülebilir sonuçlar',
  'Müşterilerimizle ilk konuşmadan ilk raporlamaya kadar her aşamayı netleştirdik. Sürprizler büyüyen kampanyalarda olur, süreçte değil.',
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('icon','Compass','title','Keşif','desc','Markanızı, rakiplerinizi ve hedef kitlenizi derinlemesine anlıyoruz. Mevcut datalarınızı analiz ediyoruz.'),
    jsonb_build_object('icon','Map','title','Strateji','desc','Hedeflerinize uygun kanalları, mesajları ve KPI''ları belirleyen 90 günlük yol haritasını çıkarıyoruz.'),
    jsonb_build_object('icon','Rocket','title','Uygulama','desc','Kreatif üretiminden teknik kuruluma kadar her şeyi tek çatı altında devreye alıyoruz.'),
    jsonb_build_object('icon','LineChart','title','Optimizasyon','desc','A/B testleri, bütçe yeniden dağıtımı ve haftalık iterasyonlarla performansı sürekli iyileştiriyoruz.'),
    jsonb_build_object('icon','FileText','title','Raporlama','desc','Şeffaf canlı dashboard ve aylık sunumlarla sonuçları sadelikle gösteriyoruz.')
  )),
  50
),

-- -------------------------------------------------------------- GLOBAL ------
(
  'global','cta','İletişim','Bir sonraki büyüme dönemini birlikte planlayalım',
  'Ücretsiz 30 dakikalık keşif görüşmesi. Hedeflerinizi konuşalım, mevcut kanallarınıza dair somut bir aksiyon planı çıkaralım.',
  jsonb_build_object('highlight','birlikte planlayalım','primaryLabel','Görüşme Planla','primaryHref','/iletisim'),
  10
),

-- --------------------------------------------------------------- ABOUT ------
(
  'about','hero','Hakkımızda','Markaları büyütmek için kurulmuş bir ekip',
  'True EDigital Marketing, performans pazarlaması ile teknoloji geliştirmenin kesiştiği noktada konumlanır. 2019''dan bu yana e-ticaret, SaaS ve hizmet markalarına dijital büyüme ortaklığı sunuyoruz.',
  null, 1
),
(
  'about','stats',null,null,null,
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('label','Yıldır faaliyetteyiz','to',7,'suffix','+','decimals',0),
    jsonb_build_object('label','Aktif müşteri','to',60,'suffix','+','decimals',0),
    jsonb_build_object('label','Tamamlanan proje','to',320,'suffix','+','decimals',0),
    jsonb_build_object('label','Ekip arkadaşımız','to',14,'suffix','','decimals',0)
  )),
  2
),
(
  'about','story','Hikayemiz','Kurucumuz Emre Tagay''ın hikayesi',null,
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('text','Emre Tagay, dijital pazarlama dünyasına 2015''te bir e-ticaret markasının kurucusu olarak girdi. Kendi markasını büyütmek için Google Ads, Meta Ads ve SEO öğrenmek zorunda kaldı — ve aslında pek çok Türkiye markasının da aynı sorunla boğuştuğunu fark etti: doğru ajansı bulamamak.'),
    jsonb_build_object('text','Çoğu ajans büyük müşterilerle dolu ya da sadece tek alanda uzman. Hem stratejiyi düşünen, hem kreatifi üreten, hem teknolojiyi geliştiren bir partneri bulmak nadirdi. 2017-2019 arasında 12+ markaya freelance danışmanlık verdikten sonra "neden bunu bir ekip işine dönüştürmüyorum" sorusuyla True EDigital Marketing''i kurdu.'),
    jsonb_build_object('text','2019''da True EDigital Marketing''i kurarken hedefi netti: müşterinin işine ortak gibi davranan, sayıların arkasındaki insanı unutmayan, hem kreatif hem teknik tarafa hakim bir ajans. Bugün İstanbul merkezli ekibimiz 14 kişiden oluşuyor; e-ticaretten fintech''e, sağlık turizminden SaaS girişimlerine kadar geniş bir portföye hizmet veriyoruz.'),
    jsonb_build_object('text','Hâlâ her yeni proje kapsama alındığında ilk strateji görüşmesini kurucu olarak ben yapıyorum. Çünkü güven bir tek bu şekilde inşa edilir. Hızlı büyüyen bir ajans olsak da bu prensibimizi koruyacağız.')
  )),
  3
),
(
  'about','mission_vision',null,null,null,
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('icon','Target','title','Misyon','desc','Markaların dijital büyümesini, ölçülebilir ve sürdürülebilir bir bilim haline getirmek. Her kararı veriyle alıp, her veriyi yaratıcılıkla yorumlamak.'),
    jsonb_build_object('icon','Eye','title','Vizyon','desc','Türkiye''nin teknolojiyi en iyi anlayan, performansı en iyi yöneten dijital büyüme ortağı olmak. 2027''ye kadar 100 markaya ortak olmuş bir yapıya ulaşmak.'),
    jsonb_build_object('icon','HeartHandshake','title','Vaadimiz','desc','İlk 90 günde ölçülebilir iyileşme. Olmadığı takdirde sözleşme bağlayıcı değil — şartlarımız ücretsiz keşif görüşmesinde net paylaşılır. Sözümüze sözleşmede yer veriyoruz.')
  )),
  4
),
(
  'about','timeline_header','Yol Haritası','2015''ten bugüne yolculuğumuz',
  'Bir ajansın sadece bugünkü hali değil, oraya nasıl geldiği de önemlidir. İşte bizim adımlarımız.',
  null, 25
),
(
  'about','team_header','Ekip','Markanızla doğrudan çalışacak isimler',
  'Junior asistanlara devredilen bir hesap planı yok. Aşağıdaki isimler, sizinle her hafta düzenli görüşen, projeyi sahiplenen kişiler.',
  null, 26
),

-- ------------------------------------------------------------ SERVICES ------
(
  'services','hero','Hizmetler','Markanız için bütünsel dijital büyüme',
  'Her hizmeti bağımsız bir ürün gibi düşünüyoruz; ama gücü bir araya geldiklerinde ortaya çıkıyor. Aşağıdaki hizmetlerin tümünü tek bir hesap planı, tek bir iletişim noktası altında alabilirsiniz.',
  null, 1
),
(
  'services','grid_header',null,null,null,
  jsonb_build_object('intro','Detayları görmek için bir hizmete tıkla','linkLabel','Hangisi sana uygun?','linkHref','/iletisim'),
  2
),
(
  'services','industries_header','Sektörler','Çalıştığımız sektörler',
  'Her sektörün kendi dinamikleri, regülasyonları ve müşteri davranışları vardır. Geniş portföyümüz sayesinde sektörel öğrenmeleri yeni projelere hızlıca taşıyoruz.',
  null, 15
),
(
  'services','tech_header','Teknoloji & Araçlar','Birlikte çalıştığımız stack',
  'Sevilen bir araç değil, doğru araç kullanıyoruz. Aşağıdaki teknolojileri günlük olarak deneyimliyor, müşterilerimize ekstra eğitim gerektirmeden devir alıyoruz.',
  null, 25
),
(
  'services','faq_header','Sık Sorulanlar','Hizmetlere özel sorular',
  'Aklında olup da burada cevabını bulamadığın bir konu varsa, iletişim sayfasından bize doğrudan sorabilirsin.',
  null, 35
),

-- ----------------------------------------------------------- PORTFOLIO ------
(
  'portfolio','hero','Çalışmalarımız','Birlikte büyüttüğümüz markalar',
  'Her proje farklı bir hedefle yola çıktı; ama hepsinde ortak olan tek şey ölçülebilir sonuçlar. Aşağıda, paylaşma izni aldığımız çalışmalardan örnekler.',
  null, 1
),
(
  'portfolio','projects_header','Tüm Projeler','Kategorilere göre çalışmalarımız',
  'Filtrelerle ilgilendiğin kategoriye daralt. Her kartta projenin ölçüt aldığı temel KPI''yı paylaşıyoruz.',
  null, 25
),
(
  'portfolio','invite',null,'Sıra sizin markanızda',
  'Bu rakamlar, bizi seçen markaların başardıklarıdır. Bir sonraki vaka çalışmasında sizin markanızı paylaşmak istiyoruz.',
  jsonb_build_object('highlight','sizin markanızda','primaryLabel','Görüşme Planla','primaryHref','/iletisim'),
  50
),

-- ------------------------------------------------------------- CONTACT ------
(
  'contact','hero','İletişim','Bir sonraki büyüme dönemini konuşalım',
  'Aşağıdaki formu doldurun ya da bize doğrudan ulaşın. Tüm yeni başvurulara 48 saat içinde dönüş sağlıyoruz.',
  null, 1
),
(
  'contact','channels',null,null,null,
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('icon','Mail','label','E-posta','bind','email','hint','En hızlı yanıt'),
    jsonb_build_object('icon','Phone','label','Telefon','bind','phone','hint','Mesai içinde'),
    jsonb_build_object('icon','MapPin','label','Ofis','bind','address','hint','Maslak / Levent çevresi'),
    jsonb_build_object('icon','Clock','label','Çalışma Saatleri','value','Hafta içi 09:00 — 18:30','hint','Acil için 7/24 nöbetçi')
  )),
  5
),
(
  'contact','office','Ofisimiz',null,
  'Maslak''ta hibrit çalışan bir ekiple Salı ve Perşembe günleri tam dolu bir ofisimiz var. Buluşmak istediğinizde önceden randevulaşmak yeterli — kapımız her zaman açık ama kahvemiz biterse hep birlikte yenisini demlemek lazım.',
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('icon','MapPin','text','İstanbul — Maslak Plaza, Kat 7'),
    jsonb_build_object('icon','Clock','text','Hafta içi 09:00 – 18:30 (Salı/Perşembe tam ofis)'),
    jsonb_build_object('icon','Coffee','text','Buluşmadan önce kahve siparişinizi paylaşmayı unutmayın')
  )),
  40
),
(
  'contact','faq_header','Sık Sorulanlar','İletişim ve görüşme süreci',
  'Sözleşme öncesi olası soruların hızlı cevapları. Daha fazlasını sormak için form yeterli.',
  null, 25
)

on conflict (page_slug, section_key) do nothing;
