"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminLocale } from "@/lib/admin/locale";
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
    slug: getStr(fd, "slug"),
    title: getStr(fd, "title"),
    client: getStr(fd, "client"),
    category: getStr(fd, "category") || "Reklam",
    description: getStr(fd, "description"),
    metric: trimOrNull(fd.get("metric")),
    gradient: trimOrNull(fd.get("gradient")) ?? "from-violet-500 to-indigo-500",
    tags: getArr(fd, "tags"),
    image_url: trimOrNull(fd.get("image_url")),
    sort_order: getInt(fd, "sort_order", 0),
    active: getBool(fd, "active"),
  };
}

export async function create(fd: FormData) {
  try {
    const supabase = await authedClient();
    const data = parse(fd);
    if (!data.slug || !data.title || !data.client)
      return { ok: false, error: "Slug, başlık ve müşteri zorunlu." };
    const { error } = await supabase.from("portfolio_projects").insert({ ...data, locale: await getAdminLocale() });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/portfolio");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function update(id: string, fd: FormData) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase
      .from("portfolio_projects")
      .update(parse(fd))
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/portfolio");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function remove(id: string) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase
      .from("portfolio_projects")
      .delete()
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/portfolio");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}
