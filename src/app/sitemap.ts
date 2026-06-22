import type { MetadataRoute } from "next";
import { getBrand } from "@/lib/theme";
import { listServicesPublic } from "@/lib/data";
import { LOCALES } from "@/i18n/config";
import { localizeHref } from "@/i18n/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brand, services] = await Promise.all([
    getBrand(),
    listServicesPublic("tr"),
  ]);
  const base = brand.url.replace(/\/$/, "");
  const now = new Date();

  const internalPaths = [
    "/",
    "/hakkimizda",
    "/hizmetler",
    "/portfolyo",
    "/iletisim",
    ...services.map((s) => `/hizmetler/${s.slug}`),
  ];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const path of internalPaths) {
      entries.push({
        url: base + localizeHref(locale, path),
        lastModified: now,
        changeFrequency: "monthly",
        priority: path === "/" ? 1 : path.startsWith("/hizmetler/") ? 0.8 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, base + localizeHref(l, path)]),
          ),
        },
      });
    }
  }
  return entries;
}
