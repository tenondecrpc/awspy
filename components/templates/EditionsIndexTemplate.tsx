// Editions index template, rebuilt from the "Ediciones" mockup
// (`AWS Community Day Paraguay (colored)/Ediciones.dc.html`). Lists past
// editions only (the current edition is served at the bare URL). When there
// are no past editions yet, it renders the mockup's dashed empty-state panel
// so the route still has meaningful content.
//
// Colors come exclusively from the design tokens in `app/globals.css`.

import NextLink from "next/link";
import {
  PageHeader,
  SECTION_BORDER,
  WRAP,
} from "@/components/molecules/SectionPrimitives";

type EditionsIndexTemplateProps = {
  pastEditions: string[];
  className?: string;
};

export function EditionsIndexTemplate({
  pastEditions,
  className,
}: EditionsIndexTemplateProps) {
  return (
    <div className={className}>
      <PageHeader
        eyebrow="Archivo"
        title="Ediciones anteriores"
        description="Cada edición del AWS Community Day Paraguay queda archivada acá con su agenda, sus speakers y sus sponsors."
      />

      <section className={SECTION_BORDER}>
        <div className={`${WRAP} py-[64px]`}>
          {pastEditions.length === 0 ? (
            <div className="border border-dashed border-[var(--color-border-subtle)] p-[44px] text-center">
              <p className="m-0 mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Sin ediciones anteriores
              </p>
              <h2 className="m-0 mb-2.5 text-[21px] font-extrabold tracking-[-0.025em] text-[var(--color-text-primary)]">
                Aún no hay ediciones anteriores
              </h2>
              <p className="mx-auto mb-[22px] max-w-[32rem] text-[15px] text-[var(--color-text-secondary)]">
                Esta es la primera edición del AWS Community Day Paraguay.
                Cuando termine, vamos a archivarla acá con su agenda, sus
                speakers y sus sponsors.
              </p>
              <NextLink
                href="/"
                className="inline-flex items-center rounded-[4px] bg-[var(--color-action)] px-[26px] py-[13px] text-[15px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
              >
                Volver al inicio
              </NextLink>
            </div>
          ) : (
            <ul
              className="border-t border-[var(--color-text-primary)]"
              aria-label="Lista de ediciones anteriores"
            >
              {pastEditions.map((year) => (
                <li
                  key={year}
                  className="grid items-center gap-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] px-1 py-[26px] [grid-template-columns:minmax(90px,120px)_minmax(0,1fr)_minmax(130px,190px)]"
                >
                  <span className="text-[34px] font-extrabold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
                    {year}
                  </span>
                  <div className="min-w-0">
                    <h2 className="m-0 mb-1 text-[19px] font-bold tracking-[-0.02em]">
                      Edición {year}
                    </h2>
                    <p className="m-0 text-[14.5px] text-[var(--color-text-muted)]">
                      Agenda, speakers y sponsors archivados.
                    </p>
                  </div>
                  <NextLink
                    href={`/editions/${year}`}
                    aria-label={`Ver edición ${year}`}
                    className="inline-flex items-center justify-self-start whitespace-nowrap rounded-[4px] bg-[var(--color-text-primary)] px-[22px] py-[11px] text-[14.5px] font-semibold text-[var(--color-surface)] transition-colors hover:bg-[var(--color-action)] hover:text-[var(--color-text-on-action)]"
                  >
                    Ver la edición
                  </NextLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
