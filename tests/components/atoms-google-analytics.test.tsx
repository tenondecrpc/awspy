import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { GoogleAnalytics } from "@/components/atoms/GoogleAnalytics";

// `next/script` injects its tags after hydration, which jsdom never reaches.
// The stub renders inert elements carrying the props the atom passed.
vi.mock("next/script", () => ({
  default: ({
    children,
    id,
    src,
    strategy,
  }: {
    children?: ReactNode;
    id?: string;
    src?: string;
    strategy?: string;
  }) => (
    <div data-script data-id={id} data-src={src} data-strategy={strategy}>
      {children}
    </div>
  ),
}));

function scripts(container: HTMLElement) {
  return Array.from(container.querySelectorAll("[data-script]"));
}

describe("GoogleAnalytics", () => {
  it("loads gtag.js for the measurement ID after hydration", () => {
    const { container } = render(
      <GoogleAnalytics measurementId="G-AB12CD34EF" />
    );
    const [loader] = scripts(container);
    expect(loader).toHaveAttribute(
      "data-src",
      "https://www.googletagmanager.com/gtag/js?id=G-AB12CD34EF"
    );
    expect(loader).toHaveAttribute("data-strategy", "afterInteractive");
  });

  it("configures the property with Google signals and ad personalization off", () => {
    const { container } = render(
      <GoogleAnalytics measurementId="G-AB12CD34EF" />
    );
    const [, config] = scripts(container);
    expect(config).toHaveAttribute("data-id", "google-analytics");
    expect(config).toHaveAttribute("data-strategy", "afterInteractive");
    const source = config.textContent ?? "";
    expect(source).toContain('gtag("config","G-AB12CD34EF",');
    expect(source).toContain("allow_google_signals:false");
    expect(source).toContain("allow_ad_personalization_signals:false");
  });
});
