import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Eyebrow, fontDisplay, gradientText } from "../components/ui";
import { Scene, IntroHeadline, StepFlow, OutroCTA } from "../components/blocks";
import { COLORS } from "../brand";
import type { FormatProps } from "../brand";

const ProcessScene: React.FC = () => (
  <Scene tint="mix" gap={64}>
    <Eyebrow delay={4}>Çalışma şeklimiz</Eyebrow>
    <div
      style={{
        fontFamily: fontDisplay,
        fontWeight: 700,
        fontSize: 72,
        lineHeight: 1.1,
        letterSpacing: -1,
        color: COLORS.white,
        maxWidth: 880,
      }}
    >
      Net bir <span style={gradientText}>yol haritası</span>
    </div>
    <StepFlow steps={["Keşif", "Strateji", "Uygulama", "Büyüme"]} delay={20} />
  </Scene>
);

export const WhyUs: React.FC<FormatProps> = () => {
  const t = springTiming({ config: { damping: 200 }, durationInFrames: 20 });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={130}>
          <IntroHeadline eyebrow="Neden True EDigital?" title="Tek ekip, uçtan uca büyüme" highlight="büyüme" tint="violet" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t} />
        <TransitionSeries.Sequence durationInFrames={230}>
          <ProcessScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={t} />
        <TransitionSeries.Sequence durationInFrames={130}>
          <OutroCTA
            tint="cyan"
            title={<>Büyüme yolculuğuna <span style={gradientText}>birlikte</span> çıkalım</>}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
