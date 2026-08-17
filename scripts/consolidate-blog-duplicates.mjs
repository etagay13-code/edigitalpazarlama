// Aynı arama niyetini hedefleyen yazıları birleştirir.
//
// Otomatik üretimde bir hata (konunun çevirilerden sonra tüketilmiş sayılması,
// fonksiyonun ise çeviri sırasında zaman aşımına uğraması) aynı konuyu üç kez
// yazdırdı. Üçü de aynı sorguyu hedeflediği için birbirinin sıralamasını yiyor.
//
// Çözüm: en kapsamlı yazı yayında kalır, diğerleri ARŞİVLENİR ve redirect_to
// ile ona bağlanır — sayfa katmanı bunu 301'e çevirir. Silmek yerine
// yönlendirmek, toplanmış bağlantı değerini ve kullanıcıyı korur.
//
// Kullanım: node --env-file=.env.local scripts/consolidate-blog-duplicates.mjs [--apply]
import pg from "pg";

const APPLY = process.argv.includes("--apply");

// Birleştirilecek kümeler: kalan slug → arşivlenecek slug'lar (Türkçe slug'lar;
// diğer diller group_id üzerinden otomatik takip eder).
const MERGES = [
  {
    keep: "donusum-orani-artirma-rehberi-2026da-e-ticaret-siteleri-icin-7-somut-adim",
    archive: [
      "e-ticaret-donusum-orani-artirma-2026da-calisan-9-kanitli-taktik",
      "donusum-orani-artirma-e-ticarette-olcumden-aksiyona-2026-yolu",
    ],
  },
];

const c = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await c.connect();

const one = async (s, p) => (await c.query(s, p)).rows[0];
const all = async (s, p) => (await c.query(s, p)).rows;

for (const m of MERGES) {
  const keeper = await one(`select id, group_id, title from blog_posts where locale='tr' and slug=$1`, [m.keep]);
  if (!keeper) {
    console.log(`⚠ kalacak yazı bulunamadı: ${m.keep}`);
    continue;
  }
  console.log(`\nKALAN → ${keeper.title}`);

  for (const slug of m.archive) {
    const src = await one(`select id, group_id, title from blog_posts where locale='tr' and slug=$1`, [slug]);
    if (!src) {
      console.log(`  ⚠ bulunamadı: ${slug}`);
      continue;
    }

    // Grubun tamamı (tr/en/de) arşivlenir. Her dil kendi dilindeki kalıcı
    // sürüme yönlendirilsin diye redirect_to kalan yazının TÜRKÇE kaydını
    // gösterir; sayfa katmanı group_id üzerinden dili eşleştirir.
    const rows = await all(`select id, locale, slug, title from blog_posts where group_id=$1 order by locale`, [src.group_id]);
    for (const r of rows) {
      console.log(`  arşiv [${r.locale}] /${r.slug}`);
      if (APPLY) {
        await c.query(
          `update blog_posts set status='archived', redirect_to=$2, updated_at=now() where id=$1`,
          [r.id, keeper.id],
        );
      }
    }
  }
}

// Kontrol
console.log("\n=== sonuç ===");
for (const r of await all(
  `select status, count(*)::int adet from blog_posts group by status order by status`,
)) console.log(`  ${r.status}: ${r.adet}`);

if (!APPLY) console.log("\n(kuru çalıştırma — uygulamak için --apply)");
await c.end();
