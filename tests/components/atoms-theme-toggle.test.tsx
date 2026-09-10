import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { THEME_STORAGE_KEY } from "@/lib/theme";

describe("ThemeToggle", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.removeProperty("color-scheme");
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("exposes an accessible toggle state", async () => {
    document.documentElement.dataset.theme = "light";
    render(<ThemeToggle />);

    const toggle = screen.getByRole("button", {
      name: /cambiar entre modo claro y oscuro/i,
    });
    await waitFor(() =>
      expect(toggle).toHaveAttribute("aria-pressed", "false")
    );
  });

  it("switches themes and persists the choice", async () => {
    document.documentElement.dataset.theme = "light";
    render(<ThemeToggle />);

    const toggle = screen.getByRole("button", {
      name: /cambiar entre modo claro y oscuro/i,
    });
    fireEvent.click(toggle);

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(toggle);
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("still switches the in-page theme when browser storage is blocked", () => {
    document.documentElement.dataset.theme = "light";
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage blocked");
    });
    render(<ThemeToggle />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /cambiar entre modo claro y oscuro/i,
      })
    );

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});
