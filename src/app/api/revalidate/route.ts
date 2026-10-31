// İçerik önbelleğini (unstable_cache etiketleri) elle boşaltır. DB'ye admin
// dışından (betikle) yazıldığında değişikliğin 1 saat beklemeden görünmesi için.
// Kullanım: curl -H "Authorization: Bearer $CRON_SECRET" https://.../api/revalidate
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TAGS = [
  "blog", "chat_rules", "faqs", "industries", "page_sections", "portfolio",
  "services", "site_settings", "team", "tech", "testimonials", "timeline",
];

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  for (const t of TAGS) revalidateTag(t);
  return NextResponse.json({ ok: true, tags: TAGS });
}
