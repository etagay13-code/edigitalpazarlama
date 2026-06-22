import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getAdminLocale } from "@/lib/admin/locale";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/admin/login");
  }

  // Profile bilgisi (full_name, role) — sidebar/topbar için
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", data.user.id)
    .single();

  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminTopBar
          email={profile?.email ?? data.user.email ?? ""}
          fullName={profile?.full_name ?? null}
          locale={await getAdminLocale()}
        />
        <main className="px-5 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
