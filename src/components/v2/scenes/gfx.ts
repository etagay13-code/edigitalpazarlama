import * as THREE from "three";

/**
 * Doku önbelleği.
 *
 * Bu dosyadaki dokular canvas2d ile ANLIK çiziliyor. Önbelleksizken her sahne
 * mount olurken 14 rozet + 14 hâle + 5 panel dokusu birden rasterize ediliyordu
 * ve ana iş parçacığı yarım saniyeye kadar kilitleniyordu (ölçülen en kötü
 * kare: 491ms). Aynı anahtar bir daha istendiğinde artık hazır doku dönüyor.
 */
const cache = new Map<string, THREE.Texture>();

function cached(key: string, make: () => THREE.Texture) {
  let t = cache.get(key);
  if (!t) {
    t = make();
    cache.set(key, t);
  }
  return t;
}

/** Yatay degrade doku — çizgi/şerit boyunca renk geçişi için. */
export function gradientTexture(stops: string[]) {
  return cached(`grad:${stops.join(",")}`, () => makeGradientTexture(stops));
}

function makeGradientTexture(stops: string[]) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 1;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 256, 0);
  stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 1);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/** Yumuşak dairesel parlama — partikül/glow sprite'ı. */
export function glowTexture(color = "#ffffff") {
  return cached(`glow:${color}`, () => makeGlowTexture(color));
}

function makeGlowTexture(color: string) {
  const s = 96;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, color);
  g.addColorStop(0.35, color.length === 7 ? `${color}80` : color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ */
/*  Mobil uygulama panelleri — telefonun etrafında uçuşan sahte UI      */
/*  kartları. Gerçek ekran görüntüsü yerine prosedürel çizim: her       */
/*  boyutta net, dosya yok.                                            */
/* ------------------------------------------------------------------ */

export type PanelVariant = "player" | "profile" | "list" | "search" | "chart";

export function uiPanelTexture(variant: PanelVariant, from: string, to: string) {
  return cached(`panel:${variant}:${from}:${to}`, () => makeUiPanelTexture(variant, from, to));
}

function makeUiPanelTexture(variant: PanelVariant, from: string, to: string) {
  const w = 512;
  const h = 384;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, from);
  g.addColorStop(1, to);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 44);
  ctx.fill();

  const sheen = ctx.createLinearGradient(0, 0, 0, h * 0.7);
  sheen.addColorStop(0, "rgba(255,255,255,0.28)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fill();

  const bar = (x: number, y: number, bw: number, bh: number, a = 0.9, r = bh / 2) => {
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.roundRect(x, y, bw, bh, r);
    ctx.fill();
  };
  const dot = (x: number, y: number, r: number, a = 0.95) => {
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  switch (variant) {
    case "player":
      bar(48, 52, 190, 22, 0.95);
      bar(48, 92, 120, 16, 0.6);
      bar(48, 210, 416, 10, 0.45);
      bar(48, 210, 250, 10, 1);
      dot(298, 215, 13);
      dot(150, 300, 15, 0.85);
      dot(256, 300, 26, 1);
      dot(362, 300, 15, 0.85);
      break;
    case "profile":
      dot(96, 96, 44);
      bar(160, 70, 190, 20, 0.95);
      bar(160, 104, 120, 14, 0.6);
      bar(48, 180, 416, 14, 0.5);
      bar(48, 214, 340, 14, 0.4);
      bar(48, 248, 380, 14, 0.35);
      bar(48, 300, 150, 40, 0.9, 20);
      break;
    case "list":
      for (let i = 0; i < 3; i++) {
        const y = 56 + i * 100;
        dot(84, y + 30, 28, 0.9);
        bar(132, y + 12, 220, 18, 0.9);
        bar(132, y + 42, 150, 14, 0.55);
        // yıldız yerine küçük noktalar
        for (let s = 0; s < 4; s++) dot(390 + s * 26, y + 30, 6, 0.75);
      }
      break;
    case "search":
      bar(40, 150, 432, 84, 0.95, 42);
      ctx.strokeStyle = from;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(408, 186, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(424, 202);
      ctx.lineTo(444, 222);
      ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath();
      ctx.roundRect(72, 176, 210, 20, 10);
      ctx.fill();
      break;
    case "chart": {
      bar(48, 52, 150, 18, 0.9);
      const pts = [0.2, 0.45, 0.35, 0.7, 0.6, 0.9];
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.lineWidth = 8;
      ctx.lineJoin = "round";
      ctx.beginPath();
      pts.forEach((v, i) => {
        const x = 60 + (i * (w - 120)) / (pts.length - 1);
        const y = h - 70 - v * 190;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.lineTo(w - 60, h - 60);
      ctx.lineTo(60, h - 60);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fill();
      break;
    }
  }

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/* ------------------------------------------------------------------ */
/*  Sosyal rozet dokuları — marka logosu kullanmadan, jenerik sosyal    */
/*  eylem sembolleri (kalp, oynat, sohbet, paylaş...). Canvas'a         */
/*  prosedürel çizilir: dış dosya/ağ isteği yok.                        */
/* ------------------------------------------------------------------ */

export type Glyph =
  | "heart"
  | "play"
  | "chat"
  | "camera"
  | "star"
  | "share"
  | "note"
  | "hash"
  | "check"
  | "bolt";

function drawGlyph(ctx: CanvasRenderingContext2D, glyph: Glyph, s: number) {
  const u = s / 24; // 24'lük ızgaradan piksele
  ctx.save();
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "#fff";
  ctx.lineWidth = 2.1 * u;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const P = (x: number, y: number) => [x * u, y * u] as const;

  switch (glyph) {
    case "heart": {
      ctx.beginPath();
      ctx.moveTo(...P(12, 20));
      ctx.bezierCurveTo(...P(2, 13), ...P(3.5, 5), ...P(8.5, 5.6));
      ctx.bezierCurveTo(...P(10.5, 5.9), ...P(11.6, 7.2), ...P(12, 8.4));
      ctx.bezierCurveTo(...P(12.4, 7.2), ...P(13.5, 5.9), ...P(15.5, 5.6));
      ctx.bezierCurveTo(...P(20.5, 5), ...P(22, 13), ...P(12, 20));
      ctx.fill();
      break;
    }
    case "play": {
      ctx.beginPath();
      ctx.moveTo(...P(9, 6));
      ctx.lineTo(...P(18, 12));
      ctx.lineTo(...P(9, 18));
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "chat": {
      ctx.beginPath();
      ctx.roundRect(4 * u, 5 * u, 16 * u, 11 * u, 3.5 * u);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(...P(9, 16));
      ctx.lineTo(...P(9, 20));
      ctx.lineTo(...P(13, 16));
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "camera": {
      ctx.beginPath();
      ctx.roundRect(3.5 * u, 4 * u, 17 * u, 16 * u, 4.5 * u);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(12 * u, 12 * u, 4 * u, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(17 * u, 7 * u, 1.1 * u, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "star": {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 8.5 : 3.6;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const x = 12 + Math.cos(a) * r;
        const y = 12 + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(...P(x, y)) : ctx.lineTo(...P(x, y));
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "share": {
      ctx.beginPath();
      ctx.arc(17 * u, 6 * u, 2.6 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(7 * u, 12 * u, 2.6 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(17 * u, 18 * u, 2.6 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(...P(9.3, 10.8));
      ctx.lineTo(...P(14.7, 7.2));
      ctx.moveTo(...P(9.3, 13.2));
      ctx.lineTo(...P(14.7, 16.8));
      ctx.stroke();
      break;
    }
    case "note": {
      ctx.beginPath();
      ctx.moveTo(...P(10, 17));
      ctx.lineTo(...P(10, 6));
      ctx.lineTo(...P(18, 4.5));
      ctx.lineTo(...P(18, 15));
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(8 * u, 17.5 * u, 2.6 * u, 2.1 * u, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(16 * u, 15.5 * u, 2.6 * u, 2.1 * u, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "hash": {
      ctx.beginPath();
      ctx.moveTo(...P(9.5, 4));
      ctx.lineTo(...P(7.5, 20));
      ctx.moveTo(...P(16.5, 4));
      ctx.lineTo(...P(14.5, 20));
      ctx.moveTo(...P(4.5, 9));
      ctx.lineTo(...P(19.5, 9));
      ctx.moveTo(...P(4, 15));
      ctx.lineTo(...P(19, 15));
      ctx.stroke();
      break;
    }
    case "check": {
      ctx.beginPath();
      ctx.moveTo(...P(5, 12.5));
      ctx.lineTo(...P(10, 17.5));
      ctx.lineTo(...P(19, 7));
      ctx.stroke();
      break;
    }
    case "bolt": {
      ctx.beginPath();
      ctx.moveTo(...P(13.5, 3));
      ctx.lineTo(...P(6, 13.5));
      ctx.lineTo(...P(11, 13.5));
      ctx.lineTo(...P(10.5, 21));
      ctx.lineTo(...P(18, 10.5));
      ctx.lineTo(...P(13, 10.5));
      ctx.closePath();
      ctx.fill();
      break;
    }
  }
  ctx.restore();
}

/** Yuvarlak köşeli, degradeli rozet + beyaz sembol. */
export function badgeTexture(glyph: Glyph, from: string, to: string, round = false) {
  return cached(`badge:${glyph}:${from}:${to}:${round}`, () =>
    makeBadgeTexture(glyph, from, to, round),
  );
}

function makeBadgeTexture(glyph: Glyph, from: string, to: string, round: boolean) {
  // 256 → 160: ekranda hiçbiri 160px'i geçmiyor, rasterize maliyeti %60 düşüyor.
  const s = 160;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;

  const g = ctx.createLinearGradient(0, 0, s, s);
  g.addColorStop(0, from);
  g.addColorStop(1, to);
  ctx.fillStyle = g;
  ctx.beginPath();
  if (round) ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
  else ctx.roundRect(0, 0, s, s, s * 0.28);
  ctx.fill();

  // Üstten gelen ışığı taklit eden ince parlaklık
  const sheen = ctx.createLinearGradient(0, 0, 0, s * 0.6);
  sheen.addColorStop(0, "rgba(255,255,255,0.35)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fill();

  const gs = s * 0.52;
  ctx.translate((s - gs) / 2, (s - gs) / 2);
  drawGlyph(ctx, glyph, gs);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
