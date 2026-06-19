-- ============================================================================
-- RLS politikalarını yeni sb_publishable_* API key formatıyla uyumlu hale getir
-- ============================================================================
-- auth.role() = 'authenticated' bazı durumlarda doğru değerlendirilmiyor.
-- auth.uid() is not null daha güvenli ve Supabase'in önerdiği pattern.
-- (select auth.uid()) kullanımı RLS performansı için de önerilen yaklaşım.
-- ============================================================================

-- ----- SITE SETTINGS -----
drop policy if exists "auth write site_settings" on site_settings;
create policy "auth write site_settings" on site_settings for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----- SERVICES -----
drop policy if exists "auth write services" on services;
create policy "auth write services" on services for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "auth write service_process" on service_process_steps;
create policy "auth write service_process" on service_process_steps for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "auth write service_faqs" on service_faqs;
create policy "auth write service_faqs" on service_faqs for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----- PORTFOLIO -----
drop policy if exists "auth write portfolio" on portfolio_projects;
create policy "auth write portfolio" on portfolio_projects for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----- TESTIMONIALS -----
drop policy if exists "auth write testimonials" on testimonials;
create policy "auth write testimonials" on testimonials for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----- TEAM -----
drop policy if exists "auth write team_members" on team_members;
create policy "auth write team_members" on team_members for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----- TIMELINE -----
drop policy if exists "auth write timeline" on timeline_events;
create policy "auth write timeline" on timeline_events for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----- INDUSTRIES -----
drop policy if exists "auth write industries" on industries;
create policy "auth write industries" on industries for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----- TECH ITEMS -----
drop policy if exists "auth write tech_items" on tech_items;
create policy "auth write tech_items" on tech_items for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----- FAQS -----
drop policy if exists "auth write faqs" on faqs;
create policy "auth write faqs" on faqs for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----- PAGE SECTIONS -----
drop policy if exists "auth write page_sections" on page_sections;
create policy "auth write page_sections" on page_sections for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----- PROFILES -----
drop policy if exists "auth read profiles" on profiles;
create policy "auth read profiles" on profiles for select
  using ((select auth.uid()) is not null);

-- ----- MESSAGES -----
drop policy if exists "auth reads messages" on messages;
create policy "auth reads messages" on messages for select
  using ((select auth.uid()) is not null);

drop policy if exists "auth updates messages" on messages;
create policy "auth updates messages" on messages for update
  using ((select auth.uid()) is not null);

drop policy if exists "auth deletes messages" on messages;
create policy "auth deletes messages" on messages for delete
  using ((select auth.uid()) is not null);

-- ----- SITE SECRETS -----
drop policy if exists "auth read secrets" on site_secrets;
create policy "auth read secrets" on site_secrets for select
  using ((select auth.uid()) is not null);

drop policy if exists "auth write secrets" on site_secrets;
create policy "auth write secrets" on site_secrets for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- ----- STORAGE -----
drop policy if exists "auth uploads to storage" on storage.objects;
create policy "auth uploads to storage" on storage.objects for insert
  with check (bucket_id = 'public-assets' and (select auth.uid()) is not null);

drop policy if exists "auth updates storage" on storage.objects;
create policy "auth updates storage" on storage.objects for update
  using (bucket_id = 'public-assets' and (select auth.uid()) is not null);

drop policy if exists "auth deletes from storage" on storage.objects;
create policy "auth deletes from storage" on storage.objects for delete
  using (bucket_id = 'public-assets' and (select auth.uid()) is not null);
