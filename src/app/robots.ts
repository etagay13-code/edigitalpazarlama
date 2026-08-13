import type { MetadataRoute } from "next";
import { getBrand } from "@/lib/theme";

// Site adresi DB'den (site_settings.url) okunur — sabit değerden değil, yoksa
// canonical host değişince robots.txt eski adresi göstermeye devam ediyor.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const b = await getBrand();
  const base = b.url.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
