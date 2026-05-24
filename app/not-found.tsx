// Spanish 404 page. Served whenever a route or `notFound()` call resolves to
// a missing resource (e.g. unknown speaker slug, unknown edition year).

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { Button } from "@/components/atoms/Button";

export default function NotFound() {
  return (
    <Section spacing="lg">
      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
          <Heading level={1}>Página no encontrada</Heading>
          <p className="text-[var(--color-text-secondary)]">
            La página que buscás no existe o ya no está disponible. Volvé a la
            home y desde ahí podés navegar a speakers, agenda, sponsors y más.
          </p>
          <Button as="a" href="/" variant="primary" size="md">
            Volver al inicio
          </Button>
        </div>
      </Container>
    </Section>
  );
}
