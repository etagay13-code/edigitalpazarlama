-- ============================================================================
-- E-Digital Marketing — Initial Schema
-- ============================================================================
-- Supabase SQL Editor'de çalıştır.
-- ============================================================================

-- gen_random_uuid() için
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES (admin kullanıcısı — auth.users'a 1:1)
-- ----------------------------------------------------------------------------
create table if not exists profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'admin' check (role in ('admin')),
  created_at  timestamptz not null default now()
);

-- auth.users'a yeni kullanıcı eklendiğinde profile otomatik oluşsun
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. SITE SETTINGS (singleton, id=1)
-- ----------------------------------------------------------------------------
create table if not exists site_settings (
  id                          smallint primary key default 1 check (id = 1),
  -- Marka
  brand_name                  text not null default 'E - Digital Marketing',
  brand_short_name            text default 'E-Digital',
  founder                     text default 'Emre Tagay',
  tagline                     text default 'A''dan Z''ye Dijital Büyüme Ortağınız',
  description                 text default 'Reklamdan SEO''ya, mobil uygulamadan SaaS geliştirmeye kadar markanızı ölçeklendiren 360° dijital pazarlama ajansı.',
  url                         text default 'https://edigitalmarketing.com',
  email                       text not null default 'info@edigitalmarketing.com',
  phone                       text default '+90 555 000 00 00',
  address                     text default 'İstanbul, Türkiye',
  -- Sosyal medya
  instagram_url               text,
  linkedin_url                text,
  twitter_url                 text,
  youtube_url                 text,
  -- Görseller (Supabase Storage public URL'leri)
  logo_url                    text,
  favicon_url                 text,
  og_image_url                text,
  -- Renkler
  color_bg                    text default '#0A0A0B',
  color_accent                text default '#7C5CFF',
  color_accent_secondary      text default '#22D3EE',
  -- Entegrasyonlar
  ga4_measurement_id          text,
  gtm_container_id            text,
  search_console_verification text,
  hotjar_site_id              text,
  microsoft_clarity_id        text,
  -- Mail
  contact_form_to_email       text,
  -- Meta
  updated_at                  timestamptz not null default now(),
  updated_by                  uuid references auth.users
);

-- İlk row (her zaman 1 satır olur)
insert into site_settings (id) values (1) on conflict do nothing;

-- ----------------------------------------------------------------------------
-- 3. SERVICES (8 hizmet + ilgili tablolar)
-- ----------------------------------------------------------------------------
create table if not exists services (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  short             text not null,
  description       text not null,
  long_description  text,
  hero              text,
  approach          text,
  bullets           text[] not null default '{}',
  deliverables      text[] not null default '{}',
  tools             text[] not null default '{}',
  outcomes          text[] not null default '{}',
  ideal_for         text[] not null default '{}',
  related_slugs     text[] not null default '{}',
  icon              text not null default 'Sparkles',  -- lucide-react icon adı
  accent            text not null default 'from-violet-500 to-indigo-500',
  sort_order        smallint not null default 0,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_services_slug on services(slug);
create index if not exists idx_services_sort on services(sort_order);

create table if not exists service_process_steps (
  id           uuid primary key default gen_random_uuid(),
  service_id   uuid not null references services(id) on delete cascade,
  step_number  smallint not null,
  title        text not null,
  description  text not null
);
create index if not exists idx_sps_service on service_process_steps(service_id, step_number);

create table if not exists service_faqs (
  id          uuid primary key default gen_random_uuid(),
  service_id  uuid not null references services(id) on delete cascade,
  question    text not null,
  answer      text not null,
  sort_order  smallint not null default 0
);
create index if not exists idx_sfaq_service on service_faqs(service_id, sort_order);

-- ----------------------------------------------------------------------------
-- 4. PORTFOLIO PROJECTS
-- ----------------------------------------------------------------------------
create table if not exists portfolio_projects (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  client       text not null,
  category     text not null,  -- Reklam / SEO / Mobil / SaaS / Web / Sosyal Medya
  description  text not null,
  metric       text,
  gradient     text default 'from-violet-500 to-indigo-500',
  tags         text[] not null default '{}',
  image_url    text,
  sort_order   smallint not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);
create index if not exists idx_portfolio_slug on portfolio_projects(slug);

-- ----------------------------------------------------------------------------
-- 5. TESTIMONIALS
-- ----------------------------------------------------------------------------
create table if not exists testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  company     text,
  quote       text not null,
  initials    text,
  avatar_url  text,
  sort_order  smallint not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 6. TEAM MEMBERS
-- ----------------------------------------------------------------------------
create table if not exists team_members (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  bio         text,
  initials    text,
  accent      text default 'from-violet-500 to-indigo-500',
  avatar_url  text,
  sort_order  smallint not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 7. TIMELINE EVENTS
-- ----------------------------------------------------------------------------
create table if not exists timeline_events (
  id           uuid primary key default gen_random_uuid(),
  year         text not null,
  title        text not null,
  description  text not null,
  sort_order   smallint not null default 0,
  active       boolean not null default true
);

-- ----------------------------------------------------------------------------
-- 8. INDUSTRIES
-- ----------------------------------------------------------------------------
create table if not exists industries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  highlights   text[] not null default '{}',
  sort_order   smallint not null default 0,
  active       boolean not null default true
);

-- ----------------------------------------------------------------------------
-- 9. TECH STACK ITEMS
-- ----------------------------------------------------------------------------
create table if not exists tech_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text,
  sort_order  smallint not null default 0
);

-- ----------------------------------------------------------------------------
-- 10. FAQS (sayfa-scope: home / services / contact)
-- ----------------------------------------------------------------------------
create table if not exists faqs (
  id          uuid primary key default gen_random_uuid(),
  scope       text not null default 'home' check (scope in ('home', 'services', 'contact', 'about', 'portfolio')),
  question    text not null,
  answer      text not null,
  sort_order  smallint not null default 0,
  active      boolean not null default true
);
create index if not exists idx_faqs_scope on faqs(scope, sort_order);

-- ----------------------------------------------------------------------------
-- 11. PAGE SECTIONS (her sayfanın section başlıkları/açıklamaları editlenebilir)
-- ----------------------------------------------------------------------------
create table if not exists page_sections (
  id           uuid primary key default gen_random_uuid(),
  page_slug    text not null,    -- home / about / services / portfolio / contact
  section_key  text not null,    -- hero / stats / process / cta / brand_strip / ...
  eyebrow      text,
  title        text,
  description  text,
  body         jsonb,             -- karmaşık içerikler
  sort_order   smallint not null default 0,
  unique (page_slug, section_key)
);
create index if not exists idx_sections_page on page_sections(page_slug, sort_order);

-- ----------------------------------------------------------------------------
-- 12. CONTACT MESSAGES (form submissions)
-- ----------------------------------------------------------------------------
create table if not exists messages (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text,
  service      text,
  message      text not null,
  ip_address   text,
  user_agent   text,
  is_read      boolean not null default false,
  is_archived  boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists idx_messages_created on messages(created_at desc);
create index if not exists idx_messages_unread on messages(is_read) where is_read = false;

-- ----------------------------------------------------------------------------
-- updated_at trigger helper
-- ----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists touch_site_settings on site_settings;
create trigger touch_site_settings before update on site_settings
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_services on services;
create trigger touch_services before update on services
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Tümünde RLS aktif
alter table profiles            enable row level security;
alter table site_settings       enable row level security;
alter table services            enable row level security;
alter table service_process_steps enable row level security;
alter table service_faqs        enable row level security;
alter table portfolio_projects  enable row level security;
alter table testimonials        enable row level security;
alter table team_members        enable row level security;
alter table timeline_events     enable row level security;
alter table industries          enable row level security;
alter table tech_items          enable row level security;
alter table faqs                enable row level security;
alter table page_sections       enable row level security;
alter table messages            enable row level security;

-- ---- PUBLIC OKUMA (herkesin görebileceği içerikler) ----
create policy "public read site_settings"      on site_settings       for select using (true);
create policy "public read services"           on services            for select using (active);
create policy "public read service_process"    on service_process_steps for select using (true);
create policy "public read service_faqs"       on service_faqs        for select using (true);
create policy "public read portfolio"          on portfolio_projects  for select using (active);
create policy "public read testimonials"       on testimonials        for select using (active);
create policy "public read team_members"       on team_members        for select using (active);
create policy "public read timeline"           on timeline_events     for select using (active);
create policy "public read industries"         on industries          for select using (active);
create policy "public read tech_items"         on tech_items          for select using (true);
create policy "public read faqs"               on faqs                for select using (active);
create policy "public read page_sections"      on page_sections       for select using (true);

-- ---- ADMIN YAZMA (giriş yapmış kullanıcı yazabilir) ----
-- Tek admin senaryosunda: any authenticated user = admin
create policy "auth write site_settings"     on site_settings       for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write services"          on services            for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write service_process"   on service_process_steps for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write service_faqs"      on service_faqs        for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write portfolio"         on portfolio_projects  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write testimonials"      on testimonials        for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write team_members"      on team_members        for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write timeline"          on timeline_events     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write industries"        on industries          for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write tech_items"        on tech_items          for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write faqs"              on faqs                for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write page_sections"     on page_sections       for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ---- PROFILES ----
create policy "auth read profiles"  on profiles for select using (auth.role() = 'authenticated');
create policy "user updates own profile" on profiles for update using (id = auth.uid());

-- ---- MESSAGES (özel: herkes yazar, sadece admin okur) ----
create policy "anyone inserts messages"  on messages for insert with check (true);
create policy "auth reads messages"      on messages for select using (auth.role() = 'authenticated');
create policy "auth updates messages"    on messages for update using (auth.role() = 'authenticated');
create policy "auth deletes messages"    on messages for delete using (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
-- Logo, favicon, og görselleri ve portfolyo görselleri için public bucket
insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
on conflict (id) do nothing;

create policy "public read storage assets"
  on storage.objects for select
  using (bucket_id = 'public-assets');

create policy "auth uploads to storage"
  on storage.objects for insert
  with check (bucket_id = 'public-assets' and auth.role() = 'authenticated');

create policy "auth updates storage"
  on storage.objects for update
  using (bucket_id = 'public-assets' and auth.role() = 'authenticated');

create policy "auth deletes from storage"
  on storage.objects for delete
  using (bucket_id = 'public-assets' and auth.role() = 'authenticated');
