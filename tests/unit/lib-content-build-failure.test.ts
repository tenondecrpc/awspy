import { describe, expect, it } from "vitest";
import { EventInfoSchema } from "@/lib/content/event-info";
import { SponsorsListSchema } from "@/lib/content/sponsors";
import { FAQListSchema } from "@/lib/content/faq";
import { VenueSchema } from "@/lib/content/venue";
import { parseCodeOfConduct } from "@/lib/content/code-of-conduct";

// FR-015 requires the build to fail with a descriptive message when content
// is malformed. We exercise the loaders directly with bad payloads and assert
// that they reject with a Zod issue list referencing the offending field.

describe("content schema build-time validation", () => {
  it("rejects an event.json without contactEmail", () => {
    const result = EventInfoSchema.safeParse({
      year: "2026",
      name: "x",
      tagline: "x",
      heroTitle: "x",
      heroSubtitle: "x",
      dates: {
        start: "2026-09-12T13:00:00-03:00",
        end: "2026-09-12T22:00:00-03:00",
      },
      location: { city: "Asuncion", country: "Paraguay", summary: "Asuncion" },
      sessionizeEventId: null,
      eventbriteEventUrl: null,
      volunteerRegistrationUrl: null,
      volunteerRegistrationStatus: "upcoming",
      cfpSubmissionUrl: null,
      cfpStatus: "upcoming",
      cfpDeadline: null,
      registrationStatus: "upcoming",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("\n");
      expect(message).toMatch(/contactEmail/);
    }
  });

  it("rejects sponsors.json with a logo path outside /logos/", () => {
    const result = SponsorsListSchema.safeParse([
      {
        id: "acme",
        name: "Acme",
        tier: "Gold",
        logo: { light: "/images/acme.svg" },
        url: "https://acme.example",
      },
    ]);
    expect(result.success).toBe(false);
    if (!result.success) {
      // The path correctly identifies the offending field even though Zod v4
      // renders union failures with a generic "Invalid input" message.
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("0.logo.light");
    }
  });

  it("rejects FAQ duplicate ids", () => {
    const result = FAQListSchema.safeParse([
      { id: "x", question: "Q1?", answer: "A1" },
      { id: "x", question: "Q2?", answer: "A2" },
    ]);
    expect(result.success).toBe(false);
  });

  it("rejects venue.json with an embedMapUrl outside the trusted host list", () => {
    const result = VenueSchema.safeParse({
      name: "x",
      address: "x",
      mapUrl: "https://www.google.com/maps/place/x",
      embedMapUrl: "https://evil.example/map",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("\n");
      expect(message).toMatch(/trusted hosts list/);
    }
  });

  it.each(["\n", "\r\n"])(
    "removes frontmatter with %j line endings",
    (lineEnding) => {
      const raw = [
        "---",
        'lastUpdated: "2026-08-23T00:00:00Z"',
        'version: "1.2.3"',
        "---",
        "# Conduct body",
      ].join(lineEnding);

      const result = parseCodeOfConduct(raw);

      expect(result.frontmatter).toEqual({
        lastUpdated: "2026-08-23T00:00:00Z",
        version: "1.2.3",
      });
      expect(result.body).toBe("# Conduct body");
      expect(result.body).not.toContain("lastUpdated");
    }
  );

  it("reports the supplied source when frontmatter is invalid", () => {
    expect(() =>
      parseCodeOfConduct("---\nunknown: value\n---\nBody", "fixture.mdx")
    ).toThrow(/fixture\.mdx.*unknown/);
  });
});
