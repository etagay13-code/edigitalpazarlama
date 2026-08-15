import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./v2.css";
import { SmoothScroll } from "@/components/v2/SmoothScroll";
import { Cursor } from "@/components/v2/Cursor";
import { ScrollProgress } from "@/components/v2/ScrollProgress";

// Tek aile, iki uç: başlıklarda 600–700 + çok sıkı harf aralığı, metinde 400.
// (İnce editoryal serif denendi, marka için fazla kırılgan durdu.)
const sans = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-v2-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "V2 — Tasarım prototipi",
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v2 ${sans.variable}`}>
      <SmoothScroll>
        <ScrollProgress />
        <Cursor />
        {children}
      </SmoothScroll>
    </div>
  );
}
