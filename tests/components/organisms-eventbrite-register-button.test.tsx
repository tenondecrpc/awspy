import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EventbriteRegisterButton } from "@/components/organisms/EventbriteRegisterButton";

describe("EventbriteRegisterButton", () => {
  it("renders the alternative when the URL is null", () => {
    render(
      <EventbriteRegisterButton
        eventbriteEventUrl={null}
        contactEmail="hola@awscommunitydayparaguay.com"
      />
    );
    expect(screen.getByText(/registro próximamente/i)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /avisame por mail/i });
    expect(link).toHaveAttribute(
      "href",
      "mailto:hola@awscommunitydayparaguay.com?subject=Avisame%20cuando%20abra%20el%20registro"
    );
  });

  it("renders an external link to Eventbrite when the URL is provided", () => {
    render(
      <EventbriteRegisterButton
        eventbriteEventUrl="https://www.eventbrite.com/e/aws-community-day-paraguay-2026-1234567890123"
        contactEmail="hola@awscommunitydayparaguay.com"
      />
    );
    const link = screen.getByRole("link", { name: /registrarme/i });
    expect(link).toHaveAttribute(
      "href",
      "https://www.eventbrite.com/e/aws-community-day-paraguay-2026-1234567890123"
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("does not inject any third-party script", () => {
    const { container } = render(
      <EventbriteRegisterButton
        eventbriteEventUrl="https://www.eventbrite.com/e/foo-1234567890123"
        contactEmail="hola@awscommunitydayparaguay.com"
      />
    );
    // The link-only approach must not load eb_widgets.js or any other
    // Eventbrite asset.
    expect(container.querySelectorAll("script")).toHaveLength(0);
  });

  it("uses a custom label when provided", () => {
    render(
      <EventbriteRegisterButton
        eventbriteEventUrl="https://www.eventbrite.com/e/foo-1234567890123"
        contactEmail="hola@awscommunitydayparaguay.com"
        label="Quiero ir"
      />
    );
    expect(
      screen.getByRole("link", { name: /quiero ir/i })
    ).toBeInTheDocument();
  });
});
