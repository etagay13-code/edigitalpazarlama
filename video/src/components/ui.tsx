import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, GRADIENT, DISPLAY, SANS } from "../brand";
import { EASE } from "./kinetic";

export const gradientText: React.CSSProperties = {
  backgroundImage: GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const fontDisplay = DISPLAY;
export const fontSans = SANS;

export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });
  const pulse = 0.6 + (Math.sin(frame / 12) * 0.5 + 0.5) * 0.4;
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px)`,
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "15px 30px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.05)",
        fontFamily: SANS,
        fontSize: 29,
        letterSpacing: 1,
        color: COLORS.muted,
        backdropFilter: "blur(8px)",
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: GRADIENT,
          opacity: pulse,
          boxShadow: `0 0 ${10 + pulse * 16}px ${COLORS.violet}`,
        }}
      />
      {children}
    </div>
  );
};
