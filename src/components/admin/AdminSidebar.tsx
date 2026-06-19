"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { adminNav } from "@/lib/admin/nav";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.06] bg-ink-900/60 backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <Logo size="md" />
          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-300">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {adminNav.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                          active
                            ? "bg-violet-500/15 text-white"
                            : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 transition ${
                            active
                              ? "text-violet-300"
                              : "text-white/45 group-hover:text-white/70"
                          }`}
                        />
                        <span className="flex-1">{item.label}</span>
                        {!item.ready && (
                          <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300/80">
                            soon
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <Link
            href="/"
            target="_blank"
            className="block rounded-xl px-3 py-2 text-xs text-white/55 transition hover:bg-white/[0.04] hover:text-white"
          >
            ↗ Siteyi yeni sekmede aç
          </Link>
        </div>
      </div>
    </aside>
  );
}
