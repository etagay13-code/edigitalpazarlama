import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { Eyebrow, gradientText, useReveal, fontDisplay, fontSans } from "../components/ui";
import { SERVICES, BRAND, COLORS } from "../brand";
import type { FormatProps } from "../brand";

const START = 22;
const SLOT = 28; // her hizmet ~0.93 sn
const OUTRO = START + SLOT * SERVICES.length; // 22 + 224 = 246

export const Services: React.FC<FormatProps> = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const head = useReveal(4, 24);

  const rawIndex = Math.floor((frame - START) / SLOT);
  const index = Math.min(Math.max(rawIndex, 0), SERVICES.length - 1);
  const local = (frame - START) % SLOT;

  const enterP = interpolate(local, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitP = interpolate(local, [SLOT - 9, SLOT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wordOpacity = enterP * exitP;
  const wordY = (1 - enterP) * 46 + (1 - exitP) * -46;

  const cycleOpacity = interpolate(frame, [OUTRO - 10, OUTRO + 4], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outro = useReveal(OUTRO + 2, 40);
  const exitAll = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: exitAll }}>
      <Background />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80 }}>
        {/* başlık üstte */}
        <div style={{ ...head, position: "absolute", top: "16%" }}>
          <Eyebrow delay={4}>Hizmetlerimiz</Eyebrow>
        </div>

        {/* dönen hizmet adı */}
        {frame < OUTRO + 4 && (
          <div
            style={{
              opacity: wordOpacity * cycleOpacity,
              transform: `translateY(${wordY}px)`,
              textAlign: "center",
              maxWidth: 940,
            }}
          >
            <div
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 96,
                lineHeight: 1.05,
                letterSpacing: -1.5,
                ...gradientText,
              }}
            >
              {SERVICES[index]}
            </div>
            <div
              style={{
                marginTop: 30,
                fontFamily: fontSans,
                fontSize: 34,
                letterSpacing: 6,
                color: COLORS.faint,
              }}
            >
              {String(index + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
            </div>
          </div>
        )}

        {/* outro: marka + domain */}
        {frame >= OUTRO - 4 && (
          <div style={{ ...outro, position: "absolute", textAlign: "center", padding: 60 }}>
            <div
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 76,
                lineHeight: 1.08,
                color: COLORS.white,
              }}
            >
              Tek ekip,{" "}
              <span style={gradientText}>tüm uzmanlıklar</span>
            </div>
            <div
              style={{
                marginTop: 34,
                fontFamily: fontDisplay,
                fontWeight: 600,
                fontSize: 44,
                ...gradientText,
              }}
            >
              {BRAND.domain}
            </div>
          </div>
        )}

        {/* ilerleme noktaları */}
        <div style={{ position: "absolute", bottom: "15%", display: "flex", gap: 16 }}>
          {SERVICES.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === index && frame < OUTRO ? 40 : 14,
                height: 14,
                borderRadius: 999,
                background: i === index && frame < OUTRO ? COLORS.violet : "rgba(255,255,255,0.18)",
                transition: "all 0.2s",
                opacity: cycleOpacity,
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
