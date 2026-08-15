// Portfolyoyu gerçek müşterilerle değiştirir.
//
// KURAL: Hiçbir performans rakamı uydurulmuyor. Kartlardaki "metric" alanı,
// yalnızca sitede/işin kendisinde doğrulanabilir bir olguyu taşır (pazar, dil
// sayısı, kapsam gibi). Gerçek ROAS/trafik rakamları müşteriden veya GA4/Ads
// hesaplarından geldiğinde admin panelinden eklenecek.
//
// Kullanım: node --env-file=.env.local scripts/seed-real-portfolio.mjs
import pg from "pg";

const PROJECTS = [
  {
    slug: "istanbul-care-saglik-turizmi",
    client: "Istanbul Care",
    gradient: "from-violet-500 to-indigo-500",
    tags: ["SEO", "Google Ads", "İçerik"],
    tr: {
      category: "Sağlık Turizmi",
      title: "Istanbul Care — Uluslararası Hasta Kazanımı",
      description:
        "Saç ekimi alanında yurt dışından hasta kazanan, İngilizce yayın yapan bir klinik. Rekabetin en sert olduğu sağlık turizmi aramalarında görünürlük ve nitelikli başvuru odaklı çalışma.",
      metric: "Uluslararası pazar",
    },
    en: {
      category: "Health Tourism",
      title: "Istanbul Care — International Patient Acquisition",
      description:
        "A hair transplant clinic acquiring patients from abroad through English-language content. Work focused on visibility and qualified enquiries in one of the most competitive search markets there is.",
      metric: "International market",
    },
    de: {
      category: "Gesundheitstourismus",
      title: "Istanbul Care — Internationale Patientengewinnung",
      description:
        "Eine Haartransplantationsklinik, die Patienten aus dem Ausland über englischsprachige Inhalte gewinnt. Fokus auf Sichtbarkeit und qualifizierte Anfragen in einem der umkämpftesten Suchmärkte.",
      metric: "Internationaler Markt",
    },
  },
  {
    slug: "myhaar-hollanda-klinik",
    client: "MyHaar",
    gradient: "from-cyan-500 to-blue-500",
    tags: ["Web", "SEO", "Yerelleştirme"],
    tr: {
      category: "Sağlık Turizmi",
      title: "MyHaar — Hollanda Pazarında Klinik Konumlandırma",
      description:
        "Lahey merkezli saç ekimi kliniği. Hollanda pazarına özgü arama davranışı ve güven beklentisine göre kurgulanmış site ve içerik yapısı; DHI ve Sapphire FUE hizmet sayfaları.",
      metric: "Hollanda",
    },
    en: {
      category: "Health Tourism",
      title: "MyHaar — Clinic Positioning in the Dutch Market",
      description:
        "A hair transplant clinic based in The Hague. Site and content structure built around Dutch search behaviour and trust expectations, with dedicated DHI and Sapphire FUE service pages.",
      metric: "Netherlands",
    },
    de: {
      category: "Gesundheitstourismus",
      title: "MyHaar — Klinikpositionierung im niederländischen Markt",
      description:
        "Haartransplantationsklinik mit Sitz in Den Haag. Website- und Inhaltsstruktur auf niederländisches Suchverhalten und Vertrauenserwartungen ausgerichtet, mit eigenen Seiten für DHI und Sapphire FUE.",
      metric: "Niederlande",
    },
  },
  {
    slug: "estemoon-medikal-estetik",
    client: "Estemoon",
    gradient: "from-fuchsia-500 to-violet-500",
    tags: ["SEO", "İçerik", "Sosyal Medya"],
    tr: {
      category: "Sağlık Turizmi",
      title: "Estemoon — Medikal Estetik Görünürlüğü",
      description:
        "Medikal estetik ve saç ekimi hizmeti veren klinik için İngilizce arama görünürlüğü ve hasta yolculuğuna göre kurgulanmış içerik mimarisi.",
      metric: "Medikal estetik",
    },
    en: {
      category: "Health Tourism",
      title: "Estemoon — Medical Aesthetics Visibility",
      description:
        "English-language search visibility and a content architecture mapped to the patient journey for a clinic offering medical aesthetics and hair restoration.",
      metric: "Medical aesthetics",
    },
    de: {
      category: "Gesundheitstourismus",
      title: "Estemoon — Sichtbarkeit in der Medizinästhetik",
      description:
        "Englischsprachige Suchsichtbarkeit und eine an der Patient Journey ausgerichtete Inhaltsarchitektur für eine Klinik für Medizinästhetik und Haartransplantation.",
      metric: "Medizinästhetik",
    },
  },
  {
    slug: "mitsubishi-klima-eticaret",
    client: "Mitsubishi Klima",
    gradient: "from-blue-500 to-cyan-500",
    tags: ["Google Ads", "SEO", "E-ticaret"],
    tr: {
      category: "E-ticaret",
      title: "Mitsubishi Klima — Ürün ve Fiyat Aramaları",
      description:
        "Klima modelleri ve fiyat aramalarında yoğun rekabet olan bir kategori. Model bazlı sayfa yapısı, ücretsiz keşif talebine yönlendiren dönüşüm akışı ve arama ağı kampanyaları.",
      metric: "Model bazlı yapı",
    },
    en: {
      category: "E-commerce",
      title: "Mitsubishi Klima — Product and Price Searches",
      description:
        "A category with intense competition on model and price searches. Model-level page structure, a conversion flow that leads to a free site survey, and search campaigns.",
      metric: "Model-level structure",
    },
    de: {
      category: "E-Commerce",
      title: "Mitsubishi Klima — Produkt- und Preissuchen",
      description:
        "Eine Kategorie mit intensivem Wettbewerb bei Modell- und Preissuchen. Seitenstruktur auf Modellebene, ein Conversion-Flow zur kostenlosen Besichtigung und Suchkampagnen.",
      metric: "Struktur auf Modellebene",
    },
  },
  {
    slug: "kosekeroglu-baklava",
    client: "Köşkeroğlu",
    gradient: "from-amber-500 to-orange-500",
    tags: ["E-ticaret", "Sosyal Medya", "Yerel SEO"],
    tr: {
      category: "E-ticaret",
      title: "Köşkeroğlu — Aynı Gün Teslimat Vaadi",
      description:
        "Baklava ve tatlı kategorisinde İstanbul içi aynı gün teslimat üzerine kurulu satış. Mevsimsel talep dalgalanmasına ve hediyelik alım davranışına göre planlanan kampanya ritmi.",
      metric: "Aynı gün teslimat",
    },
    en: {
      category: "E-commerce",
      title: "Köşkeroğlu — A Same-Day Delivery Promise",
      description:
        "Sales built on same-day delivery within Istanbul in the baklava and dessert category. Campaign rhythm planned around seasonal demand swings and gift-purchase behaviour.",
      metric: "Same-day delivery",
    },
    de: {
      category: "E-Commerce",
      title: "Köşkeroğlu — Lieferung am selben Tag",
      description:
        "Verkauf auf Basis der Lieferung am selben Tag innerhalb Istanbuls in der Baklava- und Dessertkategorie. Kampagnenrhythmus nach saisonalen Nachfrageschwankungen und Geschenkkaufverhalten.",
      metric: "Lieferung am selben Tag",
    },
  },
  {
    slug: "vibratech-endustriyel-balans",
    client: "Vibratech",
    gradient: "from-slate-400 to-cyan-500",
    tags: ["B2B", "SEO", "Web"],
    tr: {
      category: "Endüstri",
      title: "Vibratech — Endüstriyel Balans Hizmetleri",
      description:
        "Dar ve teknik bir B2B nişi: endüstriyel balans ve titreşim analizi. Karar vericinin teknik dilini konuşan, hizmet bazlı sayfa yapısı ve teklif talebine yönlendiren akış.",
      metric: "B2B / sanayi",
    },
    en: {
      category: "Industry",
      title: "Vibratech — Industrial Balancing Services",
      description:
        "A narrow, technical B2B niche: industrial balancing and vibration analysis. A service-level page structure that speaks the decision-maker's technical language and routes to a quote request.",
      metric: "B2B / industrial",
    },
    de: {
      category: "Industrie",
      title: "Vibratech — Industrielle Auswuchtdienstleistungen",
      description:
        "Eine enge, technische B2B-Nische: industrielles Auswuchten und Schwingungsanalyse. Eine Seitenstruktur auf Leistungsebene in der Fachsprache der Entscheider, die zur Angebotsanfrage führt.",
      metric: "B2B / Industrie",
    },
  },
  {
    slug: "karagoz-hukuk",
    client: "Karagöz Hukuk",
    gradient: "from-indigo-500 to-violet-500",
    tags: ["Web", "Yerel SEO", "İçerik"],
    tr: {
      category: "Hukuk",
      title: "Karagöz Hukuk — İlçe Bazlı Görünürlük",
      description:
        "Avukatlık ve hukuki danışmanlık bürosu için kurumsal site. Çalışma alanı × İstanbul ilçesi kesişiminde yapılandırılmış sayfa mimarisi ve ilk görüşmeye yönlendiren akış.",
      metric: "İlçe × çalışma alanı",
    },
    en: {
      category: "Legal",
      title: "Karagöz Law — District-Level Visibility",
      description:
        "A corporate site for a law and legal consultancy practice. Page architecture structured at the intersection of practice area and Istanbul district, routing to a first consultation.",
      metric: "District × practice area",
    },
    de: {
      category: "Recht",
      title: "Karagöz Recht — Sichtbarkeit auf Bezirksebene",
      description:
        "Unternehmenswebsite für eine Anwalts- und Rechtsberatungskanzlei. Seitenarchitektur an der Schnittstelle von Rechtsgebiet und Istanbuler Bezirk, mit Weg zur Erstberatung.",
      metric: "Bezirk × Rechtsgebiet",
    },
  },
  {
    slug: "bilen-tesisat",
    client: "Bilen Tesisat",
    gradient: "from-cyan-500 to-teal-500",
    tags: ["Yerel SEO", "Web", "Google Ads"],
    tr: {
      category: "Yerel Hizmet",
      title: "Bilen Tesisat — Acil Talebi Yakalamak",
      description:
        "Su kaçağı tespiti ve tıkanıklık açma hizmeti. Talebin acil ve konuma bağlı olduğu bir kategori: 12 hizmet × 39 ilçe kesişiminde sayfa yapısı ve telefona yönlendiren mobil öncelikli akış.",
      metric: "12 hizmet × 39 ilçe",
    },
    en: {
      category: "Local Services",
      title: "Bilen Tesisat — Capturing Urgent Demand",
      description:
        "Leak detection and drain unblocking services. A category where demand is urgent and location-bound: a page structure across 12 services × 39 districts and a mobile-first flow that routes to a phone call.",
      metric: "12 services × 39 districts",
    },
    de: {
      category: "Lokale Dienstleistungen",
      title: "Bilen Tesisat — Dringende Nachfrage abfangen",
      description:
        "Leckortung und Rohrreinigung. Eine Kategorie mit dringender, standortgebundener Nachfrage: Seitenstruktur über 12 Leistungen × 39 Bezirke und ein Mobile-First-Flow, der zum Anruf führt.",
      metric: "12 Leistungen × 39 Bezirke",
    },
  },
  {
    slug: "neco-nakliyat",
    client: "Neco Nakliyat",
    gradient: "from-violet-500 to-fuchsia-500",
    tags: ["Web", "Yerel SEO", "Teklif Akışı"],
    tr: {
      category: "Nakliyat",
      title: "Neco Nakliyat — 1993'ten Beri Süregelen Marka",
      description:
        "Evden eve nakliyat kategorisinde köklü bir markanın dijital karşılığı. Teklif talebini kolaylaştıran form akışı, hizmet ve güzergâh bazlı sayfa yapısı, yönetilebilir admin altyapısı.",
      metric: "1993'ten beri",
    },
    en: {
      category: "Moving",
      title: "Neco Nakliyat — A Brand Running Since 1993",
      description:
        "The digital counterpart of a long-established brand in home relocation. A form flow that simplifies quote requests, service and route-based page structure, and a manageable admin layer.",
      metric: "Since 1993",
    },
    de: {
      category: "Umzug",
      title: "Neco Nakliyat — Eine Marke seit 1993",
      description:
        "Das digitale Gegenstück einer etablierten Marke im Umzugsgeschäft. Ein Formularfluss, der Angebotsanfragen vereinfacht, eine Seitenstruktur nach Leistung und Route sowie eine pflegbare Administrationsebene.",
      metric: "Seit 1993",
    },
  },
  {
    slug: "oz-bayrampasa-nakliyat",
    client: "Öz Bayrampaşa Nakliyat",
    gradient: "from-amber-500 to-rose-500",
    tags: ["Web", "SEO Taşıma", "Yerel SEO"],
    tr: {
      category: "Nakliyat",
      title: "Öz Bayrampaşa — SEO Otoritesini Kaybetmeden Taşınma",
      description:
        "Yıllarca birikmiş arama otoritesi olan eski bir sitenin yeniden yazımı. Kritik kısıt: mevcut adreslerin birebir korunması — tek bir yönlendirme hatası yıllık kazanımı silebilirdi.",
      metric: "Adres yapısı korundu",
    },
    en: {
      category: "Moving",
      title: "Öz Bayrampaşa — Rebuilt Without Losing SEO Authority",
      description:
        "A rewrite of an ageing site carrying years of accumulated search authority. The critical constraint: preserving existing URLs exactly — a single redirect mistake could have erased years of gains.",
      metric: "URL structure preserved",
    },
    de: {
      category: "Umzug",
      title: "Öz Bayrampaşa — Neuaufbau ohne Verlust der SEO-Autorität",
      description:
        "Neuentwicklung einer alten Website mit jahrelang aufgebauter Suchautorität. Die entscheidende Randbedingung: bestehende URLs exakt erhalten — ein einziger Weiterleitungsfehler hätte Jahre zunichtemachen können.",
      metric: "URL-Struktur erhalten",
    },
  },
  {
    slug: "hri-insani-yardim",
    client: "HRI · IHH Belgium · IHA Austria",
    gradient: "from-emerald-500 to-teal-500",
    tags: ["Video", "Meta Ads", "Web"],
    tr: {
      category: "STK",
      title: "İnsani Yardım Kuruluşları — Üç Ülkede Erişim",
      description:
        "Humanitarian Relief International, IHH Belgium ve IHA Austria için dijital varlık ve erişim çalışması. Bağış davranışının duygusal ve güven odaklı olduğu bir alanda kampanya kreatifi ve site yapısı.",
      metric: "3 ülke",
    },
    en: {
      category: "Non-profit",
      title: "Humanitarian Organisations — Reach Across Three Countries",
      description:
        "Digital presence and reach work for Humanitarian Relief International, IHH Belgium and IHA Austria. Campaign creative and site structure in a field where donation behaviour is emotional and trust-driven.",
      metric: "3 countries",
    },
    de: {
      category: "Non-Profit",
      title: "Hilfsorganisationen — Reichweite in drei Ländern",
      description:
        "Digitale Präsenz und Reichweitenarbeit für Humanitarian Relief International, IHH Belgium und IHA Austria. Kampagnenkreation und Seitenstruktur in einem Feld, in dem Spendenverhalten emotional und vertrauensgetrieben ist.",
      metric: "3 Länder",
    },
  },
];

const c = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await c.connect();

// Kurgusal projeleri ve onlara bağlı üretilmiş vaka içeriklerini kaldır
const del = await c.query(`delete from portfolio_projects`);
console.log(`${del.rowCount} eski (kurgusal) kayıt silindi\n`);

let order = 0;
for (const p of PROJECTS) {
  order += 10;
  for (const loc of ["tr", "en", "de"]) {
    const t = p[loc];
    await c.query(
      `insert into portfolio_projects
        (locale, slug, title, client, category, description, metric, gradient, tags, sort_order, active)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)`,
      [loc, p.slug, t.title, p.client, t.category, t.description, t.metric, p.gradient, p.tags, order],
    );
  }
  console.log(`✓ ${p.slug} (3 dil)`);
}

const n = await c.query(`select locale, count(*)::int c from portfolio_projects group by locale order by locale`);
console.log("\nsonuç:", n.rows.map((r) => `${r.locale}:${r.c}`).join("  "));
await c.end();
