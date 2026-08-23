"use client";

import Link from "next/link";

export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="es-PY">
      <body>
        <title>Error - AWS Community Day Paraguay</title>
        <main>
          <h1>Ocurrió un error</h1>
          <p>
            Algo no funcionó al cargar esta página. Probá nuevamente; si el
            problema persiste, escribinos para que lo revisemos.
          </p>
          <button type="button" onClick={() => retry()}>
            Reintentar
          </button>{" "}
          <Link href="/">Volver al inicio</Link>
        </main>
      </body>
    </html>
  );
}
