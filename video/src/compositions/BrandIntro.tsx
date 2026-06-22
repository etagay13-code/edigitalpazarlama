import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Background } from "../components/Background";
import { Eyebrow, gradientText, fontDisplay, fontSans } from "../components/ui";
import { MaskedReveal, ShineText, DrawLine, WordStagger, prog } from "../components/kinetic";
import { BRAND, COLORS, GRADIENT } from "../brand";
import type { FormatProps } from "../brand";

const center: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: 90,
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const breathe = 1 + Math.sin(frame / 26) * 0.01;
  return (
    <AbsoluteFill>
      <Background tint="mix" />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 40 }}>
        <Eyebrow delay={6}>{BRAND.eyebrow}</Eyebrow>
        <div style={{ transform: `scale(${breathe})` }}>
          <MaskedReveal delay={16} duration={36}>
            <div
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 134,
                lineHeight: 1.0,
                letterSpacing: -2,
                color: COLORS.white,
              }}
            >
              True <ShineText shineAt={46}>EDigital</ShineText>
            </div>
          </MaskedReveal>
          <MaskedReveal delay={28} duration={36}>
            <div
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 134,
                lineHeight: 1.05,
                letterSpacing: -2,
                color: COLORS.white,
              }}
            >
              Marketing
            </div>
          </MaskedReveal>
        </div>
        <div style={{ marginTop: 6 }}>
          <DrawLine delay={46} width={240} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TaglineScene: React.FC = () => {
  const chips = ["Reklam", "SEO", "Sosyal Medya", "Mobil", "SaaS"];
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background tint="cyan" />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 54 }}>
        <div
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.12,
            letterSpacing: -1.5,
            color: COLORS.white,
            maxWidth: 860,
          }}
        >
          <WordStagger text="A'dan Z'ye Dijital Büyüme Ortağınız" delay={6} step={5} highlight="Büyüme" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, maxWidth: 880 }}>
          {chips.map((c, i) => {
            const p = prog(frame, 40 + i * 7, 24);
            return (
              <div
                key={c}
                style={{
                  opacity: p,
                  transform: `translateY(${(1 - p) * 26}px) scale(${0.9 + p * 0.1})`,
                  fontFamily: fontSans,
                  fontSize: 36,
                  fontWeight: 500,
                  color: COLORS.white,
                  padding: "16px 34px",
                  borderRadius: 999,
                  border: `1px solid ${COLORS.violet}55`,
                  background: "rgba(124,92,255,0.10)",
                }}
              >
                {c}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const DomainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.5 + Math.sin(frame / 11) * 0.5;
  const markP = prog(frame, 4, 30);
  return (
    <AbsoluteFill>
      <Background tint="violet" />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 40 }}>
        {/* logo mark */}
        <div
          style={{
            opacity: markP,
            transform: `scale(${0.7 + markP * 0.3}) rotate(${(1 - markP) * -12}deg)`,
            width: 150,
            height: 150,
            borderRadius: 36,
            background: GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 ${50 + glow * 60}px rgba(124,92,255,${0.4 + glow * 0.4})`,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "32px solid transparent",
              borderBottom: "32px solid transparent",
              borderLeft: "52px solid white",
              marginLeft: 12,
            }}
          />
        </div>
        <MaskedReveal delay={22} duration={30}>
          <div
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 84,
              letterSpacing: -1,
              color: COLORS.white,
            }}
          >
            True <span style={gradientText}>EDigital</span> Marketing
          </div>
        </MaskedReveal>
        <div
          style={{
            opacity: prog(frame, 40, 24),
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: 46,
            letterSpacing: 1,
            padding: "20px 44px",
            borderRadius: 999,
            border: `1px solid ${COLORS.cyan}55`,
            background: "rgba(34,211,238,0.08)",
            ...gradientText,
          }}
        >
          {BRAND.domain}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BrandIntro: React.FC<FormatProps> = () => {
  const t = springTiming({ config: { damping: 200 }, durationInFrames: 22 });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={t} />
        <TransitionSeries.Sequence durationInFrames={120}>
          <TaglineScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={104}>
          <DomainScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
