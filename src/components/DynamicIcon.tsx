import {
  Award,
  BarChart3,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Coffee,
  Compass,
  Crosshair,
  Eye,
  Gauge,
  Globe,
  HeartHandshake,
  Layers,
  Lightbulb,
  Lock,
  MessageCircle,
  MessageSquare,
  Quote,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  BarChart3,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Coffee,
  Compass,
  Crosshair,
  Eye,
  Gauge,
  Globe,
  HeartHandshake,
  Layers,
  Lightbulb,
  Lock,
  MessageCircle,
  MessageSquare,
  Quote,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wrench,
  Zap,
};

export function DynamicIcon({
  name,
  className,
  fallback,
}: {
  name?: string | null;
  className?: string;
  fallback?: LucideIcon;
}) {
  const Icon = (name && ICON_MAP[name]) || fallback;
  if (!Icon) return null;
  return <Icon className={className} />;
}
