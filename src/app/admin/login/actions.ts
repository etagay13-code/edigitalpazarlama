"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const redirectTo = (formData.get("redirect") as string | null) ?? "/admin";

  if (!email || !password) {
    redirect(`/admin/login?error=missing`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Geçersiz kimlik bilgisi vb. — kullanıcıyı bilgilendir
    const code =
      error.message.toLowerCase().includes("invalid") ||
      error.message.toLowerCase().includes("credentials")
        ? "invalid"
        : encodeURIComponent(error.message);
    redirect(`/admin/login?error=${code}`);
  }

  // Hedef path /admin altında olmalı (open redirect koruması)
  const safe = redirectTo.startsWith("/admin") ? redirectTo : "/admin";
  redirect(safe);
}
