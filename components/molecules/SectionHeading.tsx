// SectionHeading molecule. The repeated header block that opens every
// section: an eyebrow pill, a large title whose last words can be tinted
// with the accent, and a short lead paragraph.
//
// Centralizing it here is what makes the vertical rhythm identical across
// the home page and every inner page, which is the single biggest visual
// difference between this site and the rest of the AWS Community Day family.

import type { ReactNode } from "react";
import { Heading } from "@/components/atoms/Heading";
import { EyebrowPill } from "@/components/atoms/EyebrowPill";
import type { GlyphName } from "@/components/atoms/GlyphIcon";
import { cn } from "@/lib/utils/cn";

type Tone = "default" | "muted" | "inverse" | "hero";

type SectionHeadingProps = {
  /** Semantic heading level. Use 1 once per page. */
  level: 1 | 2 | 3;
  /** Visual size. Defaults to the semantic level. */
  visualLevel?: 1 | 2 | 3 | 4;
  id?: string;
  /** Short uppercase label above the title. */
  eyebrow?: string;
  eyebrowGlyph?: GlyphName;
  /** Leading, untinted part of the title. */
  title: string;
  /**
   * Trailing, accent-tinted part of the title. Rendered inside the same
   * heading, so the accessible name stays `"{title} {highlight}"`.
   */
  highlight?: string;
  /** Lead paragraph under the title. */
  description?: ReactNode;
  align?: "center" | "left";
  tone?: Tone;
  /** Rendered under the description (a "Ver todos" link, a CTA). */
  children?: ReactNode;
  className?: string;
};

const DESCRIPTION_CLASS: Record<Tone, string> = {
  default: "text-[var(--color-text-secondary)]",
  muted: "text-[var(--color-text-secondary)]",
  inverse: "text-[var(--color-text-on-inverse)] opacity-90",
  hero: "text-[var(--color-text-on-hero)] opacity-90",
};

const HIGHLIGHT_CLASS: Record<Tone, string> = {
  default: "text-[var(--color-national-red-label)]",
  muted: "text-[var(--color-national-red-label)]",
  inverse: "text-[var(--color-national-red-on-dark)]",
  hero: "text-[var(--color-national-red-on-dark)]",
};

export function SectionHeading({
  level,
  visualLevel,
  id,
  eyebrow,
  eyebrowGlyph,
  title,
  highlight,
  description,
  align = "center",
  tone = "default",
  children,
  className,
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        isCentered ? "mx-auto items-center text-center" : "items-start",
        className
      )}
    >
      {eyebrow ? (
        <EyebrowPill tone={tone} glyph={eyebrowGlyph}>
          {eyebrow}
        </EyebrowPill>
      ) : null}

      <Heading
        id={id}
        level={level}
        visualLevel={visualLevel}
        className="text-balance"
      >
        {title}
        {highlight ? (
          <>
            {" "}
            <span className={HIGHLIGHT_CLASS[tone]}>{highlight}</span>
          </>
        ) : null}
      </Heading>

      {description ? (
        <p
          className={cn(
            "max-w-[46rem] text-base sm:text-lg",
            DESCRIPTION_CLASS[tone]
          )}
        >
          {description}
        </p>
      ) : null}

      {children}
    </div>
  );
}
