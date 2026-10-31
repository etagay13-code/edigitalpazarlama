// RU içeriğini DB'ye yazar: her tablonun EN satırları DeepSeek ile Rusçaya
// yerelleştirilir, çevrilmeyen alanlar (slug, icon, sort_order...) aynen kopyalanır.
// Idempotent: ru satırları silinip yeniden yazılır.
// Kullanım:
//   node --env-file=.env.local scripts/i18n/ru.mjs content   → site içerik tabloları
//   node --env-file=.env.local scripts/i18n/ru.mjs blog      → eksik RU blog çevirileri
import pg from "pg";

const mode = process.argv[2];
if (!["content", "blog"].includes(mode)) {
  console.error("Kullanım: ru.mjs <content|blog>");
  process.exit(1);
}
const KEY = process.env.DEEPSEEK_API_KEY;
const c = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await c.connect();
const rows = async (sql, p) => (await c.query(sql, p)).rows;

// ── URL yerelleştirme (src/i18n/routes.ts ile aynı RU haritası) ──────────────
const SEG_EN_RU = {
  services: "uslugi", about: "o-nas", portfolio: "portfolio", contact: "kontakty", blog: "blog",
  "roas-calculator": "roas-kalkulyator", "digital-audit": "tsifrovoy-audit", "thank-you": "spasibo",
  industries: "otrasli", "privacy-policy": "politika-konfidentsialnosti", imprint: "rekvizity",
};
const SEG_TR_RU = {
  hizmetler: "uslugi", hakkimizda: "o-nas", portfolyo: "portfolio", iletisim: "kontakty", blog: "blog",
  sektorler: "otrasli",
};
const SERVICE_RU = {
  "360-digital-marketing": "360-tsifrovoy-marketing", "360-dijital-pazarlama": "360-tsifrovoy-marketing",
  "ad-management": "upravlenie-reklamoy", "reklam-yonetimi": "upravlenie-reklamoy",
  seo: "seo",
  "mobile-app-development": "razrabotka-mobilnykh-prilozheniy", "mobil-uygulama-gelistirme": "razrabotka-mobilnykh-prilozheniy",
  "saas-development": "razrabotka-saas", "saas-proje-gelistirme": "razrabotka-saas",
  "social-media-management": "smm", "sosyal-medya-yonetimi": "smm",
  "web-design-development": "veb-dizayn-i-razrabotka", "web-tasarim-gelistirme": "veb-dizayn-i-razrabotka",
  "content-brand-strategy": "kontent-i-brend-strategiya", "icerik-marka-stratejisi": "kontent-i-brend-strategiya",
};

function ruHref(href, blogSlugMap = {}) {
  const m = href.match(/^\/(?:en\/)?([^"#?]*)/);
  if (!m || !href.startsWith("/")) return href;
  const parts = m[1].split("/").filter(Boolean);
  if (!parts.length) return "/ru";
  const seg = SEG_EN_RU[parts[0]] ?? SEG_TR_RU[parts[0]];
  if (!seg) return href;
  const out = [seg];
  if (parts[1]) {
    if (seg === "uslugi") out.push(SERVICE_RU[parts[1]] ?? parts[1]);
    else if (seg === "blog") out.push(blogSlugMap[parts[1]] ?? parts[1]);
    else out.push(parts[1]);
  }
  return "/ru/" + out.join("/");
}

const RU_MAP = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};
const slugify = (t) =>
  t.toLowerCase().split("").map((ch) => RU_MAP[ch] ?? ch).join("")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80).replace(/-$/, "");

// ── DeepSeek ─────────────────────────────────────────────────────────────────
const BRIEF =
  "Target language: Russian (professional business Russian, address the reader with «вы»). " +
  "Localize naturally for a Russian-speaking business reader; do not translate word for word. " +
  "Keep brand and product names (True EDigital, Google Ads, Meta, GA4, Looker Studio, etc.) in Latin script. " +
  "Keep numbers, currency amounts, percentages and URLs unchanged.";

async function deepseek(system, user, tries = 3) {
  for (let i = 0; ; i++) {
    try {
      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "system", content: system }, { role: "user", content: user }],
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 8000,
        }),
      });
      if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const raw = (await res.json()).choices?.[0]?.message?.content ?? "";
      return JSON.parse(raw);
    } catch (e) {
      if (i >= tries - 1) throw e;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

/** Nesnedeki tüm insan-okur metinleri çevirir; anahtarlar ve yapı korunur. */
async function translateObj(obj, hint = "") {
  const system =
    "You are a senior marketing translator. You receive a JSON object and return the SAME JSON object " +
    "(identical keys, nesting, array lengths and order) with every human-readable string value translated. " +
    "Never translate keys, URLs, paths starting with '/', icon names, CSS classes, hex colors or slugs. Return ONLY JSON.";
  const out = await deepseek(system, `${BRIEF}\n${hint}\n\nJSON:\n${JSON.stringify(obj)}`);
  return out;
}

async function pool(items, n, fn) {
  let i = 0;
  const workers = Array.from({ length: n }, async () => {
    while (i < items.length) {
      const k = i++;
      await fn(items[k], k);
    }
  });
  await Promise.all(workers);
}

// Kategori etiketleri filtrelerde eşleştiği için sabit sözlükle çevrilir.
const CATEGORY_RU = {
  "health tourism": "Медицинский туризм", legal: "Юридические услуги", industry: "Промышленность",
  "non-profit": "НКО", "local services": "Локальные услуги", moving: "Переезды", "e-commerce": "Электронная коммерция",
  "project management": "Управление проектами", ai: "ИИ", hosting: "Хостинг", collaboration: "Совместная работа",
  advertising: "Реклама", analytics: "Аналитика", backend: "Backend", mobile: "Мобильная разработка",
  frontend: "Frontend", communication: "Коммуникации", database: "Базы данных", design: "Дизайн",
  "backend-as-a-service": "Backend-as-a-Service", reporting: "Отчётность", seo: "SEO", payments: "Платежи",
  "cdn/dns": "CDN/DNS",
};
const TAG_RU = {
  Web: "Веб", "Local SEO": "Локальное SEO", Localization: "Локализация", Content: "Контент",
  "Social Media": "Соцсети", "E-commerce": "Электронная коммерция", "Quote Flow": "Форма расчёта",
  "SEO Migration": "SEO-миграция", Video: "Видео",
};
const cat = (v) => (v == null ? v : CATEGORY_RU[v.toLowerCase()] ?? v);

// ── İçerik tabloları ─────────────────────────────────────────────────────────
// fields: çevrilecek sütunlar. Diğer tüm sütunlar (id/created_at hariç) kopyalanır.
const TABLES = [
  { t: "services", fields: ["title", "short", "description", "long_description", "hero", "approach", "bullets", "deliverables", "outcomes", "ideal_for"] },
  { t: "portfolio_projects", fields: ["title", "description", "metric", "tags", "case_study", "meta_title", "meta_desc"], map: { category: cat } },
  { t: "testimonials", fields: ["role", "quote"] },
  { t: "team_members", fields: ["role", "bio"] },
  { t: "timeline_events", fields: ["title", "description"] },
  { t: "industries", fields: ["name", "description", "highlights", "meta_title", "meta_desc", "body"], map: { category: cat } },
  { t: "tech_items", fields: [], map: { category: cat } },
  { t: "faqs", fields: ["question", "answer"] },
  { t: "page_sections", fields: ["eyebrow", "title", "description", "body"] },
  { t: "chat_rules", fields: ["question", "keywords", "answer"] },
  { t: "site_settings_i18n", fields: ["tagline", "description", "address"], noId: true },
];

async function copyTable({ t, fields, map = {}, noId }, extra = {}) {
  const src = await rows(`select * from ${t} where locale='en'`);
  const out = new Array(src.length);
  await pool(src, 8, async (r, k) => {
    const payload = Object.fromEntries(fields.filter((f) => r[f] != null).map((f) => [f, r[f]]));
    const tr = Object.keys(payload).length ? await translateObj(payload) : {};
    const row = { ...r, locale: "ru" };
    if (!noId) delete row.id;
    delete row.created_at;
    delete row.updated_at;
    for (const f of fields) if (tr[f] !== undefined && tr[f] !== null) row[f] = tr[f];
    for (const [f, fn] of Object.entries(map)) row[f] = fn(row[f]);
    Object.assign(row, extra.rowFix?.(r) ?? {});
    out[k] = row;
  });
  await c.query(`delete from ${t} where locale='ru'`);
  for (const row of out) {
    const cols = Object.keys(row);
    const vals = cols.map((col) => {
      const v = row[col];
      return v !== null && typeof v === "object" && !Array.isArray(v) ? JSON.stringify(v) : v;
    });
    await c.query(
      `insert into ${t} (${cols.join(",")}) values (${cols.map((_, i) => `$${i + 1}`).join(",")})`,
      vals,
    );
  }
  console.log(`${t}: ${out.length}`);
}

async function content() {
  for (const spec of TABLES) await copyTable(spec);

  // Portfolyo etiketleri sabit sözlükle; vaka sayfasındaki "Оказанные услуги"
  // değeri de etiketlerden kurulur (EN kaynağında bu değer Türkçe kalmıştı).
  for (const r of await rows("select id,tags,case_study from portfolio_projects where locale='ru'")) {
    const tags = (r.tags ?? []).map((t) => TAG_RU[t] ?? t);
    const cs = r.case_study?.results
      ? { ...r.case_study, results: r.case_study.results.map((x) => (x.value?.includes("·") && /услуги/.test(x.label) ? { ...x, value: tags.join(" · ") } : x)) }
      : r.case_study;
    await c.query("update portfolio_projects set tags=$1, case_study=$2 where id=$3", [tags, cs ? JSON.stringify(cs) : null, r.id]);
  }

  // Hizmet alt tabloları: service_id → RU hizmetinin id'si (slug üzerinden)
  const ruIds = Object.fromEntries((await rows("select slug,id from services where locale='ru'")).map((r) => [r.slug, r.id]));
  const enSlug = Object.fromEntries((await rows("select id,slug from services where locale='en'")).map((r) => [r.id, r.slug]));
  const fix = (r) => ({ service_id: ruIds[enSlug[r.service_id]] });
  await copyTable({ t: "service_process_steps", fields: ["title", "description"] }, { rowFix: fix });
  await copyTable({ t: "service_faqs", fields: ["question", "answer"] }, { rowFix: fix });
}

// ── Blog ─────────────────────────────────────────────────────────────────────
async function blog() {
  const en = await rows(
    "select * from blog_posts where locale='en' and redirect_to is null and group_id not in (select group_id from blog_posts where locale='ru')",
  );
  console.log("çevrilecek:", en.length);
  const taken = new Set((await rows("select slug from blog_posts where locale='ru'")).map((r) => r.slug));
  let done = 0;
  await pool(en, 8, async (p) => {
    try {
      const o = await deepseek(
        "You are a senior marketing editor who localizes performance-marketing content. Keep the HTML structure and every tag and href exactly. Return ONLY valid JSON.",
        `${BRIEF}\n\nLocalize this article. Keep the HTML structure exactly (same tags, same order, same list items, same href values).\n\nTITLE: ${p.title}\nEXCERPT: ${p.excerpt}\nHTML:\n${p.content_html}\n\nJSON SCHEMA\n{"title":"max 60 chars","excerpt":"150-200 chars","contentHtml":"same structure","metaTitle":"max 60 chars","metaDesc":"150-158 chars","tags":["3-5 tags"],"coverAlt":"alt text"}`,
      );
      let slug = slugify(o.title || p.title) || `${p.slug}-ru`;
      for (let n = 2; taken.has(slug); n++) slug = `${slugify(o.title)}-${n}`;
      taken.add(slug);
      const html = (o.contentHtml || p.content_html).replace(/href="(\/[^"]*)"/g, (_, h) => `href="${ruHref(h)}"`);
      await c.query(
        `insert into blog_posts (group_id,locale,slug,title,excerpt,content_html,cover_url,cover_alt,meta_title,meta_desc,tags,reading_min,status,source,published_at)
         values ($1,'ru',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'translation',$13)`,
        [p.group_id, slug, o.title || p.title, o.excerpt || p.excerpt, html, p.cover_url, o.coverAlt || p.cover_alt,
          (o.metaTitle || o.title || "").slice(0, 65), (o.metaDesc || "").slice(0, 165),
          Array.isArray(o.tags) ? o.tags.map(String).slice(0, 6) : p.tags, p.reading_min, p.status, p.published_at],
      );
      console.log(`[${++done}/${en.length}] ${slug}`);
    } catch (e) {
      console.error(`HATA ${p.slug}: ${e.message}`);
    }
  });

  // Blog içi /ru/blog/<en-slug> bağlantılarını RU slug'larına çevir (group_id üzerinden)
  const pairs = await rows(
    "select e.slug en, r.slug ru from blog_posts e join blog_posts r on r.group_id=e.group_id and r.locale='ru' where e.locale='en'",
  );
  const map = Object.fromEntries(pairs.map((x) => [x.en, x.ru]));
  for (const p of await rows("select id,content_html from blog_posts where locale='ru' and content_html like '%/ru/blog/%'")) {
    const html = p.content_html.replace(/href="\/ru\/blog\/([^"]+)"/g, (_, s) => `href="/ru/blog/${map[s] ?? s}"`);
    if (html !== p.content_html) await c.query("update blog_posts set content_html=$1 where id=$2", [html, p.id]);
  }
}

if (mode === "content") await content();
else await blog();
await c.end();
