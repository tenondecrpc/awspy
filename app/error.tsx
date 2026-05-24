"use client";

// Spanish error boundary. Next.js calls this for any render error that is
// not handled by a more specific boundary. The UI gives the visitor a way
// out (back to home or retry) without exposing internal details.

import { useEffect } from "react";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { Button } from "@/components/atoms/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The hosting platform's runtime logs are the only observability surface
    // for v1 (FR-038). On AWS Amplify these surface in CloudWatch; on other
    // platforms they surface in the platform's runtime/log console.
    console.error("[home/error]", error);
  }, [error]);

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
            <Button onClick={() => reset()} variant="primary" size="md">
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
