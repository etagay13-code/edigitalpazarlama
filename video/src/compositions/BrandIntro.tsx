import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { Eyebrow, gradientText, useReveal, fontDisplay, fontSans } from "../components/ui";
import { BRAND, COLORS } from "../brand";
import type { FormatProps } from "../brand";

export const BrandIntro: React.FC<FormatProps> = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const title = useReveal(16, 60);
  const tag = useReveal(46, 30);
  const domain = useReveal(74, 26);

  // genel çıkış
  const exit = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  // başlıkta hafif "nefes" efekti
  const breathe = 1 + Math.sin(frame / 22) * 0.012;

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 90,
          textAlign: "center",
          gap: 46,
        }}
      >
        <Eyebrow delay={6}>{BRAND.eyebrow}</Eyebrow>

        <div
          style={{
            ...title,
            transform: `${title.transform} scale(${breathe})`,
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 132,
            lineHeight: 1.02,
            letterSpacing: -2,
            color: COLORS.white,
            maxWidth: 920,
          }}
        >
          True <span style={gradientText}>EDigital</span> Marketing
        </div>

        <div
          style={{
            ...tag,
            fontFamily: fontSans,
            fontSize: 40,
            lineHeight: 1.35,
            color: COLORS.muted,
            maxWidth: 760,
          }}
        >
          {BRAND.tagline}
        </div>

        <div
          style={{
            ...domain,
            marginTop: 24,
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: 42,
            letterSpacing: 1,
            padding: "18px 40px",
            borderRadius: 999,
            border: `1px solid ${COLORS.violet}55`,
            background: "rgba(124,92,255,0.10)",
            ...gradientText,
          }}
        >
          {BRAND.domain}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
