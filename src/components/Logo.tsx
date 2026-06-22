import Image from "next/image";
import Link from "next/link";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
  src?: string | null;
  alt?: string;
};

const sizeMap = {
  sm: "h-8 w-32",
  md: "h-9 w-36",
  lg: "h-12 w-48",
};

export function Logo({
  size = "md",
  className = "",
  src = "/logo.jpg",
  alt = "True EDigital Marketing",
}: Props) {
  return (
    <Link
      href="/"
      aria-label={alt}
      className={`group inline-flex items-center ${className}`}
    >
      <span className={`relative block overflow-hidden ${sizeMap[size]}`}>
        <Image
          src={src || "/logo.jpg"}
          alt={alt}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 144px, 192px"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          style={{ mixBlendMode: "screen" }}
        />
      </span>
    </Link>
  );
}
