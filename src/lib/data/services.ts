// Services DB fetcher — admin ve public site tarafından kullanılır.
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/db/types";

export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
export type ServiceProcessStep =
  Database["public"]["Tables"]["service_process_steps"]["Row"];
export type ServiceFAQRow = Database["public"]["Tables"]["service_faqs"]["Row"];

export type ServiceWithChildren = ServiceRow & {
  process: ServiceProcessStep[];
  faqs: ServiceFAQRow[];
};

export async function listServices(): Promise<ServiceRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getServiceById(
  id: string,
): Promise<ServiceWithChildren | null> {
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();
  if (!service) return null;

  const [{ data: process = [] }, { data: faqs = [] }] = await Promise.all([
    supabase
      .from("service_process_steps")
      .select("*")
      .eq("service_id", id)
      .order("step_number"),
    supabase
      .from("service_faqs")
      .select("*")
      .eq("service_id", id)
      .order("sort_order"),
  ]);

  return { ...service, process: process ?? [], faqs: faqs ?? [] };
}

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceWithChildren | null> {
  const supabase = await createClient();
  const { data: service } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();
  if (!service) return null;
  return getServiceById(service.id);
}
