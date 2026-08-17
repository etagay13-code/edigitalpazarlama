-- Yazı birleştirme (keyword cannibalization giderme).
--
-- Otomatik üretim aynı arama niyetini hedefleyen birden fazla yazı üretebiliyor
-- (bir hata nedeniyle aynı konu üç kez yazıldı). Bu durumda en güçlü yazı
-- yayında kalır, diğerleri arşive alınır ve redirect_to ile ona 301 verilir —
-- silmek yerine yönlendirmek, varsa toplanmış bağlantı değerini korur.
alter table blog_posts add column if not exists redirect_to uuid references blog_posts(id) on delete set null;

comment on column blog_posts.redirect_to is
  'Arşivlenmiş yazının 301 ile yönlendirileceği yazı. Yalnızca status=archived iken anlamlıdır.';

create index if not exists idx_blog_posts_slug_locale on blog_posts(locale, slug);
