import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08080A",
          900: "#0A0A0B",
          800: "#111113",
          700: "#17171B",
          600: "#1F1F25",
          500: "#2A2A33",
        },
        accent: {
          DEFAULT: "#7C5CFF",
          violet: "#8B5CF6",
          indigo: "#6366F1",
          cyan: "#22D3EE",
          pink: "#EC4899",
          amber: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(60% 60% at 50% 0%, rgba(124,92,255,0.18) 0%, rgba(8,8,10,0) 60%)",
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      animation: {
        "blob-slow": "blob 18s ease-in-out infinite",
        "blob-fast": "blob 12s ease-in-out infinite",
        "gradient-pan": "gradientPan 12s ease infinite",
        marquee: "marquee 35s linear infinite",
      },
      keyframes: {
        blob: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(40px,-30px) scale(1.1)" },
          "66%": { transform: "translate(-30px,20px) scale(0.95)" },
        },
        gradientPan: {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        glow: "0 0 80px -20px rgba(124,92,255,0.5)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 30px 60px -30px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
