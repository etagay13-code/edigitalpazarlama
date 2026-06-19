// Admin için ortak layout: sadece arka plan/font ayarlarını sağlar.
// İçerideki (dashboard)/layout.tsx sidebar'ı ekler.
// Login sayfası bu layout'u kullanır ama sidebar görmez.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-ink-950">{children}</div>;
}
