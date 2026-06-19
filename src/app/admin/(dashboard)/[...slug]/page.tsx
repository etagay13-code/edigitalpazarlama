import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { flatAdminNav } from "@/lib/admin/nav";

export default async function ComingSoonPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = "/admin/" + slug.join("/");
  const nav = flatAdminNav.find((n) => n.href === path);

  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-glow">
        <Construction className="h-7 w-7 text-white" />
      </div>
      <h1 className="mt-6 h-display text-3xl font-semibold">
        {nav?.label ?? "Yakında"}
      </h1>
      <p className="mt-3 text-white/60">
        {nav?.description ??
          "Bu bölüm henüz hazır değil."}{" "}
        Faz 3'te bu bölümün CRUD ekranları gelecek.
      </p>

      <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-200">
        Yapım aşamasında
      </div>

      <div className="mt-12">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard'a dön
        </Link>
      </div>
    </div>
  );
}
