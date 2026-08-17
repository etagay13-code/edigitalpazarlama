// Günde çalışan üretim işi. İki fazlı:
//
//   Faz 1 — ONARIM: yayındaki Türkçe yazılardan çevirisi eksik kalanları
//           tamamlar. Hobby planında fonksiyon 60 sn'de kesiliyor ve bir
//           çeviri yarıda kalabiliyor; bu faz ertesi çalıştırmada eksiği
//           kendiliğinden kapatır, böylece hiçbir yazı tek dilde kalmaz.
//   Faz 2 — ÜRETİM: konu havuzundan konu alır, DeepSeek ile Türkçe yazıyı
//           üretir, fal.ai ile kapak görselini oluşturup Supabase Storage'a
//           yazar, İngilizce/Almanca çevirilerini üretir ve üçünü yayınlar.
//
// Her adım öncesi kalan süre kontrol edilir: yeni bir DeepSeek çağrısına
// yetecek süre yoksa iş orada bırakılır ve kalanı ertesi çalıştırma onarır.
//
// Onay kuyruğuna dönmek istersen: BLOG_AUTOPUBLISH=false ortam değişkeni.
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import {
  generateTurkishPost,
  translatePost,
  generateCoverImage,
  readingMinutes,
  type LinkOption,
  type GeneratedPost,
} from "@/lib/blog/generate";
import { localizeHref } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Hobby planında serverless fonksiyon üst sınırı 60 sn; 120 yazmak bu sınırı
// yükseltmiyordu, yalnızca gerçekte alınmayan bir süreyi varsaymamıza yol açıyordu.
export const maxDuration = 60;

const BUCKET = "public-assets";
// Bir çeviri çağrısı için ayrılan pay. Kalan süre bunun altındaysa yeni
// çağrı başlatılmaz — yarıda kesilen çağrı hem token yakar hem kayıt bırakmaz.
const TRANSLATION_BUDGET_MS = 16_000;
const GENERATION_BUDGET_MS = 26_000;

type Supa = ReturnType<typeof createServiceClient>;

/** Hedef dildeki hizmet sayfalarından iç link havuzu kurar. */
async function targetLinks(supabase: Supa, target: Exclude<Locale, "tr">): Promise<LinkOption[]> {
  const { data } = await supabase
    .from("services")
    .select("title,slug")
    .eq("locale", target)
    .eq("active", true);
  return [
    ...(data ?? []).map((x) => ({ title: x.title, url: localizeHref(target, `/hizmetler/${x.slug}`) })),
    { title: target === "de" ? "Kontakt" : "contact", url: localizeHref(target, "/iletisim") },
  ];
}

/** Çeviriyi üretir ve aynı group_id ile yayına ekler. */
async function writeTranslation(opts: {
  supabase: Supa;
  apiKey: string;
  target: Exclude<Locale, "tr">;
  source: GeneratedPost;
  groupId: string;
  coverUrl: string | null;
  publishedAt: string;
  fallbackSlug: string;
}) {
  const { supabase, target } = opts;
  const tr = await translatePost({
    apiKey: opts.apiKey,
    target,
    links: await targetLinks(supabase, target),
    post: opts.source,
  });

  let slug = tr.slug || `${opts.fallbackSlug}-${target}`;
  for (let n = 2; n < 40; n++) {
    const { data: clash } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("locale", target)
      .eq("slug", slug)
      .maybeSingle();
    if (!clash) break;
    slug = `${tr.slug}-${n}`;
  }

  const { error } = await supabase.from("blog_posts").insert({
    group_id: opts.groupId,
    locale: target,
    slug,
    title: tr.title,
    excerpt: tr.excerpt,
    content_html: tr.contentHtml,
    cover_url: opts.coverUrl,
    cover_alt: tr.coverAlt,
    meta_title: tr.metaTitle,
    meta_desc: tr.metaDesc,
    tags: tr.tags,
    reading_min: readingMinutes(tr.contentHtml),
    status: "published",
    source: "translation",
    published_at: opts.publishedAt,
  });
  if (error) throw new Error(error.message);
}

/**
 * Faz 1 — çevirisi eksik yayınlanmış Türkçe yazıları tamamlar.
 * Döndürdüğü sayı bu çalıştırmada kapatılan boşluk adedidir.
 */
async function repairMissingTranslations(
  supabase: Supa,
  apiKey: string,
  timeLeft: () => number,
  errors: string[],
): Promise<string[]> {
  const repaired: string[] = [];

  const { data: trPosts } = await supabase
    .from("blog_posts")
    .select("id,group_id,slug,title,excerpt,content_html,meta_title,meta_desc,tags,cover_url,cover_alt,published_at")
    .eq("locale", "tr")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(40);

  if (!trPosts?.length) return repaired;

  const { data: others } = await supabase
    .from("blog_posts")
    .select("group_id,locale")
    .in("locale", ["en", "de"])
    .in("group_id", trPosts.map((p) => p.group_id));

  const have = new Set((others ?? []).map((o) => `${o.group_id}:${o.locale}`));

  for (const p of trPosts) {
    for (const target of ["en", "de"] as const) {
      if (have.has(`${p.group_id}:${target}`)) continue;
      if (timeLeft() < TRANSLATION_BUDGET_MS) return repaired;
      try {
        await writeTranslation({
          supabase,
          apiKey,
          target,
          groupId: p.group_id,
          coverUrl: p.cover_url,
          publishedAt: p.published_at ?? new Date().toISOString(),
          fallbackSlug: p.slug,
          source: {
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            contentHtml: p.content_html,
            metaTitle: p.meta_title ?? p.title,
            metaDesc: p.meta_desc ?? "",
            tags: p.tags ?? [],
            imagePrompt: "",
            coverAlt: p.cover_alt ?? p.title,
          },
        });
        repaired.push(`${target}: ${p.title}`);
      } catch (e) {
        errors.push(`onarım ${target} "${p.slug}": ${e instanceof Error ? e.message : "bilinmeyen"}`);
      }
    }
  }
  return repaired;
}

export async function GET(request: Request) {
  const startedAt = Date.now();
  // 60 sn'lik sınırın son 6 saniyesi yanıtı döndürmeye ayrılır.
  const timeLeft = () => 54_000 - (Date.now() - startedAt);

  // Vercel Cron, CRON_SECRET tanımlıysa bu başlığı otomatik gönderir.
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (!deepseekKey) {
    return NextResponse.json({ error: "DEEPSEEK_API_KEY tanımlı değil" }, { status: 500 });
  }

  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  // count=0 → yalnızca onarım fazı çalışır (eksik çevirileri kapatmak için)
  const count = Math.min(3, Math.max(0, Number(searchParams.get("count") ?? 1)));
  const errors: string[] = [];

  // ── Faz 1: eksik çeviriler ────────────────────────────────────────────────
  const repaired = searchParams.get("repair") === "false"
    ? []
    : await repairMissingTranslations(supabase, deepseekKey, timeLeft, errors);

  // ── Faz 2: yeni üretim ────────────────────────────────────────────────────
  // İç linkleme havuzu: Türkçe hizmet sayfaları + ana sayfalar
  const [{ data: services }, { data: recent }] = await Promise.all([
    supabase.from("services").select("title,slug").eq("locale", "tr").eq("active", true),
    supabase.from("blog_posts").select("title").eq("locale", "tr").order("created_at", { ascending: false }).limit(60),
  ]);

  const links: LinkOption[] = [
    ...(services ?? []).map((s) => ({
      title: s.title,
      url: localizeHref("tr", `/hizmetler/${s.slug}`),
    })),
    { title: "iletişim", url: localizeHref("tr", "/iletisim") },
    { title: "portfolyo", url: localizeHref("tr", "/portfolyo") },
  ];
  const existingTitles = (recent ?? []).map((r) => r.title);

  const created: { title: string; slug: string }[] = [];

  for (let i = 0; i < count; i++) {
    if (timeLeft() < GENERATION_BUDGET_MS) {
      errors.push("süre yetmedi, kalan üretim bir sonraki çalıştırmaya bırakıldı");
      break;
    }
    try {
      // Havuzdan sıradaki konu (kullanılmamış, en yüksek öncelikli)
      const { data: topic } = await supabase
        .from("blog_topics")
        .select("id,topic,keyword")
        .is("used_at", null)
        .order("priority", { ascending: false })
        .limit(1)
        .maybeSingle();

      const post = await generateTurkishPost({
        apiKey: deepseekKey,
        topic: topic?.topic ?? null,
        keyword: topic?.keyword ?? null,
        existingTitles: [...existingTitles, ...created.map((c) => c.title)],
        links,
      });

      // Slug çakışmasını çöz
      let slug = post.slug || "yazi";
      for (let n = 2; n < 40; n++) {
        const { data: clash } = await supabase
          .from("blog_posts")
          .select("id")
          .eq("locale", "tr")
          .eq("slug", slug)
          .maybeSingle();
        if (!clash) break;
        slug = `${post.slug}-${n}`;
      }

      // Kapak görseli — başarısız olursa yazı yine de kaydedilir
      let coverUrl: string | null = null;
      const falKey = process.env.FAL_API_KEY;
      if (falKey) {
        try {
          const img = await generateCoverImage({ apiKey: falKey, prompt: post.imagePrompt });
          if (img) {
            const ext = img.contentType.includes("png") ? "png" : "jpg";
            const path = `blog/${slug}-${Date.now()}.${ext}`;
            const { error: upErr } = await supabase.storage
              .from(BUCKET)
              .upload(path, img.bytes, { contentType: img.contentType, upsert: true });
            if (!upErr) {
              coverUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
            }
          }
        } catch (e) {
          errors.push(`görsel: ${e instanceof Error ? e.message : "bilinmeyen"}`);
        }
      }

      // Varsayılan: üret ve yayınla. false yapılırsa onay kuyruğuna düşer.
      const autoPublish = process.env.BLOG_AUTOPUBLISH !== "false";
      const now = new Date().toISOString();

      const { data: inserted, error: insErr } = await supabase
        .from("blog_posts")
        .insert({
          locale: "tr",
          slug,
          title: post.title,
          excerpt: post.excerpt,
          content_html: post.contentHtml,
          cover_url: coverUrl,
          cover_alt: post.coverAlt,
          meta_title: post.metaTitle,
          meta_desc: post.metaDesc,
          tags: post.tags,
          reading_min: readingMinutes(post.contentHtml),
          status: autoPublish ? "published" : "draft",
          published_at: autoPublish ? now : null,
          source: "deepseek",
        })
        .select("id,group_id")
        .single();

      if (insErr) throw new Error(insErr.message);

      // Konu HEMEN tüketilmiş sayılır. Daha önce bu işaretleme çevirilerden
      // SONRA yapılıyordu; fonksiyon çeviri sırasında zaman aşımına uğrayınca
      // konu havuzda kalıyor ve bir sonraki çalıştırma AYNI konuyu yeniden
      // yazıyordu (üç ardışık yazı aynı konuda çıktı).
      if (topic) {
        await supabase
          .from("blog_topics")
          .update({ used_at: new Date().toISOString(), post_id: inserted.id })
          .eq("id", topic.id);
      }

      // Çeviriler: yalnızca yazı yayınlandığında üretilir (taslak için token
      // yakmayız). Süre yetmezse yazı tek dilde kalır; Faz 1 ertesi gün kapatır.
      if (autoPublish) {
        for (const target of ["en", "de"] as const) {
          if (timeLeft() < TRANSLATION_BUDGET_MS) {
            errors.push(`${target} çevirisi süre yetmediği için ertelendi (onarım fazı tamamlayacak)`);
            continue;
          }
          try {
            await writeTranslation({
              supabase,
              apiKey: deepseekKey,
              target,
              source: post,
              groupId: inserted.group_id,
              coverUrl,
              publishedAt: now,
              fallbackSlug: slug,
            });
          } catch (e) {
            errors.push(`${target}: ${e instanceof Error ? e.message : "çeviri hatası"}`);
          }
        }
      }

      created.push({ title: post.title, slug });
    } catch (e) {
      errors.push(e instanceof Error ? e.message : "bilinmeyen hata");
    }
  }

  return NextResponse.json({
    ok: created.length > 0 || repaired.length > 0,
    created,
    repaired: repaired.length ? repaired : undefined,
    elapsedMs: Date.now() - startedAt,
    errors: errors.length ? errors : undefined,
  });
}
