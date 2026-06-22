-- ============================================================================
-- MARKA YENİDEN ADLANDIRMA
-- "E - Digital Marketing" / "E-Digital" → "True EDigital Marketing"
-- Domain/e-posta/sosyal → etruemarketing(.com)
-- Canlı içeriği (site_settings + testimonials + timeline + page_sections) günceller.
-- Kullanım: npm run db:migrate -- supabase/rename_brand.sql
-- ============================================================================

-- 1) Site ayarları (marka kimliği)
update site_settings set
  brand_name        = 'True EDigital Marketing',
  brand_short_name  = 'True EDigital Marketing',
  url               = 'https://etruemarketing.com',
  email             = 'info@etruemarketing.com',
  instagram_url     = replace(replace(coalesce(instagram_url,''), 'edigitalpazarlama', 'etruemarketing'), 'edigitalmarketing', 'etruemarketing')
where id = 1;

-- 2) Müşteri yorumları (içinde marka adı geçenler)
update testimonials set
  quote = replace(replace(quote, 'E - Digital Marketing', 'True EDigital Marketing'), 'E-Digital', 'True EDigital Marketing')
where quote like '%E-Digital%' or quote like '%E - Digital Marketing%';

-- 3) Zaman çizelgesi
update timeline_events set
  title       = replace(replace(title, 'E - Digital Marketing', 'True EDigital Marketing'), 'E-Digital', 'True EDigital Marketing'),
  description = replace(replace(description, 'E - Digital Marketing', 'True EDigital Marketing'), 'E-Digital', 'True EDigital Marketing')
where title like '%E-Digital%' or title like '%E - Digital%'
   or description like '%E-Digital%' or description like '%E - Digital%';

-- 4) Sayfa bölümleri (başlık / açıklama / body içinde marka adı)
update page_sections set
  title       = replace(replace(coalesce(title,''),       'E - Digital Marketing', 'True EDigital Marketing'), 'E-Digital', 'True EDigital Marketing'),
  description = replace(replace(coalesce(description,''),  'E - Digital Marketing', 'True EDigital Marketing'), 'E-Digital', 'True EDigital Marketing'),
  body        = (replace(replace(coalesce(body::text,'null'), 'E - Digital Marketing', 'True EDigital Marketing'), 'E-Digital', 'True EDigital Marketing'))::jsonb
where coalesce(title,'') like '%E-Digital%' or coalesce(title,'') like '%E - Digital%'
   or coalesce(description,'') like '%E-Digital%' or coalesce(description,'') like '%E - Digital%'
   or coalesce(body::text,'') like '%E-Digital%' or coalesce(body::text,'') like '%E - Digital%';
