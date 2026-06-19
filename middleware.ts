import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Statik dosyaları ve API'yi atla — sadece sayfa rotalarında çalışsın
    "/((?!_next/static|_next/image|favicon|logo|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
