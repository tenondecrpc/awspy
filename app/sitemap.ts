// Site map for the public site. Iterates the current and past editions
// returned by `lib/content/editions.ts` and emits one entry per route in
// the documented surface (FR-026).

import type { MetadataRoute } from "next";
import { currentEdition, listEditions } from "@/lib/content/editions";

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    ""
  );
}

const TOP_LEVEL_ROUTES = [
  "/",
  "/speakers",
  "/schedule",
  "/sponsors",
  "/venue",
  "/team",
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
  "/faq",
  "/code-of-conduct",
  "/cfp",
  "/register",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  const currentRoutes: MetadataRoute.Sitemap = TOP_LEVEL_ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1.0 : 0.7,
  }));

  const editionRoutes: MetadataRoute.Sitemap = [];
  for (const year of listEditions()) {
    for (const sub of EDITION_SUBROUTES) {
      editionRoutes.push({
        url: `${base}/editions/${year}${sub}`,
        lastModified,
        changeFrequency: year === currentEdition() ? "monthly" : "yearly",
        priority: year === currentEdition() ? 0.6 : 0.3,
      });
    }
  }

  return [...currentRoutes, ...editionRoutes];
}
