import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, GRADIENT, DISPLAY } from "../brand";

// Sitenin imza easing'i — yumuşak, sinematik yavaşlama.
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export function prog(frame: number, start: number, dur: number, easing = EASE) {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

// Aşağıdan yukarı maskeli açılış (clip-path) + hafif parallax kayma.
export const MaskedReveal: React.FC<{
  delay?: number;
  duration?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, duration = 34, y = 40, children, style }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, duration);
  return (
    <div
      style={{
        clipPath: `inset(${(1 - p) * 100}% 0% 0% 0%)`,
        WebkitClipPath: `inset(${(1 - p) * 100}% 0% 0% 0%)`,
        transform: `translateY(${(1 - p) * y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Gradient yazı + üzerinden geçen parlaklık (shine) süpürmesi.
export const ShineText: React.FC<{
  children: React.ReactNode;
  shineAt?: number; // shine'ın başladığı frame
  style?: React.CSSProperties;
}> = ({ children, shineAt = 0, style }) => {
  const frame = useCurrentFrame();
  const pos = interpolate(frame, [shineAt, shineAt + 55], [220, -120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(110deg, ${COLORS.violet} 0%, ${COLORS.cyan} 38%, #ffffff 50%, ${COLORS.cyan} 62%, ${COLORS.violet} 100%)`,
        backgroundSize: "300% 100%",
        backgroundPosition: `${pos}% 0`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

// Soldan çizilen aksan çizgisi.
export const DrawLine: React.FC<{
  delay?: number;
  width?: number;
  duration?: number;
}> = ({ delay = 0, width = 160, duration = 30 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, duration);
  return (
    <div
      style={{
        width,
        height: 6,
        borderRadius: 999,
        background: GRADIENT,
        transform: `scaleX(${p})`,
        transformOrigin: "left center",
        boxShadow: `0 0 24px ${COLORS.violet}88`,
      }}
    />
  );
};

// Kelime kelime gecikmeli açılış.
export const WordStagger: React.FC<{
  text: string;
  delay?: number;
  step?: number;
  style?: React.CSSProperties;
  highlight?: string;
}> = ({ text, delay = 0, step = 4, style, highlight }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <span style={{ display: "inline" }}>
      {words.map((w, i) => {
        const p = prog(frame, delay + i * step, 26);
        const isHi = highlight && w.includes(highlight);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * 34}px)`,
              marginRight: "0.28em",
              ...(isHi
                ? {
                    backgroundImage: GRADIENT,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }
                : {}),
              ...style,
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
};

export const fontDisplay = DISPLAY;
