-- ============================================================================
-- 0008: Vaka çalışması detay sayfaları
--
-- portfolio_projects'te bugün sadece kart verisi var (başlık, açıklama, metrik).
-- Detay sayfası için yapılandırılmış içerik ekleniyor: durum, yaklaşım, adımlar,
-- sonuç metrikleri ve müşteri sözü. Hepsi tek bir JSONB alanında tutuluyor —
-- diğer sayfa içerikleriyle (page_sections.body) aynı desen.
--
-- case_study şekli:
-- {
--   "challenge": "...",
--   "approach": "...",
--   "steps": [{ "title": "...", "desc": "..." }],
--   "results": [{ "label": "...", "from": "...", "to": "...", "note": "..." }],
--   "deliverables": ["..."],
--   "duration": "6 ay",
--   "quote": { "text": "...", "name": "...", "role": "..." }
-- }
-- ============================================================================

alter table portfolio_projects
  add column if not exists case_study  jsonb,
  add column if not exists meta_title  text,
  add column if not exists meta_desc   text,
  -- Kart görseli yoksa detay sayfası için üretilen kapak
  add column if not exists cover_url   text;

-- Detay sayfası sorgusu: dil + slug
create index if not exists idx_portfolio_locale_slug on portfolio_projects(locale, slug);
