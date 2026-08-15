/**
 * Tek merkezi rAF döngüsü.
 *
 * Önce her bileşen (SmoothScroll, Cursor, ScrollProgress, ActOne, 4× ServiceStage,
 * GlobeCaption) kendi requestAnimationFrame'ini açıyordu: 8+ paralel döngü ve her
 * birinde getBoundingClientRect → tarayıcı her karede defalarca layout hesaplıyordu.
 * Artık tek döngü var; aboneler sırayla çağrılır.
 */

type TickFn = (time: number, dt: number) => void;

const subs = new Set<TickFn>();
let raf = 0;
let last = 0;

function loop(time: number) {
  const dt = last ? Math.min((time - last) / 1000, 1 / 20) : 1 / 60;
  last = time;
  // Kopya üzerinde gez: bir abone tick içinde kendini kaldırabilir.
  for (const fn of Array.from(subs)) fn(time, dt);
  raf = requestAnimationFrame(loop);
}

export function onTick(fn: TickFn) {
  subs.add(fn);
  if (subs.size === 1) {
    last = 0;
    raf = requestAnimationFrame(loop);
  }
  return () => {
    subs.delete(fn);
    if (subs.size === 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}
