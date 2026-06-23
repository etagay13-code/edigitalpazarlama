// Chatbot için bilgi tabanı: sitenin DB içeriğini (hizmetler, SSS, sayfa
// bölümleri, ekip, sektörler, marka) tek bir metne toplar. Dile göre + cache'li.
import { unstable_cache } from "next/cache";
import {
  listServicesPublic,
  listFaqsPublic,
  listPageSectionsPublic,
  listIndustriesPublic,
  listTeamPublic,
} from "@/lib/data";
import { getBrand } from "@/lib/theme";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

const FAQ_SCOPES = ["home", "services", "contact", "about", "portfolio"] as const;

function sectionText(s: {
  page_slug: string;
  section_key: string;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  body: unknown;
}): string {
  const parts = [s.eyebrow, s.title, s.description].filter(Boolean);
  // body içindeki insan-okur metinleri (title/desc/text/label/quote) topla
  const collect = (v: unknown): string[] => {
    if (typeof v === "string") return [v];
    if (Array.isArray(v)) return v.flatMap(collect);
    if (v && typeof v === "object") {
      return Object.entries(v as Record<string, unknown>)
        .filter(([k]) => ["title", "desc", "text", "label", "quote", "fits", "range"].includes(k))
        .flatMap(([, val]) => collect(val));
    }
    return [];
  };
  parts.push(...collect(s.body));
  return parts.join(" — ");
}

export const buildKnowledge = unstable_cache(
  async (locale: Locale): Promise<string> => {
    const [brand, services, team, industries, ...pageSets] = await Promise.all([
      getBrand(locale),
      listServicesPublic(locale),
      listTeamPublic(locale),
      listIndustriesPublic(locale),
      listPageSectionsPublic("home", locale),
      listPageSectionsPublic("about", locale),
      listPageSectionsPublic("services", locale),
      listPageSectionsPublic("portfolio", locale),
      listPageSectionsPublic("contact", locale),
    ]);
    const faqGroups = await Promise.all(FAQ_SCOPES.map((s) => listFaqsPublic(s, locale)));
    const faqs = faqGroups.flat();
    const sections = pageSets.flat();

    const lines: string[] = [];
    lines.push(`# ${brand.name}`);
    lines.push(`Slogan: ${brand.tagline}`);
    lines.push(`Açıklama: ${brand.description}`);
    lines.push(`Kurucu: ${brand.founder}`);
    lines.push(`E-posta: ${brand.email}${brand.phone ? ` | Telefon: ${brand.phone}` : ""}`);
    lines.push(`Adres: ${brand.address ?? "-"} | Web: ${brand.url}`);

    lines.push(`\n## Hizmetler`);
    for (const s of services) {
      const bullets = [...(s.bullets ?? []), ...(s.deliverables ?? [])].slice(0, 6).join("; ");
      lines.push(`- ${s.title}: ${s.short}${s.description ? ` ${s.description}` : ""}${bullets ? ` Kapsam: ${bullets}` : ""}`);
    }

    if (industries.length) {
      lines.push(`\n## Çalıştığımız sektörler`);
      lines.push(industries.map((i) => i.name).join(", "));
    }

    if (team.length) {
      lines.push(`\n## Ekip`);
      for (const m of team) lines.push(`- ${m.name}${m.role ? ` (${m.role})` : ""}${m.bio ? `: ${m.bio}` : ""}`);
    }

    const sectionLines = sections.map(sectionText).filter((t) => t.trim().length > 0);
    if (sectionLines.length) {
      lines.push(`\n## Sayfa içerikleri`);
      lines.push(...sectionLines.map((t) => `- ${t}`));
    }

    if (faqs.length) {
      lines.push(`\n## Sık sorulan sorular`);
      for (const f of faqs) lines.push(`S: ${f.question}\nC: ${f.answer}`);
    }

    return lines.join("\n");
  },
  ["chat-knowledge"],
  { tags: ["services", "faqs", "page_sections", "team", "industries", "site_settings"], revalidate: 3600 },
);

export { DEFAULT_LOCALE };
