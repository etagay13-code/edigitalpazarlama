import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, GRADIENT, BRAND } from "../brand";
import { Background } from "../components/Background";
import { fontDisplay, fontSans, gradientText } from "../components/ui";
import { prog } from "../components/kinetic";
import { POSTS, type PostData } from "./post-data";

// Feed postu (1080×1350). Still olarak render edilir; tasarım tek karede
// tamamlanmış görünsün diye animasyonlar POST_FRAME'de bitmiş olur.
export const POST_FRAME = 120;

const PAD = 84;

// Başlıkta bir kelimeyi gradient ile vurgula
function highlight(text: string, word?: string): React.ReactNode {
  if (!word) return text;
  const idx = text.toLocaleLowerCase("tr").indexOf(word.toLocaleLowerCase("tr"));
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={gradientText}>{text.slice(idx, idx + word.length)}</span>
      {text.slice(idx + word.length)}
    </>
  );
}

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "14px 28px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.16)",
      background: "rgba(255,255,255,0.05)",
      fontFamily: fontSans,
      fontSize: 26,
      fontWeight: 500,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.72)",
      alignSelf: "flex-start",
    }}
  >
    <span style={{ width: 11, height: 11, borderRadius: "50%", background: GRADIENT }} />
    {children}
  </div>
);

const Title: React.FC<{ text: string; word?: string; size?: number }> = ({
  text,
  word,
  size = 78,
}) => (
  <div
    style={{
      fontFamily: fontDisplay,
      fontWeight: 700,
      fontSize: text.length > 34 ? size - 10 : size,
      lineHeight: 1.08,
      letterSpacing: -1.6,
      color: COLORS.white,
    }}
  >
    {highlight(text, word)}
  </div>
);

const Sub: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: fontSans,
      fontSize: 31,
      lineHeight: 1.5,
      color: "rgba(255,255,255,0.68)",
    }}
  >
    {children}
  </div>
);

const Footer: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      paddingTop: 30,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: GRADIENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: 32,
          color: "white",
          boxShadow: `0 0 34px ${COLORS.violet}66`,
        }}
      >
        E
      </div>
      <div style={{ lineHeight: 1.25 }}>
        <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 30, color: COLORS.white }}>
          True EDigital
        </div>
        <div style={{ fontFamily: fontSans, fontSize: 24, color: "rgba(255,255,255,0.45)" }}>
          @etruemarketing
        </div>
      </div>
    </div>
    <div style={{ fontFamily: fontSans, fontSize: 26, ...gradientText, fontWeight: 600 }}>
      {BRAND.domain}
    </div>
  </div>
);

// ── kind'a göre gövde ────────────────────────────────────────────────────────

const StatBody: React.FC<{ d: PostData }> = ({ d }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 18,
      padding: "54px 40px",
      borderRadius: 34,
      background: "rgba(124,92,255,0.10)",
      border: `1px solid ${COLORS.violet}55`,
      boxShadow: `0 0 90px ${COLORS.violet}22 inset`,
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontFamily: fontDisplay,
        fontWeight: 700,
        fontSize: 172,
        lineHeight: 1,
        letterSpacing: -6,
        ...gradientText,
      }}
    >
      {d.stat?.value}
    </div>
    <div style={{ fontFamily: fontSans, fontSize: 34, color: COLORS.white, maxWidth: 720 }}>
      {d.stat?.label}
    </div>
    {d.stat?.foot && (
      <div style={{ fontFamily: fontSans, fontSize: 27, color: "rgba(255,255,255,0.5)" }}>
        {d.stat.foot}
      </div>
    )}
  </div>
);

const ListBody: React.FC<{ d: PostData }> = ({ d }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    {(d.items ?? []).map((it, i) => (
      <div
        key={it}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "26px 30px",
          borderRadius: 22,
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        <span
          style={{
            flexShrink: 0,
            width: 56,
            height: 56,
            borderRadius: d.numbered ? 16 : "50%",
            background: GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: d.numbered ? 30 : 28,
            color: "white",
          }}
        >
          {d.numbered ? String(i + 1).padStart(2, "0") : "✓"}
        </span>
        <span
          style={{
            fontFamily: fontSans,
            fontSize: 30,
            lineHeight: 1.35,
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {it}
        </span>
      </div>
    ))}
  </div>
);

const CaseBody: React.FC<{ d: PostData }> = ({ d }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    {(d.case ?? []).map((c) => (
      <div
        key={c.metric}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "28px 32px",
          borderRadius: 24,
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        <div style={{ flex: 1, fontFamily: fontSans, fontSize: 29, color: "rgba(255,255,255,0.62)" }}>
          {c.metric}
        </div>
        <div
          style={{
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: 38,
            color: "rgba(255,255,255,0.38)",
            textDecoration: "line-through",
          }}
        >
          {c.from}
        </div>
        <div style={{ fontSize: 34, color: COLORS.cyan }}>→</div>
        <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 46, ...gradientText }}>
          {c.to}
        </div>
        <div
          style={{
            fontFamily: fontSans,
            fontSize: 25,
            fontWeight: 600,
            color: "#34D399",
            background: "rgba(52,211,153,0.12)",
            border: "1px solid rgba(52,211,153,0.3)",
            borderRadius: 999,
            padding: "8px 18px",
            minWidth: 108,
            textAlign: "center",
          }}
        >
          {c.note}
        </div>
      </div>
    ))}
  </div>
);

const CompareBody: React.FC<{ d: PostData }> = ({ d }) => {
  const c = d.compare!;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 16, paddingLeft: 4 }}>
        <div
          style={{
            flex: 1,
            fontFamily: fontSans,
            fontSize: 25,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {c.badLabel}
        </div>
        <div
          style={{
            flex: 1,
            fontFamily: fontSans,
            fontSize: 25,
            letterSpacing: 2,
            textTransform: "uppercase",
            ...gradientText,
            fontWeight: 600,
          }}
        >
          {c.goodLabel}
        </div>
      </div>
      {c.rows.map((r) => (
        <div key={r.good} style={{ display: "flex", gap: 16 }}>
          <div
            style={{
              flex: 1,
              padding: "22px 24px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              fontFamily: fontSans,
              fontSize: 26,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            {r.bad}
          </div>
          <div
            style={{
              flex: 1,
              padding: "22px 24px",
              borderRadius: 18,
              background: "rgba(124,92,255,0.12)",
              border: `1px solid ${COLORS.violet}55`,
              fontFamily: fontSans,
              fontSize: 26,
              lineHeight: 1.35,
              color: COLORS.white,
              fontWeight: 500,
            }}
          >
            {r.good}
          </div>
        </div>
      ))}
    </div>
  );
};

const ChipsBody: React.FC<{ d: PostData }> = ({ d }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
    {(d.items ?? []).map((c) => (
      <div
        key={c}
        style={{
          fontFamily: fontSans,
          fontSize: 30,
          fontWeight: 500,
          color: COLORS.white,
          padding: "18px 30px",
          borderRadius: 999,
          border: `1px solid ${COLORS.cyan}55`,
          background: "rgba(34,211,238,0.08)",
        }}
      >
        {c}
      </div>
    ))}
  </div>
);

const CtaBody: React.FC<{ d: PostData }> = ({ d }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
    <ListBody d={d} />
    <div
      style={{
        alignSelf: "flex-start",
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        fontFamily: fontDisplay,
        fontWeight: 700,
        fontSize: 40,
        color: COLORS.white,
        padding: "26px 48px",
        borderRadius: 999,
        background: GRADIENT,
        boxShadow: `0 0 70px ${COLORS.violet}66`,
      }}
    >
      {d.cta}
      <span style={{ fontSize: 36 }}>→</span>
    </div>
  </div>
);

// ── Post kabuğu ──────────────────────────────────────────────────────────────

export const Post: React.FC<{ id: string }> = ({ id }) => {
  const frame = useCurrentFrame();
  const d = POSTS.find((p) => p.id === id) ?? POSTS[0];
  const p = prog(frame, 0, 30);

  const Body =
    d.kind === "stat" ? (
      <StatBody d={d} />
    ) : d.kind === "case" ? (
      <CaseBody d={d} />
    ) : d.kind === "compare" ? (
      <CompareBody d={d} />
    ) : d.kind === "manifesto" ? (
      <ChipsBody d={d} />
    ) : d.kind === "cta" ? (
      <CtaBody d={d} />
    ) : (
      <ListBody d={d} />
    );

  return (
    <AbsoluteFill>
      <Background tint={d.tint ?? "mix"}>
        <AbsoluteFill
          style={{
            padding: PAD,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: p,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <Title text={d.title} word={d.highlight} />
            {d.sub && <Sub>{d.sub}</Sub>}
          </div>

          {/* Gövde kalan alanı doldurup ortalanır — az maddeli postlarda üstte
              boşluk, çok maddeli postlarda taşma olmasın diye. */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "40px 0",
            }}
          >
            {Body}
          </div>

          <Footer />
        </AbsoluteFill>
      </Background>
    </AbsoluteFill>
  );
};
