import { describe, expect, it } from "vitest";
import type { Speaker } from "@/lib/api/sessionize";
import type { Keynote } from "@/lib/content/keynotes";
import { withSessionizeLinkedIn } from "@/lib/utils/keynotes";

const KEYNOTE: Keynote = {
  id: "nelly-andrade",
  name: "Nelly Andrade",
  role: "Head of Developer Relations LATAM at AWS",
  organization: "Amazon Web Services",
  photo: "/assets/keynotes/nelly-andrade.jpg",
};

function speaker(overrides: Partial<Speaker>): Speaker {
  return {
    id: "sp-1",
    firstName: "Nelly",
    lastName: "Andrade",
    fullName: "Nelly Andrade",
    slug: "nelly-andrade",
    links: [],
    sessions: [],
    ...overrides,
  };
}

const LINKEDIN = {
  title: "LinkedIn",
  url: "https://www.linkedin.com/in/nelly-andrade",
  linkType: "LinkedIn",
};

describe("withSessionizeLinkedIn", () => {
  it("takes the LinkedIn link of the Sessionize speaker with the same name", () => {
    const [card] = withSessionizeLinkedIn(
      [KEYNOTE],
      [speaker({ links: [LINKEDIN] })]
    );
    expect(card).toEqual({ ...KEYNOTE, linkedinUrl: LINKEDIN.url });
  });

  it("matches names regardless of accents, case and spacing", () => {
    const [card] = withSessionizeLinkedIn(
      [{ ...KEYNOTE, name: "Néllý  ANDRADE" }],
      [speaker({ links: [LINKEDIN] })]
    );
    expect(card.linkedinUrl).toBe(LINKEDIN.url);
  });

  it("leaves the link out when the keynote is not in Sessionize", () => {
    const [card] = withSessionizeLinkedIn([KEYNOTE], []);
    expect(card.linkedinUrl).toBeNull();
  });

  it("leaves the link out when Sessionize has no LinkedIn for the speaker", () => {
    const [card] = withSessionizeLinkedIn(
      [KEYNOTE],
      [
        speaker({
          links: [
            {
              title: "Twitter",
              url: "https://twitter.com/nelly",
              linkType: "Twitter",
            },
          ],
        }),
      ]
    );
    expect(card.linkedinUrl).toBeNull();
  });

  it("never borrows a link from a placeholder speaker", () => {
    const [card] = withSessionizeLinkedIn(
      [KEYNOTE],
      [speaker({ isMockup: true, links: [LINKEDIN] })]
    );
    expect(card.linkedinUrl).toBeNull();
  });

  it("keeps the keynote order and ignores unrelated speakers", () => {
    const other: Keynote = {
      ...KEYNOTE,
      id: "cristian-yegros",
      name: "Cristian Yegros",
    };
    const cards = withSessionizeLinkedIn(
      [KEYNOTE, other],
      [
        speaker({
          id: "sp-2",
          fullName: "Cristian Yegros",
          links: [{ ...LINKEDIN, url: "https://linkedin.com/in/cy" }],
        }),
        speaker({ id: "sp-3", fullName: "Someone Else", links: [LINKEDIN] }),
      ]
    );
    expect(cards.map((c) => [c.id, c.linkedinUrl])).toEqual([
      ["nelly-andrade", null],
      ["cristian-yegros", "https://linkedin.com/in/cy"],
    ]);
  });
});
