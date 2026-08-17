// "Uzmanlaşmış ekipler" anlatısını kurucu-yönetimli yapıya çevirir.
//
// Tek kişilik bir stüdyoda "her alan kendi ekibince yönetiliyor" savunulamaz.
// Argüman değişmiyor — kanallar arası kaybın sıfır olması — ama gerekçesi
// değişiyor: ayrı ekipler olduğu için değil, TEK ELDEN yürüdüğü için.
import pg from "pg";

const c = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await c.connect();

const upd = (page, key, loc, fields) => {
  const cols = Object.keys(fields).map((k, i) => `${k} = $${i + 4}`);
  return c.query(
    `update page_sections set ${cols.join(", ")} where page_slug=$1 and section_key=$2 and locale=$3`,
    [page, key, loc, ...Object.values(fields).map((v) => (typeof v === "object" ? JSON.stringify(v) : v))],
  );
};

// ── about/hero ──────────────────────────────────────────────────────────────
const ABOUT_HERO = {
  tr: {
    title: "Markaları büyütmek için kurulmuş bir stüdyo",
    description:
      "True EDigital Marketing, performans pazarlaması ile teknoloji geliştirmenin kesiştiği noktada çalışan, kurucu yönetiminde bir stüdyo. Sağlık turizminden sanayiye, e-ticaretten sivil topluma kadar dört ülkede markalara dijital büyüme ortaklığı sunuyor.",
  },
  en: {
    title: "A studio built to grow brands",
    description:
      "True EDigital Marketing is a founder-led studio working where performance marketing meets technology. It partners on digital growth with brands across four countries, from health tourism and industry to e-commerce and non-profits.",
  },
  de: {
    title: "Ein Studio, das Marken wachsen lässt",
    description:
      "True EDigital Marketing ist ein gründergeführtes Studio an der Schnittstelle von Performance-Marketing und Technologie. Es begleitet Marken in vier Ländern beim digitalen Wachstum — vom Gesundheitstourismus über die Industrie bis zu E-Commerce und Non-Profits.",
  },
};

// ── home/hero ───────────────────────────────────────────────────────────────
const HOME_HERO_DESC = {
  tr: "Reklam, SEO, sosyal medya, mobil uygulama ve SaaS geliştirme — markanızı büyütmek için ihtiyacınız olan her şey tek elden. Stratejiyi kuran, kreatifi üreten ve performansı ölçen aynı kişi olduğu için kanallar arasında hiçbir şey kaybolmuyor.",
  en: "Ads, SEO, social media, mobile apps and SaaS development — everything you need to grow, from one hand. Because the same person sets the strategy, produces the creative and measures the performance, nothing is lost between channels.",
  de: "Ads, SEO, Social Media, Mobile Apps und SaaS-Entwicklung — alles für Ihr Wachstum aus einer Hand. Weil dieselbe Person Strategie, Kreation und Messung verantwortet, geht zwischen den Kanälen nichts verloren.",
};

// ── home/services_header ────────────────────────────────────────────────────
const SERVICES_DESC = {
  tr: "Reklamdan SEO'ya, mobil uygulamadan SaaS geliştirmeye — markanız büyüdükçe ihtiyaç duyacağınız her hizmet aynı stratejinin parçası olarak, aynı elden sunuluyor.",
  en: "From ads to SEO, from mobile apps to SaaS development — every service you will need as you grow is delivered from the same hand, as part of the same strategy.",
  de: "Von Ads über SEO bis zu Mobile Apps und SaaS-Entwicklung — jede Leistung, die Sie beim Wachsen brauchen, kommt aus einer Hand und ist Teil derselben Strategie.",
};

// ── about/values — "uzmanlaşmış ekipler" maddesi yeniden yazıldı ─────────────
const VALUES = {
  tr: {
    description: "Bir çalışma kültürü kelimelerden değil, günlük kararlardan oluşur. İşte bizimkiler.",
    item: {
      title: "Tek elden ustalık",
      desc: "Reklam, SEO, geliştirme ve içerik ayrı ajanslara dağılmıyor. Hepsi aynı kişide birleştiği için kanallar arası devir teslim kaybı hiç yaşanmıyor.",
      icon: "Users",
    },
  },
  en: {
    description: "A way of working is made of daily decisions, not words. Here are ours.",
    item: {
      title: "Craft from one hand",
      desc: "Ads, SEO, development and content are not scattered across separate agencies. Because they meet in one person, nothing is lost in handovers between channels.",
      icon: "Users",
    },
  },
  de: {
    description: "Eine Arbeitsweise besteht aus täglichen Entscheidungen, nicht aus Worten. Hier sind unsere.",
    item: {
      title: "Handwerk aus einer Hand",
      desc: "Ads, SEO, Entwicklung und Content verteilen sich nicht auf getrennte Agenturen. Weil alles in einer Person zusammenläuft, geht bei Übergaben zwischen Kanälen nichts verloren.",
      icon: "Users",
    },
  },
};

// ── about/why — "Tek bir ekipten 360°" ──────────────────────────────────────
const WHY_TITLE = { tr: "Tek elden 360°", en: "360° from one hand", de: "360° aus einer Hand" };

for (const loc of ["tr", "en", "de"]) {
  await upd("about", "hero", loc, ABOUT_HERO[loc]);
  await upd("home", "hero", loc, { description: HOME_HERO_DESC[loc] });
  await upd("home", "services_header", loc, { description: SERVICES_DESC[loc] });

  // values: açıklama + "uzmanlaşmış ekipler" maddesini değiştir
  const v = (await c.query(
    `select body from page_sections where page_slug='about' and section_key='values' and locale=$1`,
    [loc],
  )).rows[0];
  if (v?.body?.items) {
    const items = v.body.items.map((it) =>
      /ekip|team|Team/i.test(`${it.title} ${it.desc}`) ? VALUES[loc].item : it,
    );
    await upd("about", "values", loc, { description: VALUES[loc].description, body: { items } });
  }

  // why: başlıktaki "ekip" ifadesi
  const w = (await c.query(
    `select body from page_sections where page_slug='about' and section_key='why' and locale=$1`,
    [loc],
  )).rows[0];
  if (w?.body?.items) {
    const items = w.body.items.map((it) =>
      /ekipten|team|Team/i.test(it.title) ? { ...it, title: WHY_TITLE[loc] } : it,
    );
    await upd("about", "why", loc, { body: { items } });
  }
  console.log(`✓ [${loc}] hero, hizmet başlığı, değerler ve neden-biz güncellendi`);
}

await c.end();
