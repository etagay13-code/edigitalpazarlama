"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

function useShown<T extends HTMLElement>(delay: number) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const t = window.setTimeout(() => {
          node.dataset.shown = "true";
        }, delay);
        io.disconnect();
        return () => window.clearTimeout(t);
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [delay]);
  return ref;
}

/** Aşağıdan yumuşak giriş. */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useShown<HTMLDivElement>(delay);
  return (
    <Tag ref={ref} className={`v2-reveal ${className}`} data-shown="false">
      {children}
    </Tag>
  );
}

/**
 * Satırın maskenin altından yukarı kayarak açılması.
 * Her satır ayrı bir MaskLine olmalı — çok satırlı metinde tek maske kaymaz.
 */
export function MaskLine({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useShown<HTMLSpanElement>(delay);
  return (
    <span ref={ref} className={`v2-mask ${className}`} data-shown="false">
      <span>{children}</span>
    </span>
  );
}
