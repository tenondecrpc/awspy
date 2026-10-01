import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SpeakerDetailTemplate } from "@/components/templates/SpeakerDetailTemplate";
import type { SessionizeSession, Speaker } from "@/lib/api/sessionize";

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

const SPEAKER: Speaker = {
  id: "speaker-1",
  firstName: "Ada",
  lastName: "Lovelace",
  fullName: "Ada Lovelace",
  slug: "ada-lovelace",
  links: [],
  sessions: [],
};

function session(
  times: Pick<SessionizeSession, "startsAt" | "endsAt"> = {}
): SessionizeSession {
  return {
    id: "s1",
    title: "Arquitecturas serverless en producción",
    speakers: [{ id: "speaker-1", name: "Ada Lovelace" }],
    isPlenumSession: false,
    isServiceSession: false,
    roomId: null,
    ...times,
  };
}

function renderSessions(sessions: SessionizeSession[]) {
  render(
    <SpeakerDetailTemplate
      speaker={SPEAKER}
      sessions={sessions}
      detailPath="/speakers/ada-lovelace"
    />
  );
  return screen
    .getByRole("heading", { level: 2, name: "Sesiones" })
    .closest("section");
}

describe("SpeakerDetailTemplate sessions", () => {
  it("warns under a scheduled session that its time may change", () => {
    const section = renderSessions([
      session({
        startsAt: "2026-10-17T13:00:00-03:00",
        endsAt: "2026-10-17T13:45:00-03:00",
      }),
    ]);

    expect(section).toHaveTextContent("Los horarios están sujetos a cambios.");
  });

  it("omits the warning while no session has a time", () => {
    const section = renderSessions([session()]);

    expect(section).toHaveTextContent("Por confirmar");
    expect(section).not.toHaveTextContent("sujetos a cambios");
  });

  it("omits the warning when the speaker has no sessions", () => {
    const section = renderSessions([]);

    expect(section).not.toHaveTextContent("sujetos a cambios");
  });
});
