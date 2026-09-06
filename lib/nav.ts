// Site-wide navigation entries. The Spanish copy lives here because every
// header and footer renders the same list. Routes stay in English per
// constitution Principle VII.

export type NavEntry = {
  href: string;
  label: string;
  /** When true, this entry is hidden from the primary header nav and only
   *  appears in the footer or in-context CTAs (e.g. Code of Conduct). */
  footerOnly?: boolean;
};

export const PRIMARY_NAV: readonly NavEntry[] = [
  { href: "/speakers", label: "Speakers" },
  { href: "/schedule", label: "Agenda" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/venue", label: "Sede" },
  { href: "/team", label: "Equipo" },
  { href: "/volunteers", label: "Voluntarios" },
  { href: "/faq", label: "Preguntas" },
  { href: "/cfp", label: "CFP" },
  { href: "/register", label: "Registrarme" },
] as const;

export const FOOTER_NAV: readonly NavEntry[] = [
  ...PRIMARY_NAV,
  { href: "/code-of-conduct", label: "Código de Conducta", footerOnly: true },
  { href: "/editions", label: "Ediciones anteriores", footerOnly: true },
] as const;
