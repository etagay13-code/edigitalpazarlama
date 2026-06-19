import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/data/services";
import { ServiceForm } from "../_components/ServiceForm";

export const metadata = { title: "Hizmet Düzenle" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();
  return <ServiceForm mode="edit" service={service} />;
}
