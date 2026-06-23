-- ============================================================================
-- 0006: Chatbot kuralları (kural tabanlı bot — AI yok)
-- question: görünen/örnek soru, keywords: tetikleyici kelimeler, answer: cevap.
-- Bot kullanıcı mesajını keywords ile eşleştirir; eşleşme yoksa fallback gösterir.
-- ============================================================================

create table if not exists chat_rules (
  id          uuid primary key default gen_random_uuid(),
  locale      text not null default 'tr' check (locale in ('tr','en','de')),
  question    text not null,
  keywords    text[] not null default '{}',
  answer      text not null,
  sort_order  smallint not null default 0,
  active      boolean not null default true
);
create index if not exists idx_chat_rules_locale on chat_rules(locale, sort_order);

alter table chat_rules enable row level security;
drop policy if exists "public read chat_rules" on chat_rules;
create policy "public read chat_rules" on chat_rules for select using (active = true);
drop policy if exists "auth write chat_rules" on chat_rules;
create policy "auth write chat_rules" on chat_rules for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- Başlangıç kuralları — sadece tablo boşsa eklenir (tekrar çalıştırma güvenli)
do $$
begin
  if (select count(*) from chat_rules) = 0 then

    insert into chat_rules (locale, question, keywords, answer, sort_order) values
    -- ---------- TR ----------
    ('tr','Merhaba',array['merhaba','selam','hey','iyi günler','iyi akşamlar','naber'],
      'Merhaba! 👋 Hizmetlerimiz, fiyatlandırma veya ücretsiz görüşme hakkında sorabilirsin.',0),
    ('tr','Hangi hizmetleri sunuyorsunuz?',array['hizmet','hizmetler','ne yapıyor','neler yapıyor','sunduğunuz','servis'],
      'Reklam yönetimi, SEO, sosyal medya, mobil uygulama, SaaS geliştirme, web tasarım ve içerik & marka stratejisi sunuyoruz — hepsi tek ekip altında. Detaylar için Hizmetler sayfamıza göz atabilirsin.',10),
    ('tr','Fiyatlandırma nasıl işliyor?',array['fiyat','ücret','maliyet','paket','fiyatlandırma','ne kadar','bütçe'],
      'Üç modelimiz var: aylık retainer, proje bazlı ve performans + sabit. Net teklif, ücretsiz keşif görüşmesinden sonra çıkarılır — gizli kalem ya da sürpriz fatura yok.',20),
    ('tr','Nasıl görüşme ayarlarım?',array['görüşme','randevu','danışma','toplantı','demo','görüşmek','ayarla','teklif al'],
      'Ücretsiz 30 dakikalık keşif görüşmesi için İletişim sayfamızdaki formu doldur; en geç 48 saat içinde sana dönüş yapıyoruz.',30),
    ('tr','Sizinle nasıl iletişim kurarım?',array['iletişim','telefon','e-posta','email','mail','ulaş','adres','nerede'],
      'E-posta: info@etruemarketing.com. İletişim sayfasındaki formu da doldurabilirsin — tüm başvurulara 48 saat içinde dönüyoruz.',40),
    ('tr','Süreç ne kadar sürüyor?',array['süre','ne kadar sürer','başlangıç','ne zaman','kaç gün','sonuç'],
      'Akış: keşif görüşmesi → teklif → onay. Onaydan sonra 5 iş günü içinde başlıyoruz; ilk 90 günde ölçülebilir iyileşme hedefliyoruz.',50),
    ('tr','Hakkınızda kısaca',array['kimsiniz','hakkında','hakkınızda','kim','şirket','ekip'],
      'True EDigital Marketing, performans pazarlaması ile teknoloji geliştirmeyi tek çatı altında birleştiren 360° bir dijital ajans. 2019''dan beri e-ticaret, SaaS ve hizmet markalarına büyüme ortaklığı sunuyoruz.',60),

    -- ---------- EN ----------
    ('en','Hello',array['hello','hi','hey','good morning','good evening'],
      'Hi there! 👋 Ask me about our services, pricing or a free discovery call.',0),
    ('en','What services do you offer?',array['service','services','what do you do','offer'],
      'We offer ad management, SEO, social media, mobile app development, SaaS development, web design and content & brand strategy — all under one team. Check our Services page for details.',10),
    ('en','How does pricing work?',array['price','pricing','cost','package','budget','how much'],
      'We have three models: monthly retainer, project-based, and performance + fixed. A precise quote follows a free discovery call — no hidden items or surprise invoices.',20),
    ('en','How can I book a consultation?',array['consultation','meeting','book','appointment','demo','call','get a quote'],
      'Fill in the form on our Contact page for a free 30-minute discovery call; we get back to you within 48 hours.',30),
    ('en','How can I contact you?',array['contact','phone','e-mail','email','reach','address','where'],
      'Email: info@etruemarketing.com. You can also use the form on the Contact page — we reply to every request within 48 hours.',40),
    ('en','How long does the process take?',array['how long','timeline','start','when','days','results'],
      'Flow: discovery call → proposal → approval. We start within 5 business days of approval and target measurable improvement in the first 90 days.',50),
    ('en','About you',array['who are you','about','company','team'],
      'True EDigital Marketing is a 360° digital agency combining performance marketing with technology development. Since 2019 we''ve offered growth partnership to e-commerce, SaaS and service brands.',60),

    -- ---------- DE ----------
    ('de','Hallo',array['hallo','hi','hey','guten morgen','guten abend'],
      'Hallo! 👋 Fragen Sie mich zu unseren Leistungen, Preisen oder einem kostenlosen Erstgespräch.',0),
    ('de','Welche Leistungen bieten Sie an?',array['leistung','leistungen','was machen sie','angebot','service'],
      'Wir bieten Anzeigenmanagement, SEO, Social Media, App-Entwicklung, SaaS-Entwicklung, Webdesign und Content- & Markenstrategie — alles aus einem Team. Details auf unserer Leistungen-Seite.',10),
    ('de','Wie funktioniert die Preisgestaltung?',array['preis','kosten','paket','budget','wie viel'],
      'Wir haben drei Modelle: monatlicher Retainer, projektbasiert und Performance + Fixum. Ein genaues Angebot folgt nach einem kostenlosen Erstgespräch — keine versteckten Posten.',20),
    ('de','Wie buche ich ein Gespräch?',array['gespräch','termin','buchen','meeting','demo','anruf','angebot'],
      'Füllen Sie das Formular auf unserer Kontakt-Seite für ein kostenloses 30-minütiges Erstgespräch aus; wir melden uns innerhalb von 48 Stunden.',30),
    ('de','Wie kann ich Sie kontaktieren?',array['kontakt','telefon','e-mail','email','erreichen','adresse','wo'],
      'E-Mail: info@etruemarketing.com. Sie können auch das Formular auf der Kontakt-Seite nutzen — wir antworten auf jede Anfrage innerhalb von 48 Stunden.',40),
    ('de','Wie lange dauert der Prozess?',array['wie lange','zeitplan','start','wann','tage','ergebnis'],
      'Ablauf: Erstgespräch → Angebot → Freigabe. Wir starten innerhalb von 5 Werktagen nach Freigabe und zielen auf messbare Verbesserung in den ersten 90 Tagen.',50),
    ('de','Über Sie',array['wer sind sie','über','unternehmen','team'],
      'True EDigital Marketing ist eine 360°-Digitalagentur, die Performance-Marketing mit Technologieentwicklung verbindet. Seit 2019 bieten wir E-Commerce-, SaaS- und Dienstleistungsmarken eine Wachstumspartnerschaft.',60);

  end if;
end $$;
