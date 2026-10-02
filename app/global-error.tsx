"use client";

// Last-resort boundary: it replaces the root layout, so the site's stylesheet
// and fonts are not available here. The markup stays plain and readable on the
// browser's own defaults, with only spacing and measure set inline.

import Link from "next/link";

export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="es-PY">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <title>Error - AWS Community Day Paraguay</title>
        <main style={{ maxWidth: "40rem", padding: "4rem 1.25rem" }}>
          <h1 style={{ fontWeight: 400, marginTop: 0 }}>Ocurrió un error</h1>
          <p style={{ lineHeight: 1.6 }}>
            Algo no funcionó al cargar esta página. Probá nuevamente; si el
            problema persiste, escribinos para que lo revisemos.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ minHeight: "2.75rem", padding: "0 1.5rem" }}
          >
            Reintentar
          </button>{" "}
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "0.75rem 0.5rem",
              marginLeft: "0.75rem",
            }}
          >
            Volver al inicio
          </Link>
        </main>
      </body>
    </html>
  );
}
