"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db/types";

type SettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];

function trimOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

export async function saveSettings(formData: FormData): Promise<{
  ok: boolean;
  error?: string;
}> {
  const supabase = await createClient();

  // Auth kontrolü — middleware zaten yapıyor ama defense-in-depth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Yetkin yok." };

  const update: SettingsUpdate = {
    // Marka
    brand_name: (trimOrNull(formData.get("brand_name")) ?? "E - Digital Marketing"),
    brand_short_name: trimOrNull(formData.get("brand_short_name")),
    founder: trimOrNull(formData.get("founder")),
    tagline: trimOrNull(formData.get("tagline")),
    description: trimOrNull(formData.get("description")),
    // URL / iletişim
    url: trimOrNull(formData.get("url")),
    email:
      trimOrNull(formData.get("email")) ?? "info@edigitalmarketing.com",
    phone: trimOrNull(formData.get("phone")),
    address: trimOrNull(formData.get("address")),
    // Sosyal medya
    instagram_url: trimOrNull(formData.get("instagram_url")),
    linkedin_url: trimOrNull(formData.get("linkedin_url")),
    twitter_url: trimOrNull(formData.get("twitter_url")),
    youtube_url: trimOrNull(formData.get("youtube_url")),
    // Görseller (zaten upload'lanmış URL'ler form'dan geliyor)
    logo_url: trimOrNull(formData.get("logo_url")),
    favicon_url: trimOrNull(formData.get("favicon_url")),
    og_image_url: trimOrNull(formData.get("og_image_url")),
    // Renkler
    color_bg: trimOrNull(formData.get("color_bg")) ?? "#0A0A0B",
    color_accent: trimOrNull(formData.get("color_accent")) ?? "#7C5CFF",
    color_accent_secondary:
      trimOrNull(formData.get("color_accent_secondary")) ?? "#22D3EE",
    // Audit
    updated_by: user.id,
  };

  const { error } = await supabase
    .from("site_settings")
    .update(update)
    .eq("id", 1);

  if (error) return { ok: false, error: error.message };

  // Public sayfaların cache'ini geçersiz kıl (Faz 4'te public DB'den okuyacak)
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");

  return { ok: true };
}

// Storage'daki bir dosyayı sil (görsel kaldırılırken).
export async function deleteStorageObject(path: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Yetkin yok." };

  const { error } = await supabase.storage.from("public-assets").remove([path]);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
