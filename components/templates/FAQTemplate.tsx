import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { FAQList } from "@/components/organisms/FAQList";
import type { FAQItem } from "@/lib/content/faq";

type FAQTemplateProps = {
  items: FAQItem[];
};

export function FAQTemplate({ items }: FAQTemplateProps) {
  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          level={1}
          eyebrow="Ayuda"
          eyebrowGlyph="book"
          title="Preguntas frecuentes"
          description="Lo más consultado sobre el AWS Community Day Paraguay. ¿No encontrás tu pregunta? Escribinos."
          className="mb-14"
        />
        <div className="max-w-3xl">
          <FAQList items={items} />
        </div>
      </Container>
    </Section>
  );
}
