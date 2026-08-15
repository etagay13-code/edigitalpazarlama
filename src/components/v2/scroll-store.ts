// Modül seviyesinde mutable scroll state.
// React state'e girmez: useFrame ve rAF döngüleri doğrudan buradan okur, böylece
// 60fps'te tek bir re-render tetiklenmez. Yazan tek yer SmoothScroll bileşeni.

export type ScrollState = {
  /** Sayfa başından itibaren px */
  y: number;
  /** Tüm doküman boyunca 0..1 */
  progress: number;
  /** Karanlık 3D aktın (hero + chapters) kendi içindeki ilerleme, 0..1 */
  act: number;
  /** Sayfa sonundaki CTA bölümünün görünürlüğü, 0..1 */
  cta: number;
  /** px/frame — hız bazlı deformasyon için */
  velocity: number;
  /** Fare pozisyonu, ekran merkezine göre -1..1 */
  pointerX: number;
  pointerY: number;
};

export const scroll: ScrollState = {
  y: 0,
  progress: 0,
  act: 0,
  cta: 0,
  velocity: 0,
  pointerX: 0,
  pointerY: 0,
};

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** [a,b] aralığını 0..1'e haritalar (aralık dışı kırpılır). */
export const range = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

/** Kare hızından bağımsız yumuşatma (lerp'in dt'ye duyarlı hali). */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));
