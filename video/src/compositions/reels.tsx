import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, GRADIENT, FPS } from "../brand";
import { Eyebrow, fontDisplay, fontSans, gradientText } from "../components/ui";
import { MaskedReveal, DrawLine, WordStagger, prog } from "../components/kinetic";
import {
  Scene,
  Metric,
  CountUp,
  Bars,
  SearchMock,
  StepFlow,
  Deliverables,
  Chips,
  OutroCTA,
} from "../components/blocks";

// ─────────────────────────────────────────────────────────────────────────────
// 30 saniye = 900 kare (30fps). Sahne süreleri toplamı 990, aralarında 5 geçiş
// × 18 kare = 90 kare örtüşme → net 900. Bu sayılar birbirine bağlı; sahne
// süresi değiştirirsen REEL_SCENES toplamını 990'da tutmalısın (aşağıda test var).
// ─────────────────────────────────────────────────────────────────────────────
export const REEL_DURATION = FPS * 30; // 900
const T = 18; // geçiş süresi (kare)
const REEL_SCENES = [180, 170, 165, 160, 160, 155];

// Derleme anında doğrula: yanlış süre sessizce kırpılmış video üretmesin.
const computed = REEL_SCENES.reduce((a, b) => a + b, 0) - (REEL_SCENES.length - 1) * T;
if (computed !== REEL_DURATION) {
  throw new Error(`Reel süresi tutmuyor: ${computed} ≠ ${REEL_DURATION}`);
}

// Geçişler: her sahne arasında farklı ama hepsi lineer zamanlı — kare hesabı
// sabit kalsın diye springTiming kullanılmıyor (süre tahmin edilemez olurdu).
// Her geçiş ayrı JSX olarak üretiliyor: presentation tipleri birbirine
// benzemediği için tek dizide toplandığında TypeScript birleşimi bozuluyor.
const timing = linearTiming({ durationInFrames: T });

const transitionAt = (i: number) => {
  switch (i) {
    case 0:
      return <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />;
    case 1:
      return <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={timing} />;
    case 2:
      return <TransitionSeries.Transition presentation={fade()} timing={timing} />;
    case 3:
      return <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />;
    default:
      return <TransitionSeries.Transition presentation={clockWipe({ width: 1080, height: 1920 })} timing={timing} />;
  }
};

// 6 sahneyi geçişlerle birleştiren sarmalayıcı.
const Reel: React.FC<{ scenes: React.ReactNode[] }> = ({ scenes }) => (
  <TransitionSeries>
    {scenes.map((s, i) => (
      <React.Fragment key={i}>
        <TransitionSeries.Sequence durationInFrames={REEL_SCENES[i]}>{s}</TransitionSeries.Sequence>
        {i < scenes.length - 1 && transitionAt(i)}
      </React.Fragment>
    ))}
  </TransitionSeries>
);

// ── Ortak küçük bileşenler ───────────────────────────────────────────────────

const Headline: React.FC<{ text: string; highlight?: string; size?: number; delay?: number }> = ({
  text,
  highlight,
  size = 104,
  delay = 10,
}) => (
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
    <WordStagger text={text} delay={delay} step={4} highlight={highlight} />
  </div>
);

const Lead: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 46 }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, 28);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px)`,
        fontFamily: fontSans,
        fontSize: 38,
        lineHeight: 1.45,
        color: COLORS.muted,
        maxWidth: 860,
      }}
    >
      {children}
    </div>
  );
};

// Karşılaştırma satırları (solda tipik kurgu, sağda biz)
const VsRows: React.FC<{ rows: { bad: string; good: string }[]; delay?: number }> = ({
  rows,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 900, maxWidth: "94%" }}>
      {rows.map((r, i) => {
        const p = prog(frame, delay + i * 10, 28);
        return (
          <div key={r.good} style={{ display: "flex", gap: 16, opacity: p }}>
            <div
              style={{
                flex: 1,
                transform: `translateX(${(1 - p) * -40}px)`,
                padding: "24px 26px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                fontFamily: fontSans,
                fontSize: 28,
                lineHeight: 1.3,
                color: "rgba(255,255,255,0.45)",
                textAlign: "left",
              }}
            >
              {r.bad}
            </div>
            <div
              style={{
                flex: 1,
                transform: `translateX(${(1 - p) * 40}px)`,
                padding: "24px 26px",
                borderRadius: 20,
                background: "rgba(124,92,255,0.14)",
                border: `1px solid ${COLORS.violet}66`,
                fontFamily: fontSans,
                fontSize: 28,
                lineHeight: 1.3,
                color: COLORS.white,
                fontWeight: 500,
                textAlign: "left",
                boxShadow: `0 0 40px ${COLORS.violet}22`,
              }}
            >
              {r.good}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Büyük tek metrik (öncesi → sonrası)
const BeforeAfter: React.FC<{
  rows: { label: string; from: string; to: string }[];
  delay?: number;
}> = ({ rows, delay = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 900, maxWidth: "94%" }}>
      {rows.map((r, i) => {
        const p = prog(frame, delay + i * 12, 32);
        return (
          <div
            key={r.label}
            style={{
              opacity: p,
              transform: `translateY(${(1 - p) * 30}px)`,
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "28px 34px",
              borderRadius: 24,
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <div style={{ flex: 1, textAlign: "left", fontFamily: fontSans, fontSize: 30, color: COLORS.muted }}>
              {r.label}
            </div>
            <div
              style={{
                fontFamily: fontDisplay,
                fontWeight: 600,
                fontSize: 42,
                color: "rgba(255,255,255,0.35)",
                textDecoration: "line-through",
              }}
            >
              {r.from}
            </div>
            <div style={{ fontSize: 38, color: COLORS.cyan }}>→</div>
            <div style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 56, ...gradientText }}>
              {r.to}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Tam ekran tek cümle — ritmi kıran "nefes" sahnesi
const Statement: React.FC<{ text: string; highlight?: string; tint?: "violet" | "cyan" | "mix" }> = ({
  text,
  highlight,
  tint = "mix",
}) => (
  <Scene tint={tint} gap={40}>
    <Headline text={text} highlight={highlight} size={112} delay={6} />
    <DrawLine delay={40} width={260} />
  </Scene>
);

// ─────────────────────────────────────────────────────────────────────────────
// 1) Büyüme ortağı — marka manifestosu
// ─────────────────────────────────────────────────────────────────────────────
export const ReelBuyumeOrtagi: React.FC = () => (
  <Reel
    scenes={[
      <Scene tint="violet" gap={44}>
        <Eyebrow delay={4}>Yeni nesil 360° dijital ajans</Eyebrow>
        <Headline text="Ajansını değiştirmeden önce tek soru sor" highlight="tek" />
        <Lead>Raporunda beğeni mi var, satış mı?</Lead>
      </Scene>,

      <Statement text="Gösterim rapor doldurur, ciroyu doldurmaz" highlight="ciroyu" tint="cyan" />,

      <Scene tint="mix" gap={38}>
        <Eyebrow delay={2}>Farkımız</Eyebrow>
        <VsRows
          delay={16}
          rows={[
            { bad: "Reklam, SEO, sosyal ayrı ajanslarda", good: "Tüm kanallar tek ekipte" },
            { bad: "Gösterim ve beğeni raporu", good: "Satış, lead ve ROAS raporu" },
            { bad: "Hesap junior'a devredilir", good: "Kurucu stratejide masada" },
          ]}
        />
      </Scene>,

      <Scene tint="violet" gap={54}>
        <Eyebrow delay={2}>Rakamlarla biz</Eyebrow>
        <div style={{ display: "flex", gap: 70 }}>
          <Metric value={<CountUp to={18} delay={14} prefix="₺" suffix="M+" />} label="Yönetilen bütçe" delay={14} size={116} />
          <Metric value={<CountUp to={4.6} delay={26} suffix="x" decimals={1} />} label="Ortalama ROAS" delay={26} size={116} />
        </div>
        <div style={{ display: "flex", gap: 70 }}>
          <Metric value={<CountUp to={320} delay={38} suffix="+" />} label="Tamamlanan kampanya" delay={38} size={116} />
          <Metric value={<CountUp to={64} delay={50} suffix="+" />} label="Mutlu müşteri" delay={50} size={116} />
        </div>
      </Scene>,

      <Scene tint="cyan" gap={44}>
        <Headline text="Tek brief, kanallar arası sıfır kayıp" highlight="sıfır" size={92} delay={4} />
        <Chips
          delay={34}
          items={["Reklam", "SEO", "Sosyal Medya", "Web", "Mobil", "SaaS", "İçerik"]}
        />
      </Scene>,

      <OutroCTA title={<>Büyüme ortağını <span style={gradientText}>doğru seç</span></>} />,
    ]}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// 2) Vaka çalışması — ROAS 2.1x → 4.8x
// ─────────────────────────────────────────────────────────────────────────────
export const ReelVakaRoas: React.FC = () => (
  <Reel
    scenes={[
      <Scene tint="violet" gap={44}>
        <Eyebrow delay={4}>Vaka Çalışması</Eyebrow>
        <Headline text="3 ayda ROAS 2.1x'ten 4.8x'e" highlight="4.8x'e" />
        <Lead>Kozmetik markası · Meta + Google</Lead>
      </Scene>,

      <Statement text="Bütçeyi artırmadık. Huniyi yeniden kurduk." highlight="Huniyi" tint="cyan" />,

      <Scene tint="mix" gap={40}>
        <Eyebrow delay={2}>Ne yaptık</Eyebrow>
        <Deliverables
          delay={14}
          items={[
            "Kreatif testini haftalık ritme bağladık",
            "Dönüşüm sinyallerini ve GA4'ü yeniden kurduk",
            "Bütçeyi kazanan huni adımlarına kaydırdık",
          ]}
        />
      </Scene>,

      <Scene tint="violet" gap={46}>
        <Eyebrow delay={2}>12 haftalık gelir</Eyebrow>
        <Bars delay={14} values={[32, 48, 71, 100]} labels={["Başlangıç", "1. ay", "2. ay", "3. ay"]} height={430} />
      </Scene>,

      <Scene tint="cyan" gap={38}>
        <Eyebrow delay={2}>Sonuç</Eyebrow>
        <BeforeAfter
          delay={14}
          rows={[
            { label: "ROAS", from: "2.1x", to: "4.8x" },
            { label: "Edinme maliyeti", from: "₺312", to: "₺148" },
            { label: "Dönüşüm oranı", from: "%1.4", to: "%3.2" },
          ]}
        />
      </Scene>,

      <OutroCTA title={<>Sıradaki vaka <span style={gradientText}>senin markan</span> olsun</>} />,
    ]}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// 3) SEO — reklam kapanınca biten trafik
// ─────────────────────────────────────────────────────────────────────────────
export const ReelSeo: React.FC = () => (
  <Reel
    scenes={[
      <Scene tint="cyan" gap={44}>
        <Eyebrow delay={4}>SEO</Eyebrow>
        <Headline text="Reklamı kapatınca trafiğin de kapanıyor mu?" highlight="kapanıyor" size={94} />
        <Lead>O zaman trafiğin yok — kiran var.</Lead>
      </Scene>,

      <Statement text="Organik trafik kirası ödenmiş tek kanaldır" highlight="ödenmiş" tint="violet" />,

      <Scene tint="cyan" gap={40}>
        <Eyebrow delay={2}>Hedef</Eyebrow>
        <SearchMock delay={12} query="dijital pazarlama ajansı" />
      </Scene>,

      <Scene tint="violet" gap={46}>
        <Eyebrow delay={2}>İlk 90 gün</Eyebrow>
        <StepFlow delay={12} steps={["Teknik", "İçerik", "Otorite"]} />
        <Lead delay={70}>Sırasız yapılan SEO yavaş görünür. Doğru sıra sonucu öne çeker.</Lead>
      </Scene>,

      <Scene tint="cyan" gap={54}>
        <Eyebrow delay={2}>90 gün sonunda tipik tablo</Eyebrow>
        <Metric value={<CountUp to={214} delay={14} suffix="%" />} label="Organik oturum artışı" delay={14} size={150} />
        <Metric value={<CountUp to={38} delay={34} suffix=" adet" />} label="İlk sayfaya giren anahtar kelime" delay={34} size={96} />
      </Scene>,

      <OutroCTA title={<>Ücretsiz <span style={gradientText}>SEO denetimi</span> isteyin</>} tint="cyan" />,
    ]}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// 4) Hizmetler — tek ekip, 8 uzmanlık
// ─────────────────────────────────────────────────────────────────────────────
export const ReelHizmetler: React.FC = () => (
  <Reel
    scenes={[
      <Scene tint="violet" gap={44}>
        <Eyebrow delay={4}>360° Dijital Ajans</Eyebrow>
        <Headline text="Bir marka, sekiz uzmanlık, tek ekip" highlight="tek" />
        <Lead>Ajans değiştirmeden büyümenin tamamı.</Lead>
      </Scene>,

      <Scene tint="mix" gap={38}>
        <Eyebrow delay={2}>Talep yaratma</Eyebrow>
        <Deliverables
          delay={12}
          items={["Reklam Yönetimi — Google, Meta, TikTok", "SEO — teknik, içerik, otorite", "Sosyal Medya — içerik ve topluluk"]}
        />
      </Scene>,

      <Scene tint="cyan" gap={38}>
        <Eyebrow delay={2}>Ürün ve teknoloji</Eyebrow>
        <Deliverables
          delay={12}
          items={["Web Tasarım & Geliştirme", "Mobil Uygulama Geliştirme", "SaaS Proje Geliştirme"]}
        />
      </Scene>,

      <Statement text="Aynı masada strateji, kreatif ve kod" highlight="kod" tint="violet" />,

      <Scene tint="violet" gap={50}>
        <Eyebrow delay={2}>Kanallar arası kayıp</Eyebrow>
        <Metric value={<CountUp to={0} from={38} delay={14} suffix="%" />} label="Tek ekip kurgusunda kayıp" delay={14} size={168} />
        <Lead delay={44}>Bir brief, bir ekip, tek raporlama.</Lead>
      </Scene>,

      <OutroCTA title={<>Hangi hizmet <span style={gradientText}>sana uygun?</span></>} />,
    ]}
  />
);

// ─────────────────────────────────────────────────────────────────────────────
// 5) Süreç — 48 saatte teklif, 90 günde sonuç
// ─────────────────────────────────────────────────────────────────────────────
export const ReelSurec: React.FC = () => (
  <Reel
    scenes={[
      <Scene tint="cyan" gap={44}>
        <Eyebrow delay={4}>Çalışma Süreci</Eyebrow>
        <Headline text="48 saatte teklif, 90 günde ölçülebilir sonuç" highlight="48" size={92} />
        <Lead>Sürpriz kampanyada olur, süreçte değil.</Lead>
      </Scene>,

      <Scene tint="violet" gap={44}>
        <Eyebrow delay={2}>Beş adım</Eyebrow>
        <StepFlow delay={10} steps={["Keşif", "Strateji", "Uygulama"]} />
        <StepFlow delay={54} start={3} steps={["Optimizasyon", "Raporlama"]} />
      </Scene>,

      <Statement text="İlk strateji görüşmesini kurucu yapar" highlight="kurucu" tint="mix" />,

      <Scene tint="cyan" gap={38}>
        <Eyebrow delay={2}>Ne alıyorsun</Eyebrow>
        <Deliverables
          delay={12}
          items={["90 günlük yol haritası", "Canlı performans dashboard'u", "Haftalık optimizasyon, aylık sunum"]}
        />
      </Scene>,

      <Scene tint="violet" gap={50}>
        <Eyebrow delay={2}>Bu ay</Eyebrow>
        <Metric value={<CountUp to={6} delay={14} />} label="Yeni proje kontenjanı" delay={14} size={176} />
        <Lead delay={40}>Ücretsiz 30 dakikalık keşif görüşmesi.</Lead>
      </Scene>,

      <OutroCTA title={<>Bir sonraki büyüme dönemini <span style={gradientText}>planlayalım</span></>} tint="cyan" />,
    ]}
  />
);

export const REELS = [
  { id: "ReelBuyumeOrtagi", comp: ReelBuyumeOrtagi, file: "reel-1-buyume-ortagi" },
  { id: "ReelVakaRoas", comp: ReelVakaRoas, file: "reel-2-vaka-roas" },
  { id: "ReelSeo", comp: ReelSeo, file: "reel-3-seo" },
  { id: "ReelHizmetler", comp: ReelHizmetler, file: "reel-4-hizmetler" },
  { id: "ReelSurec", comp: ReelSurec, file: "reel-5-surec" },
] as const;
