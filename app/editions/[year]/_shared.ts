// Helpers shared by every `/editions/[year]/...` page. Centralizing them
// keeps the per-year mirror route files tiny and consistent.
//
// NOTE: Next.js requires route-segment config exports (`dynamicParams`,
// `revalidate`, etc.) to be defined directly in the page file. Each page
// inlines `export const dynamicParams = false`. This file only exposes the
// type and the `listEditionParams()` helper used by `generateStaticParams`.

import { listEditions } from "@/lib/content/editions";

export type EditionRouteParams = { year: string };

/**
 * Returns the years to pre-render at build time. We pre-render every edition
 * present under `content/editions/`, including the current one, so deep
 * links like `/editions/2026/speakers` work alongside the bare equivalents.
 */
export function listEditionParams(): EditionRouteParams[] {
  return listEditions().map((year) => ({ year }));
}

export function editionBasePath(year: string): string {
  return `/editions/${year}`;
}
