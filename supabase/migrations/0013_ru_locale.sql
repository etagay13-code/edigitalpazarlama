-- ============================================================================
-- 0013: Rusça (ru) dil desteği
-- Tüm locale CHECK kısıtlarına 'ru' eklenir. Veri değişmez. Idempotent.
-- ============================================================================

do $$
declare t text;
begin
  foreach t in array array[
    'services','service_process_steps','service_faqs','portfolio_projects',
    'testimonials','team_members','timeline_events','industries','tech_items',
    'faqs','page_sections','site_settings_i18n','chat_rules','blog_posts'
  ] loop
    execute format(
      'alter table %I drop constraint if exists %I',
      t, t || '_locale_check'
    );
    execute format(
      'alter table %I add constraint %I check (locale in (''tr'',''en'',''de'',''ru''))',
      t, t || '_locale_check'
    );
  end loop;
end $$;
