import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingGrid } from "@/components/atoms/LoadingGrid";

describe("LoadingGrid atom", () => {
    it("exposes role=status and aria-busy=true with a Spanish loading label", () => {
        render(
            <LoadingGrid columns={3} rows={2} loadingLabel="Cargando speakers" />
        );
        const grid = screen.getByTestId("loading-grid");
        expect(grid).toHaveAttribute("role", "status");
        expect(grid).toHaveAttribute("aria-busy", "true");
        expect(screen.getByText("Cargando speakers")).toHaveClass("sr-only");
    });

    it("renders columns * rows skeleton cards", () => {
        render(
            <LoadingGrid columns={3} rows={2} loadingLabel="Cargando" />
        );
        expect(screen.getAllByTestId("loading-grid-item")).toHaveLength(6);
    });

    it("encodes the column and row counts via data attributes", () => {
        render(
            <LoadingGrid columns={2} rows={3} loadingLabel="Cargando" />
        );
        const grid = screen.getByTestId("loading-grid");
        expect(grid).toHaveAttribute("data-columns", "2");
        expect(grid).toHaveAttribute("data-rows", "3");
    });
});
