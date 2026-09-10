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
        "inline-flex items-center whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium",
        "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)]",
        // Active state: bold weight + underline, never color alone.
        isActive &&
          "font-bold underline decoration-[var(--color-accent)] decoration-2 underline-offset-4",
        className
      )}
    >
      {children}
    </NextLink>
  );
}
