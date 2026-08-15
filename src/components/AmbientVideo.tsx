"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero arkasındaki ambiyans klibi.
 *
 * Performans kuralları (LCP 0,9 sn'de kalsın diye):
 * - Sunucu HTML'inde <video> YOK. Bileşen istemcide, koşullar sağlanırsa mount eder.
 *   Böylece video ne LCP adayı olur ne de ilk yükte bant genişliği tüketir.
 * - poster kullanılmıyor: bölümün arka planı zaten siyah, poster koyulsaydı
 *   tam genişlikte yeni bir LCP adayı yaratırdı.
 * - Sadece masaüstünde çalışır; mobilde hem pil hem veri maliyeti orantısız.
 * - prefers-reduced-motion ve veri tasarrufu modunda hiç yüklenmez.
 */
export function AmbientVideo({ className = "" }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const slow = conn?.saveData === true || /2g/.test(conn?.effectiveType ?? "");

    if (!wide || calm || slow) return;

    // İlk boyama bittikten sonra yükle — kritik yolu meşgul etmesin.
    // requestIdleCallback denendi ama başsız/otomasyon tarayıcılarında hiç
    // tetiklenmiyor; sabit gecikme hem öngörülebilir hem de yeterli.
    const t = setTimeout(() => setEnabled(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (!enabled) return null;

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
      className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
        ready ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <source src="/video/hero-ambient.webm" type="video/webm" />
      <source src="/video/hero-ambient.mp4" type="video/mp4" />
    </video>
  );
}
