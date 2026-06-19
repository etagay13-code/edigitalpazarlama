import {
  Award,
  Briefcase,
  Coffee,
  Eye,
  Gauge,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  Briefcase,
  Coffee,
  Eye,
  Gauge,
  HeartHandshake,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
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
