"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type StepInput = { title: string; description: string };
type FaqInput = { question: string; answer: string };

type ServiceInput = {
  slug: string;
  title: string;
  short: string;
  description: string;
  long_description: string | null;
  hero: string | null;
  approach: string | null;
  bullets: string[];
  deliverables: string[];
  tools: string[];
  outcomes: string[];
  ideal_for: string[];
  related_slugs: string[];
  icon: string;
  accent: string;
  sort_order: number;
  active: boolean;
  process: StepInput[];
  faqs: FaqInput[];
};

function parseServiceFromFormData(fd: FormData): ServiceInput {
  const getArr = (key: string): string[] => {
    const raw = (fd.get(key) as string | null) ?? "";
    return raw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  };
  const get = (key: string): string =>
    ((fd.get(key) as string | null) ?? "").trim();
  const getOrNull = (key: string): string | null => {
    const v = get(key);
    return v.length === 0 ? null : v;
  };

  const stepsJson = (fd.get("process_json") as string | null) ?? "[]";
  const faqsJson = (fd.get("faqs_json") as string | null) ?? "[]";

  return {
    slug: get("slug"),
    title: get("title"),
    short: get("short"),
    description: get("description"),
    long_description: getOrNull("long_description"),
    hero: getOrNull("hero"),
    approach: getOrNull("approach"),
    bullets: getArr("bullets"),
    deliverables: getArr("deliverables"),
    tools: getArr("tools"),
    outcomes: getArr("outcomes"),
    ideal_for: getArr("ideal_for"),
    related_slugs: getArr("related_slugs"),
    icon: get("icon") || "Sparkles",
    accent: get("accent") || "from-violet-500 to-indigo-500",
    sort_order: parseInt(get("sort_order") || "0", 10) || 0,
    active: fd.get("active") === "on",
    process: (JSON.parse(stepsJson) as StepInput[]).filter(
      (s) => s.title.trim().length > 0,
    ),
    faqs: (JSON.parse(faqsJson) as FaqInput[]).filter(
      (f) => f.question.trim().length > 0,
    ),
  };
}

async function syncChildren(
  serviceId: string,
  process: StepInput[],
  faqs: FaqInput[],
) {
  const supabase = await createClient();
  // En basit: delete-then-insert (atomic değil ama tek admin senaryosunda yeterli)
  await supabase
    .from("service_process_steps")
    .delete()
    .eq("service_id", serviceId);
  if (process.length > 0) {
    await supabase.from("service_process_steps").insert(
      process.map((s, i) => ({
        service_id: serviceId,
        step_number: i + 1,
        title: s.title.trim(),
        description: s.description.trim(),
      })),
    );
  }

  await supabase.from("service_faqs").delete().eq("service_id", serviceId);
  if (faqs.length > 0) {
    await supabase.from("service_faqs").insert(
      faqs.map((f, i) => ({
        service_id: serviceId,
        sort_order: i,
        question: f.question.trim(),
        answer: f.answer.trim(),
      })),
    );
  }
}

export async function createService(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkin yok.");

  const input = parseServiceFromFormData(formData);
  if (!input.slug || !input.title) {
    throw new Error("Slug ve başlık zorunlu.");
  }

  const { process, faqs, ...service } = input;
  const { data: inserted, error } = await supabase
    .from("services")
    .insert(service)
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  await syncChildren(inserted.id, process, faqs);

  revalidatePath("/", "layout");
  revalidatePath("/admin/services");
  redirect(`/admin/services/${inserted.id}?saved=1`);
}

export async function updateService(
  id: string,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Yetkin yok." };

  const input = parseServiceFromFormData(formData);
  const { process, faqs, ...service } = input;

  const { error } = await supabase
    .from("services")
    .update(service)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  await syncChildren(id, process, faqs);

  revalidatePath("/", "layout");
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${id}`);
  return { ok: true };
}

export async function deleteService(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Yetkin yok.");

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}
