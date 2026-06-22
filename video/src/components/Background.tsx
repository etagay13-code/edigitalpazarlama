import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../brand";

// Sitenin "GradientBlobs" hissini veren animasyonlu arka plan.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  // Yumuşak sürüklenme
  const drift = (phase: number, amp: number) =>
    Math.sin((frame / durationInFrames) * Math.PI * 2 + phase) * amp;

  const blob1X = width * 0.25 + drift(0, 60);
  const blob1Y = height * 0.28 + drift(1, 50);
  const blob2X = width * 0.78 + drift(2, 70);
  const blob2Y = height * 0.72 + drift(3, 60);

  // Hafif giriş zoom'u
  const scale = interpolate(frame, [0, 30], [1.08, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <div
          style={{
            position: "absolute",
            left: blob1X,
            top: blob1Y,
            width: 720,
            height: 720,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: COLORS.violet,
            opacity: 0.32,
            filter: "blur(150px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: blob2X,
            top: blob2Y,
            width: 680,
            height: 680,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: COLORS.cyan,
            opacity: 0.22,
            filter: "blur(150px)",
          }}
        />
      </AbsoluteFill>

      {/* faint grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(circle at center, black 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 30%, transparent 78%)",
        }}
      />

      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
