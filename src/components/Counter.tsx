"use client";

import { animate, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export function Counter({
  to,
  duration = 1.2,
  prefix = "",
  suffix = "",
  decimals = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Erken tetikle: rakam ekrana girer girmez saymaya başlasın (0'da takılı kalmasın).
  const inView = useInView(ref, { once: true, amount: 0, margin: "0px 0px 10% 0px" });
  const value = useMotionValue(0);
  const display = useTransform(value, (v) =>
    `${prefix}${v.toFixed(decimals)}${suffix}`,
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [inView, to, duration, value]);

  useEffect(() => {
    const unsub = display.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
    return unsub;
  }, [display]);

  return (
    <span ref={ref} aria-label={`${prefix}${to}${suffix}`}>
      {prefix}0{suffix}
    </span>
  );
}
