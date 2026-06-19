import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  withArrow?: boolean;
};

type AsLinkProps = CommonProps & {
  href: string;
  type?: never;
  onClick?: never;
};

type AsButtonProps = CommonProps & {
  href?: never;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button(props: AsLinkProps | AsButtonProps) {
  const { children, variant = "primary", className = "", withArrow = false } = props;
  const cls = `${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={cls}>
        {children}
        {withArrow && <ArrowUpRight className="h-4 w-4" />}
      </Link>
    );
  }

  return (
    <button
      type={(props as AsButtonProps).type ?? "button"}
      onClick={(props as AsButtonProps).onClick}
      disabled={(props as AsButtonProps).disabled}
      className={`${cls} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {children}
      {withArrow && <ArrowUpRight className="h-4 w-4" />}
    </button>
  );
}
