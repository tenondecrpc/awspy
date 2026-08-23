"use client";

// Spanish error boundary. Next.js calls this for any render error that is
// not handled by a more specific boundary. The UI gives the visitor a way
// out (back to home or retry) without exposing internal details.

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { Button } from "@/components/atoms/Button";

export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <Section spacing="lg">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
          <Heading level={1}>Ocurrió un error</Heading>
          <p className="text-[var(--color-text-secondary)]">
            Algo no funcionó al cargar esta página. Probá nuevamente; si el
            problema persiste, escribinos para que lo revisemos.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => retry()} variant="primary" size="md">
              Reintentar
            </Button>
            <Button as="a" href="/" variant="secondary" size="md">
              Volver al inicio
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
