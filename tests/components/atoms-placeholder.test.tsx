import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Placeholder } from "@/components/atoms/Placeholder";

describe("Placeholder atom", () => {
  it("reserves the requested aspect ratio", () => {
    render(<Placeholder kind="cover" aspectRatio={16 / 9} />);
    const node = screen.getByTestId("placeholder");
    expect(node).toHaveStyle({ aspectRatio: (16 / 9).toString() });
  });

  it("uses the default aspect ratio when none is provided (avatar -> 1)", () => {
    render(<Placeholder kind="avatar" />);
    const node = screen.getByTestId("placeholder");
    expect(node).toHaveStyle({ aspectRatio: "1" });
  });

  it("renders the label and exposes role=img with aria-label when provided", () => {
    render(<Placeholder kind="avatar" label="JD" />);
    const node = screen.getByRole("img", { name: "JD" });
    expect(node).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("is aria-hidden when no label is provided", () => {
    render(<Placeholder kind="cover" />);
    const node = screen.getByTestId("placeholder");
    expect(node).toHaveAttribute("aria-hidden", "true");
  });

  it("applies kind-specific classes (avatar is rounded-full)", () => {
    render(<Placeholder kind="avatar" label="JD" />);
    const node = screen.getByTestId("placeholder");
    expect(node.className).toContain("rounded-full");
  });
});
