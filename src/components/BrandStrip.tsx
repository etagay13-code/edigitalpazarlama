import type { Dict } from "@/i18n/dictionaries";

// Hero altındaki "güven bandı" — marka isimleri (DB'den veya fallback).
// Başlık DB'de yoksa sözlükten gelir (dil karışmasın diye hardcode yok).
const DEFAULT_BRANDS = [
  "LUMEN",
  "TESSERA",
  "NORDEL",
  "VOLTRA",
  "VERA MODA",
  "GREENLY",
  "KAVROS",
  "ALTAN CLINIC",
];

export function BrandStrip({
  label,
  brands,
  dict,
}: {
  label?: string | null;
  brands?: string[] | null;
  dict: Dict["brandStrip"];
}) {
  const list = brands && brands.length > 0 ? brands : DEFAULT_BRANDS;
  const heading = label && label.trim() ? label : dict.label;

  return (
    <section className="relative border-y border-white/[0.05] bg-ink-900/50 py-10">
      <div className="container-x">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.32em] text-white/40">
          {heading}
        </p>
        <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-14 whitespace-nowrap">
            {[...list, ...list].map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="font-display text-2xl font-semibold tracking-[0.18em] text-white/30 transition group-hover:text-white/40"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
