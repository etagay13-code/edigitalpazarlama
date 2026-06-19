-- ============================================================================
-- 0003: faqs tablosunda (scope, question) için unique constraint + duplicate temizliği
-- ----------------------------------------------------------------------------
-- Önceki seed'ler ON CONFLICT için unique constraint olmadığından duplicate satır
-- oluşturmuştu. Bu migration:
--   1) Aynı (scope, question) için en küçük ctid hariç hepsini siler
--   2) Unique constraint ekler — sonraki seed'ler idempotent çalışır
-- Idempotent.
-- ============================================================================

delete from faqs a
using faqs b
where a.ctid > b.ctid
  and a.scope = b.scope
  and a.question = b.question;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'faqs_scope_question_unique'
  ) then
    alter table faqs
      add constraint faqs_scope_question_unique unique (scope, question);
  end if;
end $$;
