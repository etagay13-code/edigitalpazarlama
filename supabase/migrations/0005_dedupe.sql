-- ============================================================================
-- 0005: Tekrarlı seed çalıştırmalarından oluşan mükerrer kayıtların temizliği.
-- Unique constraint'i olmayan tablolarda her mantıksal kayıttan en küçük ctid
-- hariç hepsi silinir. Idempotent.
-- ============================================================================

delete from testimonials a using testimonials b
  where a.ctid > b.ctid and a.locale = b.locale and a.quote = b.quote;

delete from team_members a using team_members b
  where a.ctid > b.ctid and a.locale = b.locale and a.name = b.name;

delete from timeline_events a using timeline_events b
  where a.ctid > b.ctid and a.locale = b.locale and a.year = b.year and a.title = b.title;

delete from industries a using industries b
  where a.ctid > b.ctid and a.locale = b.locale and a.name = b.name;

delete from tech_items a using tech_items b
  where a.ctid > b.ctid and a.locale = b.locale and a.name = b.name
    and coalesce(a.category,'') = coalesce(b.category,'');

delete from service_process_steps a using service_process_steps b
  where a.ctid > b.ctid and a.service_id = b.service_id and a.step_number = b.step_number;

delete from service_faqs a using service_faqs b
  where a.ctid > b.ctid and a.service_id = b.service_id and a.question = b.question;
