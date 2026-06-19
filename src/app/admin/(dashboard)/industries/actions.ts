"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getArr, getBool, getInt, getStr, trimOrNull } from "@/lib/admin/crud-helpers";

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
    name: getStr(fd, "name"),
    description: trimOrNull(fd.get("description")),
    highlights: getArr(fd, "highlights"),
    sort_order: getInt(fd, "sort_order", 0),
    active: getBool(fd, "active"),
  };
}

export async function create(fd: FormData) {
  try {
    const supabase = await authedClient();
    const data = parse(fd);
    if (!data.name) return { ok: false, error: "Ad zorunlu." };
    const { error } = await supabase.from("industries").insert(data);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/industries");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function update(id: string, fd: FormData) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase
      .from("industries")
      .update(parse(fd))
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/industries");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function remove(id: string) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase.from("industries").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/industries");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}
