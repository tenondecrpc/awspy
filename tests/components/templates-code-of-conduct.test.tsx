import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeOfConductTemplate } from "@/components/templates/CodeOfConductTemplate";
import { getCodeOfConduct } from "@/lib/content/code-of-conduct";

describe("CodeOfConductTemplate", () => {
  it("renders the versioned code of conduct body", () => {
    const codeOfConduct = getCodeOfConduct("2026");
    render(<CodeOfConductTemplate codeOfConduct={codeOfConduct} />);

    expect(
      screen.getByRole("heading", { level: 1, name: /código de conducta/i })
    ).toBeInTheDocument();
    // The body is Markdown rendered to real elements, not raw source.
    expect(screen.queryByText(/^---$/)).not.toBeInTheDocument();
  });
});
