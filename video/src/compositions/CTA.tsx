import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { Background } from "../components/Background";
import { Eyebrow, gradientText, fontDisplay, fontSans } from "../components/ui";
import { MaskedReveal, DrawLine, WordStagger, prog } from "../components/kinetic";
import { BRAND, COLORS, GRADIENT } from "../brand";
import type { FormatProps } from "../brand";

const center: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: 90,
};

const HeadlineScene: React.FC = () => (
  <AbsoluteFill>
    <Background tint="violet" />
    <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 44 }}>
      <Eyebrow delay={6}>İletişim</Eyebrow>
      <div
        style={{
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: 110,
          lineHeight: 1.06,
          letterSpacing: -2,
          color: COLORS.white,
          maxWidth: 900,
        }}
      >
        <WordStagger
          text="Bir sonraki büyüme dönemini birlikte planlayalım"
          delay={12}
          step={4}
          highlight="planlayalım"
        />
      </div>
      <DrawLine delay={56} width={260} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const ActionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.5 + Math.sin(frame / 10) * 0.5;
  const arrow = Math.sin(frame / 9) * 8;
  const btnP = prog(frame, 30, 30);
  const shine = interpolate(frame, [40, 95], [-60, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Background tint="cyan" />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 50 }}>
        <MaskedReveal delay={4} duration={32}>
          <div
            style={{
              fontFamily: fontSans,
              fontSize: 42,
              lineHeight: 1.4,
              color: COLORS.muted,
              maxWidth: 760,
            }}
          >
            Ücretsiz 30 dakikalık keşif görüşmesi. Hedeflerini konuşalım, somut bir
            aksiyon planı çıkaralım.
          </div>
        </MaskedReveal>

        {/* premium buton */}
        <div
          style={{
            opacity: btnP,
            transform: `translateY(${(1 - btnP) * 30}px) scale(${0.92 + btnP * 0.08})`,
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 52,
            color: COLORS.white,
            padding: "34px 66px",
            borderRadius: 999,
            background: GRADIENT,
            overflow: "hidden",
            boxShadow: `0 0 ${50 + glow * 80}px rgba(124,92,255,${0.4 + glow * 0.45})`,
          }}
        >
          Ücretsiz Teklif Al
          <span style={{ display: "inline-block", transform: `translateX(${arrow}px)`, fontSize: 48 }}>→</span>
          {/* shine sweep */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shine}%`,
              width: "30%",
              background:
                "linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)",
              transform: "skewX(-18deg)",
            }}
          />
        </div>

        {/* domain + sosyal */}
        <div
          style={{
            opacity: prog(frame, 70, 26),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            marginTop: 8,
          }}
        >
          <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 46, ...gradientText }}>
            {BRAND.domain}
          </div>
          <div style={{ fontFamily: fontSans, fontSize: 30, letterSpacing: 4, color: COLORS.faint }}>
            @etruemarketing
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CTA: React.FC<FormatProps> = () => {
  const t = springTiming({ config: { damping: 200 }, durationInFrames: 22 });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={130}>
          <HeadlineScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={t} />
        <TransitionSeries.Sequence durationInFrames={192}>
          <ActionScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
