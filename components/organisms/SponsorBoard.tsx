// The sponsor board shared by the home page and the sponsors page: the
// confirmed sponsors grouped under their tier, then a row of empty
// "Tu logo aquí" frames while there is still room.
//
// The tier is written once, as the group heading next to its color chip, so
// the color reinforces the tier and never carries it alone (constitution
// Principle VI). The board shows no amounts: pricing goes out on request.

import { SponsorLogoSlots } from "@/components/molecules/SponsorLogoSlots";
import { SponsorTile } from "@/components/molecules/SponsorTile";
import { groupSponsorsByTier } from "@/lib/content/sponsors";
import { TIER_COLOR, TIER_LABEL_ES } from "@/lib/utils/sponsor-tiers";
import type { Sponsor } from "@/lib/content/sponsors";

type SponsorBoardProps = {
  sponsors: Sponsor[];
  /** How many empty frames to offer after the confirmed sponsors. */
  openSlots: number;
  /** Where the empty frames send the reader. */
  slotHref: string;
};

export function SponsorBoard({
  sponsors,
  openSlots,
  slotHref,
}: SponsorBoardProps) {
  return (
    <div className="flex flex-col gap-9">
      {groupSponsorsByTier(sponsors).map((group) => (
        <div key={group.tier}>
          <h3 className="m-0 mb-3.5 flex items-center gap-2 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            <span
              aria-hidden="true"
              className="h-2 w-2 flex-none rounded-[2px]"
              style={{ background: TIER_COLOR[group.tier] }}
            />
            Sponsor {TIER_LABEL_ES[group.tier]}
          </h3>
          <ul className="m-0 grid list-none gap-3 p-0 [grid-template-columns:repeat(auto-fill,minmax(min(160px,100%),1fr))]">
            {group.sponsors.map((sponsor) => (
              <li key={sponsor.id} className="min-w-0">
                <SponsorTile sponsor={sponsor} className="h-full" />
              </li>
            ))}
          </ul>
        </div>
      ))}
      <SponsorLogoSlots count={openSlots} href={slotHref} />
    </div>
  );
}
