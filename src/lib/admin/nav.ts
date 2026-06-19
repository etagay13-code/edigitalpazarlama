import type { LucideIcon } from "lucide-react";
import {
  Gauge,
  Settings,
  FileText,
  Globe2,
  Briefcase,
  MessageSquare,
  UsersRound,
  Clock,
  Building2,
  Wrench,
  HelpCircle,
  Mail,
  Plug,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  ready?: boolean;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const adminNav: AdminNavGroup[] = [
  {
    title: "Genel",
    items: [
      { href: "/admin", label: "Dashboard", icon: Gauge, description: "Özet ve hızlı erişim", ready: true },
      { href: "/admin/messages", label: "Mesajlar", icon: Mail, description: "İletişim formundan gelen mesajlar", ready: true },
    ],
  },
  {
    title: "İçerik",
    items: [
      { href: "/admin/pages", label: "Sayfa İçerikleri", icon: FileText, description: "Hero, başlıklar, açıklamalar", ready: true },
      { href: "/admin/services", label: "Hizmetler", icon: Globe2, description: "8 hizmet ve alt detayları", ready: true },
      { href: "/admin/portfolio", label: "Portfolyo", icon: Briefcase, description: "Proje vakaları", ready: true },
      { href: "/admin/testimonials", label: "Yorumlar", icon: MessageSquare, description: "Müşteri referansları", ready: true },
      { href: "/admin/team", label: "Ekip", icon: UsersRound, description: "Ekip üyeleri", ready: true },
      { href: "/admin/timeline", label: "Zaman Çizelgesi", icon: Clock, description: "Hakkımızda timeline", ready: true },
      { href: "/admin/industries", label: "Sektörler", icon: Building2, description: "Çalıştığımız sektörler", ready: true },
      { href: "/admin/tech", label: "Tech Stack", icon: Wrench, description: "Kullanılan araçlar", ready: true },
      { href: "/admin/faqs", label: "SSS", icon: HelpCircle, description: "Sık sorulan sorular", ready: true },
    ],
  },
  {
    title: "Sistem",
    items: [
      { href: "/admin/settings", label: "Site Ayarları", icon: Settings, description: "Marka, logo, renkler, sosyal medya", ready: true },
      { href: "/admin/integrations", label: "Entegrasyonlar", icon: Plug, description: "GA4, GTM, Search Console, mail", ready: true },
    ],
  },
];

export const flatAdminNav = adminNav.flatMap((g) => g.items);
