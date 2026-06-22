import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Origin isteğin kendisinden türetilir — NEXT_PUBLIC_SITE_URL'e bağımlı değil.
  const url = new URL("/admin/login", new URL(request.url).origin);
  return NextResponse.redirect(url, { status: 303 });
}
