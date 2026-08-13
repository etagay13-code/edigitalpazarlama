import { headers } from "next/headers";
import { asLocale } from "@/i18n/config";
import { NotFoundView } from "@/components/NotFoundView";

export default async function NotFound() {
  const h = await headers();
  return <NotFoundView locale={asLocale(h.get("x-locale"))} />;
}
