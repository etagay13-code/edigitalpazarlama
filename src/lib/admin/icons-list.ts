// Admin'de icon picker için kullanılabilir lucide ikon listesi.
// Yeni ikon eklemek istersen burayı genişlet.
import type { LucideIcon } from "lucide-react";
import {
  Globe2,
  Megaphone,
  Search,
  Smartphone,
  Layers,
  Share2,
  Code2,
  PenTool,
  Sparkles,
  Target,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Gauge,
  Users,
  Lightbulb,
  Award,
  Trophy,
  Briefcase,
  Coffee,
  Compass,
  Map,
  Rocket,
  LineChart,
  FileText,
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Settings,
  Plug,
  BarChart3,
  Wrench,
  Zap,
  Crosshair,
  Lock,
  TrendingUp,
  MessageCircle,
  MessageSquare,
  Bell,
  Calendar,
  Database,
  Cloud,
  Cpu,
  Box,
} from "lucide-react";

export const iconOptions: Record<string, LucideIcon> = {
  Globe2, Megaphone, Search, Smartphone, Layers, Share2, Code2, PenTool,
  Sparkles, Target, Eye, HeartHandshake, ShieldCheck, Gauge, Users, Lightbulb,
  Award, Trophy, Briefcase, Coffee, Compass, Map, Rocket, LineChart, FileText,
  Mail, Phone, MapPin, Clock, Instagram, Linkedin, Twitter, Youtube, Settings,
  Plug, BarChart3, Wrench, Zap, Crosshair, Lock, TrendingUp, MessageCircle,
  MessageSquare, Bell, Calendar, Database, Cloud, Cpu, Box,
};

export const iconNames = Object.keys(iconOptions).sort();

export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Sparkles;
  return iconOptions[name] ?? Sparkles;
}

export const gradientOptions = [
  { label: "Violet → Indigo", value: "from-violet-500 to-indigo-500" },
  { label: "Pink → Rose", value: "from-pink-500 to-rose-500" },
  { label: "Emerald → Cyan", value: "from-emerald-500 to-cyan-500" },
  { label: "Cyan → Blue", value: "from-cyan-500 to-blue-500" },
  { label: "Indigo → Violet", value: "from-indigo-500 to-violet-500" },
  { label: "Fuchsia → Pink", value: "from-fuchsia-500 to-pink-500" },
  { label: "Amber → Orange", value: "from-amber-500 to-orange-500" },
  { label: "Rose → Amber", value: "from-rose-500 to-amber-500" },
  { label: "Lime → Emerald", value: "from-lime-500 to-emerald-500" },
  { label: "Sky → Cyan", value: "from-sky-500 to-cyan-500" },
  { label: "Purple → Pink", value: "from-purple-500 to-pink-500" },
  { label: "Teal → Blue", value: "from-teal-500 to-blue-500" },
];
