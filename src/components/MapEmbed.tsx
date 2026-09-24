"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { CONSENT_CHANGE, readConsent, saveConsent, type Consent } from "@/lib/consent";

// Google Maps, "Harici medya" onayı olmadan yüklenmez (iki tıklama çözümü):
// onay yoksa yer tutucu gösterilir, tek tıkla onay verilip harita açılır.
export function MapEmbed({
  src,
  title,
  className,
  dict,
}: {
  src: string;
  title: string;
  className?: string;
  dict: { text: string; button: string };
}) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(!!readConsent()?.media);
    const on = (e: Event) => setAllowed((e as CustomEvent<Consent>).detail.media);
    window.addEventListener(CONSENT_CHANGE, on);
    return () => window.removeEventListener(CONSENT_CHANGE, on);
  }, []);

  if (allowed) {
    return (
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={className}
        style={{ border: 0 }}
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink-800/80 p-8 text-center">
      <MapPin className="h-8 w-8 text-violet-300" aria-hidden />
      <p className="max-w-sm text-sm leading-relaxed text-white/60">{dict.text}</p>
      <button
        type="button"
        onClick={() => saveConsent({ stats: !!readConsent()?.stats, media: true })}
        className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.12]"
      >
        {dict.button}
      </button>
    </div>
  );
}
