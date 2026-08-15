import { Composition } from "remotion";
import { BrandIntro } from "./compositions/BrandIntro";
import { Services } from "./compositions/Services";
import { CTA } from "./compositions/CTA";
import { Results } from "./compositions/Results";
import { WhyUs } from "./compositions/WhyUs";
import { ServiceVideo } from "./compositions/ServiceVideo";
import { SERVICE_VIDEOS } from "./service-videos";
import { REELS, REEL_DURATION } from "./compositions/reels";
import { Post, POST_FRAME } from "./posts/Post";
import { POSTS } from "./posts/post-data";
import { Og, OG_LOCALES } from "./posts/Og";
import { HeroAmbient } from "./ambient/HeroAmbient";
import { FORMATS, FPS, DURATION } from "./brand";

const DUR15 = FPS * 15; // 15 saniye → 450 kare

// Genel tanıtım videoları
const concepts = [
  { id: "BrandIntro", comp: BrandIntro, dur: DURATION },
  { id: "Services", comp: Services, dur: DURATION },
  { id: "CTA", comp: CTA, dur: DURATION },
  { id: "Sonuclar", comp: Results, dur: DUR15 },
  { id: "NedenBiz", comp: WhyUs, dur: DUR15 },
] as const;

const formats = [
  { key: "vertical" as const, label: "Dikey", ...FORMATS.vertical },
  { key: "square" as const, label: "Kare", ...FORMATS.square },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {concepts.map(({ id, comp: Comp, dur }) =>
        formats.map((f) => (
          <Composition
            key={`${id}-${f.key}`}
            id={`${id}-${f.label}`}
            component={Comp as React.FC<Record<string, unknown>>}
            durationInFrames={dur}
            fps={FPS}
            width={f.width}
            height={f.height}
            defaultProps={{ format: f.key }}
          />
        )),
      )}

      {/* 30 saniyelik Instagram Reels videoları (1080×1920) */}
      {REELS.map(({ id, comp: Comp }) => (
        <Composition
          key={id}
          id={id}
          component={Comp as React.FC<Record<string, unknown>>}
          durationInFrames={REEL_DURATION}
          fps={FPS}
          width={1080}
          height={1920}
        />
      ))}

      {/* Instagram feed postları (1080×1350, 4:5) — still olarak render edilir */}
      {POSTS.map((p) => (
        <Composition
          key={p.id}
          id={p.id}
          component={Post as React.FC<Record<string, unknown>>}
          durationInFrames={POST_FRAME + 30}
          fps={FPS}
          width={1080}
          height={1350}
          defaultProps={{ id: p.id }}
        />
      ))}

      {/* Site ambiyans klipleri — metinsiz, sessiz, kusursuz döngü (10 sn) */}
      <Composition
        id="HeroAmbient"
        component={HeroAmbient}
        durationInFrames={FPS * 10}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* Sosyal paylaşım görselleri (1200×630) — dil başına bir tane */}
      {OG_LOCALES.map((loc) => (
        <Composition
          key={`og-${loc}`}
          id={`Og${loc.toUpperCase()}`}
          component={Og as React.FC<Record<string, unknown>>}
          durationInFrames={60}
          fps={FPS}
          width={1200}
          height={630}
          defaultProps={{ locale: loc }}
        />
      ))}

      {/* Her hizmet için ayrı 15 sn'lik video (kare + dikey) */}
      {SERVICE_VIDEOS.map((s) =>
        formats.map((f) => (
          <Composition
            key={`${s.id}-${f.key}`}
            id={`${s.id}-${f.label}`}
            component={ServiceVideo as React.FC<Record<string, unknown>>}
            durationInFrames={DUR15}
            fps={FPS}
            width={f.width}
            height={f.height}
            defaultProps={{ format: f.key, id: s.id }}
          />
        )),
      )}
    </>
  );
};
