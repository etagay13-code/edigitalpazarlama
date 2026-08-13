// Hero ve section'lar için yumuşak animasyonlu arka plan blob'ları.
// pointer-events-none -> tıklamayı engellemez. z-index düşük, içerik üstte kalır.
export function GradientBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* tek odak, sakin parlama — mobilde daha hafif blur (GPU maliyeti) */}
      <div className="absolute left-1/2 -top-40 h-[34rem] w-[44rem] -translate-x-1/2 rounded-full bg-violet-600/16 blur-[80px] sm:blur-[130px]" />
      <div className="absolute right-[-8rem] top-52 hidden h-[24rem] w-[24rem] rounded-full bg-cyan-500/[0.08] blur-[130px] sm:block" />
      {/* sıcak amber karşı-ton: koyu paleti dengeler */}
      <div className="absolute left-[-6rem] top-72 hidden h-[20rem] w-[20rem] rounded-full bg-amber-400/[0.07] blur-[120px] sm:block" />
      {/* üstten ince beyaz ışık huzmesi */}
      <div className="absolute inset-x-0 -top-24 h-64 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)]" />
      <div className="absolute inset-0 bg-grid-faint bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_65%)]" />
    </div>
  );
}

export function SubtleGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 bg-grid-faint bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
    />
  );
}
