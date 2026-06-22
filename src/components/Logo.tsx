import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";

type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
  src?: string | null;
  alt?: string;
  href?: string;
};

const imgSizeMap = {
  sm: "h-8 w-32",
  md: "h-9 w-36",
  lg: "h-12 w-48",
};

const markSize = { sm: "h-7 w-7", md: "h-8 w-8", lg: "h-10 w-10" };
const textSize = { sm: "text-base", md: "text-lg", lg: "text-xl" };
const iconSize = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };

export function Logo({
  size = "md",
  className = "",
  src = null,
  alt = "True EDigital Marketing",
  href = "/",
}: Props) {
  return (
    <Link
      href={href}
      aria-label={alt}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      {src ? (
        <span className={`relative block overflow-hidden ${imgSizeMap[size]}`}>
          <Image
            src={src}
            alt={alt}
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 144px, 192px"
            className="object-contain object-left transition-transform duration-300 group-hover:scale-105"
          />
        </span>
      ) : (
        <>
          <span
            className={`grid ${markSize[size]} shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_20px_-4px] shadow-violet-500/60 transition-transform duration-300 group-hover:scale-105`}
          >
            <Zap className={`${iconSize[size]} text-white`} strokeWidth={2.5} />
          </span>
          <span
            className={`font-display font-semibold tracking-tight text-white ${textSize[size]}`}
          >
            True{" "}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              EDigital
            </span>
          </span>
        </>
      )}
    </Link>
  );
}
