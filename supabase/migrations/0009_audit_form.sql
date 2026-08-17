-- ============================================================================
-- 0009: Ücretsiz dijital denetim formu
--
-- İletişim formundan farklı: çok adımlı ve yapılandırılmış veri topluyor
-- (site adresi, sektör, aktif kanallar, bütçe aralığı, hedef). Bu alanlar
-- messages tablosuna ayrı kolonlar olarak değil, payload JSONB içinde
-- tutuluyor — form alanları değiştikçe şema göçü gerekmesin diye.
-- ============================================================================

alter table messages
  add column if not exists form_type text not null default 'contact'
    check (form_type in ('contact', 'audit')),
  add column if not exists payload jsonb,
  add column if not exists locale text default 'tr';

-- Admin gelen kutusunda form tipine göre filtreleme
create index if not exists idx_messages_form_type on messages(form_type, created_at desc);
