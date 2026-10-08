// Keynote card molecule, drawn for the home page's navy band: the square
// portrait over the name in the display serif, the role, the organization, a
// short red rule and, when Sessionize provides one, a LinkedIn link.
//
// The portrait is square because the photos are, so it is shown whole.

import { LinkedInLink } from "@/components/atoms/LinkedInLink";
import { Frame } from "@/components/molecules/SectionPrimitives";
import { cn } from "@/lib/utils/cn";
import type { KeynoteCardData } from "@/lib/utils/keynotes";
import { tieLast } from "@/lib/utils/typography";

type KeynoteCardProps = {
  keynote: KeynoteCardData;
  className?: string;
};

export function KeynoteCard({ keynote, className }: KeynoteCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-on-inverse)]",
        className
      )}
    >
      <Frame
        label={keynote.name}
        photo={keynote.photo}
        position="50% 20%"
        className="aspect-square w-full"
        sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"
      />

      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6 [overflow-wrap:anywhere]">
        <h3 className="m-0 font-display text-step-2 leading-[1.08] text-[var(--color-text-on-inverse)]">
          {tieLast(keynote.name)}
        </h3>
        <p className="m-0 mt-3 text-step-0 font-semibold leading-snug text-[var(--color-national-red-on-dark)]">
          {tieLast(keynote.role)}
        </p>
        <p className="m-0 mt-1 text-base text-[var(--color-text-on-inverse-secondary)]">
          {tieLast(keynote.organization)}
        </p>
        <span
          aria-hidden="true"
          className="mt-4 block h-[3px] w-12 bg-[var(--color-national-red-on-dark)]"
        />

        {keynote.linkedinUrl ? (
          <div className="mt-auto pt-5">
            <LinkedInLink
              href={keynote.linkedinUrl}
              name={keynote.name}
              tone="inverse"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}
