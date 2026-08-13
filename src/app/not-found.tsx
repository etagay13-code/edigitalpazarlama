// Kök 404: hiçbir route eşleşmediğinde Next bu dosyayı kullanır.
// Dili middleware'in yazdığı x-locale header'ından alır (yoksa cookie, yoksa tr).
import { headers, cookies } from "next/headers";
import { asLocale, isLocale } from "@/i18n/config";
import { NotFoundView } from "@/components/NotFoundView";

export default async function RootNotFound() {
  const [h, c] = await Promise.all([headers(), cookies()]);
  const fromHeader = h.get("x-locale");
  const fromCookie = c.get("NEXT_LOCALE")?.value;
  const locale = isLocale(fromHeader) ? fromHeader : asLocale(fromCookie);
  return (
    <main className="relative">
      <NotFoundView locale={locale} />
    </main>
  );
}
