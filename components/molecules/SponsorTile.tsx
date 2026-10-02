// A confirmed sponsor on the board: the logo on a white plate and the name,
// linking to the sponsor's own site.
//
// The home page and the sponsors page render this same tile, so a sponsor
// looks and behaves identically on both. The board writes the tier once, as
// the heading of the group the tile sits in, so the tile only repeats it in
// its accessible name.

import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { TIER_LABEL } from "@/lib/utils/sponsor-tiers";
import type { Sponsor } from "@/lib/content/sponsors";
import { tieLast } from "@/lib/utils/typography";

type SponsorTileProps = {
  sponsor: Sponsor;
  /** `lg` is a taller plate, for a page that shows only a few sponsors. */
  size?: "md" | "lg";
  className?: string;
};

export function SponsorTile({
  sponsor,
  size = "md",
  className,
}: SponsorTileProps) {
  const tier = TIER_LABEL[sponsor.tier];

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${sponsor.name} (sponsor ${tier})`}
      className={cn(
        "group flex flex-col gap-2 text-[var(--color-text-primary)]",
        className
      )}
    >
      {/* The plate stays white in both themes because the sponsor supplies a
          single mark drawn for a light background and we do not recolor
          someone else's brand. */}
      <span
        className={`relative block w-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-logo-plate)] group-hover:border-[var(--color-text-primary)] ${
          size === "lg" ? "h-24 sm:h-32" : "h-[72px] sm:h-[88px]"
        }`}
      >
        <Image
          src={sponsor.logo.light}
          alt=""
          aria-hidden="true"
          fill
          sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 45vw"
          className="object-contain p-2.5"
        />
      </span>
      <span className="break-words text-sm leading-tight underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-[var(--color-national-red)]">
        {tieLast(sponsor.name)}
      </span>
    </a>
  );
}
