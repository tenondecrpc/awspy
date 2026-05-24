// FAQ list organism. Renders a stack of FAQItem accordions. Empty state for
// the unlikely case where no FAQ entries are seeded.

import { FAQItem } from "@/components/molecules/FAQItem";
import { EmptyState } from "@/components/organisms/EmptyState";
import type { FAQItem as FAQItemData } from "@/lib/content/faq";

type FAQListProps = {
  items: FAQItemData[];
};

export function FAQList({ items }: FAQListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Estamos preparando las preguntas frecuentes"
        description="Pronto vamos a publicar las dudas más comunes con sus respuestas."
      />
    );
  }
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <FAQItem key={item.id} item={item} defaultOpen={index === 0} />
      ))}
    </div>
  );
}
