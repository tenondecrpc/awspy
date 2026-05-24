// Internal/external link wrapper. Uses `next/link` for same-origin or
// app-relative paths; renders a plain `<a>` for absolute external URLs and
// adds the safety attributes per constitution (target="_blank" + rel
// "noopener noreferrer" on external links).

import NextLink from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type LinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className"
> & {
  href: string;
  children: ReactNode;
  className?: string;
  /**
   * Opt-in: open in a new tab. Defaults to `true` for absolute external
   * URLs and `false` for relative paths.
   */
  external?: boolean;
};

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function Link({
  href,
  external,
  children,
  className,
  ...rest
}: LinkProps) {
  const isExt = external ?? isExternal(href);
  const cls = cn(
    "text-[var(--color-accent)] underline-offset-2 hover:underline",
    className
  );
  if (isExt) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <NextLink href={href} className={cls} {...rest}>
      {children}
    </NextLink>
  );
}
