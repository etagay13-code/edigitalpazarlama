import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  TransitionSeries,
  springTiming,
  linearTiming,
  type TransitionPresentation,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { Eyebrow, fontDisplay, fontSans, gradientText } from "../components/ui";
import { MaskedReveal, DrawLine, WordStagger } from "../components/kinetic";
import {
  Scene,
  Deliverables,
  Bars,
  SearchMock,
  PhoneMock,
  BrowserMock,
  Chips,
  CountUp,
  OutroCTA,
} from "../components/blocks";
import { COLORS, FORMATS } from "../brand";
import type { FormatProps } from "../brand";
import { SERVICE_VIDEOS, type ServiceVideoConfig } from "../service-videos";

// "metin" içinde "kelime"yi gradient ile vurgula
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

const IntroScene: React.FC<{ cfg: ServiceVideoConfig }> = ({ cfg }) => (
  <Scene tint="violet" gap={40}>
    <Eyebrow delay={4}>Hizmetlerimiz</Eyebrow>
    <div
      style={{
        fontFamily: fontDisplay,
        fontWeight: 700,
        fontSize: cfg.title.length > 22 ? 92 : 112,
        lineHeight: 1.06,
        letterSpacing: -2,
        color: COLORS.white,
        maxWidth: 940,
      }}
    >
      <WordStagger text={cfg.title} delay={12} step={4} highlight={cfg.highlight} />
    </div>
    <MaskedReveal delay={42} duration={30}>
      <div style={{ fontFamily: fontSans, fontSize: 42, lineHeight: 1.4, color: COLORS.muted, maxWidth: 820 }}>
        {cfg.short}
      </div>
    </MaskedReveal>
    <DrawLine delay={56} width={240} />
  </Scene>
);

const AdsShowcase: React.FC = () => (
  <Scene tint="mix" gap={52}>
    <Eyebrow delay={4}>Performans</Eyebrow>
    <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 130, lineHeight: 1, letterSpacing: -2, ...gradientText }}>
      <CountUp to={4.8} delay={16} decimals={1} suffix="x" />
    </div>
    <div style={{ fontFamily: fontSans, fontSize: 34, color: COLORS.muted, marginTop: -26 }}>Ortalama reklam getirisi (ROAS)</div>
    <Bars delay={24} values={[24, 38, 52, 70, 96]} labels={["Oca", "Şub", "Mar", "Nis", "May"]} />
  </Scene>
);

const SeoShowcase: React.FC = () => (
  <Scene tint="cyan" gap={54}>
    <SearchMock query="dijital pazarlama ajansı" delay={10} />
    <Chips items={["Teknik SEO", "İçerik", "Backlink", "Yerel SEO"]} delay={66} />
  </Scene>
);

const SocialShowcase: React.FC = () => (
  <Scene tint="mix" gap={0}>
    <PhoneMock delay={8} />
  </Scene>
);

const WebShowcase: React.FC = () => (
  <Scene tint="mix" gap={50}>
    <BrowserMock delay={8} />
    <Chips items={["Next.js", "Mobil uyumlu", "Şimşek hızında", "SEO hazır"]} delay={46} />
  </Scene>
);

const ListShowcase: React.FC<{ cfg: ServiceVideoConfig }> = ({ cfg }) => (
  <Scene tint="mix" gap={48}>
    <Eyebrow delay={4}>Neler sunuyoruz?</Eyebrow>
    <Deliverables items={cfg.features} delay={14} />
  </Scene>
);

const Showcase: React.FC<{ cfg: ServiceVideoConfig }> = ({ cfg }) => {
  switch (cfg.showcase) {
    case "ads":
      return <AdsShowcase />;
    case "seo":
      return <SeoShowcase />;
    case "social":
      return <SocialShowcase />;
    case "web":
      return <WebShowcase />;
    default:
      return <ListShowcase cfg={cfg} />;
  }
};

export const ServiceVideo: React.FC<FormatProps & { id: string }> = ({ format, id }) => {
  const cfg = SERVICE_VIDEOS.find((s) => s.id === id) ?? SERVICE_VIDEOS[0];
  const i = SERVICE_VIDEOS.findIndex((s) => s.id === cfg.id);
  const dims = FORMATS[format];
  const spring = springTiming({ config: { damping: 200 }, durationInFrames: 20 });
  const lin = linearTiming({ durationInFrames: 22 });

  // her hizmet için farklı geçiş kombinasyonu (sırayla döner)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Trans = { p: TransitionPresentation<any>; t: typeof spring | typeof lin };
  const t1List: Trans[] = [
    { p: slide({ direction: "from-bottom" }), t: spring },
    { p: fade(), t: spring },
    { p: clockWipe({ width: dims.width, height: dims.height }), t: lin },
    { p: wipe({ direction: "from-right" }), t: lin },
    { p: slide({ direction: "from-right" }), t: spring },
    { p: flip(), t: lin },
    { p: wipe({ direction: "from-bottom" }), t: lin },
    { p: fade(), t: spring },
  ];
  const t2List: Trans[] = [
    { p: wipe({ direction: "from-left" }), t: lin },
    { p: slide({ direction: "from-right" }), t: spring },
    { p: fade(), t: spring },
    { p: fade(), t: spring },
    { p: flip(), t: lin },
    { p: slide({ direction: "from-bottom" }), t: spring },
    { p: fade(), t: spring },
    { p: slide({ direction: "from-left" }), t: spring },
  ];
  const T1 = t1List[i % 8];
  const T2 = t2List[i % 8];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={130}>
          <IntroScene cfg={cfg} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={T1.p} timing={T1.t} />
        <TransitionSeries.Sequence durationInFrames={230}>
          <Showcase cfg={cfg} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={T2.p} timing={T2.t} />
        <TransitionSeries.Sequence durationInFrames={130}>
          <OutroCTA tint="cyan" cta={cfg.cta} title={highlight(cfg.outroTitle, cfg.outroHighlight)} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
