import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/organisms/EmptyState";

describe("EmptyState", () => {
  it("renders the default Spanish copy when no props are given", () => {
    render(<EmptyState />);
    expect(
      screen.getByRole("heading", { name: "Próximamente" })
    ).toBeInTheDocument();
    expect(screen.getByText(/trabajando/i)).toBeInTheDocument();
  });

  it("renders custom title and description", () => {
    render(
      <EmptyState
        title="Aún no hay charlas confirmadas"
        description="Estamos seleccionando las propuestas. Pronto las publicaremos."
      />
    );
    expect(
      screen.getByRole("heading", { name: "Aún no hay charlas confirmadas" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Estamos seleccionando las propuestas. Pronto las publicaremos."
      )
    ).toBeInTheDocument();
  });

  it("renders an action link when actionHref + actionLabel are provided", () => {
    render(
      <EmptyState
        title="Registro próximamente"
        description="Pronto abriremos el registro."
        actionHref="mailto:hola@awscommunitydayparaguay.com"
        actionLabel="Avisame por mail"
      />
    );
    const link = screen.getByRole("link", { name: "Avisame por mail" });
    expect(link).toHaveAttribute(
      "href",
      "mailto:hola@awscommunitydayparaguay.com"
    );
  });

  it("does not render an action when only one of href/label is provided", () => {
    render(
      <EmptyState
        title="Sin agenda"
        description="No hay agenda publicada"
        actionHref="/cfp"
      />
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the heading at the requested semantic level", () => {
    render(
      <EmptyState title="Detalle" description="Sub bloque" headingLevel={3} />
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Detalle" })
    ).toBeInTheDocument();
  });

  it("uses role=status so screen readers announce the empty state without being intrusive", () => {
    const { container } = render(<EmptyState />);
    const status = container.querySelector('[role="status"]');
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-live", "polite");
  });
});
