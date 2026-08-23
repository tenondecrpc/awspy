// SEO and structured data helpers. Each route uses these to build its
// `metadata` export and any JSON-LD it injects into the page head/body.
//
// The site URL is read from `NEXT_PUBLIC_SITE_URL` so canonical URLs and OG
// images resolve correctly across environments (preview, production).

import type { Metadata } from "next";
import { HttpUrlSchema } from "@/lib/validation/urls";

const DEFAULT_SITE_URL = "http://localhost:3000";

/** Return the configured public origin without a trailing slash or path. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute HTTP(S) URL");
  }
  if (url.username || url.password) {
    throw new Error("NEXT_PUBLIC_SITE_URL must not contain credentials");
  }
  const parsed = HttpUrlSchema.safeParse(configured);
  if (!parsed.success) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute HTTP(S) URL");
  }
  return url.origin;
}

/** Return the hostname used in generated, user-visible share assets. */
export function getSiteHostname(): string {
  return new URL(getSiteUrl()).hostname;
}

/**
 * Serialize JSON-LD for an HTML script element without allowing data to close
 * the element or introduce an HTML parsing boundary.
 */
export function serializeJsonLd(value: unknown): string {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) {
    throw new TypeError("JSON-LD value must be serializable");
  }
  return serialized
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function absolute(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${getSiteUrl()}${path}`;
}

export type PageMetadataInput = {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. `/speakers`. */
  path: string;
  /** Optional override for the OG image. Defaults to `/opengraph-image`. */
  ogImage?: string;
  /** Optional override for the OG/Twitter type. Defaults to `website`. */
  type?: "website" | "article" | "profile";
};

/**
 * Build the standard `metadata` export for a page. The title is suffixed with
 * the site brand for consistency.
 */
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const url = absolute(input.path);
  const ogImage = absolute(input.ogImage ?? "/opengraph-image");
  const fullTitle =
    input.title === "AWS Community Day Paraguay"
      ? input.title
      : `${input.title} - AWS Community Day Paraguay`;

  return {
    title: fullTitle,
    description: input.description,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? "website",
      url,
      title: fullTitle,
      description: input.description,
      siteName: "AWS Community Day Paraguay",
      locale: "es_PY",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [ogImage],
    },
  };
}

// ---------- JSON-LD builders ----------
//
// These return plain objects that the page renders inside a
// <script type="application/ld+json"> tag. Keep them serialisable.

export type EventJsonLdInput = {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  /** Path or absolute URL of the event page. */
  path: string;
  location: { name: string; address?: string; city?: string; country?: string };
  image?: string;
  organizerName?: string;
  organizerUrl?: string;
};

export function buildEventJsonLd(
  input: EventJsonLdInput
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.name,
    description: input.description,
    startDate: input.startDate,
    endDate: input.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: input.location.name,
      address: input.location.address
        ? {
            "@type": "PostalAddress",
            streetAddress: input.location.address,
            addressLocality: input.location.city,
            addressCountry: input.location.country,
          }
        : undefined,
    },
    url: absolute(input.path),
    image: input.image ? absolute(input.image) : absolute("/opengraph-image"),
    organizer: input.organizerName
      ? {
          "@type": "Organization",
          name: input.organizerName,
          url: input.organizerUrl ? absolute(input.organizerUrl) : undefined,
        }
      : undefined,
  };
}

export type PersonJsonLdInput = {
  name: string;
  /** Path or absolute URL of the speaker detail page. */
  path: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
};

export function buildPersonJsonLd(
  input: PersonJsonLdInput
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    url: absolute(input.path),
    jobTitle: input.jobTitle,
    description: input.description,
    image: input.image ? absolute(input.image) : undefined,
    sameAs: input.sameAs && input.sameAs.length > 0 ? input.sameAs : undefined,
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function buildBreadcrumbJsonLd(
  items: BreadcrumbItem[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}
