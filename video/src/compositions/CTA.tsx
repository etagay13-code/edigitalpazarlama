import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { Eyebrow, gradientText, useReveal, fontDisplay, fontSans } from "../components/ui";
import { BRAND, COLORS, GRADIENT } from "../brand";
import type { FormatProps } from "../brand";

export const CTA: React.FC<FormatProps> = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const title = useReveal(16, 50);
  const sub = useReveal(46, 30);
  const btn = useReveal(72, 30);
  const domain = useReveal(100, 24);

  const glow = 0.5 + Math.sin(frame / 10) * 0.5; // 0..1 nabız
  const exit = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 90,
          gap: 44,
        }}
      >
        <Eyebrow delay={6}>İletişim</Eyebrow>

        <div
          style={{
            ...title,
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 112,
            lineHeight: 1.04,
            letterSpacing: -2,
            color: COLORS.white,
            maxWidth: 900,
          }}
        >
          Bir sonraki büyüme dönemini{" "}
          <span style={gradientText}>birlikte planlayalım</span>
        </div>

        <div
          style={{
            ...sub,
            fontFamily: fontSans,
            fontSize: 40,
            lineHeight: 1.4,
            color: COLORS.muted,
            maxWidth: 720,
          }}
        >
          Ücretsiz 30 dakikalık keşif görüşmesi. Hedeflerini konuşalım, somut bir
          aksiyon planı çıkaralım.
        </div>

        <div
          style={{
            ...btn,
            marginTop: 18,
            display: "inline-flex",
            alignItems: "center",
            gap: 18,
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: 48,
            color: COLORS.white,
            padding: "30px 60px",
            borderRadius: 999,
            background: GRADIENT,
            boxShadow: `0 0 ${40 + glow * 60}px rgba(124,92,255,${0.35 + glow * 0.4})`,
          }}
        >
          Ücretsiz Teklif Al <span style={{ fontSize: 44 }}>→</span>
        </div>

        <div
          style={{
            ...domain,
            marginTop: 12,
            fontFamily: fontSans,
            fontSize: 38,
            letterSpacing: 2,
            color: COLORS.faint,
          }}
        >
          {BRAND.domain}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
