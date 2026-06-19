"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function authedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkin yok.");
  return supabase;
}

export async function markRead(id: string, read = true) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase
      .from("messages")
      .update({ is_read: read })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function archive(id: string, archived = true) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase
      .from("messages")
      .update({ is_archived: archived })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/messages");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function deleteMessage(id: string) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/messages");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}
