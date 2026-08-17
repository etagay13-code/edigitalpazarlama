-- ============================================================================
-- 0010: Sektör (dikey) sayfaları
--
-- industries tablosu bugüne kadar yalnızca anasayfa/hizmetler sayfasındaki
-- kart listesi için kullanılıyordu. Kendi sayfası olabilmesi için slug ve
-- sayfa içeriği (body) ekleniyor.
--
-- body şekli:
-- {
--   "challenges": [{ "title": "...", "desc": "..." }],
--   "approach":   [{ "title": "...", "desc": "..." }],
--   "faq":        [{ "q": "...", "a": "..." }]
-- }
--
-- Sektör slug'ları portfolyo kategorileriyle eşleşir; sayfa, o kategorideki
-- gerçek vakaları otomatik listeler.
-- ============================================================================

alter table industries
  add column if not exists slug        text,
  add column if not exists category    text,
  add column if not exists meta_title  text,
  add column if not exists meta_desc   text,
  add column if not exists body        jsonb;

create unique index if not exists uniq_industries_locale_slug
  on industries(locale, slug) where slug is not null;
create index if not exists idx_industries_category on industries(category);
