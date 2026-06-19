import type { MetadataRoute } from "next";
import { brand } from "@/lib/theme";
import { services } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/hakkimizda", "/hizmetler", "/portfolyo", "/iletisim"];
  const serviceRoutes = services.map((s) => `/hizmetler/${s.slug}`);

  return [...staticRoutes, ...serviceRoutes].map((r) => ({
    url: `${brand.url}${r}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: r === "" ? 1 : r.startsWith("/hizmetler/") ? 0.8 : 0.7,
  }));
}
