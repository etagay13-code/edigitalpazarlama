import Image from "next/image";
import type { Dict } from "@/i18n/dictionaries";

// Onay/ortaklık rozetleri şeridi — marka adları evrensel (proper noun),
// bu yüzden alt metinleri çevrilmez; sadece bölüm başlığı sözlükten gelir.
// Yeni rozet eklemek için: dosyayı public/badges/ altına koy + buraya bir satır ekle.
type Badge = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optik olarak eşit görünmeleri için rozet başına yükseklik. */
  size: string;
};

const BADGES: Badge[] = [
  {
    src: "/badges/google-premier-partner.png",
    alt: "Google Premier Partner",
    width: 317,
    height: 304,
    size: "h-14",
  },
  {
    src: "/badges/microsoft-advertising-select-partner.png",
    alt: "Microsoft Advertising Select Partner 2026",
    width: 600,
    height: 207,
    size: "h-9",
  },
  {
    src: "/badges/b-corp.png",
    alt: "Certified B Corporation",
    width: 237,
    height: 400,
    size: "h-14",
  },
  {
    src: "/badges/exali.png",
    alt: "exali.de — Haftpflicht gesichert",
    width: 120,
    height: 120,
    size: "h-14",
  },
];

export function TrustBadges({ dict }: { dict: Dict["trust"] }) {
  return (
    <section className="py-10">
      <div className="container-x">
        <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-white/35">
          {dict.label}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {BADGES.map((b) => (
            <span
              key={b.src}
              className="grid h-20 place-items-center rounded-2xl border border-white/[0.08] bg-white px-5 py-3 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.9)] transition hover:border-white/20"
            >
              <Image
                src={b.src}
                alt={b.alt}
                width={b.width}
                height={b.height}
                className={`${b.size} w-auto object-contain`}
                sizes="160px"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
