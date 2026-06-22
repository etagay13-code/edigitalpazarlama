"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ADMIN_LOCALE_COOKIE, LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";

// Admin'de düzenleme dilini seçen bayraklı switcher.
export function AdminLangSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const pick = (loc: Locale) => {
    if (loc === current) return;
    document.cookie = `${ADMIN_LOCALE_COOKIE}=${loc}; path=/; max-age=${60 * 60 * 24 * 365}`;
    startTransition(() => router.refresh());
  };

  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 ${
        pending ? "opacity-60" : ""
      }`}
      title="Düzenleme dili"
    >
      {LOCALES.map((loc) => {
        const active = loc === current;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => pick(loc)}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-glow"
                : "text-white/55 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            <span className="text-sm leading-none">{LOCALE_LABELS[loc].flag}</span>
            <span className="hidden sm:inline">{loc.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
