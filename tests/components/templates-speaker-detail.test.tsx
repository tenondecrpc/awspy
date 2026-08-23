import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SpeakerDetailTemplate } from "@/components/templates/SpeakerDetailTemplate";
import type { Speaker } from "@/lib/api/sessionize";

describe("SpeakerDetailTemplate structured data", () => {
  it("keeps provider text from terminating JSON-LD script elements", () => {
    const speaker: Speaker = {
      id: "speaker-1",
      firstName: "Ada",
      lastName: "Lovelace",
      fullName: '</script><script data-attack="true">Ada</script>',
      slug: "ada-lovelace",
      bio: "A&B > C",
      links: [],
      sessions: [],
    };

    const { container } = render(
      <SpeakerDetailTemplate
        speaker={speaker}
        sessions={[]}
        detailPath="/speakers/ada-lovelace"
      />
    );

    const scripts = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]')
    );
    expect(scripts).toHaveLength(2);
    for (const script of scripts) {
      expect(script.innerHTML.toLowerCase()).not.toContain("</script");
      expect(() => JSON.parse(script.innerHTML)).not.toThrow();
    }
  });
});
