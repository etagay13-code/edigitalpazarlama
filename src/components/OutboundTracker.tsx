"use client";

import { useEffect } from "react";
import { trackLinkClick } from "@/lib/analytics";
import type { Locale } from "@/i18n/config";

/**
 * Telefon, e-posta, harita ve WhatsApp tıklamalarını tek yerden ölçer.
 * Her bağlantıya tek tek onClick eklemek yerine belge seviyesinde dinlenir —
 * DB'den gelen içerikteki bağlantılar da (blog yazıları dahil) kapsama girer.
 */
export function OutboundTracker({ locale }: { locale: Locale }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (href) trackLinkClick(href, locale);
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [locale]);

  return null;
}
