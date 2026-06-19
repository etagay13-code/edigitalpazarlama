-- ============================================================================
-- Site Secrets — Resend API key gibi sadece admin'in göreceği değerler
-- ============================================================================
-- site_settings public-readable çünkü brand info'lar herkes tarafından okunur.
-- Bu yüzden gizli değerler (API key'ler) ayrı bir tabloda, sadece authenticated
-- kullanıcı (admin) okuyabilir.
-- ============================================================================

create table if not exists site_secrets (
  id                          smallint primary key default 1 check (id = 1),
  resend_api_key              text,
  resend_from_email           text default 'onboarding@resend.dev',
  contact_form_to_email       text,
  -- gelecekte eklenebilecek diğer secret'lar için yer
  updated_at                  timestamptz not null default now(),
  updated_by                  uuid references auth.users
);

insert into site_secrets (id) values (1) on conflict do nothing;

alter table site_secrets enable row level security;

-- SADECE authenticated user okur — public read YOK
create policy "auth read secrets" on site_secrets for select using (auth.role() = 'authenticated');
create policy "auth write secrets" on site_secrets for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- updated_at otomatik güncelleme (touch_updated_at fonksiyonu var, kullanalım)
drop trigger if exists touch_site_secrets on site_secrets;
create trigger touch_site_secrets before update on site_secrets
  for each row execute function public.touch_updated_at();
