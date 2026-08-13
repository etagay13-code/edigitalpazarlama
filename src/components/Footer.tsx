import Link from "next/link";
import { Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { getBrand } from "@/lib/theme";
import { listServicesPublic } from "@/lib/data";
import { navLinks } from "@/lib/navigation";
import { localizeHref } from "@/i18n/routes";
import { getDict } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export async function Footer({ locale }: { locale: Locale }) {
  const [brand, services] = await Promise.all([
    getBrand(locale),
    listServicesPublic(locale),
  ]);
  const t = getDict(locale);
  const href = (internal: string) => localizeHref(locale, internal);

  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-ink-950/80">
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-radial-fade opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(45%_60%_at_70%_0%,rgba(251,191,36,0.10),transparent_70%)]" />
      <div className="container-x relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <Logo size="lg" src={brand.logoUrl} alt={brand.name} href={href("/")} />
            <p className="max-w-xs text-sm text-white/60">{brand.description}</p>
            <div className="flex items-center gap-2">
              {brand.socials.instagram && (
                <a
                  href={brand.socials.instagram}
                  aria-label="Instagram"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {brand.socials.linkedin && (
                <a
                  href={brand.socials.linkedin}
                  aria-label="LinkedIn"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {brand.socials.twitter && (
                <a
                  href={brand.socials.twitter}
                  aria-label="Twitter / X"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {brand.socials.youtube && (
                <a
                  href={brand.socials.youtube}
                  aria-label="YouTube"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.key}>
                  <Link href={href(l.internal)} className="text-white/70 transition hover:text-white">
                    {t.nav[l.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              {t.footer.services}
            </h4>
            <ul className="space-y-2 text-sm">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={href(`/hizmetler/${s.slug}`)}
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
              {t.footer.contact}
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-white/40" />
                <a href={`mailto:${brand.email}`} className="hover:text-white">
                  {brand.email}
                </a>
              </li>
              {brand.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-white/40" />
                  <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="hover:text-white">
                    {brand.phone}
                  </a>
                </li>
              )}
              {brand.address && (
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-white/40" />
                  {brand.address}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {brand.name}. {t.footer.rights}
          </p>
          <p>
            {t.footer.founder}: <span className="text-white/70">{brand.founder}</span> ·{" "}
            {t.footer.city}
          </p>
        </div>
      </div>
    </footer>
  );
}
