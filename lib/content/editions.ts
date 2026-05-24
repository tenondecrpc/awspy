// Top-level edition loader. Aggregates the per-resource loaders and exposes
// the multi-edition primitives: `currentEdition()`, `listEditions()`,
// `getEdition(year)`. See `data-model.md` for the Edition entity.

import { readdirSync, statSync } from "node:fs";
import { contentRoot, editionDir } from "@/lib/content/_fs";
import { join } from "node:path";
import { getEventInfo, type EventInfo } from "@/lib/content/event-info";
import { getSponsors, type Sponsor } from "@/lib/content/sponsors";
import { getOrganizers, type Organizer } from "@/lib/content/organizers";
import { getFAQ, type FAQItem } from "@/lib/content/faq";
import { getVenue, type Venue } from "@/lib/content/venue";
import {
  getCodeOfConduct,
  type CodeOfConduct,
} from "@/lib/content/code-of-conduct";

const YEAR_RE = /^\d{4}$/;

export type Edition = {
  year: string;
  eventInfo: EventInfo;
  sponsors: Sponsor[];
  organizers: Organizer[];
  faq: FAQItem[];
  venue: Venue;
  codeOfConduct: CodeOfConduct;
};

/** Returns the currently-active edition year. Defaults to "2026". */
export function currentEdition(): string {
  const raw = process.env.CURRENT_EDITION ?? "2026";
  if (!YEAR_RE.test(raw)) {
    throw new Error(
      `CURRENT_EDITION must be a 4-digit year, got "${raw}". Set it in .env.local.`
    );
  }
  return raw;
}

/**
 * Returns the list of edition year folders present under
 * `content/editions/`, sorted descending. Folders that are not 4-digit years
 * are silently ignored so transient artifacts (e.g. .DS_Store) do not break
 * the build.
 */
export function listEditions(): string[] {
  const root = join(contentRoot(), "editions");
  let entries: string[] = [];
  try {
    entries = readdirSync(root);
  } catch {
    return [];
  }
  const years = entries.filter((entry) => {
    if (!YEAR_RE.test(entry)) return false;
    try {
      return statSync(join(root, entry)).isDirectory();
    } catch {
      return false;
    }
  });
  return years.sort((a, b) => b.localeCompare(a));
}

/**
 * Returns the past editions (everything except the current one), sorted
 * descending. Used by `EditionsIndexTemplate` and the sitemap.
 */
export function listPastEditions(): string[] {
  const current = currentEdition();
  return listEditions().filter((y) => y !== current);
}

/** Returns true if `year` exists as a folder under `content/editions/`. */
export function editionExists(year: string): boolean {
  if (!YEAR_RE.test(year)) return false;
  try {
    return statSync(editionDir(year)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Loads and validates the entire content tree for the requested edition.
 * Throws if any file is missing or malformed.
 */
export function getEdition(year: string): Edition {
  if (!editionExists(year)) {
    throw new Error(
      `Edition ${year} does not exist under content/editions/`
    );
  }
  return {
    year,
    eventInfo: getEventInfo(year),
    sponsors: getSponsors(year),
    organizers: getOrganizers(year),
    faq: getFAQ(year),
    venue: getVenue(year),
    codeOfConduct: getCodeOfConduct(year),
  };
}
