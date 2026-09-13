import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { listEditions } from "@/lib/content/editions";

// `notFound()` halts rendering by throwing in Next; the mock reproduces that so
// a route that should bail cannot silently fall through and render a page.
const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
  usePathname: () => "/editions/2026",
}));

import * as home from "@/app/editions/[year]/page";
import * as speakers from "@/app/editions/[year]/speakers/page";
import * as schedule from "@/app/editions/[year]/schedule/page";
import * as sponsors from "@/app/editions/[year]/sponsors/page";
import * as venue from "@/app/editions/[year]/venue/page";
import * as team from "@/app/editions/[year]/team/page";
import * as faq from "@/app/editions/[year]/faq/page";
import * as codeOfConduct from "@/app/editions/[year]/code-of-conduct/page";
import * as cfp from "@/app/editions/[year]/cfp/page";
import * as register from "@/app/editions/[year]/register/page";
import * as volunteers from "@/app/editions/[year]/volunteers/page";

const YEAR = listEditions()[0];

type RouteModule = {
  dynamicParams: boolean;
  generateStaticParams: () => unknown;
  generateMetadata: (a: {
    params: Promise<{ year: string }>;
  }) => Promise<{ alternates?: { canonical?: string } }>;
  default: (a: {
    params: Promise<{ year: string }>;
  }) => Promise<React.ReactElement>;
};

// Every mirror route under /editions/[year], with a heading that proves the
// page actually rendered its template.
const ROUTES: Array<{ path: string; mod: RouteModule; heading: RegExp }> = [
  {
    path: "",
    mod: home as never, // jsdom does not insert whitespace for the <br> breaks in the hero
    // headline, so the accessible name comes back as "AWSCommunity Day…".
    heading: /AWS\s*Community\s*Day/i,
  },
  { path: "/speakers", mod: speakers as never, heading: /^speakers$/i },
  { path: "/schedule", mod: schedule as never, heading: /^agenda$/i },
  { path: "/sponsors", mod: sponsors as never, heading: /^sponsors$/i },
  { path: "/venue", mod: venue as never, heading: /^sede$/i },
  { path: "/team", mod: team as never, heading: /equipo organizador/i },
  { path: "/faq", mod: faq as never, heading: /preguntas frecuentes/i },
  {
    path: "/code-of-conduct",
    mod: codeOfConduct as never,
    heading: /código de conducta/i,
  },
  { path: "/cfp", mod: cfp as never, heading: /proponé una charla/i },
  { path: "/register", mod: register as never, heading: /^registro$/i },
  { path: "/volunteers", mod: volunteers as never, heading: /voluntariado/i },
];

describe("/editions/[year] routes", () => {
  beforeEach(() => {
    // Block body on purpose: `mockClear()` returns the mock, and a value
    // returned from `beforeEach` is treated by Vitest as a teardown callback —
    // which would call the mock and throw after every test.
    notFound.mockClear();
  });

  it.each(ROUTES)("$path pre-renders one path per edition", ({ mod }) => {
    expect(mod.dynamicParams).toBe(false);
    expect(mod.generateStaticParams()).toEqual(
      listEditions().map((year) => ({ year }))
    );
  });

  it.each(ROUTES)(
    "$path builds an edition-scoped canonical",
    async ({ path, mod }) => {
      const metadata = await mod.generateMetadata({
        params: Promise.resolve({ year: YEAR }),
      });
      expect(metadata.alternates?.canonical).toContain(
        `/editions/${YEAR}${path}`
      );
    }
  );

  it.each(ROUTES)(
    "$path renders the archived edition",
    async ({ mod, heading }) => {
      render(await mod.default({ params: Promise.resolve({ year: YEAR }) }));
      expect(
        screen.getByRole("heading", { level: 1, name: heading })
      ).toBeInTheDocument();
      expect(notFound).not.toHaveBeenCalled();
    }
  );

  it.each(ROUTES)("$path is a 404 for an unknown edition", async ({ mod }) => {
    await expect(
      mod.default({ params: Promise.resolve({ year: "1999" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
