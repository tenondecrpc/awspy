import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { FAQList } from "@/components/organisms/FAQList";
import type { FAQItem } from "@/lib/content/faq";

type FAQTemplateProps = {
  items: FAQItem[];
};

export function FAQTemplate({ items }: FAQTemplateProps) {
  return (
    <Section spacing="lg">
      <Container>
        <div className="mb-10 max-w-3xl space-y-3">
          <Heading level={1}>Preguntas frecuentes</Heading>
          <p className="text-[var(--color-text-secondary)]">
            Lo más consultado sobre el AWS Community Day Paraguay. ¿No encontrás
            tu pregunta? Escribinos.
          </p>
        </div>
        <div className="max-w-3xl">
          <FAQList items={items} />
        </div>
      </Container>
    </Section>
  );
}
