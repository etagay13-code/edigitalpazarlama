// Site Settings'i DB'den çeker. Server-side helper.
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db/types";

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
    throw new Error(
      `site_settings okunamadı: ${error?.message ?? "row yok"}. Migration çalıştı mı?`,
    );
  }
  return data;
}
