import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, random } from "remotion";
import { COLORS } from "../brand";

// Hero arkasında dönen ambiyans klibi.
//
// Site videolarının sosyal videolardan tek farkı var: METİN YOK, SES YOK ve
// KUSURSUZ DÖNGÜ. Bütün hareketler frame/durationInFrames oranının sinüs/kosinüs
// fonksiyonları — yani son kare ilk kareye birebir eşit, video başa sardığında
// sıçrama olmuyor. Metin HTML'de kalıyor (SEO ve 3 dil için şart).

// Not: opaklıklar bilerek düşük. Bu klip hero METNİNİN ARKASINDA duruyor;
// merkez aydınlanırsa hem okunurluk düşer hem de "premium koyu" his kaybolur.
// Işık kenarlarda nefes alsın, orta bölge derin siyah kalsın.
const ORBS = [
  { r: 0.34, cx: 0.20, cy: 0.28, size: 0.68, color: COLORS.violet, opacity: 0.20, phase: 0 },
  { r: 0.28, cx: 0.84, cy: 0.66, size: 0.58, color: COLORS.cyan, opacity: 0.13, phase: 2.1 },
  { r: 0.22, cx: 0.62, cy: 0.16, size: 0.46, color: "#B9A8FF", opacity: 0.10, phase: 4.2 },
];

const PARTICLES = 26;

export const HeroAmbient: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // 0 → 1 arası döngüsel ilerleme
  const t = frame / durationInFrames;
  const TAU = Math.PI * 2;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Yavaş eliptik yörüngede dönen ışık kütleleri */}
      {ORBS.map((o, i) => {
        const a = t * TAU + o.phase;
        const x = (o.cx + Math.cos(a) * o.r * 0.5) * width;
        const y = (o.cy + Math.sin(a) * o.r * 0.32) * height;
        const scale = 1 + Math.sin(a * 2) * 0.08;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: o.size * width,
              height: o.size * width,
              transform: `translate(-50%, -50%) scale(${scale})`,
              borderRadius: "50%",
              background: o.color,
              opacity: o.opacity,
              filter: `blur(${width * 0.13}px)`,
            }}
          />
        );
      })}

      {/* Tam bir kare kayan ince ızgara — periyot bir hücreye eşit olduğu için dikişsiz */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
          backgroundPosition: `${t * 88}px ${t * 88}px`,
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 72%)",
        }}
      />

      {/* Yükselen zerreler — her biri döngü boyunca tam tur atar */}
      <AbsoluteFill>
        {new Array(PARTICLES).fill(0).map((_, i) => {
          const px = random(`x${i}`) * width;
          const speed = 1 + Math.floor(random(`s${i}`) * 2); // 1 veya 2 tur
          const offset = random(`o${i}`);
          const y = height * (1 - ((t * speed + offset) % 1));
          const size = 2 + random(`r${i}`) * 3.5;
          // Kenarlarda sönümle: döngü başında/sonunda görünürlük eşit olsun
          const fade = Math.sin(((t * speed + offset) % 1) * Math.PI);
          const cyan = i % 3 === 0;
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
                background: cyan ? COLORS.cyan : "#FFFFFF",
                opacity: 0.5 * fade,
                boxShadow: `0 0 ${size * 4}px ${cyan ? COLORS.cyan : COLORS.violet}`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Ekranı bir kez geçen ışık huzmesi */}
      <div
        style={{
          position: "absolute",
          top: -height * 0.5,
          left: `${-30 + t * 160}%`,
          width: "22%",
          height: height * 2,
          background:
            "linear-gradient(100deg, transparent, rgba(255,255,255,0.022), transparent)",
          transform: "rotate(14deg)",
          opacity: Math.sin(t * Math.PI) * 0.7,
        }}
      />

      {/* Kenar karartma — içerik metni her zaman okunur kalsın */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(8,8,10,0.55) 0%, rgba(8,8,10,0.35) 35%, rgba(8,8,10,0.8) 75%, rgba(8,8,10,0.96) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
