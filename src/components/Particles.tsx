// Site geneli "baloncuk" katmanı — beyaz ve amber tonlarında küçük ışık noktaları.
// Kurallar: içeriğin ARKASINDA kalır (-z-10), tıklamayı engellemez, metin okunurluğunu
// bozmaz (düşük opaklık + küçük boyut) ve konumlar metin kolonunun ortasından uzak tutulur. Konumlar sabit dizi — Math.random yok ki
// sunucu/istemci render'ı birebir aynı olsun (hidrasyon uyuşmazlığı olmasın).
type Bubble = {
  /** yatay konum (%) */ x: number;
  /** dikey başlangıç (%) */ y: number;
  /** px cinsinden çap */ s: number;
  /** saniye cinsinden süre */ d: number;
  /** saniye cinsinden gecikme */ delay: number;
  tone: "white" | "amber";
};

const BUBBLES: Bubble[] = [
  { x: 6, y: 18, s: 6, d: 26, delay: 0, tone: "white" },
  { x: 14, y: 72, s: 4, d: 34, delay: 3, tone: "amber" },
  { x: 22, y: 40, s: 3, d: 30, delay: 8, tone: "white" },
  { x: 31, y: 88, s: 7, d: 38, delay: 1, tone: "amber" },
  { x: 29, y: 12, s: 4, d: 28, delay: 6, tone: "white" },
  { x: 24, y: 62, s: 3, d: 33, delay: 11, tone: "white" },
  { x: 78, y: 26, s: 5, d: 36, delay: 4, tone: "amber" },
  { x: 61, y: 80, s: 4, d: 29, delay: 9, tone: "white" },
  { x: 69, y: 46, s: 6, d: 40, delay: 2, tone: "amber" },
  { x: 76, y: 16, s: 3, d: 31, delay: 13, tone: "white" },
  { x: 83, y: 68, s: 5, d: 35, delay: 5, tone: "white" },
  { x: 90, y: 34, s: 4, d: 27, delay: 10, tone: "amber" },
  { x: 96, y: 84, s: 3, d: 37, delay: 7, tone: "white" },
  { x: 2, y: 52, s: 4, d: 32, delay: 15, tone: "amber" },
  { x: 17, y: 96, s: 3, d: 30, delay: 12, tone: "white" },
  { x: 65, y: 6, s: 3, d: 34, delay: 14, tone: "white" },
  { x: 10, y: 34, s: 8, d: 42, delay: 2, tone: "amber" },
  { x: 27, y: 60, s: 5, d: 33, delay: 16, tone: "white" },
  { x: 25, y: 30, s: 3, d: 29, delay: 19, tone: "amber" },
  { x: 85, y: 8, s: 6, d: 39, delay: 5, tone: "white" },
  { x: 74, y: 52, s: 4, d: 31, delay: 17, tone: "white" },
  { x: 72, y: 90, s: 7, d: 44, delay: 3, tone: "amber" },
  { x: 80, y: 42, s: 3, d: 28, delay: 20, tone: "white" },
  { x: 88, y: 12, s: 5, d: 36, delay: 8, tone: "white" },
  { x: 94, y: 58, s: 6, d: 41, delay: 12, tone: "amber" },
  { x: 18, y: 6, s: 4, d: 30, delay: 21, tone: "white" },
];

const TONE = {
  white: {
    background: "rgba(255,255,255,0.8)",
    boxShadow: "0 0 16px 4px rgba(255,255,255,0.22)",
  },
  amber: {
    background: "rgba(251,191,36,0.9)",
    boxShadow: "0 0 18px 5px rgba(245,158,11,0.28)",
  },
} as const;

export function Particles() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble absolute rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.s,
            height: b.s,
            animationDuration: `${b.d}s`,
            animationDelay: `-${b.delay}s`,
            ...TONE[b.tone],
          }}
        />
      ))}
    </div>
  );
}
