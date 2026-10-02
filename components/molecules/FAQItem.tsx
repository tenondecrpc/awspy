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
import { tieLast } from "@/lib/utils/typography";

type FAQItemProps = {
  item: FAQItemData;
  className?: string;
  /** When provided, the item starts open. */
  defaultOpen?: boolean;
};

export function FAQItem({
  item,
  className,
  defaultOpen = false,
}: FAQItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reactId = useId();
  const triggerId = `faq-trigger-${item.id}-${reactId}`;
  const panelId = `faq-panel-${item.id}-${reactId}`;

  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] bg-[var(--color-surface-elevated)]",
        className
      )}
    >
      <h3 className="m-0">
        <button
          id={triggerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-14 w-full items-center justify-between gap-4 rounded-[var(--radius-md)] px-5 py-4 text-left font-semibold text-step-0 leading-[1.3] text-[var(--color-text-primary)]"
        >
          <span>{tieLast(item.question)}</span>
          <svg
            aria-hidden="true"
            focusable="false"
            width={22}
            height={22}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "shrink-0 transition-transform duration-150",
              open && "rotate-180"
            )}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        className="px-5 pb-5 pr-10 text-step-0 leading-[1.6] text-[var(--color-text-secondary)]"
      >
        <p className="m-0">{tieLast(item.answer)}</p>
      </div>
    </div>
  );
}
