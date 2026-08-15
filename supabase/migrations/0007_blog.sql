-- ============================================================================
-- 0007: Blog — otomatik üretilen çok dilli yazılar
--
-- Akış: DeepSeek günde 2 Türkçe yazı üretir (taslak). Yazı onaylandığında
-- İngilizce ve Almanca çevirileri üretilip yayınlanır. Üç dil aynı kapak
-- görselini ve aynı group_id'yi paylaşır; hreflang bağlantısı bu id ile kurulur.
--
-- Sitedeki diğer içerik tablolarıyla aynı desen: satır başına bir dil,
-- locale kolonu + herkese açık okuma / oturumlu yazma RLS politikaları.
-- ============================================================================

create table if not exists blog_posts (
  id            uuid primary key default gen_random_uuid(),
  -- Aynı yazının üç dildeki sürümünü birbirine bağlar (hreflang + çeviri takibi)
  group_id      uuid not null default gen_random_uuid(),
  locale        text not null default 'tr' check (locale in ('tr','en','de')),
  slug          text not null,
  title         text not null,
  excerpt       text not null default '',
  content_html  text not null,
  cover_url     text,
  -- Kapak görseli üç dilde ortak; alt metin dile göre değişir
  cover_alt     text,
  meta_title    text,
  meta_desc     text,
  tags          text[] not null default '{}',
  reading_min   smallint not null default 5,
  -- draft: üretildi, onay bekliyor · published: yayında · archived: gizlendi
  status        text not null default 'draft' check (status in ('draft','published','archived')),
  -- Üretim kaynağı: hangi modelden geldiği ve çeviri mi olduğu izlenebilsin
  source        text not null default 'deepseek' check (source in ('deepseek','manual','translation')),
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Aynı dilde aynı slug iki kez olamaz
create unique index if not exists uniq_blog_locale_slug on blog_posts(locale, slug);
-- Bir yazının her dilde en fazla bir sürümü olur
create unique index if not exists uniq_blog_group_locale on blog_posts(group_id, locale);
-- Liste sorgusu: dile göre, yayınlanmışlar, tarihe göre
create index if not exists idx_blog_list on blog_posts(locale, status, published_at desc);
create index if not exists idx_blog_tags on blog_posts using gin(tags);

alter table blog_posts enable row level security;

drop policy if exists "public read blog_posts" on blog_posts;
create policy "public read blog_posts" on blog_posts for select
  using (status = 'published');

drop policy if exists "auth write blog_posts" on blog_posts;
create policy "auth write blog_posts" on blog_posts for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----------------------------------------------------------------------------
-- Konu havuzu: üretimin rastgele değil, planlı ilerlemesi için.
-- Cron her çalıştığında kullanılmamış en yüksek öncelikli konuyu alır;
-- havuz boşaldığında model serbest konu üretir.
-- ----------------------------------------------------------------------------
create table if not exists blog_topics (
  id          uuid primary key default gen_random_uuid(),
  topic       text not null,
  keyword     text,
  -- Büyük sayı önce işlenir
  priority    smallint not null default 0,
  used_at     timestamptz,
  post_id     uuid references blog_posts(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists idx_blog_topics_queue on blog_topics(used_at, priority desc);

alter table blog_topics enable row level security;
drop policy if exists "auth all blog_topics" on blog_topics;
create policy "auth all blog_topics" on blog_topics for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----------------------------------------------------------------------------
-- Başlangıç konu havuzu — ajansın hizmet alanlarına ve arama niyetine göre.
-- Sadece tablo boşsa eklenir (migration tekrar çalıştırılabilir olsun diye).
-- ----------------------------------------------------------------------------
do $$
begin
  if (select count(*) from blog_topics) = 0 then
    insert into blog_topics (topic, keyword, priority) values
      ('ROAS nedir, nasıl hesaplanır ve başabaş ROAS neden marja bağlıdır', 'roas nedir', 100),
      ('Google Ads''te bütçe yakan en yaygın hatalar ve düzeltmeleri', 'google ads hataları', 95),
      ('Performance Max kampanyası doğru nasıl kurulur', 'performance max', 90),
      ('E-ticaret sitesi dönüşüm oranı nasıl artırılır', 'dönüşüm oranı artırma', 90),
      ('Teknik SEO denetimi: ilk 30 günde nelere bakılır', 'teknik seo denetimi', 88),
      ('Core Web Vitals nedir, LCP nasıl iyileştirilir', 'core web vitals', 85),
      ('Meta reklamlarında kreatif testi nasıl kurgulanır', 'meta ads kreatif testi', 85),
      ('CAC ve LTV hesabı: sağlıklı bir birim ekonomisi nasıl görünür', 'cac ltv hesaplama', 82),
      ('GA4''te dönüşüm olayları nasıl kurulur', 'ga4 dönüşüm kurulumu', 80),
      ('Arama niyetine göre içerik mimarisi nasıl kurulur', 'arama niyeti seo', 78),
      ('B2B için LinkedIn reklamları: bütçe ve hedefleme rehberi', 'linkedin reklam', 75),
      ('Sağlık turizminde dijital pazarlama: mevzuat ve kanal seçimi', 'sağlık turizmi pazarlama', 75),
      ('SaaS ürünü için ilk 100 müşteriye ulaşma kanalları', 'saas müşteri kazanımı', 72),
      ('Marka arama kampanyası gerekli mi, ne zaman durdurulmalı', 'marka kampanyası', 70),
      ('Yeniden pazarlama kitleleri nasıl kurgulanır', 'remarketing stratejisi', 70),
      ('Landing page yapısı: reklamdan gelen trafiği dönüştüren sayfa', 'landing page tasarımı', 68),
      ('Mobil uygulama pazarlaması: ASO ve ilk indirmeler', 'aso mobil uygulama', 65),
      ('E-ticarette sepet terk oranı nasıl düşürülür', 'sepet terk oranı', 65),
      ('Sosyal medyada organik erişim düşerken ne yapmalı', 'organik erişim', 62),
      ('Yapay zeka çağında içerik üretimi: kalite sinyalleri', 'ai içerik seo', 60);
  end if;
end $$;
