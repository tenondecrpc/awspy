import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPage from "@/app/privacy/page";

afterEach(() => vi.unstubAllEnvs());

describe("PrivacyPage", () => {
  it("states that this site collects no personal data when analytics is off", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "");
    render(<PrivacyPage />);

    expect(
      screen.getByText(/este sitio no recopila datos personales/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/no está activa/i)).toBeInTheDocument();
  });

  it("discloses cookies without claiming no data collection when analytics is on", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-ABCDEFGH12");
    render(<PrivacyPage />);

    expect(
      screen.getByText(/usamos google analytics para medir las visitas/i)
    ).toHaveTextContent(/guarda cookies en tu navegador/i);
    expect(
      screen.queryByText(/este sitio no recopila datos personales/i)
    ).not.toBeInTheDocument();
  });
});
