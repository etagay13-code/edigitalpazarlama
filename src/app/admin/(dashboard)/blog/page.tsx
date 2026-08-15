import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { localizeHref } from "@/i18n/routes";
import { BlogTable } from "./BlogTable";

export const metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const supabase = await createClient();

  const [{ data: posts = [] }, { count: queueCount }] = await Promise.all([
    supabase
      .from("blog_posts")
      .select("id,locale,slug,title,excerpt,status,source,group_id,published_at,created_at,reading_min,cover_url")
      .order("created_at", { ascending: false })
      .limit(120),
    supabase.from("blog_topics").select("id", { count: "exact", head: true }).is("used_at", null),
  ]);

  const all = posts ?? [];
  const drafts = all.filter((p) => p.status === "draft" && p.locale === "tr");
  const published = all.filter((p) => p.status === "published" && p.locale === "tr");
  const translations = all.filter((p) => p.locale !== "tr");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Blog</h1>
          <p className="text-sm text-white/55">
            Yazılar günde 2 kez otomatik üretilip taslak olarak buraya düşer. Yayınladığında
            İngilizce ve Almanca sürümleri üretilip birlikte yayınlanır.
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/60">
            Onay bekleyen: <strong className="text-white">{drafts.length}</strong>
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/60">
            Yayında: <strong className="text-white">{published.length}</strong>
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-white/60">
            Konu havuzu: <strong className="text-white">{queueCount ?? 0}</strong>
          </span>
        </div>
      </header>

      <BlogTable
        drafts={drafts.map((p) => ({
          ...p,
          previewHref: localizeHref("tr", `/blog/${p.slug}`),
          translationCount: translations.filter((t) => t.group_id === p.group_id).length,
        }))}
        published={published.map((p) => ({
          ...p,
          previewHref: localizeHref("tr", `/blog/${p.slug}`),
          translationCount: translations.filter((t) => t.group_id === p.group_id).length,
        }))}
      />

      {queueCount === 0 && (
        <p className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-5 py-4 text-sm text-amber-100/80">
          Konu havuzu boşaldı. Bundan sonraki üretimlerde model konuyu kendi seçer. Havuza yeni konu
          eklemek için <code className="text-amber-100">blog_topics</code> tablosuna satır ekleyebilirsin.
        </p>
      )}

      <p className="text-xs text-white/35">
        Yayınlanan yazılar{" "}
        <Link href="/blog" className="underline underline-offset-4 hover:text-white/60">
          /blog
        </Link>{" "}
        altında üç dilde listelenir.
      </p>
    </div>
  );
}
