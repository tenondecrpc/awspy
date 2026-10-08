// Joins the edition's keynote speakers with the Sessionize speakers list to
// find each keynote's LinkedIn link. Pure and server-safe.
//
// The link is shown only when Sessionize provides it: the keynote content
// file carries no social links of its own. A keynote is matched to a
// Sessionize speaker by full name, compared as a slug so accents, case and
// spacing do not matter.

import type { Speaker } from "@/lib/api/sessionize";
import type { Keynote } from "@/lib/content/keynotes";
import { slugify } from "@/lib/utils/slug";
import { linkedinUrlOf } from "@/lib/utils/speaker-links";

export type KeynoteCardData = Keynote & {
  /** The speaker's LinkedIn profile from Sessionize, or `null` without one. */
  linkedinUrl: string | null;
};

export function withSessionizeLinkedIn(
  keynotes: Keynote[],
  speakers: Speaker[]
): KeynoteCardData[] {
  const byName = new Map<string, string>();
  for (const sp of speakers) {
    // A placeholder record never lends a real person its link.
    if (sp.isMockup) continue;
    const url = linkedinUrlOf(sp);
    const key = slugify(sp.fullName);
    if (url && !byName.has(key)) byName.set(key, url);
  }
  return keynotes.map((k) => ({
    ...k,
    linkedinUrl: byName.get(slugify(k.name)) ?? null,
  }));
}
