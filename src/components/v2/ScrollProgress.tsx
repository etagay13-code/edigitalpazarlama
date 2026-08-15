"use client";

import { useEffect, useRef } from "react";
import { scroll } from "./scroll-store";
import { onTick } from "./ticker";

/** Üstte ince ilerleme çizgisi — merkezi ticker'dan doğrudan transform'a yazar. */
export function ScrollProgress() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let prev = -1;
    return onTick(() => {
      const p = scroll.progress;
      // Değişmediyse DOM'a yazma — gereksiz style invalidation'ı önler.
      if (Math.abs(p - prev) < 0.0005) return;
      prev = p;
      if (el.current) el.current.style.transform = `scaleX(${p})`;
    });
  }, []);

  return <div ref={el} className="v2-progress" aria-hidden />;
}
