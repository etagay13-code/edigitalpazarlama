"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "./Logo";
import { navLinks } from "@/lib/navigation";
import { getIcon } from "@/lib/admin/icons-list";
import { localizeHref } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavService = {
  slug: string;
  title: string;
  short: string;
  icon: string;
  accent: string;
};

export function Navbar({
  services,
  logoUrl,
  brandName,
  locale,
  dict,
}: {
  services: NavService[];
  logoUrl: string | null;
  brandName: string;
  locale: Locale;
  dict: Dict["nav"];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const href = (internal: string) => localizeHref(locale, internal);
  const servicesHref = href("/hizmetler");
  const contactHref = href("/iletisim");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openServicesDelayed = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const closeServicesDelayed = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 140);
  };

  const isOnServices =
    pathname === servicesHref || pathname.startsWith(servicesHref + "/");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container-x">
        <nav
          className={`flex items-center justify-between rounded-2xl border transition-all duration-500 ${
            scrolled
              ? "border-white/10 bg-ink-900/90 px-4 py-2 shadow-card backdrop-blur-md"
              : "border-transparent px-4 py-3"
          }`}
        >
          <Logo src={logoUrl} alt={brandName} href={href("/")} />

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const linkHref = href(link.internal);
              const isServices = link.key === "services";
              const active = isServices ? isOnServices : pathname === linkHref;
              const label = dict[link.key];

              if (isServices) {
                return (
                  <li
                    key={link.key}
                    className="relative"
                    onMouseEnter={openServicesDelayed}
                    onMouseLeave={closeServicesDelayed}
                  >
                    <Link
                      href={linkHref}
                      aria-haspopup="true"
                      aria-expanded={servicesOpen}
                      className={`relative inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                        active ? "text-white" : "text-white/70 hover:text-white"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="navactive"
                          className="absolute inset-0 -z-10 rounded-full bg-white/10"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      {label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${
                          servicesOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Link>

                    <AnimatePresence>
                      {servicesOpen && services.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2"
                        >
                          <div className="w-[720px] overflow-hidden rounded-2xl border border-white/10 bg-ink-900/95 shadow-card backdrop-blur-2xl">
                            <div className="grid grid-cols-2 gap-1 p-3">
                              {services.map((s) => {
                                const Icon: LucideIcon = getIcon(s.icon) ?? Sparkles;
                                return (
                                  <Link
                                    key={s.slug}
                                    href={href(`/hizmetler/${s.slug}`)}
                                    onClick={() => setServicesOpen(false)}
                                    className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[0.05]"
                                  >
                                    <span className="icon-chip h-10 w-10 shrink-0">
                                      <Icon className="h-5 w-5 text-violet-300" />
                                    </span>
                                    <span className="flex-1">
                                      <span className="block font-medium text-white">
                                        {s.title}
                                      </span>
                                      <span className="mt-0.5 block text-xs leading-relaxed text-white/55">
                                        {s.short}
                                      </span>
                                    </span>
                                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80" />
                                  </Link>
                                );
                              })}
                            </div>
                            <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] bg-white/[0.02] px-5 py-3.5">
                              <span className="text-xs text-white/55">
                                {dict.servicesHint}
                              </span>
                              <div className="flex gap-2">
                                <Link
                                  href={servicesHref}
                                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/[0.08] hover:text-white"
                                  onClick={() => setServicesOpen(false)}
                                >
                                  {dict.allServices}
                                </Link>
                                <Link
                                  href={contactHref}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/90 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-500"
                                  onClick={() => setServicesOpen(false)}
                                >
                                  {dict.getQuote}
                                  <ArrowUpRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              return (
                <li key={link.key}>
                  <Link
                    href={linkHref}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                      active ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="navactive"
                        className="absolute inset-0 -z-10 rounded-full bg-white/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <LanguageSwitcher locale={locale} />
            <Link href={contactHref} className="btn-primary hidden sm:inline-flex">
              {dict.getQuote}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              aria-label={open ? dict.menuClose : dict.menuOpen}
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/90 lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="container-x lg:hidden"
          >
            <div className="mt-2 rounded-2xl border border-white/10 bg-ink-900/95 p-3 shadow-card backdrop-blur-2xl">
              <ul className="flex flex-col">
                {navLinks.map((link) => {
                  const linkHref = href(link.internal);
                  const isServices = link.key === "services";
                  const active = isServices ? isOnServices : pathname === linkHref;
                  const label = dict[link.key];

                  if (isServices) {
                    return (
                      <li key={link.key}>
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen((v) => !v)}
                          aria-expanded={mobileServicesOpen}
                          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                            active
                              ? "bg-white/10 text-white"
                              : "text-white/75 hover:bg-white/[0.05] hover:text-white"
                          }`}
                        >
                          {label}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              mobileServicesOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <ul className="mt-1 space-y-1 border-l border-white/[0.08] pl-3">
                                {services.map((s) => {
                                  const Icon: LucideIcon = getIcon(s.icon) ?? Sparkles;
                                  return (
                                    <li key={s.slug}>
                                      <Link
                                        href={href(`/hizmetler/${s.slug}`)}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition hover:bg-white/[0.05] hover:text-white"
                                      >
                                        <span className="icon-chip h-8 w-8 shrink-0">
                                          <Icon className="h-4 w-4 text-violet-300" />
                                        </span>
                                        {s.title}
                                      </Link>
                                    </li>
                                  );
                                })}
                                <li>
                                  <Link
                                    href={servicesHref}
                                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-violet-200 transition hover:bg-white/[0.05]"
                                  >
                                    {dict.allServices}
                                    <ArrowUpRight className="h-4 w-4" />
                                  </Link>
                                </li>
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  }

                  return (
                    <li key={link.key}>
                      <Link
                        href={linkHref}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/75 hover:bg-white/[0.05] hover:text-white"
                        }`}
                      >
                        {label}
                        <ArrowUpRight className="h-4 w-4 opacity-50" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link href={contactHref} className="btn-primary mt-2 w-full justify-center">
                {dict.getQuote}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <LanguageSwitcher locale={locale} variant="menu" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
