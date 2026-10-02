import { describe, expect, it } from "vitest";
import { tieLast } from "@/lib/utils/typography";

const NBSP = "\u00a0";

describe("tieLast", () => {
  it("ties the last two words of a three-word text", () => {
    expect(tieLast("Patrones de despliegue")).toBe(
      `Patrones de${NBSP}despliegue`
    );
  });

  it("returns an empty string for missing text", () => {
    expect(tieLast(null)).toBe("");
    expect(tieLast(undefined)).toBe("");
    expect(tieLast("")).toBe("");
  });

  it("leaves one- and two-word texts untouched, minus trailing space", () => {
    expect(tieLast("Speakers  ")).toBe("Speakers");
    expect(tieLast("Cecilia Neira")).toBe("Cecilia Neira");
  });

  it("does not tie two words that would overflow a narrow column", () => {
    const text = "Arquitectura de microservicios serverless";
    expect(tieLast(text)).toBe(text);
  });

  it("keeps line breaks and inner spacing of multi-paragraph text", () => {
    const text = "Primer párrafo.\n\nSegundo  párrafo con cierre corto.";
    expect(tieLast(text)).toBe(
      `Primer párrafo.\n\nSegundo  párrafo con cierre${NBSP}corto.`
    );
  });

  it("does not join two words that sit on different lines", () => {
    const text = "Una línea larga\nfinal";
    expect(tieLast(text)).toBe(text);
  });

  it("removes only trailing whitespace", () => {
    expect(tieLast("Ver la agenda completa \n")).toBe(
      `Ver la agenda${NBSP}completa`
    );
  });
});
