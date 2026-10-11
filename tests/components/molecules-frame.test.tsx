import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { StaticImageData } from "next/image";
import { Frame } from "@/components/molecules/SectionPrimitives";

// Vite resolves a `.jpg` import to a plain URL string, so the test builds the
// object a Next.js static import yields.
const PHOTO: StaticImageData = {
  src: "/_next/static/media/cover.0a1b2c3d.jpg",
  width: 1875,
  height: 839,
  blurDataURL: "data:image/jpeg;base64,/9j/2wBDAAEBAQ==",
};

function frameOf(label: string) {
  return screen.getByRole("img", { name: label }).parentElement!;
}

describe("Frame", () => {
  it("sizes the frame to the photo's own ratio when asked to fit it", () => {
    render(<Frame label="Fachada" photo={PHOTO} fitPhoto />);

    expect(frameOf("Fachada").style.aspectRatio).toBe("1875 / 839");
  });

  it("leaves the ratio to the class names by default", () => {
    render(<Frame label="Fachada" photo={PHOTO} className="aspect-video" />);

    expect(frameOf("Fachada").style.aspectRatio).toBe("");
    expect(frameOf("Fachada")).toHaveClass("aspect-video");
  });

  it("cannot fit a provider URL, which carries no dimensions", () => {
    render(<Frame label="Retrato" photo="/assets/charla.jpg" fitPhoto />);

    expect(frameOf("Retrato").style.aspectRatio).toBe("");
  });
});
