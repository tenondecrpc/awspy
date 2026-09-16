// Display data for a sponsorship tier: the Spanish label attendees read and
// the palette token that tints its chip.
//
// Shared by every surface that names a tier — the sponsor tiles, the open
// slots, the package cards and the benefit table — so a tier reads the same
// way wherever it appears. The tier tokens are only ever used as a small
// color chip next to the written label, which is the pairing the palette
// contract verifies: the color reinforces the tier, it never carries it.

import type { SponsorTier } from "@/lib/content/sponsors";

export const TIER_LABEL_ES: Record<SponsorTier, string> = {
  Diamante: "Diamante",
  Platinum: "Platino",
  Gold: "Oro",
  Silver: "Plata",
  Bronze: "Bronce",
  Community: "Comunidad",
};

export const TIER_COLOR: Record<SponsorTier, string> = {
  Diamante: "var(--color-tier-diamante)",
  Platinum: "var(--color-tier-platinum)",
  Gold: "var(--color-tier-gold)",
  Silver: "var(--color-tier-silver)",
  Bronze: "var(--color-tier-bronze)",
  Community: "var(--color-tier-community)",
};
