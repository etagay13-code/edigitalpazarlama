"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BadgeDollarSign, Check, Gauge, ListChecks, Search, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { localizeHref } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

// 10. saniyede açılan dönüşüm penceresi.
//
// Üç şey bilinçli:
//
// 1) İçeriği UYDURULMUYOR. Kartlar ve alt not, denetim sayfasının kendi
//    vaatleridir (dict.audit.benefits / promise) — pencere yeni bir söz
//    vermez, var olanı öne çıkarır. Böylece iki sayfa çelişemez.
// 2) Mobilde tam ekran kaplamıyor, alttan açılan bir yaprak. Google'ın
//    "araya giren geçiş reklamı" ölçütü aramadan gelen mobil ziyaretçiyi
//    içerikten koparan katmanları cezalandırıyor; yaprak içeriğin bir
//    kısmını görünür bırakır ve tek dokunuşla kapanır.
// 3) Zaten dönüşüm yolundaki sayfalarda (denetim formu, teşekkür) hiç
//    açılmaz — orada kesintiye uğratmak kazanılmış talebi geri iter.

const DEPO = "edm.popup.v1";
const GECIKME_MS = 10_000;
const SESSIZLIK_GUN = 7;

function bastirilmis(): boolean {
  try {
    const raw = localStorage.getItem(DEPO);
    return !!raw && Number(raw) > Date.now();
  } catch {
    return false;
  }
}

function bastir(gun = SESSIZLIK_GUN) {
  try {
    localStorage.setItem(DEPO, String(Date.now() + gun * 864e5));
  } catch {
    /* özel sekmede localStorage kapalı olabilir — sessizce geç */
  }
}

const IKONLAR = [Gauge, BadgeDollarSign, Search, ListChecks];

export function LeadPopup({
  locale,
  dict,
  benefits,
  promise,
}: {
  locale: Locale;
  dict: Dict["popup"];
  benefits: readonly string[];
  promise: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const oncekiOdak = useRef<HTMLElement | null>(null);

  // Dönüşüm yolundaki sayfalarda pencere hiç kurulmaz.
  const haric =
    /\/(dijital-denetim|digital-audit|tesekkurler|thank-you|danke)(\/|$)/.test(pathname ?? "");

  const kapat = useCallback((sure = SESSIZLIK_GUN) => {
    setOpen(false);
    bastir(sure);
    oncekiOdak.current?.focus?.();
  }, []);

  useEffect(() => {
    if (haric || bastirilmis()) return;
    const t = setTimeout(() => {
      oncekiOdak.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }, GECIKME_MS);
    return () => clearTimeout(t);
  }, [haric]);

  // Esc ile kapanma + odak tuzağı: açıkken Tab pencereden çıkmaz.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        kapat();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const odaklanabilir = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!odaklanabilir.length) return;
      const ilk = odaklanabilir[0];
      const son = odaklanabilir[odaklanabilir.length - 1];
      if (e.shiftKey && document.activeElement === ilk) {
        e.preventDefault();
        son.focus();
      } else if (!e.shiftKey && document.activeElement === son) {
        e.preventDefault();
        ilk.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const eskiOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = eskiOverflow;
    };
  }, [open, kapat]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
            onClick={() => kapat()}
            aria-hidden
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-baslik"
            tabIndex={-1}
            initial={{ y: 28, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong relative max-h-[88vh] w-full max-w-4xl overflow-y-auto overflow-x-hidden rounded-t-3xl border-white/10 bg-ink-900/95 outline-none focus:outline-none focus-visible:outline-none sm:rounded-3xl"
          >
            {/* Üstten geçen ince accent çizgi — kart kenarını canlandırır */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent" />

            <button
              type="button"
              onClick={() => kapat()}
              aria-label={dict.close}
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-white/25 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-0 md:grid-cols-[1.05fr_1fr]">
              {/* Sol: teklif */}
              <div className="px-6 pb-7 pt-8 pr-14 sm:px-8 sm:pb-9 md:pr-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-violet-200">
                  {dict.eyebrow}
                </span>

                <h2
                  id="popup-baslik"
                  className="mt-4 font-display text-[1.7rem] font-bold leading-[1.12] tracking-tight text-white sm:text-4xl"
                  style={{ textWrap: "balance" } as React.CSSProperties}
                >
                  {dict.titleTop}
                  <br />
                  <span className="gradient-text">{dict.titleAccent}</span>
                  <br />
                  {dict.titleBottom}
                </h2>

                <ul className="mt-6 space-y-3">
                  {[dict.point1, dict.point2].map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-white/75">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-emerald-300">
                        <Check className="h-3 w-3" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>

                <Link
                  href={localizeHref(locale, "/dijital-denetim")}
                  onClick={() => {
                    track({ event: "cta_click", label: dict.cta, location: "popup", locale });
                    // Teklifi kabul eden kişiye aynı pencere bir daha gösterilmez.
                    kapat(90);
                  }}
                  className="btn-primary mt-7 w-full py-3.5 text-[0.95rem]"
                >
                  {dict.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <p className="mt-4 text-xs leading-relaxed text-white/40">{promise}</p>
              </div>

              {/* Sağ: denetimin kapsamı */}
              <div className="hidden border-t border-white/[0.07] bg-white/[0.02] px-6 pb-8 pt-7 sm:px-8 md:block md:border-l md:border-t-0">
                <p className="pr-10 text-sm font-semibold text-white/85">{dict.asideTitle}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {benefits.slice(0, 4).map((b, i) => {
                    const Icon = IKONLAR[i] ?? Gauge;
                    return (
                      <div
                        key={b}
                        className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 transition hover:border-white/15"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500/25 to-cyan-400/15 text-violet-200">
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className="mt-3 text-[0.82rem] leading-snug text-white/70">{b}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
