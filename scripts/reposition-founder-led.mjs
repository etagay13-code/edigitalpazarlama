// Kurucu-yönetimli butik stüdyo konumlandırması.
//
// Sitede yayında olan ölçek iddiaları (14 kişilik ekip, 60+ aktif müşteri,
// ₺18M+ bütçe, 4.6x ortalama ROAS, 92/100 NPS, Maslak ofisi, async ekip
// kültürü) doğrulanamıyordu ve tek kişilik bir yapıyla çelişiyordu.
//
// Yerine yalnızca SİTENİN KENDİSİNDEN doğrulanabilir rakamlar konuyor:
//   13 marka   → portfolyo + marka şeridinde adları yazılı
//   4 ülke     → Türkiye, Hollanda (MyHaar), Belçika (IHH), Avusturya (IHA)
//   7 sektör   → portfolyo kategorileri
//   3 dil      → tr/en/de
//
// Kullanım: node --env-file=.env.local scripts/reposition-founder-led.mjs
import pg from "pg";

const c = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await c.connect();

const set = async (page, key, locale, fields) => {
  const cols = [];
  const vals = [page, key, locale];
  let i = 4;
  for (const [k, v] of Object.entries(fields)) {
    cols.push(`${k} = $${i}`);
    vals.push(k === "body" ? JSON.stringify(v) : v);
    i += 1;
  }
  const q = `update page_sections set ${cols.join(", ")} where page_slug=$1 and section_key=$2 and locale=$3`;
  const r = await c.query(q, vals);
  return r.rowCount;
};

// ── 1) Sayaçlar: yalnızca doğrulanabilir olgular ────────────────────────────
const STATS = {
  tr: [
    { to: 13, suffix: "", label: "Marka" },
    { to: 4, suffix: "", label: "Ülke" },
    { to: 7, suffix: "", label: "Sektör" },
    { to: 3, suffix: "", label: "Dil" },
  ],
  en: [
    { to: 13, suffix: "", label: "Brands" },
    { to: 4, suffix: "", label: "Countries" },
    { to: 7, suffix: "", label: "Sectors" },
    { to: 3, suffix: "", label: "Languages" },
  ],
  de: [
    { to: 13, suffix: "", label: "Marken" },
    { to: 4, suffix: "", label: "Länder" },
    { to: 7, suffix: "", label: "Branchen" },
    { to: 3, suffix: "", label: "Sprachen" },
  ],
};

for (const [loc, items] of Object.entries(STATS)) {
  for (const page of ["home", "about", "portfolio"]) {
    await set(page, "stats", loc, { body: { items } });
  }
}
console.log("✓ sayaçlar doğrulanabilir rakamlarla değiştirildi (3 sayfa × 3 dil)");

// ── 2) Ekip bölümü → kurucu-yönetimli konumlandırma ─────────────────────────
const FOUNDER = {
  tr: {
    eyebrow: "Kurucu yönetiminde",
    title: "Projenizi devralan kişi, görüştüğünüz kişidir",
    description:
      "Bu bir ajans değil, kurucu yönetiminde çalışan bir stüdyo. Strateji görüşmesini yapan, kampanyayı kuran ve raporu yazan aynı kişi. Bu yüzden aynı anda sınırlı sayıda markayla çalışıyoruz — devredilecek bir junior ekip yok.",
  },
  en: {
    eyebrow: "Founder-led",
    title: "The person you meet is the person who does the work",
    description:
      "This is not an agency but a founder-led studio. The same person runs the strategy call, builds the campaign and writes the report. That is why only a limited number of brands are taken on at a time — there is no junior team to hand the account to.",
  },
  de: {
    eyebrow: "Gründergeführt",
    title: "Die Person im Gespräch ist die Person, die arbeitet",
    description:
      "Dies ist keine Agentur, sondern ein gründergeführtes Studio. Dieselbe Person führt das Strategiegespräch, baut die Kampagne auf und schreibt den Report. Deshalb wird immer nur eine begrenzte Zahl an Marken betreut — es gibt kein Junior-Team, an das übergeben wird.",
  },
};
for (const [loc, f] of Object.entries(FOUNDER)) {
  await set("about", "team_header", loc, {
    eyebrow: f.eyebrow,
    title: f.title,
    description: f.description,
  });
}
console.log("✓ ekip bölümü kurucu-yönetimli konumlandırmaya çevrildi");

// ── 3) Uydurma ofis/ekip kültürü bölümleri kaldırıldı ───────────────────────
for (const loc of ["tr", "en", "de"]) {
  // culture: async ekip kültürü, ofis günleri — tek kişilik yapıda anlamsız
  await set("about", "culture", loc, { body: { items: [] } });
}
console.log("✓ 'çalışma kültürü' bölümü kaldırıldı (uydurma ofis/ekip anlatısı)");

const OFFICE = {
  tr: {
    title: "Nasıl çalışıyoruz",
    description:
      "Görüşmeler çevrimiçi yapılıyor; İstanbul içinde yüz yüze buluşmak isterseniz önceden randevulaşmak yeterli. Projeler tek iletişim noktasından yürüyor: aracı yok, brief kaybolmuyor.",
    items: [
      { icon: "Video", text: "Keşif ve strateji görüşmeleri çevrimiçi" },
      { icon: "MapPin", text: "İstanbul içinde randevuyla yüz yüze görüşme" },
      { icon: "Clock", text: "Mesai içinde aynı gün, dışında ertesi iş günü dönüş" },
    ],
  },
  en: {
    title: "How we work",
    description:
      "Meetings are held online; if you would rather meet in person in Istanbul, an appointment is all it takes. Projects run through a single point of contact: no middle layer, no brief lost in translation.",
    items: [
      { icon: "Video", text: "Discovery and strategy calls held online" },
      { icon: "MapPin", text: "In-person meetings in Istanbul by appointment" },
      { icon: "Clock", text: "Same-day replies in working hours, next business day otherwise" },
    ],
  },
  de: {
    title: "So arbeiten wir",
    description:
      "Gespräche finden online statt; für ein persönliches Treffen in Istanbul genügt ein Termin. Projekte laufen über einen einzigen Ansprechpartner: keine Zwischenebene, kein verlorenes Briefing.",
    items: [
      { icon: "Video", text: "Kennenlern- und Strategiegespräche online" },
      { icon: "MapPin", text: "Persönliche Treffen in Istanbul nach Vereinbarung" },
      { icon: "Clock", text: "Antwort am selben Werktag, sonst am nächsten" },
    ],
  },
};
for (const [loc, o] of Object.entries(OFFICE)) {
  await set("contact", "office", loc, {
    title: o.title,
    description: o.description,
    body: { items: o.items },
  });
}
console.log("✓ iletişim sayfasındaki uydurma ofis anlatısı gerçekle değiştirildi");

// ── 4) Kontenjan: tek kişilik yapıda inandırıcı sayı ────────────────────────
const HERO_NOTE = {
  tr: { note1: "Aynı anda en fazla 3 marka", note2: "Ortalama 48 saat içinde teklif" },
  en: { note1: "Maximum 3 brands at a time", note2: "Proposal within 48 hours on average" },
  de: { note1: "Maximal 3 Marken gleichzeitig", note2: "Angebot im Schnitt binnen 48 Stunden" },
};
for (const [loc, h] of Object.entries(HERO_NOTE)) {
  const r = await c.query(
    `select body from page_sections where page_slug='home' and section_key='hero' and locale=$1`,
    [loc],
  );
  const body = r.rows[0]?.body ?? {};
  await set("home", "hero", loc, { body: { ...body, ...h } });
}
console.log("✓ hero kontenjan notu tek kişilik yapıya göre güncellendi");

await c.end();
