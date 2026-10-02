// Spanish 404 page. Served whenever a route or `notFound()` call resolves to
// a missing resource (e.g. unknown speaker slug, unknown edition year).

import type { Metadata } from "next";
import NextLink from "next/link";
import { IconBadge } from "@/components/atoms/IconBadge";
import {
  BTN_OUTLINE,
  BTN_PRIMARY,
  WRAP,
} from "@/components/molecules/SectionPrimitives";

export const metadata: Metadata = {
  title: "Página no encontrada - AWS Community Day Paraguay",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section id="contenido-principal">
      <div
        className={`${WRAP} flex flex-col items-start gap-5 py-[clamp(2.5rem,10svh,6rem)]`}
      >
        <IconBadge name="route" size="lg" />
        <h1 className="m-0 font-display text-step-3 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
          Página no encontrada
        </h1>
        <p className="m-0 max-w-[32rem] text-step-0 leading-[1.5] text-[var(--color-text-secondary)]">
          La página que buscás no existe o ya no está disponible. Volvé al
          inicio y desde ahí podés navegar a speakers, agenda, sponsors y más.
        </p>
        <nav aria-label="Otras páginas" className="flex flex-wrap gap-3 pt-2">
          <NextLink href="/" className={BTN_OUTLINE}>
            Inicio
          </NextLink>
          <NextLink href="/schedule" className={BTN_OUTLINE}>
            Agenda
          </NextLink>
          <NextLink href="/register" className={BTN_PRIMARY}>
            Registro
          </NextLink>
        </nav>
      </div>
    </section>
  );
}
