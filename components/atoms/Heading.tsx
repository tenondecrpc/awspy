// Type-safe heading primitive. The visible level (size) is decoupled from
// the semantic level (h1..h6) so a page can have a single h1 even when the
// design calls for multiple visually-large titles.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = {
  children: ReactNode;
  /** Semantic level used for the rendered HTML tag. */
  level: HeadingLevel;
  /** Visual size. Defaults to the value of `level`. */
  visualLevel?: HeadingLevel;
  className?: string;
  id?: string;
  /**
   * When true, render a Paraguayan-red accent bar before the heading text
   * to reinforce visual rhythm. Defaults to false (backwards compatible).
   */
  accent?: boolean;
};

// Display scale. Levels 1 and 2 carry the extra step at `lg` that gives the
// section titles the same presence they have across the AWS Community Day
// family; the tighter leading keeps two-line titles from drifting apart.
const VISUAL_CLASS: Record<HeadingLevel, string> = {
  1: "text-4xl leading-[1.08] sm:text-5xl lg:text-6xl font-bold tracking-tight",
  2: "text-3xl leading-[1.1] sm:text-4xl lg:text-5xl font-bold tracking-tight",
  3: "text-2xl sm:text-3xl font-semibold tracking-tight",
  4: "text-xl sm:text-2xl font-semibold",
  5: "text-lg font-semibold",
  6: "text-base font-semibold",
};

export function Heading({
  children,
  level,
  visualLevel,
  className,
  id,
  accent = false,
}: HeadingProps) {
  const Tag = `h${level}` as `h${HeadingLevel}`;
  const visual = visualLevel ?? level;
  return (
    <Tag id={id} className={cn(VISUAL_CLASS[visual], className)}>
      {accent ? (
        <span
          aria-hidden="true"
          className="mr-3 inline-block h-3 w-1.5 rounded-[var(--radius-sm)] bg-[var(--color-national-red)] align-middle"
        />
      ) : null}
      {children}
    </Tag>
  );
}
