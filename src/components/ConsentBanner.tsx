"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { CONSENT_OPEN, readConsent, saveConsent } from "@/lib/consent";
import { localizeHref } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

// "Kabul et" ve "Reddet" bilinçli olarak eşit ağırlıkta: Alman mahkemeleri
// reddetmenin kabul etmek kadar kolay olmasını şart koşuyor.
export function ConsentBanner({ locale, dict }: { locale: Locale; dict: Dict["consent"] }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [stats, setStats] = useState(false);
  const [media, setMedia] = useState(false);

  useEffect(() => {
    const c = readConsent();
    if (!c) setOpen(true);
    const onOpen = () => {
      const cur = readConsent();
      setStats(!!cur?.stats);
      setMedia(!!cur?.media);
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN, onOpen);
  }, []);

  if (!open) return null;

  const decide = (choice: { stats: boolean; media: boolean }) => {
    saveConsent(choice);
    setOpen(false);
  };

  const btn =
    "inline-flex flex-1 items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition sm:flex-none";

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={dict.title}
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-white/10 bg-ink-900/95 p-5 text-sm text-white/70 shadow-2xl backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <Cookie className="mt-0.5 h-5 w-5 flex-none text-violet-300" aria-hidden />
        <div>
          <p className="font-semibold text-white">{dict.title}</p>
          <p className="mt-1.5 leading-relaxed">
            {dict.text}{" "}
            <Link
              href={localizeHref(locale, "/gizlilik-politikasi")}
              className="text-violet-200 underline underline-offset-4 hover:text-white"
            >
              {dict.privacyLink}
            </Link>
          </p>
        </div>
      </div>

      {details && (
        <div className="mt-4 space-y-2">
          <label className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
            <input type="checkbox" checked disabled className="mt-1 accent-violet-500" />
            <span>
              <span className="font-medium text-white">{dict.necessary}</span>
              <span className="block text-xs text-white/50">{dict.necessaryDesc}</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
            <input
              type="checkbox"
              checked={stats}
              onChange={(e) => setStats(e.target.checked)}
              className="mt-1 accent-violet-500"
            />
            <span>
              <span className="font-medium text-white">{dict.stats}</span>
              <span className="block text-xs text-white/50">{dict.statsDesc}</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
            <input
              type="checkbox"
              checked={media}
              onChange={(e) => setMedia(e.target.checked)}
              className="mt-1 accent-violet-500"
            />
            <span>
              <span className="font-medium text-white">{dict.media}</span>
              <span className="block text-xs text-white/50">{dict.mediaDesc}</span>
            </span>
          </label>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => decide({ stats: false, media: false })}
          className={`${btn} border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]`}
        >
          {dict.reject}
        </button>
        <button
          type="button"
          onClick={() => decide({ stats: true, media: true })}
          className={`${btn} border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]`}
        >
          {dict.accept}
        </button>
        {details ? (
          <button
            type="button"
            onClick={() => decide({ stats, media })}
            className={`${btn} border-violet-400/40 bg-violet-500/20 text-white hover:bg-violet-500/30`}
          >
            {dict.save}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setDetails(true)}
            className="px-2 py-2.5 text-sm font-medium text-white/60 underline underline-offset-4 hover:text-white"
          >
            {dict.settings}
          </button>
        )}
      </div>
    </div>
  );
}

// Footer'daki "Çerez ayarları" bağlantısı (Footer sunucu bileşeni olduğu için ayrı).
export function ConsentSettingsLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN))}
      className="transition hover:text-white"
    >
      {label}
    </button>
  );
}
