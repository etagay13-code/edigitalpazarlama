import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { noise2D } from "@remotion/noise";
import { COLORS } from "../brand";

const PARTICLES = 42;

export const Background: React.FC<{
  tint?: "violet" | "cyan" | "mix";
  children?: React.ReactNode;
}> = ({ tint = "mix", children }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Organik orb hareketi (noise tabanlı, yavaş)
  const t = frame / 90;
  const o1x = width * 0.28 + noise2D("o1x", t, 0) * 120;
  const o1y = height * 0.26 + noise2D("o1y", t, 1) * 110;
  const o2x = width * 0.74 + noise2D("o2x", t, 2) * 140;
  const o2y = height * 0.7 + noise2D("o2y", t, 3) * 120;
  const o3x = width * 0.55 + noise2D("o3x", t, 4) * 100;
  const o3y = height * 0.5 + noise2D("o3y", t, 5) * 90;

  const intro = interpolate(frame, [0, 40], [1.12, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${intro})` }}>
        <Orb x={o1x} y={o1y} size={780} color={COLORS.violet} opacity={0.34} />
        <Orb x={o2x} y={o2y} size={720} color={COLORS.cyan} opacity={0.24} />
        <Orb
          x={o3x}
          y={o3y}
          size={560}
          color={tint === "cyan" ? COLORS.cyan : COLORS.violet}
          opacity={0.16}
        />
      </AbsoluteFill>

      {/* hareketli ince grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          backgroundPosition: `0 ${(frame * 0.35) % 72}px`,
          maskImage: "radial-gradient(circle at center, black 28%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 28%, transparent 80%)",
        }}
      />

      {/* yüzen parçacıklar */}
      <AbsoluteFill>
        {new Array(PARTICLES).fill(0).map((_, i) => {
          const px = random(`px${i}`) * width;
          const baseY = random(`py${i}`) * height;
          const size = 2 + random(`ps${i}`) * 4;
          const speed = 0.25 + random(`pv${i}`) * 0.6;
          const phase = random(`pp${i}`) * Math.PI * 2;
          const y = (((baseY - frame * speed) % (height + 60)) + height + 60) % (height + 60);
          const tw = 0.25 + (Math.sin(frame / 18 + phase) * 0.5 + 0.5) * 0.6;
          const isCyan = i % 3 === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: px,
                top: y,
                width: size,
                height: size,
                borderRadius: "50%",
                background: isCyan ? COLORS.cyan : COLORS.violet,
                opacity: tw,
                boxShadow: `0 0 ${size * 3}px ${isCyan ? COLORS.cyan : COLORS.violet}`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* film greni */}
      <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>

      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, transparent 42%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* önplan içeriği */}
      {children}
    </AbsoluteFill>
  );
};

const Orb: React.FC<{ x: number; y: number; size: number; color: string; opacity: number }> = ({
  x,
  y,
  size,
  color,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      background: color,
      opacity,
      filter: "blur(150px)",
    }}
  />
);
