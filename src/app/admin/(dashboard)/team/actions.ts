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
    bio: trimOrNull(fd.get("bio")),
    initials: trimOrNull(fd.get("initials")),
    accent: trimOrNull(fd.get("accent")) ?? "from-violet-500 to-indigo-500",
    avatar_url: trimOrNull(fd.get("avatar_url")),
    sort_order: getInt(fd, "sort_order", 0),
    active: getBool(fd, "active"),
  };
}

export async function create(fd: FormData) {
  try {
    const supabase = await authedClient();
    const data = parse(fd);
    if (!data.name) return { ok: false, error: "Ad zorunlu." };
    const { error } = await supabase.from("team_members").insert(data);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/team");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function update(id: string, fd: FormData) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase
      .from("team_members")
      .update(parse(fd))
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/team");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}

export async function remove(id: string) {
  try {
    const supabase = await authedClient();
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/", "layout");
    revalidatePath("/admin/team");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Hata" };
  }
}
