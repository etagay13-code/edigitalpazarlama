import Link from "next/link";
import {
  Sparkles,
  Globe2,
  Briefcase,
  MessageSquare,
  UsersRound,
  Settings,
  Plug,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Hızlı sayımlar — eklemeler oldukça anlamlı veriler dönecek
  const [
    { count: servicesCount },
    { count: portfolioCount },
    { count: testimonialsCount },
    { count: messagesCount },
    { count: unreadCount },
    { count: teamCount },
  ] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase
      .from("portfolio_projects")
      .select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase.from("team_members").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Hizmet", count: servicesCount ?? 0, icon: Globe2, href: "/admin/services" },
    { label: "Proje", count: portfolioCount ?? 0, icon: Briefcase, href: "/admin/portfolio" },
    { label: "Yorum", count: testimonialsCount ?? 0, icon: MessageSquare, href: "/admin/testimonials" },
    { label: "Ekip Üyesi", count: teamCount ?? 0, icon: UsersRound, href: "/admin/team" },
  ];

  const quickActions = [
    {
      title: "Site Ayarları",
      desc: "Marka adı, e-mail, telefon, logo, favicon, renkler",
      icon: Settings,
      href: "/admin/settings",
    },
    {
      title: "Entegrasyonlar",
      desc: "Google Analytics, Tag Manager, Search Console, mail",
      icon: Plug,
      href: "/admin/integrations",
    },
    {
      title: "Mesajlar",
      desc: `${unreadCount ?? 0} okunmamış iletişim formu mesajı`,
      icon: MessageSquare,
      href: "/admin/messages",
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <span className="eyebrow">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" />
          Hoş geldin
        </span>
        <h1 className="mt-5 h-display text-3xl font-semibold sm:text-4xl">
          Admin Paneli
        </h1>
        <p className="mt-2 max-w-2xl text-white/60">
          Buradan tüm site içeriğini, marka ayarlarını, entegrasyonları ve
          iletişim formundan gelen mesajları yönetebilirsin. Şu anda Faz 2 —
          shell ve auth hazır. İçerik CRUD ekranları sırayla eklenecek.
        </p>
      </header>

      {/* Sayılar */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          İçerik Durumu
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.label}
                href={s.href}
                className="card group block"
              >
                <div className="flex items-start justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/80 to-indigo-500/80">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </div>
                <p className="mt-5 font-display text-3xl font-semibold gradient-text">
                  {s.count}
                </p>
                <p className="mt-1 text-sm text-white/55">{s.label}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Hızlı Aksiyonlar */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          Hızlı Aksiyonlar
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((q) => {
            const Icon = q.icon;
            return (
              <Link key={q.href} href={q.href} className="card group block h-full">
                <div className="flex items-start justify-between">
                  <Icon className="h-5 w-5 text-violet-300" />
                  <ArrowUpRight className="h-4 w-4 text-white/25 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">
                  {q.title}
                </h3>
                <p className="mt-2 text-sm text-white/55">{q.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Yol haritası */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          Yol Haritası
        </h2>
        <div className="card">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-violet-300" />
            <span className="font-display text-lg font-semibold">
              Admin paneli adım adım gelişiyor
            </span>
          </div>
          <ul className="mt-6 space-y-3 text-sm text-white/65">
            <li className="flex items-center gap-3">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">
                ✓
              </span>
              <span>
                <strong className="text-white">Faz 1:</strong> Supabase + DB
                şeması + admin user — tamam
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">
                ✓
              </span>
              <span>
                <strong className="text-white">Faz 2:</strong> Admin shell +
                login + dashboard — şu an buradasın
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-violet-500/20 text-[10px] font-bold text-violet-200">
                3
              </span>
              <span>
                <strong className="text-white">Faz 3:</strong> Site Ayarları &
                CRUD ekranları (Hizmetler, Portfolyo, Yorumlar, vb.)
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-white/55">
                4
              </span>
              <span>
                <strong className="text-white/75">Faz 4:</strong>{" "}
                Entegrasyonlar (GA4, GTM, Search Console, Resend mail)
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-white/55">
                5
              </span>
              <span>
                <strong className="text-white/75">Faz 5:</strong> Public
                sayfalar Supabase'den okumaya geçecek
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-white/55">
                6
              </span>
              <span>
                <strong className="text-white/75">Faz 6:</strong> Vercel deploy
                + custom domain
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
