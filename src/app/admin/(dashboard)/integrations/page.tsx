import { getSiteSettings } from "@/lib/data/settings";
import { getSiteSecrets } from "@/lib/data/secrets";
import { IntegrationsForm } from "./IntegrationsForm";

export const metadata = { title: "Entegrasyonlar" };

export default async function IntegrationsPage() {
  const [settings, secrets] = await Promise.all([
    getSiteSettings(),
    getSiteSecrets(),
  ]);
  return <IntegrationsForm settings={settings} secrets={secrets} />;
}
