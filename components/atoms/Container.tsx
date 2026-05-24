// Page-level horizontal container. Centers content and applies the standard
// gutter so every page lines up vertically across the site.

import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** Defaults to `<div>`; pass `<main>` or `<section>` for semantics. */
  as?: ElementType;
};

export function Container({
  children,
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-[var(--container-padding)]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
