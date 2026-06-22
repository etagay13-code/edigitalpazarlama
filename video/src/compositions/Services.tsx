import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Background } from "../components/Background";
import { Eyebrow, gradientText, fontDisplay } from "../components/ui";
import { MaskedReveal, DrawLine, WordStagger, prog } from "../components/kinetic";
import { SERVICES, BRAND, COLORS } from "../brand";
import type { FormatProps } from "../brand";

const center: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: 80,
};

const Card: React.FC<{ n: number; name: string; delay: number }> = ({ n, name, delay }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, 32);
  return (
    <div
      style={{
        position: "relative",
        opacity: p,
        transform: `translateY(${(1 - p) * 56}px) scale(${0.94 + p * 0.06})`,
        padding: "44px 40px",
        borderRadius: 30,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
        overflow: "hidden",
        textAlign: "left",
        minHeight: 230,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 22,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -28,
          right: 6,
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: 150,
          lineHeight: 1,
          color: "rgba(255,255,255,0.05)",
        }}
      >
        {String(n).padStart(2, "0")}
      </div>
      <div
        style={{
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.12,
          letterSpacing: -0.5,
          color: COLORS.white,
          zIndex: 1,
        }}
      >
        {name}
      </div>
      <DrawLine delay={delay + 10} width={84} />
    </div>
  );
};

const ServiceGroup: React.FC<{ start: number }> = ({ start }) => {
  const items = SERVICES.slice(start, start + 4);
  return (
    <AbsoluteFill>
      <Background tint="mix" />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 56 }}>
        <Eyebrow delay={2}>Hizmetlerimiz</Eyebrow>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 26,
            width: "100%",
            maxWidth: 920,
          }}
        >
          {items.map((name, i) => (
            <Card key={name} n={start + i + 1} name={name} delay={16 + i * 8} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const IntroScene: React.FC = () => (
  <AbsoluteFill>
    <Background tint="violet" />
    <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 44 }}>
      <Eyebrow delay={4}>Hizmetlerimiz</Eyebrow>
      <div
        style={{
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.08,
          letterSpacing: -2,
          color: COLORS.white,
          maxWidth: 880,
        }}
      >
        <WordStagger text="Markanı büyütecek tüm uzmanlıklar" delay={10} step={5} highlight="uzmanlıklar" />
      </div>
      <DrawLine delay={40} width={240} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background tint="cyan" />
      <AbsoluteFill style={{ ...center, flexDirection: "column", gap: 38 }}>
        <MaskedReveal delay={6} duration={34}>
          <div
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 92,
              lineHeight: 1.08,
              color: COLORS.white,
            }}
          >
            Tek ekip, <span style={gradientText}>tüm uzmanlıklar</span>
          </div>
        </MaskedReveal>
        <div
          style={{
            opacity: prog(frame, 34, 24),
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: 48,
            padding: "20px 44px",
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

export const Services: React.FC<FormatProps> = () => {
  const t = springTiming({ config: { damping: 200 }, durationInFrames: 20 });
  const slideR = slide({ direction: "from-right" });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={60}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={100}>
          <ServiceGroup start={0} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slideR} timing={t} />
        <TransitionSeries.Sequence durationInFrames={100}>
          <ServiceGroup start={4} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={100}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
