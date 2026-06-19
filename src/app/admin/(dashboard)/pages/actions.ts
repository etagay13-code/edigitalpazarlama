"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getInt, getStr, trimOrNull } from "@/lib/admin/crud-helpers";

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
    page_slug: getStr(fd, "page_slug") || "home",
    section_key: getStr(fd, "section_key"),
    eyebrow: trimOrNull(fd.get("eyebrow")),
    title: trimOrNull(fd.get("title")),
    description: trimOrNull(fd.get("description")),
    sort_order: getInt(fd, "sort_order", 0),
  };
}

export async function create(fd: FormData) {
  try {
    const supabase = await authedClient();
    const data = parse(fd);
    if (!data.section_key)
      return { ok: false, error: "Section key zorunlu." };
    const { error } = await supabase.from("page_sections").insert(data);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/pages");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function update(id: string, fd: FormData) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase
      .from("page_sections")
      .update(parse(fd))
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/pages");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function remove(id: string) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase.from("page_sections").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/pages");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}
