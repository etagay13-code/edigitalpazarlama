"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Phone } from "lucide-react";
import { track } from "@/lib/analytics";
import { localizeHref } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";

/**
 * Mobilde ekranın altına sabitlenen tek eylem çubuğu.
 * Sadece kullanıcı sayfaya girdikten sonra (ilk ekranı geçince) belirir; böylece
 * hem LCP ölçümünü etkilemez hem de hemen kapatılacak bir engel gibi durmaz.
 * Sohbet balonuyla çakışmaması için sağ tarafta boşluk bırakır.
 */
export function StickyCta({
  locale,
  label,
  phone,
}: {
  locale: Locale;
  label: string;
  phone: string | null;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[80] border-t border-white/10 bg-ink-950/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-2.5 pr-20">
        {phone && (
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            aria-label={phone}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-white/85"
          >
            <Phone className="h-5 w-5" />
          </a>
        )}
        <Link
          href={localizeHref(locale, "/iletisim")}
          onClick={() => track({ event: "cta_click", label: "sticky", location: "mobile_bar", locale })}
          className="btn-primary h-12 flex-1 justify-center"
        >
          {label}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
