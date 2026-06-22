import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadSans } from "@remotion/google-fonts/Inter";

export const { fontFamily: DISPLAY } = loadDisplay();
export const { fontFamily: SANS } = loadSans();

export const COLORS = {
  bg: "#0A0A0B",
  bg2: "#101015",
  violet: "#7C5CFF",
  cyan: "#22D3EE",
  white: "#FFFFFF",
  muted: "rgba(255,255,255,0.62)",
  faint: "rgba(255,255,255,0.40)",
};

export const GRADIENT = `linear-gradient(100deg, ${COLORS.violet}, ${COLORS.cyan})`;

export const BRAND = {
  name: "True EDigital Marketing",
  eyebrow: "Yeni nesil 360° dijital ajans",
  tagline: "A'dan Z'ye Dijital Büyüme Ortağınız",
  domain: "etruemarketing.com",
};

export const SERVICES = [
  "360° Dijital Pazarlama",
  "Reklam Yönetimi",
  "SEO",
  "Sosyal Medya Yönetimi",
  "Mobil Uygulama Geliştirme",
  "SaaS Proje Geliştirme",
  "Web Tasarım & Geliştirme",
  "İçerik & Marka Stratejisi",
];

// Format tanımları — her ikisi de 1080 genişlikte, dikey daha uzun.
export type FormatProps = { format: "vertical" | "square" };

export const FORMATS = {
  vertical: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
};

export const FPS = 30;
export const DURATION = 300; // 10 saniye
