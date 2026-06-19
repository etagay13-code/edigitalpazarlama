import Link from "next/link";
import { Plus, ArrowUpRight, EyeOff } from "lucide-react";
import { listServices } from "@/lib/data/services";
import { getIcon } from "@/lib/admin/icons-list";

export const metadata = { title: "Hizmetler" };

export default async function ServicesListPage() {
  const services = await listServices();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Hizmetler</h1>
          <p className="text-sm text-white/55">
            8 hizmet — başlık, açıklama, süreç adımları, FAQ'lar düzenlenebilir
          </p>
        </div>
        <Link href="/admin/services/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          Yeni Hizmet
        </Link>
      </header>

      <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.02] text-xs uppercase tracking-[0.16em] text-white/45">
            <tr>
              <th className="px-5 py-3 text-left">Hizmet</th>
              <th className="px-5 py-3 text-left">Slug</th>
              <th className="px-5 py-3 text-left">Sıra</th>
              <th className="px-5 py-3 text-left">Durum</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {services.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <tr
                  key={s.id}
                  className="group transition hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/services/${s.id}`}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${s.accent}`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-violet-200">
                          {s.title}
                        </p>
                        <p className="mt-0.5 text-xs text-white/45">
                          {s.short}
                        </p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-white/55">
                    {s.slug}
                  </td>
                  <td className="px-5 py-4 text-white/55">{s.sort_order}</td>
                  <td className="px-5 py-4">
                    {s.active ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200">
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/55">
                        <EyeOff className="h-3 w-3" />
                        Pasif
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/services/${s.id}`}
                      className="inline-flex items-center gap-1 text-xs text-white/55 transition group-hover:text-white"
                    >
                      Düzenle
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {services.length === 0 && (
        <p className="py-12 text-center text-white/45">
          Henüz hizmet yok. "Yeni Hizmet" ile başla.
        </p>
      )}
    </div>
  );
}
