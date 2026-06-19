import { getSiteSettings } from "@/lib/data/settings";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Site Ayarları" };

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  return <SettingsForm settings={settings} />;
}
