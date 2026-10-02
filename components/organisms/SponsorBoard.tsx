// The sponsor board shared by the home page and the sponsors page: the
// confirmed sponsors grouped under their tier, then a row of empty
// "Tu logo aquí" frames while there is still room.
//
// The tier is written once, as the group heading next to its color chip, so
// the color reinforces the tier and never carries it alone (constitution
// Principle VI). The heading is written even when only one tier is confirmed:
// it says which level these sponsors chose, which the page around the board
// does not. The board shows no amounts: pricing goes out on request.
// Logos run two to a row on a phone for the top tiers and three for the
// lower ones, which keeps the board short without shrinking the marks.
//
// The tier headings are `h3`: whoever renders the board puts it under an
// `h2` of its own.

import { SponsorLogoSlots } from "@/components/molecules/SponsorLogoSlots";
import { SponsorTile } from "@/components/molecules/SponsorTile";
import { groupSponsorsByTier } from "@/lib/content/sponsors";
import { TIER_COLOR, TIER_LABEL } from "@/lib/utils/sponsor-tiers";
import type { Sponsor, SponsorTier } from "@/lib/content/sponsors";

type SponsorBoardProps = {
  sponsors: Sponsor[];
  /** How many empty frames to offer after the confirmed sponsors. */
  openSlots: number;
  /** Where the empty frames send the reader. */
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
  return (
    <div className="flex flex-col gap-8">
      {groupSponsorsByTier(sponsors).map((group) => {
        const lower = LOWER_TIERS.includes(group.tier);
        return (
          <div key={group.tier}>
            <h3 className="m-0 mb-3 flex items-center gap-2 pt-3 font-sans text-base font-semibold text-[var(--color-text-primary)]">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 flex-none"
                style={{ background: TIER_COLOR[group.tier] }}
              />
              Sponsor {TIER_LABEL[group.tier]}
            </h3>
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
