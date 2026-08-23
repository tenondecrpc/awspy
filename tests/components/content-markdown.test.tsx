import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RenderMarkdown } from "@/lib/content/markdown";

describe("RenderMarkdown", () => {
  it("renders safe web links with external-link protection", () => {
    render(
      <RenderMarkdown source="Read [the policy](https://example.test)." />
    );
    expect(screen.getByRole("link", { name: "the policy" })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });

  it("renders an unsafe link label as inert text", () => {
    render(<RenderMarkdown source="Read [this](javascript:alert(1))." />);
    expect(screen.getByText("this")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "this" })
    ).not.toBeInTheDocument();
  });
});
