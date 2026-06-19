// Site Secrets — SADECE server-side, sadece authenticated user.
// Resend API key vb. asla client'a geçirilmemeli.
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db/types";

export type SiteSecrets = Database["public"]["Tables"]["site_secrets"]["Row"];

export async function getSiteSecrets(): Promise<SiteSecrets> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_secrets")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) {
    throw new Error(
      `site_secrets okunamadı: ${error?.message ?? "row yok"}. Admin değilsen RLS engelliyordur.`,
    );
  }
  return data;
}
