// A horizontal rule drawn as the Paraguayan tricolor: red over white over
// blue, the order of the flag. It is the site's structural divider, used under
// the header, above the footer and at the head of sections, so the national
// colors are part of the layout and not an accent sprinkled on top.
//
// Colors come from tokens only (`local/no-color-literals`). It is decorative:
// `aria-hidden`, never the only carrier of meaning.

import { cn } from "@/lib/utils/cn";

type FlagRuleProps = {
  /** `thin` is a 6px divider; `bold` is 12px and anchors a section head. */
  weight?: "thin" | "bold";
  className?: string;
};

const HEIGHT = {
  thin: "h-[6px]",
  bold: "h-[12px]",
} as const;

export function FlagRule({ weight = "thin", className }: FlagRuleProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("grid w-full grid-rows-3", HEIGHT[weight], className)}
    >
      <span className="bg-[var(--color-national-red)]" />
      <span className="bg-[var(--color-surface-elevated)]" />
      <span className="bg-[var(--color-accent)]" />
    </div>
  );
}
