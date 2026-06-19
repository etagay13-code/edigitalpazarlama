import Link from "next/link";
import { Lock, ArrowUpRight } from "lucide-react";
import { signIn } from "./actions";
import { Logo } from "@/components/Logo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect, error } = await searchParams;

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden p-6">
      {/* Arka plan dekorasyon */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-10 h-[36rem] w-[36rem] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute right-[-10rem] top-40 h-[30rem] w-[30rem] rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute inset-0 bg-grid-faint bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4">
          <Logo size="lg" />
          <p className="text-sm text-white/55">Admin paneline giriş</p>
        </div>

        <form action={signIn} className="card p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold">Giriş yap</h1>
              <p className="text-xs text-white/50">Sadece yetkili kullanıcılar</p>
            </div>
          </div>

          {redirect && (
            <input type="hidden" name="redirect" value={redirect} />
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error === "invalid"
                ? "E-posta veya şifre hatalı."
                : error === "missing"
                  ? "Tüm alanları doldur."
                  : decodeURIComponent(error)}
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              E-posta
            </span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="info@..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/15"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              Şifre
            </span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-500/15"
            />
          </label>

          <button
            type="submit"
            className="btn-primary mt-6 w-full justify-center"
          >
            Giriş Yap
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          Siteye dön —{" "}
          <Link href="/" className="text-white/70 hover:text-white">
            Anasayfa
          </Link>
        </p>
      </div>
    </div>
  );
}
