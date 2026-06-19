"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBool, getInt, getStr, trimOrNull } from "@/lib/admin/crud-helpers";

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
    role: trimOrNull(fd.get("role")),
    company: trimOrNull(fd.get("company")),
    quote: getStr(fd, "quote"),
    initials: trimOrNull(fd.get("initials")),
    avatar_url: trimOrNull(fd.get("avatar_url")),
    sort_order: getInt(fd, "sort_order", 0),
    active: getBool(fd, "active"),
  };
}

export async function create(fd: FormData) {
  try {
    const supabase = await authedClient();
    const data = parse(fd);
    if (!data.name || !data.quote)
      return { ok: false, error: "Ad ve yorum zorunlu." };
    const { error } = await supabase.from("testimonials").insert(data);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/testimonials");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function update(id: string, fd: FormData) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase
      .from("testimonials")
      .update(parse(fd))
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/testimonials");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function remove(id: string) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/testimonials");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}
