"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBool, getInt, getStr } from "@/lib/admin/crud-helpers";

async function authedClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkin yok.");
  return supabase;
}

function parse(fd: FormData) {
  const scope = getStr(fd, "scope");
  const validScopes = ["home", "services", "contact", "about", "portfolio"];
  return {
    scope: (validScopes.includes(scope) ? scope : "home") as
      | "home"
      | "services"
      | "contact"
      | "about"
      | "portfolio",
    question: getStr(fd, "question"),
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
    const { error } = await supabase.from("faqs").insert(data);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/faqs");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function update(id: string, fd: FormData) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase.from("faqs").update(parse(fd)).eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/faqs");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function remove(id: string) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/faqs");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}
