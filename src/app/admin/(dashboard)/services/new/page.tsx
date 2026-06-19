import { ServiceForm } from "../_components/ServiceForm";

export const metadata = { title: "Yeni Hizmet" };

export default function NewServicePage() {
  return <ServiceForm mode="create" />;
}
