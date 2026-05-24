import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
    DecorativePattern,
    AWS_ARCH_ICONS,
} from "@/components/atoms/DecorativePattern";

describe("DecorativePattern atom", () => {
    it("renders an aria-hidden wrapper", () => {
        render(<DecorativePattern />);
        expect(screen.getByTestId("decorative-pattern")).toHaveAttribute(
            "aria-hidden",
            "true"
        );
    });

    it("renders the right number of icon tiles for the requested density", () => {
        const { container } = render(
            <DecorativePattern density="low" seed="t1" />
        );
        // density="low" => 6 columns * 3 rows = 18 cells
        const imgs = container.querySelectorAll("img");
        expect(imgs).toHaveLength(18);
    });

    it("uses a deterministic seed: same seed = same first icon", () => {
        const { container: a } = render(
            <DecorativePattern density="low" seed="seed-A" />
        );
        const { container: b } = render(
            <DecorativePattern density="low" seed="seed-A" />
        );
        const firstA = a.querySelector("img")?.getAttribute("src");
        const firstB = b.querySelector("img")?.getAttribute("src");
        expect(firstA).toBe(firstB);
    });

    it("uses different seeds to produce a different first icon (most of the time)", () => {
        // Not a strict guarantee for any pair, but for these particular seeds it
        // holds with the current PRNG. If the implementation changes and this
        // becomes flaky, choose two seeds that demonstrably differ.
        const { container: a } = render(
            <DecorativePattern density="low" seed="alpha" />
        );
        const { container: b } = render(
            <DecorativePattern density="low" seed="zulu" />
        );
        const firstA = a.querySelector("img")?.getAttribute("src");
        const firstB = b.querySelector("img")?.getAttribute("src");
        expect(firstA).not.toBe(firstB);
    });

    it("only references icons from the curated AWS_ARCH_ICONS list", () => {
        const { container } = render(
            <DecorativePattern density="medium" seed="curated" />
        );
        const imgs = Array.from(container.querySelectorAll("img"));
        const fileNames = imgs.map((img) =>
            img.getAttribute("src")?.split("/").pop() ?? ""
        );
        for (const name of fileNames) {
            expect(AWS_ARCH_ICONS).toContain(name as (typeof AWS_ARCH_ICONS)[number]);
        }
    });

    it("renders a custom pattern as a background when customPatternHref is set", () => {
        render(
            <DecorativePattern customPatternHref="/assets/hero/pattern.svg" />
        );
        const wrapper = screen.getByTestId("decorative-pattern");
        expect(wrapper).toHaveAttribute("data-variant", "custom");
        expect(wrapper.getAttribute("style")).toContain(
            "/assets/hero/pattern.svg"
        );
    });
});
