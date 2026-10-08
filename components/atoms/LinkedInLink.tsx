// LinkedIn link atom: a round 44px icon button that opens a speaker's
// LinkedIn profile in a new tab. The accessible name ("LinkedIn de <name>")
// comes from visually hidden text, so the glyph itself stays decorative.
//
// `paper` sits on the light page or over a photo, on its own solid plate so it
// reads against any portrait; `inverse` is for the navy band.

import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import { cn } from "@/lib/utils/cn";

type LinkedInLinkProps = {
  href: string;
  /** Whose profile it is, for the accessible name. */
  name: string;
  tone?: "paper" | "inverse";
  className?: string;
};

const BASE =
  "inline-flex size-[var(--size-touch)] items-center justify-center rounded-full border transition-colors duration-150";

const TONE = {
  paper:
    "border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]",
  inverse:
    "border-[var(--color-border-on-inverse)] text-[var(--color-text-on-inverse)] hover:bg-[var(--color-text-on-inverse)] hover:text-[var(--color-surface-inverse)]",
} as const;

export function LinkedInLink({
  href,
  name,
  tone = "paper",
  className,
}: LinkedInLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(BASE, TONE[tone], className)}
    >
      <GlyphIcon name="linkedin" size={20} />
      <span className="sr-only">LinkedIn de {name}</span>
    </a>
  );
}
