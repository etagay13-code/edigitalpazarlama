import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, GRADIENT, BRAND } from "../brand";
import { prog, DrawLine, MaskedReveal, WordStagger } from "./kinetic";
import { Background } from "./Background";
import { Eyebrow, fontDisplay, fontSans, gradientText } from "./ui";

export const sceneCenter: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  flexDirection: "column",
  padding: 90,
};

// ── Sayı sayacı (0 → hedef, easing'li). Tabular rakamlarla zıplamaz. ──────────
export const CountUp: React.FC<{
  to: number;
  delay?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  from?: number;
}> = ({ to, delay = 0, duration = 52, prefix = "", suffix = "", decimals = 0, from = 0 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, duration);
  const val = from + (to - from) * p;
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum"' }}>
      {prefix}
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// ── Büyük metrik: gradient rakam + alt etiket ────────────────────────────────
export const Metric: React.FC<{
  value: React.ReactNode;
  label: string;
  delay?: number;
  size?: number;
}> = ({ value, label, delay = 0, size = 132 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, 30);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 44}px)`, textAlign: "center" }}>
      <div
        style={{
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: -2,
          ...gradientText,
        }}
      >
        {value}
      </div>
      <div style={{ fontFamily: fontSans, fontSize: 34, color: COLORS.muted, marginTop: 14 }}>
        {label}
      </div>
    </div>
  );
};

// ── Büyüme çubuk grafiği (son çubuk vurgulu) ─────────────────────────────────
export const Bars: React.FC<{
  values: number[];
  labels?: string[];
  delay?: number;
  height?: number;
}> = ({ values, labels, delay = 0, height = 360 }) => {
  const frame = useCurrentFrame();
  const max = Math.max(...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 22, height }}>
      {values.map((v, i) => {
        const p = prog(frame, delay + i * 6, 34);
        const h = (v / max) * (height - 40) * p;
        const last = i === values.length - 1;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 78,
                height: h,
                borderRadius: 16,
                background: last ? GRADIENT : "rgba(124,92,255,0.22)",
                border: `1px solid ${last ? "transparent" : "rgba(124,92,255,0.4)"}`,
                boxShadow: last ? `0 0 50px ${COLORS.violet}88` : "none",
              }}
            />
            {labels && (
              // minHeight: etiketsiz sütunlar kısalıp çubukları aşağı kaydırmasın
              // (satır flex-end hizalı olduğu için boş etiket hizayı bozuyordu).
              <div style={{ fontFamily: fontSans, fontSize: 24, color: COLORS.faint, minHeight: 30 }}>
                {labels[i]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── SEO arama kutusu + sıralama rozeti (9 → 1) ───────────────────────────────
export const SearchMock: React.FC<{ query: string; delay?: number }> = ({ query, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, 28);
  const rankP = prog(frame, delay + 24, 56);
  const rank = Math.round(interpolate(rankP, [0, 1], [9, 1]));
  const lift = interpolate(rankP, [0, 1], [40, 0]);
  return (
    <div style={{ width: 820, maxWidth: "92%", display: "flex", flexDirection: "column", gap: 30 }}>
      {/* arama kutusu */}
      <div
        style={{
          opacity: p,
          transform: `translateY(${(1 - p) * 24}px)`,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "26px 34px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: `4px solid ${COLORS.cyan}`,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -10,
              bottom: -6,
              width: 16,
              height: 4,
              borderRadius: 4,
              background: COLORS.cyan,
              transform: "rotate(45deg)",
            }}
          />
        </div>
        <div style={{ fontFamily: fontSans, fontSize: 36, color: COLORS.white }}>{query}</div>
      </div>

      {/* 1. sonuç — bizim marka, vurgulu */}
      <div
        style={{
          opacity: prog(frame, delay + 18, 24),
          transform: `translateY(${lift}px)`,
          textAlign: "left",
          padding: "30px 36px",
          borderRadius: 26,
          background: "rgba(124,92,255,0.12)",
          border: `1px solid ${COLORS.violet}66`,
          boxShadow: `0 0 60px ${COLORS.violet}33`,
          display: "flex",
          alignItems: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 96,
            height: 96,
            borderRadius: 22,
            background: GRADIENT,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fontDisplay,
            fontWeight: 700,
            color: COLORS.white,
            lineHeight: 1,
          }}
        >
          <span style={{ fontSize: 22, opacity: 0.8 }}>SIRA</span>
          <span style={{ fontSize: 52 }}>#{rank}</span>
        </div>
        <div>
          <div style={{ fontFamily: fontSans, fontSize: 24, color: COLORS.cyan }}>{BRAND.domain}</div>
          <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 38, color: COLORS.white, marginTop: 4 }}>
            {BRAND.name}
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 56, color: COLORS.cyan }}>↑</div>
      </div>
    </div>
  );
};

// ── Telefon mockup (sosyal medya: profil + takipçi + içerik grid) ────────────
export const PhoneMock: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, 32);
  const heart = prog(frame, delay + 44, 22);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 60}px) scale(${0.92 + p * 0.08})`,
        position: "relative",
        width: 440,
        height: 880,
        borderRadius: 64,
        padding: 16,
        background: "linear-gradient(160deg, #1a1a22, #0c0c10)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 50,
          overflow: "hidden",
          background: COLORS.bg2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* başlık */}
        <div style={{ background: GRADIENT, padding: "34px 30px 30px", display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: "rgba(255,255,255,0.25)", border: "3px solid white" }} />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 32, color: "white" }}>@etruemarketing</div>
            <div style={{ fontFamily: fontSans, fontSize: 24, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
              <CountUp to={18.4} delay={delay + 20} decimals={1} suffix="K takipçi" />
            </div>
          </div>
        </div>
        {/* içerik grid */}
        <div style={{ flex: 1, padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {new Array(9).fill(0).map((_, i) => {
            const tp = prog(frame, delay + 26 + i * 4, 22);
            return (
              <div
                key={i}
                style={{
                  opacity: tp,
                  transform: `scale(${0.8 + tp * 0.2})`,
                  borderRadius: 16,
                  background: i % 2 === 0 ? "rgba(124,92,255,0.3)" : "rgba(34,211,238,0.22)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            );
          })}
        </div>
      </div>
      {/* yüzen beğeni rozeti */}
      <div
        style={{
          position: "absolute",
          right: -34,
          top: 300,
          opacity: heart,
          transform: `scale(${0.6 + heart * 0.4})`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "18px 26px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow: `0 0 50px ${COLORS.violet}66`,
        }}
      >
        <span style={{ fontSize: 40 }}>❤️</span>
        <span style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 36, color: "white" }}>
          +<CountUp to={2400} delay={delay + 46} duration={36} />
        </span>
      </div>
    </div>
  );
};

// ── Tarayıcı mockup (web: chrome + hero) ─────────────────────────────────────
export const BrowserMock: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 860 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, 32);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 50}px) scale(${0.94 + p * 0.06})`,
        width,
        maxWidth: "94%",
        borderRadius: 26,
        overflow: "hidden",
        background: COLORS.bg2,
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
      }}
    >
      {/* chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 26px", background: "rgba(255,255,255,0.04)" }}>
        <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#febc2e" }} />
        <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#28c840" }} />
        <div
          style={{
            marginLeft: 20,
            flex: 1,
            maxWidth: 460,
            padding: "12px 24px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            fontFamily: fontSans,
            fontSize: 24,
            color: COLORS.faint,
            textAlign: "left",
          }}
        >
          {BRAND.domain}
        </div>
      </div>
      {/* hero içerik */}
      <div style={{ position: "relative", padding: "70px 60px 80px", textAlign: "left", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -120,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: GRADIENT,
            opacity: 0.4,
            filter: "blur(60px)",
          }}
        />
        <div style={{ fontFamily: fontSans, fontSize: 26, letterSpacing: 2, color: COLORS.cyan, marginBottom: 24 }}>
          DİJİTAL BÜYÜME
        </div>
        <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 64, lineHeight: 1.08, color: COLORS.white, maxWidth: 620 }}>
          Markanı <span style={gradientText}>zirveye</span> taşıyan dijital deneyim
        </div>
        <div
          style={{
            marginTop: 44,
            display: "inline-block",
            padding: "22px 46px",
            borderRadius: 999,
            background: GRADIENT,
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 30,
            color: "white",
          }}
        >
          Hemen Başla →
        </div>
      </div>
    </div>
  );
};

// ── Adım akışı (süreç: çizgi çizilir, düğümler sırayla açılır) ───────────────
export const StepFlow: React.FC<{ steps: string[]; delay?: number; start?: number }> = ({
  steps,
  delay = 0,
  // Numaralandırmanın kaçtan başlayacağı — akış iki satıra bölündüğünde
  // ikinci satır 1'den değil kaldığı yerden devam etsin diye.
  start = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "space-between", width: 900, maxWidth: "94%" }}>
      {/* bağlayıcı çizgi */}
      <div style={{ position: "absolute", top: 56, left: 56, right: 56, height: 4, background: "rgba(255,255,255,0.1)" }}>
        <div
          style={{
            height: "100%",
            background: GRADIENT,
            transform: `scaleX(${prog(frame, delay + 4, 60)})`,
            transformOrigin: "left center",
          }}
        />
      </div>
      {steps.map((s, i) => {
        const p = prog(frame, delay + 10 + i * 12, 26);
        return (
          <div key={s} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: 180 }}>
            <div
              style={{
                opacity: p,
                transform: `scale(${0.6 + p * 0.4})`,
                width: 112,
                height: 112,
                borderRadius: "50%",
                background: GRADIENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 48,
                color: "white",
                boxShadow: `0 0 50px ${COLORS.violet}66`,
              }}
            >
              {i + 1 + start}
            </div>
            <div style={{ opacity: p, fontFamily: fontDisplay, fontWeight: 600, fontSize: 32, color: COLORS.white }}>{s}</div>
          </div>
        );
      })}
    </div>
  );
};

// ── Ortak kapanış sahnesi (CTA) — 6 videonun hepsinde kullanılır ─────────────
export const OutroCTA: React.FC<{ title: React.ReactNode; cta?: string; tint?: "violet" | "cyan" | "mix" }> = ({
  title,
  cta = "Ücretsiz Teklif Al",
  tint = "cyan",
}) => {
  const frame = useCurrentFrame();
  const glow = 0.5 + Math.sin(frame / 10) * 0.5;
  const arrow = Math.sin(frame / 9) * 8;
  const btnP = prog(frame, 24, 30);
  const shine = interpolate(frame, [34, 92], [-60, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Background tint={tint}>
      <div style={{ ...sceneCenter, position: "absolute", inset: 0, display: "flex", gap: 50 }}>
        <MaskedReveal delay={2} duration={32}>
          <div
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 96,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              color: COLORS.white,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
        </MaskedReveal>

        <div
          style={{
            opacity: btnP,
            transform: `translateY(${(1 - btnP) * 30}px) scale(${0.92 + btnP * 0.08})`,
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 52,
            color: COLORS.white,
            padding: "34px 66px",
            borderRadius: 999,
            background: GRADIENT,
            overflow: "hidden",
            boxShadow: `0 0 ${50 + glow * 80}px rgba(124,92,255,${0.4 + glow * 0.45})`,
          }}
        >
          {cta}
          <span style={{ display: "inline-block", transform: `translateX(${arrow}px)`, fontSize: 48 }}>→</span>
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shine}%`,
              width: "30%",
              background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)",
              transform: "skewX(-18deg)",
            }}
          />
        </div>

        <div style={{ opacity: prog(frame, 60, 26), display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: fontDisplay, fontWeight: 600, fontSize: 46, ...gradientText }}>{BRAND.domain}</div>
          <div style={{ fontFamily: fontSans, fontSize: 30, letterSpacing: 4, color: COLORS.faint }}>@etruemarketing</div>
        </div>
      </div>
    </Background>
  );
};

// ── Teslimat listesi (gradient tikli, soldan kayarak açılan satırlar) ─────────
export const Deliverables: React.FC<{ items: string[]; delay?: number }> = ({ items, delay = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 880, maxWidth: "92%" }}>
      {items.map((it, i) => {
        const p = prog(frame, delay + i * 9, 28);
        return (
          <div
            key={it}
            style={{
              opacity: p,
              transform: `translateX(${(1 - p) * -44}px)`,
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "28px 34px",
              borderRadius: 22,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              textAlign: "left",
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: GRADIENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                fontWeight: 700,
                color: "white",
                boxShadow: `0 0 30px ${COLORS.violet}55`,
              }}
            >
              ✓
            </span>
            <span style={{ fontFamily: fontSans, fontSize: 36, fontWeight: 500, color: COLORS.white }}>{it}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── Ortak giriş başlığı sahnesi (eyebrow + kelime kelime başlık + çizgi) ──────
export const IntroHeadline: React.FC<{
  eyebrow: string;
  title: string;
  highlight?: string;
  tint?: "violet" | "cyan" | "mix";
  size?: number;
}> = ({ eyebrow, title, highlight, tint = "violet", size = 106 }) => (
  <Scene tint={tint} gap={44}>
    <Eyebrow delay={4}>{eyebrow}</Eyebrow>
    <div
      style={{
        fontFamily: fontDisplay,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.06,
        letterSpacing: -2,
        color: COLORS.white,
        maxWidth: 920,
      }}
    >
      <WordStagger text={title} delay={12} step={4} highlight={highlight} />
    </div>
    <DrawLine delay={48} width={240} />
  </Scene>
);

// ── Çip satırı (etiketler) ───────────────────────────────────────────────────
export const Chips: React.FC<{ items: string[]; delay?: number }> = ({ items, delay = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, maxWidth: 880 }}>
      {items.map((c, i) => {
        const p = prog(frame, delay + i * 6, 24);
        return (
          <div
            key={c}
            style={{
              opacity: p,
              transform: `translateY(${(1 - p) * 24}px) scale(${0.9 + p * 0.1})`,
              fontFamily: fontSans,
              fontSize: 34,
              fontWeight: 500,
              color: COLORS.white,
              padding: "16px 34px",
              borderRadius: 999,
              border: `1px solid ${COLORS.cyan}55`,
              background: "rgba(34,211,238,0.08)",
            }}
          >
            {c}
          </div>
        );
      })}
    </div>
  );
};

// ── Genel sahne sarmalayıcı (arka plan + ortalanmış içerik) ──────────────────
export const Scene: React.FC<{
  tint?: "violet" | "cyan" | "mix";
  gap?: number;
  children: React.ReactNode;
}> = ({ tint = "mix", gap = 44, children }) => (
  <Background tint={tint}>
    <div style={{ ...sceneCenter, position: "absolute", inset: 0, display: "flex", gap }}>
      {children}
    </div>
  </Background>
);

// küçük yardımcı: gradient aksan etiketi
export { Eyebrow, DrawLine };
