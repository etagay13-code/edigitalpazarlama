"use client";

import { useEffect, useRef } from "react";
import { damp } from "./scroll-store";
import { onTick } from "./ticker";

/**
 * Yumuşak takipli özel imleç. Fare pozisyonunu React state'e yazmaz;
 * doğrudan transform'a damp eder. data-cursor="hot" taşıyan öğelerde büyür.
 */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const cur = { ...target };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const hot = (e.target as HTMLElement)?.closest?.('[data-cursor="hot"]');
      if (el.current) el.current.dataset.hot = hot ? "true" : "false";
    };

    const off = onTick((_time, dt) => {
      // Hedefe oturduysa boşuna transform yazma.
      if (Math.abs(cur.x - target.x) < 0.1 && Math.abs(cur.y - target.y) < 0.1) return;
      cur.x = damp(cur.x, target.x, 14, dt);
      cur.y = damp(cur.y, target.y, 14, dt);
      if (el.current) {
        el.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      }
    });

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      off();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div ref={el} className="v2-cursor" aria-hidden />;
}
