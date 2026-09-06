// Site map for the public site. Iterates the current and past editions
// returned by `lib/content/editions.ts` and emits one entry per route in
// the documented surface (FR-026).

import type { MetadataRoute } from "next";
import { currentEdition, listEditions } from "@/lib/content/editions";
import { getEventInfo } from "@/lib/content/event-info";
import { listSpeakers, type Speaker } from "@/lib/api/sessionize";
import { getSiteUrl } from "@/lib/utils/seo";

const TOP_LEVEL_ROUTES = [
  "/",
  "/speakers",
  "/schedule",
  "/sponsors",
  "/venue",
  "/team",
  "/volunteers",
  "/faq",
  "/code-of-conduct",
  "/cfp",
  "/register",
  "/editions",
] as const;

const EDITION_SUBROUTES = [
  "",
  "/speakers",
  "/schedule",
  "/sponsors",
  "/venue",
  "/team",
  "/volunteers",
  "/faq",
  "/code-of-conduct",
  "/cfp",
  "/register",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const lastModified = new Date();
  const editions = listEditions();
  const speakersByEdition = new Map<string, Speaker[]>(
    await Promise.all(
      editions.map(
        async (year) =>
          [
            year,
            await listSpeakers(getEventInfo(year).sessionizeEventId),
          ] as const
      )
    )
  );

  const currentRoutes: MetadataRoute.Sitemap = TOP_LEVEL_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1.0 : 0.7,
  }));

  const editionRoutes: MetadataRoute.Sitemap = [];
  for (const year of editions) {
    for (const sub of EDITION_SUBROUTES) {
      editionRoutes.push({
        url: `${base}/editions/${year}${sub}`,
        lastModified,
        changeFrequency: year === currentEdition() ? "monthly" : "yearly",
        priority: year === currentEdition() ? 0.6 : 0.3,
      });
    }
    for (const speaker of speakersByEdition.get(year) ?? []) {
      editionRoutes.push({
        url: `${base}/editions/${year}/speakers/${speaker.slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: year === currentEdition() ? 0.6 : 0.3,
      });
    }
  }

  const currentSpeakerRoutes: MetadataRoute.Sitemap = (
    speakersByEdition.get(currentEdition()) ?? []
  ).map((speaker) => ({
    url: `${base}/speakers/${speaker.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...currentRoutes, ...currentSpeakerRoutes, ...editionRoutes];
}
