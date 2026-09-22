// A confirmed sponsor, drawn as one tile of the sponsor board: logo and name,
// linking to the sponsor's own site.
//
// The home page and the sponsors page render this same tile, so a sponsor
// looks and behaves identically on both — before this existed the home copy
// was a plain div and the logos there were not clickable at all. The board
// writes the tier once, as the heading of the group the tile sits in, so the
// tile only repeats it in its accessible name.

import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { TIER_LABEL_ES } from "@/lib/utils/sponsor-tiers";
import type { Sponsor } from "@/lib/content/sponsors";

type SponsorTileProps = {
  sponsor: Sponsor;
  className?: string;
};

export function SponsorTile({ sponsor, className }: SponsorTileProps) {
  const tier = TIER_LABEL_ES[sponsor.tier];

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${sponsor.name} (sponsor ${tier})`}
      className={cn(
        "flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-[4px]",
        "border border-[var(--color-border-subtle)] px-[18px] py-6",
        "text-center text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-muted)]",
        className
      )}
    >
      {/* The plate stays light in both themes because the sponsor supplies a
          single mark drawn for a light background and we do not recolor
          someone else's brand. */}
      <span className="relative flex h-[54px] w-full max-w-[140px] items-center justify-center rounded-[3px] bg-[var(--color-surface-logo-plate)] px-2.5 py-1.5">
        <Image
          src={sponsor.logo.light}
          alt=""
          aria-hidden="true"
          fill
          sizes="140px"
          className="object-contain p-1.5"
        />
      </span>
      <span className="text-[14px] font-bold tracking-[-0.01em]">
        {sponsor.name}
      </span>
    </a>
  );
}
