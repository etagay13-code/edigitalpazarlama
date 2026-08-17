// Sektör (dikey) sayfalarını gerçek portföye göre kurar.
//
// Eski industries kayıtları kurgusaldı ("+50 D2C markası", "ARR x3 vakaları")
// ve portfolyodaki gerçek müşteri dağılımıyla uyuşmuyordu. Yeni sektörler
// portfolyo kategorileriyle BİREBİR eşleşir; böylece her sektör sayfası kendi
// gerçek vakalarını listeleyebiliyor.
//
// Kullanım: node --env-file=.env.local scripts/seed-sectors.mjs
import pg from "pg";

const SECTORS = [
  {
    slug: "saglik-turizmi",
    category: { tr: "Sağlık Turizmi", en: "Health Tourism", de: "Gesundheitstourismus" },
    tr: {
      name: "Sağlık Turizmi & Klinik",
      description:
        "Saç ekimi, estetik ve diş kliniklerinde rekabet aramanın en pahalı olduğu yerde: hasta yurt dışından geliyor, karar süreci uzun ve güven her şeyden önce geliyor.",
      highlights: ["Çok dilli site", "Uluslararası hasta", "Başvuru kalitesi"],
    },
    en: {
      name: "Health Tourism & Clinics",
      description:
        "In hair transplant, aesthetics and dental clinics the competition sits where search is most expensive: the patient comes from abroad, the decision takes weeks and trust outranks everything.",
      highlights: ["Multilingual site", "International patients", "Enquiry quality"],
    },
    de: {
      name: "Gesundheitstourismus & Kliniken",
      description:
        "Bei Haartransplantation, Ästhetik und Zahnkliniken liegt der Wettbewerb dort, wo Suche am teuersten ist: Patienten kommen aus dem Ausland, die Entscheidung dauert Wochen und Vertrauen zählt mehr als alles andere.",
      highlights: ["Mehrsprachige Website", "Internationale Patienten", "Anfragequalität"],
    },
  },
  {
    slug: "eticaret",
    category: { tr: "E-ticaret", en: "E-commerce", de: "E-Commerce" },
    tr: {
      name: "E-ticaret",
      description:
        "Ürün ve fiyat aramalarında görünmek yetmiyor; marjın kaldırabildiği bir edinme maliyetiyle satmak gerekiyor. Ölçüm ve sayfa deneyimi burada reklamdan daha belirleyici.",
      highlights: ["Marj bazlı hedef", "Ürün sayfası", "Sepet akışı"],
    },
    en: {
      name: "E-commerce",
      description:
        "Showing up in product and price searches is not enough; you have to sell at an acquisition cost your margin can carry. Measurement and page experience decide more here than the ads do.",
      highlights: ["Margin-based targets", "Product pages", "Checkout flow"],
    },
    de: {
      name: "E-Commerce",
      description:
        "In Produkt- und Preissuchen sichtbar zu sein reicht nicht; verkauft werden muss zu Akquisekosten, die die Marge trägt. Messung und Seitenerlebnis entscheiden hier mehr als die Anzeigen.",
      highlights: ["Margenbasierte Ziele", "Produktseiten", "Checkout-Fluss"],
    },
  },
  {
    slug: "yerel-hizmet",
    category: { tr: "Yerel Hizmet", en: "Local Services", de: "Lokale Dienstleistungen" },
    tr: {
      name: "Yerel Hizmet",
      description:
        "Su kaçağı, tesisat, tamir gibi acil talepte kazanan, en iyi teklifi veren değil; arayan kişinin ilk bulduğu ve hemen ulaşabildiği işletme oluyor.",
      highlights: ["İlçe bazlı sayfa", "Mobil öncelik", "Aramaya yönlendirme"],
    },
    en: {
      name: "Local Services",
      description:
        "In urgent demand — leaks, plumbing, repairs — the winner is not the best offer but the business the caller finds first and can reach immediately.",
      highlights: ["District-level pages", "Mobile-first", "Click-to-call"],
    },
    de: {
      name: "Lokale Dienstleistungen",
      description:
        "Bei dringendem Bedarf — Leckagen, Sanitär, Reparaturen — gewinnt nicht das beste Angebot, sondern der Betrieb, den der Anrufer zuerst findet und sofort erreicht.",
      highlights: ["Seiten je Bezirk", "Mobile First", "Direktanruf"],
    },
  },
  {
    slug: "hukuk",
    category: { tr: "Hukuk", en: "Legal", de: "Recht" },
    tr: {
      name: "Hukuk",
      description:
        "Reklam mevzuatının en dar olduğu alanlardan biri. Görünürlük büyük ölçüde organik aramadan geliyor; içerik hem doğru hem de meslek kurallarına uygun olmak zorunda.",
      highlights: ["Çalışma alanı × ilçe", "Mevzuata uygun dil", "Organik görünürlük"],
    },
    en: {
      name: "Legal",
      description:
        "One of the most tightly regulated areas for advertising. Visibility comes largely from organic search, and the content has to be both accurate and compliant with professional rules.",
      highlights: ["Practice area × district", "Compliant language", "Organic visibility"],
    },
    de: {
      name: "Recht",
      description:
        "Einer der am strengsten regulierten Werbebereiche. Sichtbarkeit entsteht überwiegend organisch, und die Inhalte müssen sowohl korrekt als auch berufsrechtlich zulässig sein.",
      highlights: ["Rechtsgebiet × Bezirk", "Regelkonforme Sprache", "Organische Sichtbarkeit"],
    },
  },
  {
    slug: "nakliyat",
    category: { tr: "Nakliyat", en: "Moving", de: "Umzug" },
    tr: {
      name: "Nakliyat",
      description:
        "Talep mevsimsel ve fiyat odaklı; müşteri aynı anda birkaç firmadan teklif alıyor. Fark, teklif akışının hızında ve güven veren referansta oluşuyor.",
      highlights: ["Teklif akışı", "Güzergâh sayfaları", "Mevsimsel bütçe"],
    },
    en: {
      name: "Moving & Relocation",
      description:
        "Demand is seasonal and price-driven; the customer collects quotes from several firms at once. The difference is made by how fast the quote flow is and how much trust the references carry.",
      highlights: ["Quote flow", "Route pages", "Seasonal budgeting"],
    },
    de: {
      name: "Umzug & Relocation",
      description:
        "Die Nachfrage ist saisonal und preisgetrieben; Kunden holen mehrere Angebote gleichzeitig ein. Den Unterschied machen die Geschwindigkeit des Angebotsprozesses und vertrauenswürdige Referenzen.",
      highlights: ["Angebotsprozess", "Routenseiten", "Saisonales Budget"],
    },
  },
  {
    slug: "endustri",
    category: { tr: "Endüstri", en: "Industry", de: "Industrie" },
    tr: {
      name: "Endüstri & B2B",
      description:
        "Arama hacmi düşük, işlem değeri yüksek. Karar veren kişi teknik; genel pazarlama diliyle yazılmış sayfa güven kaybettiriyor, doğru terminoloji ise tek başına ayrıştırıyor.",
      highlights: ["Teknik terminoloji", "Uzun satış döngüsü", "Teklif talebi"],
    },
    en: {
      name: "Industry & B2B",
      description:
        "Low search volume, high deal value. The decision-maker is technical; a page written in generic marketing language loses trust, while the right terminology alone sets you apart.",
      highlights: ["Technical terminology", "Long sales cycle", "Quote requests"],
    },
    de: {
      name: "Industrie & B2B",
      description:
        "Geringes Suchvolumen, hoher Auftragswert. Der Entscheider ist technisch; eine Seite in generischer Marketingsprache verliert Vertrauen, die richtige Terminologie allein differenziert.",
      highlights: ["Fachterminologie", "Langer Vertriebszyklus", "Angebotsanfragen"],
    },
  },
  {
    slug: "stk",
    category: { tr: "STK", en: "Non-profit", de: "Non-Profit" },
    tr: {
      name: "Sivil Toplum & Bağış",
      description:
        "Bağış kararı duygusal ama güven olmadan tamamlanmıyor. Şeffaflık, saha görüntüsü ve bağışın nereye gittiğinin görünmesi dönüşümü doğrudan belirliyor.",
      highlights: ["Bağış akışı", "Saha içeriği", "Çok ülkeli erişim"],
    },
    en: {
      name: "Non-profit & Fundraising",
      description:
        "The decision to donate is emotional, but it does not complete without trust. Transparency, field footage and showing where the money goes decide conversion directly.",
      highlights: ["Donation flow", "Field content", "Multi-country reach"],
    },
    de: {
      name: "Non-Profit & Spenden",
      description:
        "Die Spendenentscheidung ist emotional, kommt ohne Vertrauen aber nicht zustande. Transparenz, Aufnahmen aus dem Einsatz und die Sichtbarkeit der Mittelverwendung entscheiden direkt über die Conversion.",
      highlights: ["Spendenprozess", "Content aus dem Einsatz", "Reichweite über Länder"],
    },
  },
];

const c = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await c.connect();

const del = await c.query(`delete from industries`);
console.log(`${del.rowCount} eski (kurgusal) sektör kaydı silindi\n`);

let order = 0;
for (const s of SECTORS) {
  order += 10;
  for (const loc of ["tr", "en", "de"]) {
    const t = s[loc];
    await c.query(
      `insert into industries (locale, slug, category, name, description, highlights, sort_order, active)
       values ($1,$2,$3,$4,$5,$6,$7,true)`,
      [loc, s.slug, s.category[loc], t.name, t.description, t.highlights, order],
    );
  }
  console.log(`✓ ${s.slug} (3 dil)`);
}

// Kategori eşleşmesi doğrulaması: her sektörün gerçek vakası var mı?
console.log("\n=== sektör ↔ vaka eşleşmesi ===");
for (const s of SECTORS) {
  const n = (await c.query(
    `select count(*)::int c from portfolio_projects where locale='tr' and category=$1`,
    [s.category.tr],
  )).rows[0].c;
  console.log(`  ${s.slug.padEnd(16)} ${n} vaka ${n === 0 ? "⚠" : "✓"}`);
}
await c.end();
