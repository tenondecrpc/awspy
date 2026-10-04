// Reads a speaker's LinkedIn profile from the links Sessionize returns. Pure
// and server-safe.
//
// Sessionize sends each social link a speaker filled in on their profile with
// a `linkType`; LinkedIn arrives as `"LinkedIn"`. The CFP decides whether the
// field is asked for, so the link is optional everywhere it is shown. The
// host is checked too, so a link labelled "LinkedIn" never leads elsewhere.

import type { Speaker } from "@/lib/api/sessionize";

function isLinkedInHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "linkedin.com" || host.endsWith(".linkedin.com");
  } catch {
    return false;
  }
}

/** The speaker's LinkedIn profile URL, or `null` when Sessionize has none. */
export function linkedinUrlOf(speaker: Pick<Speaker, "links">): string | null {
  const link = speaker.links.find(
    (l) => l.linkType.toLowerCase() === "linkedin" && isLinkedInHost(l.url)
  );
  return link?.url ?? null;
}
