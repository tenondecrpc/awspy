import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildBreadcrumbJsonLd,
  buildEventJsonLd,
  buildPageMetadata,
  buildPersonJsonLd,
  getSiteHostname,
  getSiteUrl,
  serializeJsonLd,
} from "@/lib/utils/seo";

const ORIGINAL_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

beforeEach(() => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
});

afterEach(() => {
  if (ORIGINAL_SITE_URL === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_SITE_URL;
});

describe("buildPageMetadata", () => {
  it("appends the brand suffix to the title", () => {
    const meta = buildPageMetadata({
      title: "Speakers",
      description: "Confirmed speakers",
      path: "/speakers",
    });
    expect(meta.title).toBe("Speakers - AWS Community Day Paraguay");
  });

  it("does not double-suffix when the title is the brand itself", () => {
    const meta = buildPageMetadata({
      title: "AWS Community Day Paraguay",
      description: "Home",
      path: "/",
    });
    expect(meta.title).toBe("AWS Community Day Paraguay");
  });

  it("returns canonical and OG URLs against the configured origin", () => {
    const meta = buildPageMetadata({
      title: "Speakers",
      description: "Confirmed speakers",
      path: "/speakers",
    });
    expect(meta.alternates?.canonical).toBe("https://example.test/speakers");
    expect(meta.openGraph?.url).toBe("https://example.test/speakers");
  });

  it("defaults the OG image to /opengraph-image when not provided", () => {
    const meta = buildPageMetadata({
      title: "Speakers",
      description: "x",
      path: "/speakers",
    });
    const images = meta.openGraph?.images as { url: string }[] | undefined;
    expect(images?.[0].url).toBe("https://example.test/opengraph-image");
  });
});

describe("site URL helpers", () => {
  it("normalizes the configured value to its origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.test/some/path/";

    expect(getSiteUrl()).toBe("https://example.test");
  });

  it("returns the configured hostname for generated share assets", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://awscommunitydayparaguay.com";

    expect(getSiteHostname()).toBe("awscommunitydayparaguay.com");
  });

  it.each(["javascript:alert(1)", "ftp://example.test", "not a URL"])(
    "rejects invalid site origin %s",
    (value) => {
      process.env.NEXT_PUBLIC_SITE_URL = value;
      expect(() => getSiteUrl()).toThrow(/HTTP\(S\)/);
    }
  );

  it("rejects credentials in the public site origin", () => {
    const credentialUrl = new URL("https://example.test");
    credentialUrl.username = "user";
    credentialUrl.password = "pass";
    process.env.NEXT_PUBLIC_SITE_URL = credentialUrl.toString();
    expect(() => getSiteUrl()).toThrow(/credentials/);
  });

  it("preserves scheme validation precedence when userinfo is also present", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "ftp://user:pass@example.test";

    expect(() => getSiteUrl()).toThrow(
      "NEXT_PUBLIC_SITE_URL must be an absolute HTTP(S) URL"
    );
  });

  it("accepts an HTTP loopback origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000/path";

    expect(getSiteUrl()).toBe("http://localhost:3000");
  });
});

describe("buildEventJsonLd", () => {
  it("includes the required schema.org Event keys", () => {
    const ld = buildEventJsonLd({
      name: "AWS Community Day Paraguay 2026",
      description: "Free conference",
      startDate: "2026-09-12T13:00:00Z",
      endDate: "2026-09-12T22:00:00Z",
      path: "/",
      location: {
        name: "Asunción Convention Center",
        city: "Asunción",
        country: "PY",
      },
    });
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Event");
    expect(ld.name).toBe("AWS Community Day Paraguay 2026");
    expect(ld.url).toBe("https://example.test/");
    expect(ld.eventAttendanceMode).toBe(
      "https://schema.org/OfflineEventAttendanceMode"
    );
  });
});

describe("buildPersonJsonLd", () => {
  it("includes the required schema.org Person keys", () => {
    const ld = buildPersonJsonLd({
      name: "Ada Lovelace",
      path: "/speakers/ada-lovelace",
      jobTitle: "Cloud Architect",
      sameAs: ["https://twitter.com/ada"],
    });
    expect(ld["@type"]).toBe("Person");
    expect(ld.name).toBe("Ada Lovelace");
    expect(ld.url).toBe("https://example.test/speakers/ada-lovelace");
    expect(ld.sameAs).toEqual(["https://twitter.com/ada"]);
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("emits sequential positions starting at 1", () => {
    const ld = buildBreadcrumbJsonLd([
      { name: "Inicio", path: "/" },
      { name: "Speakers", path: "/speakers" },
      { name: "Ada Lovelace", path: "/speakers/ada-lovelace" },
    ]);
    expect(ld["@type"]).toBe("BreadcrumbList");
    const items = ld.itemListElement as Array<{
      position: number;
      name: string;
      item: string;
    }>;
    expect(items).toHaveLength(3);
    expect(items[0].position).toBe(1);
    expect(items[1].position).toBe(2);
    expect(items[2].position).toBe(3);
    expect(items[2].item).toBe("https://example.test/speakers/ada-lovelace");
  });
});

describe("serializeJsonLd", () => {
  it("prevents script termination while preserving the exact JSON value", () => {
    const input = {
      name: '</script><script data-attack="true">alert(1)</script>',
      detail: "A&B > C < D\u2028next\u2029last",
    };

    const serialized = serializeJsonLd(input);

    expect(serialized.toLowerCase()).not.toContain("</script");
    expect(serialized).not.toContain("<");
    expect(serialized).not.toContain(">");
    expect(serialized).not.toContain("&");
    expect(serialized).not.toContain("\u2028");
    expect(serialized).not.toContain("\u2029");
    expect(JSON.parse(serialized)).toEqual(input);
  });

  it("rejects values that JSON cannot serialize", () => {
    expect(() => serializeJsonLd(undefined)).toThrow(/serializable/);
  });
});
