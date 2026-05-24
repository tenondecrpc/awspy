// Editions index template. Lists past editions only (the current edition
// is served at the bare URL). When there are no past editions yet, renders
// an empty state so the route still has meaningful content.

import NextLink from "next/link";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { EmptyState } from "@/components/organisms/EmptyState";
import { cn } from "@/lib/utils/cn";

type EditionsIndexTemplateProps = {
  pastEditions: string[];
  className?: string;
};

export function EditionsIndexTemplate({
  pastEditions,
  className,
}: EditionsIndexTemplateProps) {
  return (
    <Section spacing="lg" className={className}>
      <Container>
        <div className="mb-10 max-w-3xl space-y-3">
          <Heading level={1}>Ediciones anteriores</Heading>
          <p className="text-[var(--color-text-secondary)]">
            Archivo de las ediciones pasadas del AWS Community Day Paraguay.
            La edición vigente vive en el sitio principal.
          </p>
        </div>

        {pastEditions.length === 0 ? (
          <EmptyState
            title="Aún no hay ediciones anteriores"
            description="Esta es la primera edición del AWS Community Day Paraguay. Cuando termine, vamos a archivarla acá."
            actionHref="/"
            actionLabel="Volver al inicio"
          />
        ) : (
          <ul
            className={cn(
              "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            )}
            aria-label="Lista de ediciones anteriores"
          >
            {pastEditions.map((year) => (
              <li key={year}>
                <NextLink
                  href={`/editions/${year}`}
                  className="block rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-6 shadow-sm hover:bg-[var(--color-surface-muted)]"
                >
                  <p className="text-3xl font-bold">{year}</p>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    Ver edición {year}
                  </p>
                </NextLink>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
