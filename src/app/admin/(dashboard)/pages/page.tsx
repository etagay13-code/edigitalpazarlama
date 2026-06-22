import { createClient } from "@/lib/supabase/server";
import { getAdminLocale } from "@/lib/admin/locale";
import type { EditorItem } from "@/components/admin/InlineEditor";
import { PagesEditor } from "./PagesEditor";
import { pageOptions } from "./config";

export const metadata = { title: "Sayfa İçerikleri" };

export default async function PagesContentPage() {
  const supabase = await createClient();
  const locale = await getAdminLocale();
  const { data: items } = await supabase
    .from("page_sections")
    .select("*")
    .eq("locale", locale)
    .order("page_slug")
    .order("sort_order");

  const editorItems: EditorItem[] = (items ?? []).map((i) => ({
    ...i,
    _title: `[${pageOptions.find((o) => o.value === i.page_slug)?.label ?? i.page_slug}] ${i.section_key}${i.title ? " — " + i.title : ""}`,
    _subtitle: (i.description ?? "").slice(0, 100),
  }));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Sayfa İçerikleri</h1>
        <p className="text-sm text-white/55">
          Public sayfalardaki kart / liste içerikleri. Her bölümü buradan
          düzenleyince site otomatik güncellenir.
        </p>
      </header>
      <PagesEditor items={editorItems} />
    </div>
  );
}
