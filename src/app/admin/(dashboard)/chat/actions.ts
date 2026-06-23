"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getArr, getBool, getInt, getStr } from "@/lib/admin/crud-helpers";
import { getAdminLocale } from "@/lib/admin/locale";

async function authedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkin yok.");
  return supabase;
}

function parse(fd: FormData) {
  return {
    question: getStr(fd, "question"),
    keywords: getArr(fd, "keywords"),
    answer: getStr(fd, "answer"),
    sort_order: getInt(fd, "sort_order", 0),
    active: getBool(fd, "active"),
  };
}

export async function create(fd: FormData) {
  try {
    const supabase = await authedClient();
    const data = parse(fd);
    if (!data.question || !data.answer)
      return { ok: false, error: "Soru ve cevap zorunlu." };
    const { error } = await supabase
      .from("chat_rules")
      .insert({ ...data, locale: await getAdminLocale() });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/chat");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function update(id: string, fd: FormData) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase.from("chat_rules").update(parse(fd)).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/chat");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function remove(id: string) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase.from("chat_rules").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/chat");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}
