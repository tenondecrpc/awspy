"use client";

// Accessible FAQ accordion item. Exposes:
//   - role=button on the trigger (already a real <button>)
//   - aria-expanded + aria-controls
//   - Enter and Space activate (default for <button>)
//
// Multiple items can be open at the same time; the parent does not enforce
// exclusivity. The arrow-key roving-tabindex pattern is intentionally not
// used here because each item is its own tab stop, which is the simpler
// and equally accessible pattern for a long FAQ.

import { useId, useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { FAQItem as FAQItemData } from "@/lib/content/faq";

type FAQItemProps = {
  item: FAQItemData;
  className?: string;
  /** When provided, the item starts open. Used for the first item on the
   *  FAQ page to give the visitor immediate context. */
  defaultOpen?: boolean;
};

export function FAQItem({ item, className, defaultOpen = false }: FAQItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reactId = useId();
  const triggerId = `faq-trigger-${item.id}-${reactId}`;
  const panelId = `faq-panel-${item.id}-${reactId}`;

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-surface-muted)] bg-[var(--color-surface)]",
        className
      )}
    >
      <h3>
        <button
          id={triggerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-semibold"
        >
          <span>{item.question}</span>
          <span aria-hidden="true" className="text-[var(--color-accent)]">
            {open ? "-" : "+"}
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        className="px-4 pb-4 text-[var(--color-text-secondary)]"
      >
        <p>{item.answer}</p>
      </div>
    </div>
  );
}
