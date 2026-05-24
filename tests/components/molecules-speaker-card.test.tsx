import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpeakerCard } from "@/components/molecules/SpeakerCard";
import type { Speaker } from "@/lib/api/sessionize";

vi.mock("next/image", () => ({
  default: ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />,
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
    render(<SpeakerCard speaker={SPEAKER} basePath="/editions/2025/speakers" />);
    expect(screen.getByRole("link", { name: "Ada Lovelace" })).toHaveAttribute(
      "href",
      "/editions/2025/speakers/ada-lovelace"
    );
  });

  it("falls back to initials when the speaker has no profile picture", () => {
    render(
      <SpeakerCard
        speaker={{ ...SPEAKER, profilePicture: null }}
      />
    );
    expect(screen.getByText("AL")).toBeInTheDocument();
  });
});
