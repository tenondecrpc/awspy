// Spanish privacy notice for the external attendee and volunteer flows.
// Renders inside SiteFooter; can also be reused on conversion pages.

import { Link } from "@/components/atoms/Link";

export function PrivacyFooterNote() {
  return (
    <p className="text-sm text-[var(--color-text-secondary)]">
      Este sitio no recopila datos personales. El registro y la compra de
      entradas se hacen a través de{" "}
      <Link
        href="https://www.eventbrite.com/help/en-us/articles/460838/eventbrite-privacy-policy/"
        external
      >
        Eventbrite
      </Link>{" "}
      según su política de privacidad. Las postulaciones de voluntariado se
      realizan mediante Google Forms y están sujetas a la{" "}
      <Link href="https://policies.google.com/privacy?hl=es-419" external>
        Política de Privacidad de Google
      </Link>
      .
    </p>
  );
}
