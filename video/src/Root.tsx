import { Composition } from "remotion";
import { BrandIntro } from "./compositions/BrandIntro";
import { Services } from "./compositions/Services";
import { CTA } from "./compositions/CTA";
import { FORMATS, FPS, DURATION } from "./brand";

const concepts = [
  { id: "BrandIntro", comp: BrandIntro },
  { id: "Services", comp: Services },
  { id: "CTA", comp: CTA },
] as const;

const formats = [
  { key: "vertical" as const, label: "Dikey", ...FORMATS.vertical },
  { key: "square" as const, label: "Kare", ...FORMATS.square },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {concepts.map(({ id, comp: Comp }) =>
        formats.map((f) => (
          <Composition
            key={`${id}-${f.key}`}
            id={`${id}-${f.label}`}
            component={Comp as React.FC<Record<string, unknown>>}
            durationInFrames={DURATION}
            fps={FPS}
            width={f.width}
            height={f.height}
            defaultProps={{ format: f.key }}
          />
        )),
      )}
    </>
  );
};
