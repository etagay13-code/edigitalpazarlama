// Hero ve section'lar için yumuşak animasyonlu arka plan blob'ları.
// pointer-events-none -> tıklamayı engellemez. z-index düşük, içerik üstte kalır.
export function GradientBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 top-10 h-[36rem] w-[36rem] rounded-full bg-violet-600/30 blur-[120px] animate-blob-slow" />
      <div className="absolute right-[-10rem] top-40 h-[30rem] w-[30rem] rounded-full bg-cyan-500/25 blur-[120px] animate-blob-fast" />
      <div className="absolute left-1/3 top-[28rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/20 blur-[120px] animate-blob-slow" />
      <div className="absolute inset-0 bg-grid-faint bg-grid opacity-[0.6] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
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
