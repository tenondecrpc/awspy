// Eventbrite registration button. Renders an anchor styled as a button that
// opens the public Eventbrite event page in a new tab. We deliberately do not
// embed the Eventbrite widget script: the AWS Community Days in Mexico and
// Colombia (the regional reference points cited in research R2) both use a
// plain external link, and skipping the widget eliminates third-party
// JavaScript on the home and register pages.
//
// When the URL is missing, the component renders the "Registro proximamente"
// alternative with a mailto fallback so editors can ship the page before the
// Eventbrite event is published.

import { Button } from "@/components/atoms/Button";

type EventbriteRegisterButtonProps = {
  eventbriteEventUrl: string | null;
  /** Used as the mailto fallback when the URL is missing. */
  contactEmail: string;
  /** Visible label for the button. */
  label?: string;
};

export function EventbriteRegisterButton({
  eventbriteEventUrl,
  contactEmail,
  label = "Registrarme",
}: EventbriteRegisterButtonProps) {
  if (!eventbriteEventUrl) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
          Registro próximamente
        </p>
        <Button
          as="a"
          href={`mailto:${contactEmail}?subject=Avisame%20cuando%20abra%20el%20registro`}
          variant="secondary"
          size="md"
        >
          Avisame por mail
        </Button>
      </div>
    );
  }

  return (
    <Button
      as="a"
      href={eventbriteEventUrl}
      target="_blank"
      rel="noopener noreferrer"
      variant="primary"
      size="lg"
    >
      {label}
    </Button>
  );
}
