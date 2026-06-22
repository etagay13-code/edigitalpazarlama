import { BadgeCheck, Award, ShieldCheck, Trophy } from "lucide-react";
import type { Dict } from "@/i18n/dictionaries";

// Onay/ortaklık rozetleri şeridi — marka adları evrensel (proper noun).
const BADGES = [
  { icon: BadgeCheck, label: "Google Premier Partner" },
  { icon: ShieldCheck, label: "Meta Business Partner" },
  { icon: Trophy, label: "Clutch Top B2B" },
  { icon: Award, label: "Awwwards Honorable Mention" },
];

export function TrustBadges({ dict }: { dict: Dict["trust"] }) {
  return (
    <section className="py-8">
      <div className="container-x">
        <p className="mb-5 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-white/35">
          {dict.label}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <span
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-sm text-white/70"
              >
                <Icon className="h-4 w-4 text-violet-300" />
                {b.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
