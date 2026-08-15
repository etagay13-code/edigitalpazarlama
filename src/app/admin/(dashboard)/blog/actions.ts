"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { translatePost, readingMinutes, slugify, type LinkOption } from "@/lib/blog/generate";
import { localizeHref } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";

async function authedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkin yok.");
  return supabase;
}

function refresh() {
  revalidateTag("blog");
  revalidatePath("/", "layout");
  revalidatePath("/admin/blog");
}

/** Hedef dilde iç linkleme havuzu — çevirinin linkleri o dile bağlaması için. */
async function linksFor(locale: Locale): Promise<LinkOption[]> {
  const supabase = createServiceClient();
  const { data: services } = await supabase
    .from("services")
    .select("title,slug")
    .eq("locale", locale)
    .eq("active", true);

  return [
    ...(services ?? []).map((s) => ({
      title: s.title,
      url: localizeHref(locale, `/hizmetler/${s.slug}`),
    })),
    { title: locale === "de" ? "Kontakt" : locale === "en" ? "contact" : "iletişim", url: localizeHref(locale, "/iletisim") },
  ];
}

/**
 * Türkçe yazıyı yayınlar ve İngilizce/Almanca sürümlerini üretip yayınlar.
 * Çeviri burada üretilir (üretim anında değil) — onaylanmayan yazı için
 * token harcanmasın diye.
 */
export async function publishPost(id: string) {
  try {
    await authedClient();
    const supabase = createServiceClient();

    const { data: post, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
    if (error || !post) return { ok: false, error: "Yazı bulunamadı." };

    const now = new Date().toISOString();
    await supabase
      .from("blog_posts")
      .update({ status: "published", published_at: post.published_at ?? now, updated_at: now })
      .eq("id", id);

    const warnings: string[] = [];

    // Çeviriler yalnızca Türkçe kaynak için ve daha önce üretilmemişse
    if (post.locale === "tr") {
      const apiKey = process.env.DEEPSEEK_API_KEY;
      if (!apiKey) {
        warnings.push("DEEPSEEK_API_KEY yok — çeviriler üretilmedi.");
      } else {
        for (const target of ["en", "de"] as const) {
          try {
            const { data: existing } = await supabase
              .from("blog_posts")
              .select("id")
              .eq("group_id", post.group_id)
              .eq("locale", target)
              .maybeSingle();
            if (existing) continue;

            const translated = await translatePost({
              apiKey,
              target,
              links: await linksFor(target),
              post: {
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                contentHtml: post.content_html,
                metaTitle: post.meta_title ?? post.title,
                metaDesc: post.meta_desc ?? post.excerpt,
                tags: post.tags,
                imagePrompt: "",
                coverAlt: post.cover_alt ?? post.title,
              },
            });

            // Slug çakışması
            let slug = translated.slug || `${post.slug}-${target}`;
            for (let n = 2; n < 40; n++) {
              const { data: clash } = await supabase
                .from("blog_posts")
                .select("id")
                .eq("locale", target)
                .eq("slug", slug)
                .maybeSingle();
              if (!clash) break;
              slug = `${slugify(translated.title, target)}-${n}`;
            }

            const { error: insErr } = await supabase.from("blog_posts").insert({
              group_id: post.group_id,
              locale: target,
              slug,
              title: translated.title,
              excerpt: translated.excerpt,
              content_html: translated.contentHtml,
              // Kapak görseli üç dilde ortak
              cover_url: post.cover_url,
              cover_alt: translated.coverAlt,
              meta_title: translated.metaTitle,
              meta_desc: translated.metaDesc,
              tags: translated.tags,
              reading_min: readingMinutes(translated.contentHtml),
              status: "published",
              source: "translation",
              published_at: post.published_at ?? now,
            });
            if (insErr) warnings.push(`${target.toUpperCase()}: ${insErr.message}`);
          } catch (e) {
            warnings.push(`${target.toUpperCase()}: ${e instanceof Error ? e.message : "çeviri hatası"}`);
          }
        }
      }
    }

    refresh();
    return { ok: true, warning: warnings.length ? warnings.join(" · ") : undefined };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

/** Yayından kaldırır (yazı silinmez, taslağa döner). */
export async function unpublishPost(id: string) {
  try {
    await authedClient();
    const supabase = createServiceClient();
    const { error } = await supabase.from("blog_posts").update({ status: "draft" }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

/** Yazıyı ve varsa çevirilerini siler. */
export async function removePost(id: string) {
  try {
    await authedClient();
    const supabase = createServiceClient();
    const { data: post } = await supabase.from("blog_posts").select("group_id,locale").eq("id", id).single();
    if (!post) return { ok: false, error: "Yazı bulunamadı." };

    // Türkçe kaynak silinirse çeviriler de gider; tek bir çeviri silinirse sadece o.
    const query =
      post.locale === "tr"
        ? supabase.from("blog_posts").delete().eq("group_id", post.group_id)
        : supabase.from("blog_posts").delete().eq("id", id);

    const { error } = await query;
    if (error) return { ok: false, error: error.message };
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

/** Admin'den elle üretim tetikler (cron'u beklemeden). */
export async function generateNow() {
  try {
    await authedClient();
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/cron/generate-blog?count=1`, {
      headers: process.env.CRON_SECRET ? { authorization: `Bearer ${process.env.CRON_SECRET}` } : {},
      cache: "no-store",
    });
    const data = (await res.json()) as { created?: unknown[]; errors?: string[] };
    refresh();
    if (!res.ok || !data.created?.length) {
      return { ok: false, error: data.errors?.join(" · ") || "Üretim başarısız." };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}
