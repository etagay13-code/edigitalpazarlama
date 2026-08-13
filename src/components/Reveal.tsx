"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
};

// Giriş animasyonu tetikleme ayarı: element görüş alanına GİRMEDEN önce başlar
// (rootMargin alt kenarı büyütülür) ve "amount: 0" ile ilk pikselde tetiklenir.
// Böylece uzun bölümlerde ekran boş kalmıyor — özellikle mobilde.
const VIEWPORT = { amount: 0, margin: "0px 0px 25% 0px" } as const;

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (custom: { delay: number; y: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      // Çağrı yerlerindeki kademeli gecikmeler yarıya indiriliyor — sıralama
      // korunuyor ama içerik belirgin şekilde daha erken görünüyor.
      delay: custom.delay * 0.5,
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  once = true,
}: Props) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, ...VIEWPORT }}
      custom={{ delay, y }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delayChildren = 0,
  stagger = 0.05,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, ...VIEWPORT }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};
