// Blog üretimi: DeepSeek ile Türkçe yazı, aynı yazının İngilizce/Almanca
// yerelleştirilmiş çevirisi, fal.ai (FLUX) ile ortak kapak görseli.
//
// Tasarım kararı: içerik BİR kez Türkçe üretilir, diğer diller çeviridir.
// Böylece üç dilde aynı bilgi, aynı görsel ve aynı yapı bulunur; hreflang
// grubu tutarlı kalır ve maliyet üçte bire iner.
import type { Locale } from "@/i18n/config";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const FAL_URL = "https://fal.run/fal-ai/flux/schnell";

export type GeneratedPost = {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  metaTitle: string;
  metaDesc: string;
  tags: string[];
  imagePrompt: string;
  coverAlt: string;
};

export type LinkOption = { title: string; url: string };

// ── Yardımcılar ─────────────────────────────────────────────────────────────

const TR_MAP: Record<string, string> = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i", ö: "o", Ö: "o",
  ş: "s", Ş: "s", ü: "u", Ü: "u", â: "a", î: "i", û: "u",
};

// Almancada umlautlar tek harfe değil çift harfe açılır (ä→ae). Türkçe haritayla
// aynı olsaydı "Verhältnis" → "verhltnis" gibi okunmaz slug'lar çıkıyordu.
const DE_MAP: Record<string, string> = {
  ä: "ae", Ä: "ae", ö: "oe", Ö: "oe", ü: "ue", Ü: "ue", ß: "ss",
};

export function slugify(text: string, locale: string = "tr"): string {
  const map = locale === "de" ? { ...TR_MAP, ...DE_MAP } : TR_MAP;
  return text
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");
}

/** Ortalama okuma hızı 200 kelime/dk; HTML etiketleri sayılmaz. */
export function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

/**
 * Metindeki ilk uygun geçişi ilgili sayfaya bağlar. Zaten link içindeki
 * metinlere ve başlıklara dokunmaz — model link koymayı atlarsa emniyet ağı.
 */
export function addInternalLinks(html: string, links: LinkOption[], max = 4): string {
  let out = html;
  let added = 0;
  for (const link of links) {
    if (added >= max) break;
    const term = link.title.trim();
    if (term.length < 4) continue;
    if (out.includes(`href="${link.url}"`)) continue;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // <a> içinde ya da başlık etiketleri arasında olmayan ilk geçiş
    const re = new RegExp(`(?<!<a[^>]{0,200})\\b(${escaped})\\b(?![^<]{0,200}</a>)`, "i");
    if (re.test(out)) {
      out = out.replace(re, `<a href="${link.url}">$1</a>`);
      added += 1;
    }
  }
  return out;
}

async function deepseek(apiKey: string, system: string, user: string): Promise<Record<string, unknown>> {
  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 1.0,
      max_tokens: 6000,
    }),
  });

  if (!res.ok) {
    throw new Error(`DeepSeek ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = data.choices?.[0]?.message?.content ?? "";
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    // Model bazen JSON'u kod bloğuna sarar
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("DeepSeek geçerli JSON döndürmedi");
    return JSON.parse(m[0]) as Record<string, unknown>;
  }
}

const str = (o: Record<string, unknown>, k: string, fallback = ""): string =>
  typeof o[k] === "string" ? (o[k] as string) : fallback;

// ── 1) Türkçe yazı üretimi ──────────────────────────────────────────────────

export async function generateTurkishPost(opts: {
  apiKey: string;
  topic?: string | null;
  keyword?: string | null;
  existingTitles: string[];
  links: LinkOption[];
}): Promise<GeneratedPost> {
  const linkList = opts.links.map((l) => `- ${l.title} → ${l.url}`).join("\n");
  const avoid = opts.existingTitles.slice(0, 60).map((t) => `- ${t}`).join("\n");

  const system = [
    "Sen İstanbul merkezli 360° dijital pazarlama ajansı 'True EDigital Marketing' için yazan kıdemli bir performans pazarlama editörüsün.",
    "Uzmanlık alanların: Google Ads, Meta Ads, SEO, analitik ve dönüşüm optimizasyonu.",
    "Yazıların somut, sayıya dayalı ve uygulanabilir olur; klişe, dolgu cümle ve abartılı vaat kullanmazsın.",
    "Gerçek olmayan istatistik veya müşteri ismi UYDURMA; genel kabul görmüş formüller ve örnek senaryolar kullan.",
    "Çıktıyı SADECE geçerli JSON olarak ver.",
  ].join(" ");

  // Model eğitim verisindeki yılı yazıya taşıyor ("2024'te doğru kurulum" gibi).
  // Güncel tarihi vererek hem bunu engelliyoruz hem de içeriğin tazeliğini koruyoruz.
  const today = new Date();
  const dateNote = `Bugünün tarihi: ${today.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}. Başlıkta veya metinde yıl geçirecekseniz ${today.getFullYear()} kullanın; geçmiş yılları güncelmiş gibi yazmayın.`;

  const user = `${dateNote}

${
    opts.topic
      ? `Bu konuda bir blog yazısı yaz: "${opts.topic}"${opts.keyword ? ` (hedef anahtar kelime: "${opts.keyword}")` : ""}.`
      : "Dijital pazarlama alanında, okuyucuya somut fayda veren özgün bir blog yazısı konusu seç ve yaz."
  }

KURALLAR
- Dil: Türkçe. Ton: uzman, net, gereksiz süslemesiz. Okuyucuya "sen" diye hitap et.
- Uzunluk: 800-1100 kelime.
- Yapı: 2-3 cümlelik güçlü bir giriş (sorunu adlandır), ardından <h2> ve gerektiğinde <h3> alt başlıklar, <p> paragraflar, en az bir <ul><li> liste ve mümkünse bir <table> (formül/karşılaştırma varsa).
- Somut ol: formül, eşik değer, örnek hesap, kontrol listesi ver. "Önemlidir", "kritiktir" gibi boş cümleler kurma.
- Kapanışta 1 paragraflık yumuşak bir davet: ücretsiz keşif görüşmesi / dijital denetim.
- İç linkleme: aşağıdaki sayfalardan 2-4 tanesini metin içinde DOĞAL şekilde <a href="URL">bağlantı metni</a> olarak bağla:
${linkList}
- HTML gövdesinde <h1> KULLANMA (başlık ayrı alanda).
- Şu başlıklara benzer bir konu seçme, tekrar etme:
${avoid || "(henüz yazı yok)"}

JSON ŞEMASI
{
  "title": "60 karakteri geçmeyen, merak uyandıran ama net başlık",
  "excerpt": "150-200 karakter arası özet",
  "contentHtml": "<p>...</p> biçiminde tam gövde",
  "metaTitle": "60 karakteri geçmeyen SEO başlığı",
  "metaDesc": "150-158 karakter arası meta açıklama",
  "tags": ["3-5 adet kısa etiket"],
  "imagePrompt": "İngilizce, fotogerçekçi olmayan, soyut/geometrik bir kapak görseli tarifi; koyu arka plan, mor (#7C5CFF) ve camgöbeği (#22D3EE) tonlar, metin YOK",
  "coverAlt": "Kapak görseli için Türkçe alt metin"
}`;

  const o = await deepseek(opts.apiKey, system, user);
  const title = str(o, "title", "Başlıksız yazı").trim();
  const tags = Array.isArray(o.tags) ? (o.tags as unknown[]).map(String).slice(0, 6) : [];

  return {
    title,
    slug: slugify(title, "tr"),
    excerpt: str(o, "excerpt").trim(),
    contentHtml: addInternalLinks(str(o, "contentHtml"), opts.links),
    metaTitle: str(o, "metaTitle", title).slice(0, 65),
    metaDesc: str(o, "metaDesc", str(o, "excerpt")).slice(0, 165),
    tags,
    imagePrompt: str(o, "imagePrompt", "abstract geometric gradient, dark background, violet and cyan"),
    coverAlt: str(o, "coverAlt", title),
  };
}

// ── 2) Çeviri + yerelleştirme ───────────────────────────────────────────────

const LOCALE_BRIEF: Record<Exclude<Locale, "tr">, string> = {
  en: [
    "Target language: English (international business English).",
    "Localize, don't translate literally: convert Turkish Lira amounts to euro/dollar equivalents with round numbers,",
    "replace Turkey-specific references with international ones, and keep idioms natural for an English-speaking reader.",
  ].join(" "),
  de: [
    "Zielsprache: Deutsch (professionelles Wirtschaftsdeutsch, Sie-Form).",
    "Lokalisieren statt wörtlich übersetzen: türkische Lira-Beträge in Euro umrechnen (runde Zahlen),",
    "türkeispezifische Bezüge durch DACH-Bezüge ersetzen, DSGVO-Kontext beachten wo relevant.",
  ].join(" "),
};

export async function translatePost(opts: {
  apiKey: string;
  post: GeneratedPost;
  target: Exclude<Locale, "tr">;
  links: LinkOption[];
}): Promise<GeneratedPost> {
  const linkList = opts.links.map((l) => `- ${l.title} → ${l.url}`).join("\n");

  const system =
    "You are a senior marketing editor who localizes performance-marketing content between languages. " +
    "You keep the structure and every HTML tag intact, and you adapt examples to the target market instead of translating word for word. " +
    "Return ONLY valid JSON.";

  const user = `${LOCALE_BRIEF[opts.target]}

Localize the following article. Keep the HTML structure exactly (same tags, same order, same list items).
Replace the internal links with the target-language versions of the same pages:
${linkList}

SOURCE TITLE: ${opts.post.title}
SOURCE EXCERPT: ${opts.post.excerpt}
SOURCE HTML:
${opts.post.contentHtml}

JSON SCHEMA
{
  "title": "localized title, max 60 chars",
  "excerpt": "localized excerpt, 150-200 chars",
  "contentHtml": "localized HTML body, same structure",
  "metaTitle": "max 60 chars",
  "metaDesc": "150-158 chars",
  "tags": ["3-5 localized tags"],
  "coverAlt": "localized alt text for the cover image"
}`;

  const o = await deepseek(opts.apiKey, system, user);
  const title = str(o, "title", opts.post.title).trim();
  const tags = Array.isArray(o.tags) ? (o.tags as unknown[]).map(String).slice(0, 6) : opts.post.tags;

  return {
    title,
    slug: slugify(title, opts.target),
    excerpt: str(o, "excerpt", opts.post.excerpt).trim(),
    contentHtml: addInternalLinks(str(o, "contentHtml", opts.post.contentHtml), opts.links),
    metaTitle: str(o, "metaTitle", title).slice(0, 65),
    metaDesc: str(o, "metaDesc").slice(0, 165),
    tags,
    imagePrompt: opts.post.imagePrompt,
    coverAlt: str(o, "coverAlt", title),
  };
}

// ── 3) Kapak görseli ────────────────────────────────────────────────────────

/** fal.ai FLUX ile görsel üretir, ham baytları döner. */
export async function generateCoverImage(opts: {
  apiKey: string;
  prompt: string;
}): Promise<{ bytes: Uint8Array; contentType: string } | null> {
  const prompt = `${opts.prompt}. Abstract editorial cover art, dark near-black background (#0A0A0B), violet #7C5CFF and cyan #22D3EE accents, soft volumetric light, subtle grain, premium tech aesthetic, no text, no letters, no logos, no people.`;

  const res = await fetch(FAL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Key ${opts.apiKey}` },
    body: JSON.stringify({
      prompt,
      image_size: "landscape_16_9",
      num_inference_steps: 4,
      num_images: 1,
      enable_safety_checker: true,
    }),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { images?: { url?: string; content_type?: string }[] };
  const url = data.images?.[0]?.url;
  if (!url) return null;

  const img = await fetch(url);
  if (!img.ok) return null;

  return {
    bytes: new Uint8Array(await img.arrayBuffer()),
    contentType: data.images?.[0]?.content_type ?? "image/jpeg",
  };
}
