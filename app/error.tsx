"use client";

// Spanish error boundary. Next.js calls this for any render error that is
// not handled by a more specific boundary. The UI gives the visitor a way
// out (retry or back to home) without exposing internal details.

import NextLink from "next/link";
import { IconBadge } from "@/components/atoms/IconBadge";
import {
  BTN_OUTLINE,
  WRAP,
} from "@/components/molecules/SectionPrimitives";

export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <section id="contenido-principal">
      <div
        className={`${WRAP} flex flex-col items-start gap-5 py-[clamp(2.5rem,10svh,6rem)]`}
      >
        <IconBadge name="info" size="lg" />
        <h1 className="m-0 font-display text-step-3 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
          Ocurrió un error
        </h1>
        <p className="m-0 max-w-[32rem] text-step-0 leading-[1.5] text-[var(--color-text-secondary)]">
          Algo no funcionó al cargar esta página. Probá nuevamente; si el
          problema persiste, escribinos para que lo revisemos.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => retry()}
            className={BTN_OUTLINE}
          >
            Reintentar
          </button>
          <NextLink href="/" className={BTN_OUTLINE}>
            Volver al inicio
          </NextLink>
        </div>
      </div>
    </section>
  );
}
