// The sponsor board shared by the home page and the sponsors page: the
// confirmed sponsors grouped under their tier, then one line saying there is
// still room.
//
// The tier is written once, as the group heading next to its color chip, so
// the color reinforces the tier and never carries it alone (constitution
// Principle VI). The board shows no amounts: pricing goes out on request.
// Logos run two to a row on a phone for the top tiers and three for the
// lower ones, which keeps the board short without shrinking the marks.

import { SponsorLogoSlots } from "@/components/molecules/SponsorLogoSlots";
import { SponsorTile } from "@/components/molecules/SponsorTile";
import { groupSponsorsByTier } from "@/lib/content/sponsors";
import { TIER_COLOR, TIER_LABEL } from "@/lib/utils/sponsor-tiers";
import type { Sponsor, SponsorTier } from "@/lib/content/sponsors";

type SponsorBoardProps = {
  sponsors: Sponsor[];
  /** How many tiers still have room, for the closing line. */
  openSlots: number;
  /** Where the closing line's link sends the reader. */
  slotHref: string;
  /** `lg` shows taller logo plates, for a page with only a few sponsors. */
  size?: "md" | "lg";
};

const LOWER_TIERS: SponsorTier[] = ["Silver", "Bronze", "Community"];

export function SponsorBoard({
  sponsors,
  openSlots,
  slotHref,
  size = "md",
}: SponsorBoardProps) {
  const groups = groupSponsorsByTier(sponsors);
  // With a single tier the heading only repeats what the page already says
  // ("Sponsors" above, "Sponsor Diamante" below), so it is written only when
  // there are several tiers to tell apart. Each logo still names its tier in
  // its accessible label.
  const showTier = groups.length > 1;

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => {
        const lower = LOWER_TIERS.includes(group.tier);
        return (
          <div key={group.tier}>
            {showTier ? (
              <h3 className="m-0 mb-3 flex items-center gap-2 pt-3 font-sans text-base font-semibold text-[var(--color-text-primary)]">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 flex-none"
                  style={{ background: TIER_COLOR[group.tier] }}
                />
                Sponsor {TIER_LABEL[group.tier]}
              </h3>
            ) : (
              <div aria-hidden="true" className="mb-4" />
            )}
            <ul
              className={
                "m-0 grid list-none gap-x-3 gap-y-5 p-0 " +
                (size === "lg"
                  ? "grid-cols-2"
                  : lower
                    ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")
              }
            >
              {group.sponsors.map((sponsor) => (
                <li key={sponsor.id} className="min-w-0">
                  <SponsorTile
                    sponsor={sponsor}
                    size={size}
                    className="h-full"
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <SponsorLogoSlots count={openSlots} href={slotHref} />
    </div>
  );
}
