# Sistema de diseño: AWS Community Day Paraguay

Identidad **editorial paraguaya**: papel, encaje y bandera. Este directorio
documenta las decisiones; la fuente de verdad del código es
[`app/globals.css`](../app/globals.css) (colores, tipografía, escalas) y los
primitivos de `components/`.

## Contenido

| Archivo | Para qué |
| --- | --- |
| [foundations.md](foundations.md) | Color, tipografía, espaciado, movimiento y accesibilidad vigentes |
| [components.md](components.md) | Inventario de componentes, motivos y reglas de uso |
| [mobile-patterns.md](mobile-patterns.md) | Patrones mobile y criterios de aceptación |
| [brand-alignment.md](brand-alignment.md) | Relación con la marca AWS y estatus del evento |
| [roadmap.md](roadmap.md) | Qué está hecho y qué falta |
| [scripts/check-contrast.mjs](scripts/check-contrast.mjs) | Verifica el contraste AA de la paleta |

## Concepto

- **Fotografía como protagonista.** Fotos reales a gran escala; el título va
  en un bloque sólido sobre la imagen, no en tarjetas.
- **Motivo propio de encaje.** `Lace` es geometría radial original, inspirada
  en la estructura del ñandutí (anillos de pétalos y puntos). No reproduce el
  trabajo de ninguna artesana.
- **Calma.** Sin franjas de color ni adornos repetidos: un hilo fino separa
  las partes, todo vive sobre el mismo papel y la serif queda para los
  títulos de página y de sección.
- **Papel, no pantalla.** Fondo cálido, tinta azul medianoche, esquinas casi
  rectas, líneas finas en lugar de sombras.
- **Texto concreto.** Voseo paraguayo y frases que el contenido respalda; lo
  que no se puede verificar se omite.

## Qué evitamos (rasgos de "plantilla generada por IA")

Etiquetas numeradas 01–08; "pills" en mayúsculas con letra monoespaciada;
franja de estadísticas proyectadas; marquee de íconos; tres tarjetas
simétricas de "formas de participar"; vidrio esmerilado, brillos y gradientes;
tarjetas que flotan al hover; palabra de color dentro del titular; mascota
animada con chat falso; apilado de avatares redondos; tipografía por defecto
del framework; textos genéricos o inventados.

## Reglas del repositorio

- Los colores solo viven en `app/globals.css` (regla ESLint
  `local/no-color-literals`).
- Estructura atómica: `components/{atoms,molecules,organisms,templates}`.
- Tailwind v4 con tokens en `@theme`.
- Interfaz en español de Paraguay (voseo); código y docs técnicos en inglés.
- Accesibilidad no negociable: AA, teclado, `prefers-reduced-motion`, color
  nunca como único portador de estado.

## Estado

v0.2: identidad aplicada a todo el sitio. Ver [roadmap.md](roadmap.md).
