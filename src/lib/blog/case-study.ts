// Vaka çalışması detay içeriği üretimi.
//
// ÖNEMLİ: Model yeni rakam UYDURAMAZ. Mevcut kayıttaki metrik, açıklama ve
// etiketler girdi olarak verilir; modelin işi bu gerçekleri bir vaka anlatısına
// (durum → yaklaşım → adımlar → sonuç) dönüştürmektir. Sonuç metrikleri yalnızca
// kayıtta zaten bulunan değerden türetilir.
import type { Locale } from "@/i18n/config";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

export type CaseStudy = {
  challenge: string;
  approach: string;
  steps: { title: string; desc: string }[];
  results: { label: string; value: string; note?: string }[];
  deliverables: string[];
  duration: string;
  metaTitle: string;
  metaDesc: string;
};

export type ProjectFacts = {
  title: string;
  client: string;
  category: string;
  description: string;
  metric: string | null;
  tags: string[];
};

/** Model bazen bozuk JSON döndürüyor; bir kez daha deneriz. */
async function deepseek(
  apiKey: string,
  system: string,
  user: string,
  attempt = 0,
): Promise<Record<string, unknown>> {
  try {
    return await deepseekOnce(apiKey, system, user);
  } catch (e) {
    if (attempt >= 2) throw e;
    return deepseek(apiKey, system, user, attempt + 1);
  }
}

async function deepseekOnce(apiKey: string, system: string, user: string): Promise<Record<string, unknown>> {
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
      temperature: 0.8,
      max_tokens: 3000,
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = data.choices?.[0]?.message?.content ?? "";
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("Geçerli JSON gelmedi");
    return JSON.parse(m[0]) as Record<string, unknown>;
  }
}

const LANG: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English (international business English)",
  de: "Deutsch (professionelles Wirtschaftsdeutsch, Sie-Form)",
};

export async function generateCaseStudy(opts: {
  apiKey: string;
  locale: Locale;
  facts: ProjectFacts;
}): Promise<CaseStudy> {
  const { facts, locale } = opts;

  const system = [
    "Sen bir dijital pazarlama ajansı için vaka çalışması yazan kıdemli bir içerik editörüsün.",
    "MUTLAK KURAL: Hiçbir alanda SONUÇ İDDİASI kurma. 'arttı', 'iyileşti', 'yükseldi', 'düştü', 'increased', 'improved', 'boosted', 'gesteigert', 'verbessert' gibi fiiller ve yüzde/kat ifadeleri YASAK.",
    "Sadece YAPILAN İŞİ anlat: ne kuruldu, nasıl yapılandırıldı, hangi sıra izlendi. Sonucun ne olduğunu iddia etme.",
    "Sadece sana verilen gerçeklerle çalışırsın: YENİ RAKAM, YENİ MÜŞTERİ ADI veya DOĞRULANMAMIŞ İDDİA ÜRETMEZSİN.",
    "Verilen metriği aynen kullanırsın; ek metrik gerekiyorsa sayı vermek yerine niteliksel ifade kullanırsın.",
    "Anlatın somut ve yöntem odaklıdır: ne yapıldığı, hangi sırayla, neden.",
    "Çıktıyı SADECE geçerli JSON olarak ver.",
  ].join(" ");

  const user = `Aşağıdaki proje için vaka çalışması detay içeriği yaz. Dil: ${LANG[locale]}.

PROJE GERÇEKLERİ (bunların dışına çıkma)
- Başlık: ${facts.title}
- Müşteri: ${facts.client}
- Kategori: ${facts.category}
- Öne çıkan metrik: ${facts.metric ?? "(yok)"}
- Özet: ${facts.description}
- Kullanılan araçlar/teknolojiler: ${facts.tags.join(", ")}

KURALLAR
- "challenge": 2-3 cümle. Müşterinin başlangıçtaki sorunu; sektör bağlamıyla.
- "approach": 2-3 cümle. Ajansın stratejik yaklaşımı, neden bu yol seçildi.
- "steps": 4 adım. Her biri { "title": kısa başlık, "desc": 1-2 cümle }. Kronolojik ve somut.
- "results": 3 madde. Her biri { "label": başlık, "value": kısa değer, "note": kısa açıklama }.
  İLK madde verilen öne çıkan bilgi olmalı (${facts.metric ?? "kapsamı özetleyen bir ifade"}).
  KESİN KURAL: PERFORMANS RAKAMI UYDURMA. Yüzde artış, ROAS, trafik katı, tıklama
  maliyeti gibi ölçüm sonuçları SANA VERİLMEDİYSE yazma. Bunun yerine "value"
  alanına teslim edilen kapsamı veya yapısal kazanımı yaz (ör. hizmet/bölge sayısı,
  dil sayısı, kurulan yapı). Ölçüm sonucu gibi görünen hiçbir sayı üretme.
  DİKKAT: Tüm alanlar hedef dilde (${LANG[locale]}) yazılmalı; bu talimatlardaki Türkçe
  kelimeleri çıktıya KOPYALAMA.
- "deliverables": 4-5 madde, teslim edilen somut çıktılar.
- "duration": projenin süresi (metrikte süre varsa onu kullan, yoksa makul bir aralık).
- "metaTitle": 60 karakteri geçmeyen SEO başlığı.
- "metaDesc": 150-158 karakter meta açıklama.

JSON ŞEMASI
{ "challenge": "...", "approach": "...", "steps": [...], "results": [...], "deliverables": [...], "duration": "...", "metaTitle": "...", "metaDesc": "..." }`;

  const o = await deepseek(opts.apiKey, system, user);

  const arr = <T,>(k: string, map: (x: Record<string, unknown>) => T): T[] =>
    Array.isArray(o[k]) ? (o[k] as Record<string, unknown>[]).map(map) : [];
  const s = (v: unknown, fb = ""): string => (typeof v === "string" ? v : fb);

  return {
    challenge: s(o.challenge),
    approach: s(o.approach),
    steps: arr("steps", (x) => ({ title: s(x.title), desc: s(x.desc) })).slice(0, 5),
    results: arr("results", (x) => ({
      label: s(x.label),
      value: s(x.value),
      note: s(x.note) || undefined,
    })).slice(0, 4),
    deliverables: Array.isArray(o.deliverables)
      ? (o.deliverables as unknown[]).map(String).slice(0, 6)
      : [],
    duration: s(o.duration),
    metaTitle: s(o.metaTitle, facts.title).slice(0, 65),
    metaDesc: s(o.metaDesc, facts.description).slice(0, 165),
  };
}
