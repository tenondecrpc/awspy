import { describe, expect, it } from "vitest";
import { EventInfoSchema } from "@/lib/content/event-info";
import {
  SponsorsListSchema,
  groupSponsorsByTier,
} from "@/lib/content/sponsors";
import { OrganizersListSchema } from "@/lib/content/organizers";
import { FAQListSchema } from "@/lib/content/faq";
import { VenueSchema } from "@/lib/content/venue";
import { CodeOfConductFrontmatterSchema } from "@/lib/content/code-of-conduct";

const VALID_EVENT = {
  year: "2026",
  name: "AWS Community Day Paraguay 2026",
  tagline: "First edition",
  heroTitle: "AWS Community Day Paraguay 2026",
  heroSubtitle: "Una jornada gratuita",
  dates: {
    start: "2026-09-12T13:00:00-03:00",
    end: "2026-09-12T22:00:00-03:00",
  },
  location: { city: "Asuncion", country: "Paraguay", summary: "Asuncion" },
  sessionizeEventId: null,
  eventbriteEventUrl: null,
  cfpSubmissionUrl: null,
  cfpStatus: "upcoming",
  cfpDeadline: null,
  registrationStatus: "upcoming",
  contactEmail: "hola@awscommunitydayparaguay.com",
};

describe("EventInfoSchema", () => {
  it("accepts a minimally valid event.json", () => {
    expect(() => EventInfoSchema.parse(VALID_EVENT)).not.toThrow();
  });

  it("defaults social to {} and previousEditions to []", () => {
    const out = EventInfoSchema.parse(VALID_EVENT);
    expect(out.social).toEqual({});
    expect(out.previousEditions).toEqual([]);
  });

  it("rejects a year that does not match /^\\d{4}$/", () => {
    expect(() =>
      EventInfoSchema.parse({ ...VALID_EVENT, year: "26" })
    ).toThrow();
  });

  it("rejects an invalid email", () => {
    expect(() =>
      EventInfoSchema.parse({ ...VALID_EVENT, contactEmail: "not-an-email" })
    ).toThrow();
  });

  it("rejects when dates.end is before dates.start", () => {
    const result = EventInfoSchema.safeParse({
      ...VALID_EVENT,
      dates: {
        start: "2026-09-12T13:00:00-03:00",
        end: "2026-09-12T12:00:00-03:00",
      },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("\n");
      expect(message).toMatch(/dates\.end/);
    }
  });

  it("rejects an unknown cfpStatus value", () => {
    expect(() =>
      EventInfoSchema.parse({ ...VALID_EVENT, cfpStatus: "maybe" })
    ).toThrow();
  });
});

describe("SponsorsListSchema", () => {
  it("accepts an empty array", () => {
    expect(SponsorsListSchema.parse([])).toEqual([]);
  });

  it("rejects sponsors with duplicate ids", () => {
    const result = SponsorsListSchema.safeParse([
      {
        id: "acme",
        name: "Acme",
        tier: "Gold",
        logo: { light: "/logos/acme.svg" },
        url: "https://acme.example",
      },
      {
        id: "acme",
        name: "Acme 2",
        tier: "Silver",
        logo: { light: "/logos/acme2.svg" },
        url: "https://acme2.example",
      },
    ]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message.includes("duplicated"))
      ).toBe(true);
    }
  });

  it("rejects a sponsor logo path outside /logos/", () => {
    expect(() =>
      SponsorsListSchema.parse([
        {
          id: "acme",
          name: "Acme",
          tier: "Gold",
          logo: { light: "/images/acme.svg" },
          url: "https://acme.example",
        },
      ])
    ).toThrow();
  });

  it.each(["/public/logos/acme.svg", "https://images.example.test/acme.svg"])(
    "rejects a sponsor logo Next Image cannot serve: %s",
    (logo) => {
      expect(() =>
        SponsorsListSchema.parse([
          {
            id: "acme",
            name: "Acme",
            tier: "Gold",
            logo: { light: logo },
            url: "https://acme.example",
          },
        ])
      ).toThrow();
    }
  );
});

describe("groupSponsorsByTier", () => {
  it("groups sponsors in canonical tier order and skips empty tiers", () => {
    const groups = groupSponsorsByTier([
      {
        id: "a",
        name: "A",
        tier: "Silver",
        logo: { light: "/logos/a.svg" },
        url: "https://a.example",
      },
      {
        id: "b",
        name: "B",
        tier: "Platinum",
        logo: { light: "/logos/b.svg" },
        url: "https://b.example",
      },
    ]);
    expect(groups.map((g) => g.tier)).toEqual(["Platinum", "Silver"]);
  });
});

describe("OrganizersListSchema", () => {
  it("accepts an empty array", () => {
    expect(OrganizersListSchema.parse([])).toEqual([]);
  });

  it("rejects organizers with duplicate ids", () => {
    const result = OrganizersListSchema.safeParse([
      { id: "x", name: "X", role: "Lead" },
      { id: "x", name: "Y", role: "Lead" },
    ]);
    expect(result.success).toBe(false);
  });

  it("rejects an organizer photo from an unconfigured image host", () => {
    expect(
      OrganizersListSchema.safeParse([
        {
          id: "x",
          name: "X",
          role: "Lead",
          photo: "https://images.example.test/x.jpg",
        },
      ]).success
    ).toBe(false);
  });
});

describe("FAQListSchema", () => {
  it("rejects FAQs with duplicate ids", () => {
    const result = FAQListSchema.safeParse([
      { id: "x", question: "Q1?", answer: "A1" },
      { id: "x", question: "Q2?", answer: "A2" },
    ]);
    expect(result.success).toBe(false);
  });
});

describe("VenueSchema", () => {
  const VALID_VENUE = {
    name: "Sede",
    address: "Asuncion",
    mapUrl: "https://www.google.com/maps/place/foo",
  };

  it("accepts a minimally valid venue", () => {
    expect(() => VenueSchema.parse(VALID_VENUE)).not.toThrow();
  });

  it("rejects an embedMapUrl from an untrusted host", () => {
    const result = VenueSchema.safeParse({
      ...VALID_VENUE,
      embedMapUrl: "https://evil.example/map",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) =>
          i.message.includes("trusted hosts list")
        )
      ).toBe(true);
    }
  });

  it("accepts an embedMapUrl from google.com", () => {
    expect(() =>
      VenueSchema.parse({
        ...VALID_VENUE,
        embedMapUrl: "https://www.google.com/maps/embed?pb=foo",
      })
    ).not.toThrow();
  });
});

describe("CodeOfConductFrontmatterSchema", () => {
  it("accepts an empty frontmatter object", () => {
    expect(() => CodeOfConductFrontmatterSchema.parse({})).not.toThrow();
  });

  it("validates a semver-shaped version", () => {
    expect(() =>
      CodeOfConductFrontmatterSchema.parse({ version: "1.2.3" })
    ).not.toThrow();
    expect(() =>
      CodeOfConductFrontmatterSchema.parse({ version: "v1.2" })
    ).toThrow();
  });

  it("rejects unknown keys", () => {
    expect(() =>
      CodeOfConductFrontmatterSchema.parse({ author: "alice" })
    ).toThrow();
  });
});
