# Fundamentos

Todos los valores de color son los tokens que ya existen en `app/globals.css`.
Se listan aquí para documentar su **rol**, no para redefinirlos.

## 1. Color

### Roles

| Rol                      | Token                                           | Claro     | Oscuro    | Uso                                                      |
| ------------------------ | ----------------------------------------------- | --------- | --------- | -------------------------------------------------------- |
| Marca / fondo hero       | `brand-primary`, `surface-hero`                 | `#041a53` | `#041a53` | Hero, footer, bandas de impacto                          |
| **Acción (AWS Smile)**   | `action` / `action-strong`                      | `#ff9900` | `#ff9900` | **Un** botón primario por vista. Texto siempre navy      |
| Navegación y enlaces     | `accent` / `accent-strong`                      | `#0038a8` | `#74a8ff` | Enlaces, botón secundario, foco, estados activos         |
| Identidad nacional       | `national-red`                                  | `#f02f3b` | `#ff4b5b` | Detalles decorativos y acentos de título. Nunca error    |
| Superficie base          | `surface`                                       | `#ffffff` | `#010928` | Fondo de página                                          |
| Superficie fría          | `surface-muted`                                 | `#eef2fd` | `#071438` | Bandas alternas (speakers, hero de páginas)              |
| Superficie cálida        | `surface-warm`                                  | `#fff6e8` | `#16142e` | Bandas de "qué es", CTA suaves                           |
| Texto                    | `text-primary` / `secondary` / `muted`          | ver CSS   | ver CSS   | Cuerpo, apoyo, metadatos                                 |
| Estado                   | `success`, `warning`, `danger` (+ `-soft`)      | ver CSS   | ver CSS   | Mensajes del sistema                                     |
| Categórica               | `category-{blue,violet,teal,amber,green,pink}`  | ver CSS   | ver CSS   | Salas/tracks. Siempre con etiqueta de texto               |
| Nivel de sponsor         | `tier-*`                                        | ver CSS   | ver CSS   | Siempre con etiqueta de texto                            |

### Reglas de uso

- **60 / 30 / 10.** 60 % superficies (`surface`, `surface-muted`), 30 % navy
  y texto, 10 % color de acción y acentos. Si un viewport muestra más de dos
  elementos naranjas, sobra uno.
- **El naranja nunca es texto sobre claro.** `#ff9900` sobre blanco da
  ~2:1. Para texto naranja usa `action-label` (`#9a5200`, AA). El naranja de
  relleno siempre lleva texto navy (`text-on-action`, ~9:1).
- **El rojo nacional no es error.** El estado de error usa `danger`.
- **El color nunca va solo.** Salas, niveles y estados llevan texto o icono.
- **Un acento por sección.** No mezclar azul, naranja y rojo en el mismo
  componente salvo el hero.

### Contraste (mínimos del proyecto)

| Par                              | Mínimo |
| -------------------------------- | ------ |
| Texto normal (< 24px / < 19px b) | 4.5:1  |
| Texto grande y UI (bordes, íconos) | 3:1  |
| Foco visible                     | 3:1 contra ambos vecinos |

Verificar con la matriz de `specs/002-visual-refresh/data-model.md`. Cualquier
token nuevo debe sumarse a esa matriz.

## 2. Tipografía

**Familias:** Geist (títulos y cuerpo) y Geist Mono (etiquetas, horas,
metadatos). Se mantienen. No se carga una tercera familia.

### Escala fluida (`tokens.css`)

| Token       | Rango (375 → 1280px) | Uso                              | Interlineado | Peso    |
| ----------- | -------------------- | -------------------------------- | ------------ | ------- |
| `step-4`    | 36 → 64px            | H1 / hero                        | 1.08         | 700     |
| `step-3`    | 30 → 48px            | H2 de sección                    | 1.1          | 700     |
| `step-2`    | 24 → 32px            | H3, título de tarjeta grande     | 1.2          | 600     |
| `step-1`    | 20 → 24px            | H4, lead de párrafo              | 1.3          | 600     |
| `step-0`    | 16 → 18px            | Cuerpo                           | 1.55         | 400     |
| `step--1`   | 14 → 15px            | Metadatos, pies de tarjeta       | 1.45         | 400/500 |
| `step--2`   | 12px                 | Etiqueta mono en mayúsculas      | 1.3          | 500     |

### Reglas

- **Mínimo 12px**, nunca menos. Hoy hay etiquetas de 10.5, 11 y 11.5px
  (`StatTile`, `SponsorTile`, `SessionSpeakers`, hero). Pasan a `step--2`.
- **Etiquetas mono:** mayúsculas, `tracking-label` (0.12em), color
  `text-muted`. Solo para metadato corto (≤ 3 palabras).
- **Cuerpo con medida:** `max-w-[65ch]` en párrafos largos.
- **Títulos con `tracking-display`** (−0.025em) y `text-balance`.
- **Números** de estadísticas y horas: `tabular-nums` para alinear.
- Un solo `h1` por página; el nivel visual se desacopla con `Heading`
  (`visualLevel`), como ya hace el atom.

## 3. Espaciado y layout

- **Base 4px** (`space-1` … `space-8`).
- **Contenedor:** `max-width 1200px`, gutter fluido `1rem → 1.5rem`
  (`--container-gutter`). A 375px el contenido mide 343px.
- **Ritmo vertical de sección:** `--space-section-y` (48 → 96px).
  `--space-section-y-tight` para bandas secundarias (estadísticas, CTA).
  Hoy el aire entre secciones en mobile es excesivo.
- **Rejilla:** 4 col mobile (2 con tarjetas), 8 tablet, 12 escritorio.
- **Breakpoints:** 360 (mínimo soportado), 640 (`sm`), 768 (`md`), 1024
  (`lg`), 1280 (`xl`).

### Radio

`sm 6px` (chips, inputs) · `md 10px` (botones, tarjetas) · `lg 16px`
(paneles, medios) · `pill` (CTA del hero, etiquetas de estado).

## 4. Elevación

| Nivel     | Token              | Uso                                      |
| --------- | ------------------ | ---------------------------------------- |
| 0 plano   | —                  | Contenido en bandas, con borde `subtle`  |
| 1 elevado | `shadow-raised`    | Tarjetas en reposo                       |
| 2 flotante| `shadow-floating`  | Tarjetas hover, menús                    |
| 3 overlay | `shadow-overlay`   | Drawer, diálogos                         |

El sitio es principalmente plano con bordes; la sombra se reserva para
interacción y capas.

## 5. Movimiento

- **Propósito:** orientar (entrada de contenido, estado de un control).
  Nada decorativo en bucle salvo el marquee de servicios.
- **Duraciones:** `fast 120ms` (press, color), `base 200ms` (hover, chips),
  `slow 360ms` (drawer, aparición de sección).
- **Curva:** `ease-out-quint` para entradas, `ease-in-out-soft` para
  cambios de estado.
- **Solo `transform` y `opacity`.** No animar `width`, `height` ni `top`.
- **Hover solo en puntero fino:** envolver en `@media (hover: hover)`. El
  `translateY(-6px)` de `media-card` hoy se queda "pegado" en touch.
- **Movimiento reducido:** ya cubierto por la regla global de
  `prefers-reduced-motion`. Mantenerla.

## 6. Accesibilidad

- **Objetivos táctiles:** 44×44px (`--size-touch`) para controles
  principales; 40px en enlaces densos; 24px es el piso absoluto (WCAG 2.2
  SC 2.5.8). Los enlaces "Ver todos →", "Agenda completa →" y los del footer
  miden hoy 18-20px de alto: usar `.hit-area` o `py-3`.
- **Foco:** anillo de 2px (`--color-focus`) con offset 2px, ya global.
  Mantener `focus-on-hero` sobre superficies oscuras.
- **Saltar al contenido:** existe; conservar como primer elemento.
- **Orden y semántica:** un `h1`, niveles sin saltos, listas reales,
  `nav` con `aria-label` cuando haya más de uno.
- **Filtros y pestañas:** patrón `role=tablist` o grupo de botones con
  `aria-pressed`; el estado activo no depende solo del color.
- **Imágenes:** `alt` descriptivo en fotos de personas (nombre + rol);
  `alt=""` en decorativas.
- **Texto:** el usuario puede ampliar al 200 % sin pérdida (usar `rem`).
