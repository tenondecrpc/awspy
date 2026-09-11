"use client";

// Active-aware navigation link. Becomes the SiteHeader's primary nav and is
// reused inside the mobile drawer. The active state is announced to AT via
// `aria-current` and reinforced visually with an underline (no color-only
// state per constitution Principle VI).

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { cn } from "@/lib/utils/cn";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Closes the mobile drawer on tap. */
  onNavigate?: () => void;
};

export function NavLink({
  href,
  children,
  className,
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname() ?? "/";
  // The home link only matches the exact root; everything else matches its
  // own segment plus deeper paths under it.
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <NextLink
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "inline-flex items-center whitespace-nowrap px-2.5 py-1.5 text-[13.5px] font-medium",
        "border-b-2 border-transparent text-[var(--color-text-secondary)]",
        "hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]",
        // Active: bold + navy + navy underline (never color alone).
        isActive &&
          "border-[var(--color-text-primary)] font-bold text-[var(--color-text-primary)]",
        className
      )}
    >
      {children}
    </NextLink>
  );
}
