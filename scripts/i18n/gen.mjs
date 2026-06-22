// EN/DE içeriğini DB'ye yazar. Çevrilebilir alanları scripts/i18n/<locale>.json'dan,
// çevrilemeyen alanları (icon, accent, slug, sort_order, year...) canlı TR satırlarından alır.
// Parametreli insert (kaçış sorunu yok). Idempotent: locale satırları silinip yeniden yazılır.
// Kullanım: node --env-file=.env.local scripts/i18n/gen.mjs en
import pg from "pg";
import { readFileSync } from "node:fs";

const locale = process.argv[2];
if (!["en", "de"].includes(locale)) {
  console.error("Kullanım: gen.mjs <en|de>");
  process.exit(1);
}
const T = JSON.parse(readFileSync(`scripts/i18n/${locale}.json`, "utf-8"));

const c = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
await c.connect();
const rows = async (sql) => (await c.query(sql)).rows;

// overlay erişimi — eksikse TR değeri kalsın diye undefined döner
const ov = (table, i) => (T[table] && T[table][i]) || {};
const pick = (overlay, trVal, field) =>
  overlay[field] !== undefined && overlay[field] !== null ? overlay[field] : trVal;

async function insertRow(table, cols, vals) {
  const ph = cols.map((_, i) => `$${i + 1}`).join(",");
  await c.query(`insert into ${table} (${cols.join(",")}) values (${ph})`, vals);
}

console.log(`\n=== ${locale.toUpperCase()} yazılıyor ===`);

// --- services + children (cascade delete) ---
await c.query("delete from services where locale=$1", [locale]);
const trServices = await rows(
  "select * from services where locale='tr' order by sort_order",
);
const slugToId = {};
for (let i = 0; i < trServices.length; i++) {
  const tr = trServices[i];
  const o = ov("services", i);
  const cols = ["locale", "slug", "title", "short", "description", "long_description", "hero", "approach", "bullets", "deliverables", "tools", "outcomes", "ideal_for", "related_slugs", "icon", "accent", "sort_order", "active"];
  const vals = [
    locale, tr.slug,
    pick(o, tr.title, "title"), pick(o, tr.short, "short"), pick(o, tr.description, "description"),
    pick(o, tr.long_description, "long_description"), pick(o, tr.hero, "hero"), pick(o, tr.approach, "approach"),
    pick(o, tr.bullets, "bullets"), pick(o, tr.deliverables, "deliverables"), pick(o, tr.tools, "tools"),
    pick(o, tr.outcomes, "outcomes"), pick(o, tr.ideal_for, "ideal_for"),
    tr.related_slugs, tr.icon, tr.accent, tr.sort_order, tr.active,
  ];
  await insertRow("services", cols, vals);
  const { rows: r } = await c.query("select id from services where locale=$1 and slug=$2", [locale, tr.slug]);
  slugToId[tr.slug] = r[0].id;
}
console.log("services:", trServices.length);

// process steps
const trSteps = await rows(
  "select s.slug, p.step_number, p.title, p.description from service_process_steps p join services s on s.id=p.service_id and s.locale='tr' order by s.slug, p.step_number",
);
for (let i = 0; i < trSteps.length; i++) {
  const tr = trSteps[i];
  const o = ov("service_process_steps", i);
  await insertRow(
    "service_process_steps",
    ["locale", "service_id", "step_number", "title", "description"],
    [locale, slugToId[tr.slug], tr.step_number, pick(o, tr.title, "title"), pick(o, tr.description, "description")],
  );
}
console.log("service_process_steps:", trSteps.length);

// service faqs
const trSF = await rows(
  "select s.slug, f.question, f.answer, f.sort_order from service_faqs f join services s on s.id=f.service_id and s.locale='tr' order by s.slug, f.sort_order",
);
for (let i = 0; i < trSF.length; i++) {
  const tr = trSF[i];
  const o = ov("service_faqs", i);
  await insertRow(
    "service_faqs",
    ["locale", "service_id", "question", "answer", "sort_order"],
    [locale, slugToId[tr.slug], pick(o, tr.question, "question"), pick(o, tr.answer, "answer"), tr.sort_order],
  );
}
console.log("service_faqs:", trSF.length);

// --- bağımsız tablolar ---
async function simpleTable(table, selectCols, trOrder, mapCols) {
  await c.query(`delete from ${table} where locale=$1`, [locale]);
  const tr = await rows(`select ${selectCols} from ${table} where locale='tr' order by ${trOrder}`);
  for (let i = 0; i < tr.length; i++) {
    const o = ov(table, i);
    const { cols, vals } = mapCols(tr[i], o);
    await insertRow(table, ["locale", ...cols], [locale, ...vals]);
  }
  console.log(`${table}:`, tr.length);
}

await simpleTable("portfolio_projects", "*", "sort_order", (tr, o) => ({
  cols: ["slug", "title", "client", "category", "description", "metric", "gradient", "tags", "image_url", "sort_order", "active"],
  vals: [tr.slug, pick(o, tr.title, "title"), pick(o, tr.client, "client"), tr.category, pick(o, tr.description, "description"), pick(o, tr.metric, "metric"), tr.gradient, pick(o, tr.tags, "tags"), tr.image_url, tr.sort_order, tr.active],
}));

await simpleTable("testimonials", "*", "sort_order", (tr, o) => ({
  cols: ["name", "role", "company", "quote", "initials", "avatar_url", "sort_order", "active"],
  vals: [tr.name, pick(o, tr.role, "role"), pick(o, tr.company, "company"), pick(o, tr.quote, "quote"), tr.initials, tr.avatar_url, tr.sort_order, tr.active],
}));

await simpleTable("team_members", "*", "sort_order", (tr, o) => ({
  cols: ["name", "role", "bio", "initials", "accent", "avatar_url", "sort_order", "active"],
  vals: [tr.name, pick(o, tr.role, "role"), pick(o, tr.bio, "bio"), tr.initials, tr.accent, tr.avatar_url, tr.sort_order, tr.active],
}));

await simpleTable("timeline_events", "*", "sort_order", (tr, o) => ({
  cols: ["year", "title", "description", "sort_order", "active"],
  vals: [tr.year, pick(o, tr.title, "title"), pick(o, tr.description, "description"), tr.sort_order, tr.active],
}));

await simpleTable("industries", "*", "sort_order", (tr, o) => ({
  cols: ["name", "description", "highlights", "sort_order", "active"],
  vals: [pick(o, tr.name, "name"), pick(o, tr.description, "description"), pick(o, tr.highlights, "highlights"), tr.sort_order, tr.active],
}));

await simpleTable("tech_items", "*", "sort_order", (tr, o) => ({
  cols: ["name", "category", "sort_order"],
  vals: [tr.name, pick(o, tr.category, "category"), tr.sort_order],
}));

await simpleTable("faqs", "*", "scope,sort_order", (tr, o) => ({
  cols: ["scope", "question", "answer", "sort_order", "active"],
  vals: [tr.scope, pick(o, tr.question, "question"), pick(o, tr.answer, "answer"), tr.sort_order, tr.active],
}));

await simpleTable("page_sections", "*", "page_slug,sort_order", (tr, o) => ({
  cols: ["page_slug", "section_key", "eyebrow", "title", "description", "body", "sort_order"],
  vals: [tr.page_slug, tr.section_key, pick(o, tr.eyebrow, "eyebrow"), pick(o, tr.title, "title"), pick(o, tr.description, "description"), JSON.stringify(pick(o, tr.body, "body") ?? null), tr.sort_order],
}));

// site_settings_i18n
{
  const o = T.site_settings || {};
  await c.query(
    `insert into site_settings_i18n (locale, tagline, description, address)
     values ($1,$2,$3,$4)
     on conflict (locale) do update set tagline=excluded.tagline, description=excluded.description, address=excluded.address`,
    [locale, o.tagline ?? null, o.description ?? null, o.address ?? null],
  );
  console.log("site_settings_i18n: 1");
}

await c.end();
console.log(`✓ ${locale} tamam.`);
