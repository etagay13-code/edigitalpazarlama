import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, GRADIENT } from "../brand";
import { Background } from "../components/Background";
import { fontDisplay, fontSans, gradientText } from "../components/ui";

// Sosyal paylaşım görseli (1200×630). Still olarak render edilip web projesinin
// public/og/ klasörüne konur; her dil için bir dosya.
export const OG_LOCALES = ["tr", "en", "de"] as const;
export type OgLocale = (typeof OG_LOCALES)[number];

const COPY: Record<OgLocale, { eyebrow: string; title: string; highlight: string; sub: string; chips: string[] }> = {
  tr: {
    eyebrow: "Yeni nesil 360° dijital ajans",
    title: "A'dan Z'ye dijital büyüme ortağınız",
    highlight: "dijital büyüme",
    sub: "Reklam · SEO · Sosyal Medya · Web · Mobil · SaaS",
    chips: ["Google Premier Partner", "Meta Business Partner"],
  },
  en: {
    eyebrow: "Next-generation 360° digital agency",
    title: "Your A-to-Z digital growth partner",
    highlight: "digital growth",
    sub: "Ads · SEO · Social · Web · Mobile · SaaS",
    chips: ["Google Premier Partner", "Meta Business Partner"],
  },
  de: {
    eyebrow: "Digitalagentur der neuen Generation",
    title: "Ihr Partner für digitales Wachstum",
    highlight: "digitales Wachstum",
    sub: "Ads · SEO · Social · Web · Mobile · SaaS",
    chips: ["Google Premier Partner", "Meta Business Partner"],
  },
};

function highlight(text: string, word: string): React.ReactNode {
  const idx = text.toLocaleLowerCase("tr").indexOf(word.toLocaleLowerCase("tr"));
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={gradientText}>{text.slice(idx, idx + word.length)}</span>
      {text.slice(idx + word.length)}
    </>
  );
}

export const Og: React.FC<{ locale: string }> = ({ locale }) => {
  const c = COPY[(locale as OgLocale) in COPY ? (locale as OgLocale) : "tr"];

  return (
    <AbsoluteFill>
      <Background tint="violet">
        <AbsoluteFill style={{ padding: 72, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: 18,
                background: GRADIENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 36,
                color: "white",
                boxShadow: `0 0 40px ${COLORS.violet}66`,
              }}
            >
              E
            </div>
            <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 34, color: COLORS.white }}>
              True EDigital
            </div>
            <div
              style={{
                marginLeft: "auto",
                fontFamily: fontSans,
                fontSize: 22,
                letterSpacing: 1,
                color: "rgba(255,255,255,0.55)",
              }}
            >
              {c.eyebrow}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 76,
                lineHeight: 1.06,
                letterSpacing: -2,
                color: COLORS.white,
                maxWidth: 940,
              }}
            >
              {highlight(c.title, c.highlight)}
            </div>
            <div style={{ fontFamily: fontSans, fontSize: 30, color: "rgba(255,255,255,0.66)" }}>{c.sub}</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {c.chips.map((chip) => (
              <span
                key={chip}
                style={{
                  fontFamily: fontSans,
                  fontSize: 22,
                  color: "rgba(255,255,255,0.8)",
                  padding: "12px 24px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                {chip}
              </span>
            ))}
            <span
              style={{
                marginLeft: "auto",
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 30,
                ...gradientText,
              }}
            >
              etruemarketing.com
            </span>
          </div>
        </AbsoluteFill>
      </Background>
    </AbsoluteFill>
  );
};
