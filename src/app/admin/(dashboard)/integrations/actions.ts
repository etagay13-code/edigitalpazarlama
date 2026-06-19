"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db/types";

type SettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];
type SecretsUpdate = Database["public"]["Tables"]["site_secrets"]["Update"];

function trimOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

export async function saveIntegrations(formData: FormData): Promise<{
  ok: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Yetkin yok." };

  // Public analytics ID'leri site_settings'e
  const settingsUpdate: SettingsUpdate = {
    ga4_measurement_id: trimOrNull(formData.get("ga4_measurement_id")),
    gtm_container_id: trimOrNull(formData.get("gtm_container_id")),
    search_console_verification: trimOrNull(
      formData.get("search_console_verification"),
    ),
    hotjar_site_id: trimOrNull(formData.get("hotjar_site_id")),
    microsoft_clarity_id: trimOrNull(formData.get("microsoft_clarity_id")),
    updated_by: user.id,
  };

  const { error: settingsErr } = await supabase
    .from("site_settings")
    .update(settingsUpdate)
    .eq("id", 1);
  if (settingsErr) return { ok: false, error: settingsErr.message };

  // Secret değerler site_secrets'a
  // Resend API key gizli — boş gelirse mevcut değeri SİLMEYELİM (placeholder yapıştır kullanıcı için sürpriz olmasın)
  const secretsUpdate: SecretsUpdate = {
    resend_from_email: trimOrNull(formData.get("resend_from_email")),
    contact_form_to_email: trimOrNull(formData.get("contact_form_to_email")),
    updated_by: user.id,
  };
  const resendKey = trimOrNull(formData.get("resend_api_key"));
  // Sadece input doluysa key'i güncelle (placeholder/dummy değeri ezme koruması)
  if (resendKey && !resendKey.startsWith("•")) {
    secretsUpdate.resend_api_key = resendKey;
  }
  // Açıkça "sil" butonuna basıldıysa
  if (formData.get("resend_api_key_clear") === "1") {
    secretsUpdate.resend_api_key = null;
  }

  const { error: secretsErr } = await supabase
    .from("site_secrets")
    .update(secretsUpdate)
    .eq("id", 1);
  if (secretsErr) return { ok: false, error: secretsErr.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/integrations");
  return { ok: true };
}
