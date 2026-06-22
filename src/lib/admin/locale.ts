import { cookies } from "next/headers";
import { ADMIN_LOCALE_COOKIE, asLocale, type Locale } from "@/i18n/config";

// Admin panelinde aktif düzenleme dili (cookie). Varsayılan tr.
export async function getAdminLocale(): Promise<Locale> {
  const c = await cookies();
  return asLocale(c.get(ADMIN_LOCALE_COOKIE)?.value);
}
