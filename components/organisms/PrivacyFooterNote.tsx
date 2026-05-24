// Per FR-036: Spanish privacy notice plus a link to Eventbrite's privacy
// policy. Renders inside SiteFooter; can also be reused on /register.

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
      según su política de privacidad.
    </p>
  );
}
