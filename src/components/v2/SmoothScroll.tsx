"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scroll, clamp01 } from "./scroll-store";
import { onTick } from "./ticker";

/**
 * Lenis momentum scroll + global scroll state yazıcısı.
 * Karanlık 3D aktın ilerlemesi (#act-1) burada ölçülür; sahne bunu okur.
 * prefers-reduced-motion açıksa Lenis devre dışı, native scroll'a düşer.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Global film grain'i bu rotada kapat (v2.css'teki body[data-v2] kuralı).
    document.body.dataset.v2 = "1";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lastY = window.scrollY;
    // Layout ölçümleri kare başına değil, yalnızca resize'da alınır.
    let actTop = 0;
    let actSpan = 1;
    let docH = 1;

    const measure = () => {
      const actEl = document.getElementById("act-1");
      if (actEl) {
        actTop = actEl.offsetTop;
        actSpan = Math.max(1, actEl.offsetHeight - window.innerHeight);
      }
      docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const write = (y: number) => {
      scroll.velocity = y - lastY;
      lastY = y;
      scroll.y = y;
      scroll.progress = clamp01(y / docH);
      // Akt, viewport'un üstünden geçtiği sürece 0..1 ilerler.
      scroll.act = clamp01((y - actTop) / actSpan);
    };

    measure();
    write(window.scrollY);
    // Fontlar/görseller yerleştikten sonra yükseklikler değişir — yeniden ölç.
    const remeasure = window.setTimeout(measure, 600);
    window.addEventListener("load", measure);

    const onPointer = (e: PointerEvent) => {
      scroll.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scroll.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", measure);

    if (reduced) {
      const onScroll = () => write(window.scrollY);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.clearTimeout(remeasure);
        window.removeEventListener("load", measure);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", measure);
      };
    }

    const lenis = new Lenis({
      // 1.15 çok ağırdı — tekerleği çevirince sayfa "geriden geliyor" hissi
      // veriyordu. 0.8 hâlâ yumuşak ama takip eden bir his bırakıyor.
      duration: 0.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1.15,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ({ scroll: y }: { scroll: number }) => write(y));

    const off = onTick((time) => lenis.raf(time));

    return () => {
      off();
      lenis.destroy();
      window.clearTimeout(remeasure);
      window.removeEventListener("load", measure);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return <>{children}</>;
}
