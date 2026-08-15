import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Eyebrow, fontDisplay, gradientText } from "../components/ui";
import { Scene, IntroHeadline, Metric, CountUp, OutroCTA } from "../components/blocks";
import { COLORS } from "../brand";
import type { FormatProps } from "../brand";

const StatsScene: React.FC = () => (
  <Scene tint="mix" gap={64}>
    <Eyebrow delay={4}>Rakamlarla biz</Eyebrow>
    <div style={{ display: "flex", flexDirection: "column", gap: 58 }}>
      <Metric delay={16} value={<CountUp to={320} delay={20} prefix="+%" />} label="Ortalama reklam getirisi (ROAS)" />
      <Metric delay={34} value={<CountUp to={180} delay={38} prefix="+%" />} label="Organik trafik artışı" />
      <Metric delay={52} value={<CountUp to={120} delay={56} suffix="+" />} label="Tamamlanan proje" />
    </div>
  </Scene>
);

export const Results: React.FC<FormatProps> = () => {
  const t = springTiming({ config: { damping: 200 }, durationInFrames: 20 });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={130}>
          <IntroHeadline eyebrow="Sonuçlar" title="İşinizi büyüten gerçek sonuçlar" highlight="gerçek" tint="violet" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={t} />
        <TransitionSeries.Sequence durationInFrames={230}>
          <StatsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={linearTiming({ durationInFrames: 20 })} />
        <TransitionSeries.Sequence durationInFrames={130}>
          <OutroCTA
            tint="cyan"
            title={<>Sıradaki başarı hikayesi <span style={gradientText}>seninki</span> olsun</>}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
