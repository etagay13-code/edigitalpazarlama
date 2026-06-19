import Link from "next/link";
import { Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { brand } from "@/lib/theme";
import { services } from "@/lib/services";
import { navLinks } from "@/lib/navigation";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-ink-950/80">
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-radial-fade opacity-60" />
      <div className="container-x relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <Logo size="lg" />
            <p className="max-w-xs text-sm text-white/60">{brand.description}</p>
            <div className="flex items-center gap-2">
              <a
                href={brand.socials.instagram}
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={brand.socials.linkedin}
                aria-label="LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={brand.socials.twitter}
                aria-label="Twitter / X"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={brand.socials.youtube}
                aria-label="YouTube"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Hızlı Linkler
            </h4>
            <ul className="space-y-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/70 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Hizmetler
            </h4>
            <ul className="space-y-2 text-sm">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/hizmetler/${s.slug}`}
                    className="text-white/70 transition hover:text-white"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              İletişim
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-white/40" />
                <a href={`mailto:${brand.email}`} className="hover:text-white">
                  {brand.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-white/40" />
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {brand.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-white/40" />
                {brand.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {brand.name}. Tüm hakları saklıdır.
          </p>
          <p>
            Kurucu: <span className="text-white/70">{brand.founder}</span> · İstanbul
          </p>
        </div>
      </div>
    </footer>
  );
}
