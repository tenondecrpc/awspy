// Editions index: past editions only (the current edition is served at the
// bare URL). Each edition is a soft panel with the year in the display serif
// and a button; with none yet, it says so plainly and links home.

import NextLink from "next/link";
import {
  BTN_OUTLINE,
  PageHeader,
  SECTION_Y,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import { EmptyState } from "@/components/organisms/EmptyState";

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
        title="Ediciones anteriores"
        description="Cada edición del AWS Community Day Paraguay queda archivada acá con su agenda, sus speakers y sus sponsors."
      />

      <section>
        <div className={`${WRAP} ${SECTION_Y} !pt-4`}>
          {pastEditions.length === 0 ? (
            <EmptyState
              variant="schedule"
              title="Aún no hay ediciones anteriores"
              description="Esta es la primera edición del AWS Community Day Paraguay. Cuando termine, la vamos a archivar acá."
              actionHref="/"
              actionLabel="Volver al inicio"
            />
          ) : (
            <ul
              className="m-0 grid list-none gap-4 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))]"
              aria-label="Lista de ediciones anteriores"
            >
              {pastEditions.map((year) => (
                <li
                  key={year}
                  className="flex min-w-0 flex-col items-start gap-4 rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)] p-6"
                >
                  <span className="font-display text-step-4 leading-none text-[var(--color-text-primary)]">
                    {year}
                  </span>
                  <p className="m-0 text-base text-[var(--color-text-secondary)]">
                    Agenda, speakers y sponsors archivados.
                  </p>
                  <NextLink
                    href={`/editions/${year}`}
                    aria-label={`Ver edición ${year}`}
                    className={BTN_OUTLINE}
                  >
                    Ver la edición
                    <GlyphIcon name="arrow-right" size={20} />
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
