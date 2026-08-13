"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import { toInternalPath, localizeHref } from "@/i18n/routes";

export function LanguageSwitcher({
  locale,
  variant = "bar",
}: {
  locale: Locale;
  variant?: "bar" | "menu";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (loc: Locale) => {
    setOpen(false);
    if (loc === locale) return;
    document.cookie = `NEXT_LOCALE=${loc}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const internal = toInternalPath(locale, pathname);
    // router.push yerine tam sayfa yükleme: kök layout (ve <html lang>) yeniden
    // render edilsin, router cache'inden eski dildeki parçalar gelmesin.
    window.location.assign(localizeHref(loc, internal));
  };

  // Mobil menü içinde: yatay bayrak satırı
  if (variant === "menu") {
    return (
      <div className="mt-2 flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {LOCALES.map((loc) => {
          const active = loc === locale;
          return (
            <button
              key={loc}
              type="button"
              onClick={() => choose(loc)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
              }`}
            >
              <span>{LOCALE_LABELS[loc].flag}</span>
              {loc.toUpperCase()}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Dil / Language"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
      >
        <Globe className="h-4 w-4" />
        <span>{LOCALE_LABELS[locale].flag}</span>
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/10 bg-ink-900/95 p-1 shadow-card backdrop-blur-2xl">
          {LOCALES.map((loc) => {
            const active = loc === locale;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => choose(loc)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-white/[0.06] text-white"
                    : "text-white/70 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span className="text-base leading-none">{LOCALE_LABELS[loc].flag}</span>
                <span className="flex-1 text-left">{LOCALE_LABELS[loc].label}</span>
                {active && <Check className="h-4 w-4 text-violet-300" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
