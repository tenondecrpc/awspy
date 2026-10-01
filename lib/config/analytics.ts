// Google Analytics 4 configuration (ADR 0010).
//
// The measurement ID is public: it ships in every page. It is still validated,
// because it is interpolated into an inline script, and a malformed value
// fails the build the way a malformed `NEXT_PUBLIC_SITE_URL` does instead of
// silently measuring nothing.

import { z } from "zod";

const GaMeasurementIdSchema = z.string().regex(/^G-[A-Z0-9]{4,20}$/);

/** Return the configured GA4 measurement ID, or `null` when analytics is off. */
export function getGaMeasurementId(): string | null {
  const configured = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  if (!configured) return null;
  const parsed = GaMeasurementIdSchema.safeParse(configured);
  if (!parsed.success) {
    throw new Error(
      "NEXT_PUBLIC_GA_MEASUREMENT_ID must be a GA4 measurement ID (G-XXXXXXXXXX)"
    );
  }
  return parsed.data;
}
