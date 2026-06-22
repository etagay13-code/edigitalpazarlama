import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, GRADIENT, DISPLAY, SANS } from "../brand";

export const gradientText: React.CSSProperties = {
  backgroundImage: GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

// spring tabanlı giriş — delay (frame) ve yön ile
export function useReveal(delay = 0, distance = 40) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.7, stiffness: 120 },
  });
  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
  };
}

// Belirli bir aralıkta opaklık (giriş + çıkış)
export function useFadeWindow(inAt: number, holdFrom: number, outAt: number, end: number) {
  const frame = useCurrentFrame();
  return interpolate(frame, [inAt, holdFrom, outAt, end], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const r = useReveal(delay, 24);
  return (
    <div
      style={{
        ...r,
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 28px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.04)",
        fontFamily: SANS,
        fontSize: 30,
        letterSpacing: 1,
        color: COLORS.muted,
        backdropFilter: "blur(6px)",
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: GRADIENT,
          boxShadow: `0 0 18px ${COLORS.violet}`,
        }}
      />
      {children}
    </div>
  );
};

export const fontDisplay = DISPLAY;
export const fontSans = SANS;
