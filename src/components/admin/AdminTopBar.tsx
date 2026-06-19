import { LogOut, User } from "lucide-react";

export function AdminTopBar({
  email,
  fullName,
}: {
  email: string;
  fullName: string | null;
}) {
  const initials = (fullName || email)
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink-900/70 backdrop-blur-xl">
      <div className="flex items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-semibold text-white shadow-glow">
            {initials || <User className="h-4 w-4" />}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-white">
              {fullName ?? "Admin"}
            </p>
            <p className="text-xs text-white/45">{email}</p>
          </div>
        </div>

        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-white/75 transition hover:bg-rose-500/15 hover:text-rose-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            Çıkış
          </button>
        </form>
      </div>
    </header>
  );
}
