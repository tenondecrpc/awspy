import { describe, expect, it } from "vitest";
import { linkedinUrlOf } from "@/lib/utils/speaker-links";

function link(linkType: string, url: string) {
  return { title: linkType, url, linkType };
}

describe("linkedinUrlOf", () => {
  it("returns the LinkedIn profile among the speaker's links", () => {
    expect(
      linkedinUrlOf({
        links: [
          link("Twitter", "https://twitter.com/ada"),
          link("LinkedIn", "https://www.linkedin.com/in/ada"),
        ],
      })
    ).toBe("https://www.linkedin.com/in/ada");
  });

  it("accepts the bare and regional LinkedIn hosts and any link type case", () => {
    expect(
      linkedinUrlOf({ links: [link("linkedin", "http://linkedin.com/in/ada")] })
    ).toBe("http://linkedin.com/in/ada");
    expect(
      linkedinUrlOf({
        links: [link("LinkedIn", "https://py.linkedin.com/in/ada")],
      })
    ).toBe("https://py.linkedin.com/in/ada");
  });

  it("ignores a LinkedIn-labelled link that leads to another host", () => {
    expect(
      linkedinUrlOf({
        links: [link("LinkedIn", "https://linkedin.com.example.org/in/ada")],
      })
    ).toBeNull();
  });

  it("returns null without a LinkedIn link", () => {
    expect(linkedinUrlOf({ links: [] })).toBeNull();
    expect(
      linkedinUrlOf({ links: [link("Blog", "https://ada.dev")] })
    ).toBeNull();
  });
});
