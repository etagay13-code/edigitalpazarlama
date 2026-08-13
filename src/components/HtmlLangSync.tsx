"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/config";

// Kök layout client navigasyonunda yeniden render edilmediği için <html lang>
// eski dilde kalabiliyor. Bu bileşen aktif dili DOM'a yazarak senkron tutar.
export function HtmlLangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  return null;
}
