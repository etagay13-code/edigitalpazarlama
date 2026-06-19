// Public veri fetcher'ları — service role client kullanır (cookies'siz, hızlı).
// Sadece "active=true" filtreli okuduğumuz için public-safe.
import { unstable_cache } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db/types";

type Tables = Database["public"]["Tables"];

export const listServicesPublic = unstable_cache(
  async () => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    return data ?? [];
  },
  ["services-list"],
  { tags: ["services"], revalidate: 3600 },
);

export const getServiceBySlugPublic = unstable_cache(
  async (slug: string) => {
    const supabase = createServiceClient();
    const { data: service } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();
    if (!service) return null;

    const [{ data: process = [] }, { data: faqs = [] }] = await Promise.all([
      supabase
        .from("service_process_steps")
        .select("*")
        .eq("service_id", service.id)
        .order("step_number"),
      supabase
        .from("service_faqs")
        .select("*")
        .eq("service_id", service.id)
        .order("sort_order"),
    ]);
    return { ...service, process: process ?? [], faqs: faqs ?? [] };
  },
  ["service-detail"],
  { tags: ["services"], revalidate: 3600 },
);

export const listPortfolioProjectsPublic = unstable_cache(
  async () => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    return data ?? [];
  },
  ["portfolio-list"],
  { tags: ["portfolio"], revalidate: 3600 },
);

export const listTestimonialsPublic = unstable_cache(
  async () => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    return data ?? [];
  },
  ["testimonials-list"],
  { tags: ["testimonials"], revalidate: 3600 },
);

export const listTeamPublic = unstable_cache(
  async () => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("team_members")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    return data ?? [];
  },
  ["team-list"],
  { tags: ["team"], revalidate: 3600 },
);

export const listTimelinePublic = unstable_cache(
  async () => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("timeline_events")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    return data ?? [];
  },
  ["timeline-list"],
  { tags: ["timeline"], revalidate: 3600 },
);

export const listIndustriesPublic = unstable_cache(
  async () => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("industries")
      .select("*")
      .eq("active", true)
      .order("sort_order");
    return data ?? [];
  },
  ["industries-list"],
  { tags: ["industries"], revalidate: 3600 },
);

export const listTechPublic = unstable_cache(
  async () => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("tech_items")
      .select("*")
      .order("sort_order");
    return data ?? [];
  },
  ["tech-list"],
  { tags: ["tech"], revalidate: 3600 },
);

export const listFaqsPublic = unstable_cache(
  async (scope: Tables["faqs"]["Row"]["scope"]) => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .eq("scope", scope)
      .eq("active", true)
      .order("sort_order");
    return data ?? [];
  },
  ["faqs-list"],
  { tags: ["faqs"], revalidate: 3600 },
);

export const listPageSectionsPublic = unstable_cache(
  async (page_slug: string) => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("page_sections")
      .select("*")
      .eq("page_slug", page_slug)
      .order("sort_order");
    return data ?? [];
  },
  ["page-sections"],
  { tags: ["page_sections"], revalidate: 3600 },
);

export const getPageSection = async (page_slug: string, section_key: string) => {
  const sections = await listPageSectionsPublic(page_slug);
  return sections.find((s) => s.section_key === section_key) ?? null;
};

export const getSiteSettingsPublic = unstable_cache(
  async () => {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();
    return data;
  },
  ["site-settings"],
  { tags: ["site_settings"], revalidate: 3600 },
);
