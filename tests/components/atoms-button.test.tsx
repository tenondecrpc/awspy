import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "@/components/atoms/Button";

describe("Button", () => {
  it("renders a real <button> by default and triggers click handlers", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Registrarme</Button>);
    const btn = screen.getByRole("button", { name: "Registrarme" });
    expect(btn.tagName).toBe("BUTTON");
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("activates with keyboard (Enter)", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Enviar</Button>);
    const btn = screen.getByRole("button", { name: "Enviar" });
    btn.focus();
    expect(document.activeElement).toBe(btn);
    fireEvent.keyDown(btn, { key: "Enter" });
    fireEvent.click(btn); // browsers translate Enter to click
    expect(onClick).toHaveBeenCalled();
  });

  it('renders as an anchor when as="a" and href is provided', () => {
    render(
      <Button as="a" href="/register">
        Ir al registro
      </Button>
    );
    const link = screen.getByRole("link", { name: "Ir al registro" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/register");
  });

  it("communicates disabled state to assistive tech (aria-disabled)", () => {
    render(<Button disabled>No disponible</Button>);
    const btn = screen.getByRole("button", { name: "No disponible" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        No
      </Button>
    );
    fireEvent.click(screen.getByRole("button", { name: "No" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies the requested variant class", () => {
    render(<Button variant="secondary">Secundario</Button>);
    const btn = screen.getByRole("button", { name: "Secundario" });
    // Class names are stable - assert on the variant-defining token.
    expect(btn.className).toMatch(/var\(--color-accent\)/);
  });

  it("forwards additional props (e.g. aria-label)", () => {
    render(<Button aria-label="enviar formulario">flecha</Button>);
    const btn = screen.getByRole("button", { name: "enviar formulario" });
    expect(btn).toBeInTheDocument();
  });
});
