// Eventbrite registration button. Renders an anchor styled as the one orange
// button that opens the public Eventbrite event page in a new tab. We
// deliberately do not embed the Eventbrite widget script: a plain external link
// keeps third-party JavaScript off the home and register pages.
//
// When the URL is missing, the component renders the "Registro próximamente"
// alternative with a mailto fallback so editors can ship the page before the
// Eventbrite event is published.

import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import {
  BTN_OUTLINE,
  BTN_PRIMARY,
} from "@/components/molecules/SectionPrimitives";
import { cn } from "@/lib/utils/cn";

type EventbriteRegisterButtonProps = {
  eventbriteEventUrl: string | null;
  /** Used as the mailto fallback when the URL is missing. */
  contactEmail: string;
  /** Visible label for the button. */
  label?: string;
  className?: string;
};

export function EventbriteRegisterButton({
  eventbriteEventUrl,
  contactEmail,
  label = "Registrarme",
  className,
}: EventbriteRegisterButtonProps) {
  if (!eventbriteEventUrl) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="m-0 text-sm font-semibold text-[var(--color-text-secondary)]">
          Registro próximamente
        </p>
        <a
          href={`mailto:${contactEmail}?subject=Avisame%20cuando%20abra%20el%20registro`}
          className={cn(BTN_OUTLINE, className)}
        >
          <GlyphIcon name="mail" size={20} />
          Avisame por mail
        </a>
      </div>
    );
  }

  return (
    <a
      href={eventbriteEventUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(BTN_PRIMARY, className)}
    >
      {label}
      <GlyphIcon name="external" size={20} />
    </a>
  );
}
