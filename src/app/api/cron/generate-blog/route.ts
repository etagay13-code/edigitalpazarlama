// Günde 2 kez çalışan üretim işi: konu havuzundan bir konu alır, DeepSeek ile
// Türkçe yazıyı üretir, fal.ai ile kapak görselini oluşturup Supabase Storage'a
// yazar ve yazıyı TASLAK olarak kaydeder.
//
// Çeviriler burada üretilmez — yazı admin panelinden onaylandığında
// (publishPost action'ı) İngilizce ve Almanca sürümleri oluşturulur.
// Sebep: onaylanmayan bir yazının çevirisi için token harcamamak.
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import {
  generateTurkishPost,
  generateCoverImage,
  readingMinutes,
  type LinkOption,
} from "@/lib/blog/generate";
import { localizeHref } from "@/i18n/routes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const BUCKET = "public-assets";

export async function GET(request: Request) {
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
  const count = Math.min(3, Math.max(1, Number(searchParams.get("count") || 1)));

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
  const errors: string[] = [];

  for (let i = 0; i < count; i++) {
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
          status: "draft",
          source: "deepseek",
        })
        .select("id")
        .single();

      if (insErr) throw new Error(insErr.message);

      if (topic) {
        await supabase
          .from("blog_topics")
          .update({ used_at: new Date().toISOString(), post_id: inserted.id })
          .eq("id", topic.id);
      }

      created.push({ title: post.title, slug });
    } catch (e) {
      errors.push(e instanceof Error ? e.message : "bilinmeyen hata");
    }
  }

  return NextResponse.json({
    ok: created.length > 0,
    created,
    errors: errors.length ? errors : undefined,
  });
}
