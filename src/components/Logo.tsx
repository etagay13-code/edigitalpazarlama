import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/theme";

// Logo bileşeni.
// Logo görseli /public/logo.jpg üzerinden gelir; logoda zaten "E - DIGITAL MARKETING"
// wordmark içerdiği için ayrı bir metin göstermiyoruz.
// Siyah arka planın koyu temayla kusursuz harmanlanması için mix-blend-mode: screen kullanıyoruz.
type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "h-8 w-32",
  md: "h-9 w-36",
  lg: "h-12 w-48",
};

export function Logo({ size = "md", className = "" }: Props) {
  return (
    <Link
      href="/"
      aria-label={brand.name}
      className={`group inline-flex items-center ${className}`}
    >
      <span
        className={`relative block overflow-hidden ${sizeMap[size]}`}
      >
        <Image
          src="/logo.jpg"
          alt={brand.name}
          fill
          priority
          sizes="(max-width: 768px) 144px, 192px"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          style={{ mixBlendMode: "screen" }}
        />
      </span>
    </Link>
  );
}
