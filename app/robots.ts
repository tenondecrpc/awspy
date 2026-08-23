// Public-site robots policy. Allows crawling everything and points at the
// sitemap so search engines can discover all pages efficiently (FR-027).

import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
