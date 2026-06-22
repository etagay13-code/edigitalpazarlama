-- ============================================================================
-- 0004: Çok dilli destek (TR / EN / DE)
-- Her içerik tablosuna `locale` kolonu eklenir; mevcut satırlar 'tr' olur.
-- Unique kısıtları locale'i kapsayacak şekilde güncellenir.
-- Çevrilebilir marka alanları için site_settings_i18n tablosu eklenir.
-- Idempotent.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) locale kolonu (mevcut satırlar 'tr')
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'services','service_process_steps','service_faqs','portfolio_projects',
    'testimonials','team_members','timeline_events','industries','tech_items',
    'faqs','page_sections'
  ] loop
    execute format(
      'alter table %I add column if not exists locale text not null default ''tr''',
      t
    );
    execute format(
      'alter table %I drop constraint if exists %I',
      t, t || '_locale_check'
    );
    execute format(
      'alter table %I add constraint %I check (locale in (''tr'',''en'',''de''))',
      t, t || '_locale_check'
    );
  end loop;
end $$;

-- locale bazlı sorgular için yardımcı indeksler
create index if not exists idx_services_locale on services(locale, sort_order);
create index if not exists idx_portfolio_locale on portfolio_projects(locale, sort_order);
create index if not exists idx_faqs_locale on faqs(locale, scope, sort_order);
create index if not exists idx_sections_locale on page_sections(locale, page_slug, sort_order);

-- ---------------------------------------------------------------------------
-- 2) Unique kısıtlarını locale dahil olacak şekilde yeniden kur
-- ---------------------------------------------------------------------------
alter table services            drop constraint if exists services_slug_key;
alter table services            drop constraint if exists services_locale_slug_key;
alter table services            add  constraint services_locale_slug_key unique (locale, slug);

alter table portfolio_projects  drop constraint if exists portfolio_projects_slug_key;
alter table portfolio_projects  drop constraint if exists portfolio_projects_locale_slug_key;
alter table portfolio_projects  add  constraint portfolio_projects_locale_slug_key unique (locale, slug);

alter table faqs                drop constraint if exists faqs_scope_question_unique;
alter table faqs                drop constraint if exists faqs_locale_scope_question_unique;
alter table faqs                add  constraint faqs_locale_scope_question_unique unique (locale, scope, question);

alter table page_sections       drop constraint if exists page_sections_page_slug_section_key_key;
alter table page_sections       drop constraint if exists page_sections_locale_page_section_key;
alter table page_sections       add  constraint page_sections_locale_page_section_key unique (locale, page_slug, section_key);

-- ---------------------------------------------------------------------------
-- 3) Çevrilebilir marka alanları (tagline / description / address) — dil başına
-- ---------------------------------------------------------------------------
create table if not exists site_settings_i18n (
  locale       text primary key check (locale in ('tr','en','de')),
  tagline      text,
  description  text,
  address      text,
  updated_at   timestamptz not null default now()
);

alter table site_settings_i18n enable row level security;

drop policy if exists "public read site_settings_i18n" on site_settings_i18n;
create policy "public read site_settings_i18n" on site_settings_i18n
  for select using (true);

drop policy if exists "auth write site_settings_i18n" on site_settings_i18n;
create policy "auth write site_settings_i18n" on site_settings_i18n
  for all using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- TR satırını mevcut site_settings'ten doldur (varsa)
insert into site_settings_i18n (locale, tagline, description, address)
select 'tr', tagline, description, address from site_settings where id = 1
on conflict (locale) do nothing;
