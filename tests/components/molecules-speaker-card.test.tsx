import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpeakerCard } from "@/components/molecules/SpeakerCard";
import type { Speaker } from "@/lib/api/sessionize";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}));

const SPEAKER: Speaker = {
  id: "1",
  slug: "ada-lovelace",
  firstName: "Ada",
  lastName: "Lovelace",
  fullName: "Ada Lovelace",
  tagLine: "Cloud architect",
  bio: null,
  profilePicture: "https://sessionize.com/image/ada.jpg",
  links: [],
  sessions: [],
};

describe("SpeakerCard", () => {
  it("renders the name as a link to the detail page", () => {
    render(<SpeakerCard speaker={SPEAKER} />);
    const link = screen.getByRole("link", { name: "Ada Lovelace" });
    expect(link).toHaveAttribute("href", "/speakers/ada-lovelace");
  });

  it("renders the tagline when present", () => {
    render(<SpeakerCard speaker={SPEAKER} />);
    expect(screen.getByText("Cloud architect")).toBeInTheDocument();
  });

  it("respects a custom basePath (e.g. archived editions)", () => {
    render(
      <SpeakerCard speaker={SPEAKER} basePath="/editions/2025/speakers" />
    );
    expect(screen.getByRole("link", { name: "Ada Lovelace" })).toHaveAttribute(
      "href",
      "/editions/2025/speakers/ada-lovelace"
    );
  });

  it("falls back to initials when the speaker has no profile picture", () => {
    render(<SpeakerCard speaker={{ ...SPEAKER, profilePicture: null }} />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("exposes exactly one link so the card is a single tab stop", () => {
    render(<SpeakerCard speaker={SPEAKER} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("stretches the single link over the whole card", () => {
    render(<SpeakerCard speaker={SPEAKER} />);
    expect(
      screen.getByRole("link", { name: "Ada Lovelace" }).className
    ).toContain("after:absolute");
  });

  it("keeps the talk title in the accessibility tree, not only on hover", () => {
    render(
      <SpeakerCard
        speaker={{
          ...SPEAKER,
          sessions: [{ id: "42", name: "Serverless en producción" }],
        }}
      />
    );
    // Rendered unconditionally: the scrim animates opacity, so a screen
    // reader announces the talk regardless of the visual state.
    expect(screen.getByText("Serverless en producción")).toBeInTheDocument();
    expect(screen.getByText(/^Charla:/)).toBeInTheDocument();
  });

  it("omits the talk block when Sessionize reports no named session", () => {
    render(<SpeakerCard speaker={{ ...SPEAKER, sessions: [{ id: "42" }] }} />);
    expect(screen.queryByText(/^Charla:/)).not.toBeInTheDocument();
  });

  // Every speaker carries the same weight, and the source photos are square,
  // so the portrait is the same square at any position in the list: nobody is
  // cropped into a close-up or made larger than the rest.
  it("frames every portrait as the same square, whatever its position", () => {
    const cropOf = (index: number) => {
      const { container } = render(
        <SpeakerCard speaker={SPEAKER} accentIndex={index} />
      );
      return container
        .querySelector("article > div")
        ?.className.match(/aspect-\S+/)?.[0];
    };
    expect(cropOf(0)).toBe("aspect-square");
    expect(cropOf(1)).toBe("aspect-square");
    expect(cropOf(2)).toBe("aspect-square");
  });

  it("wraps the accent index so any list length is safe", () => {
    render(<SpeakerCard speaker={SPEAKER} accentIndex={97} />);
    expect(
      screen.getByRole("link", { name: "Ada Lovelace" })
    ).toBeInTheDocument();
  });
});
