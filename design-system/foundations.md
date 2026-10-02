# Fundamentos

Valores vigentes en `app/globals.css`. Si este documento y el CSS difieren,
manda el CSS.

## Color

Paleta muestreada del arte oficial 2026: azul medianoche, azul bandera y rojo
paraguayo, sobre papel cálido.

| Rol | Token | Claro | Uso |
| --- | --- | --- | --- |
| Papel (fondo de página) | `surface` | `#f7f2e8` | Base de todas las páginas |
| Papel profundo | `surface-muted` | `#ece3d0` | Cabeceras de página, bandas alternas |
| Papel cálido | `surface-warm` | `#f4e6d2` | Equipo |
| Tarjeta blanca | `surface-elevated` | `#ffffff` | Superficies sobre el papel |
| Tinta | `text-primary` | `#08152f` | Texto y líneas de énfasis |
| Azul bandera | `accent` | `#0038a8` | Enlaces y foco |
| Rojo paraguayo | `national-red` / `-label` / `-on-dark` | `#f02f3b` / `#c4152f` / `#ff5566` | Franja y subrayado de enlaces; el `-label` para texto |
| Acción | `action` | `#ff9900` | **Solo** el botón de registro |
| Bandas oscuras | `surface-inverse`, `surface-hero` | `#08152f`, `#000c2f` | Sede, cierre, bloque del hero, pie |

El modo oscuro conserva los fondos azul medianoche y cambia tinta, enlaces y
estados (ver bloque `html[data-theme="dark"]`).

### Reglas

- Un único botón naranja por vista: el de registro.
- El rojo es identidad y subrayado, nunca estado de error (`danger`).
- El color nunca va solo: salas, niveles y estados llevan texto.
- Texto naranja sobre claro: solo `action-label` (`#9a5200`).
- Verificar con `node design-system/scripts/check-contrast.mjs`.

## Tipografía

| Rol | Familia | Notas |
| --- | --- | --- |
| Titulares (`h1`–`h4`) | **Young Serif** | Un solo peso (400). `font-synthesis: none`: no se simula negrita |
| Cuerpo y UI | **Atkinson Hyperlegible Next** | Diseñada para legibilidad; números tabulares activados |

Las variables de `next/font` se declaran en `<html>` (no en `<body>`): los
tokens `--font-sans` y `--font-display` viven en `:root` y las referencian.

### Escala fluida (375 → 1280px)

| Utilidad | Rango | Uso |
| --- | --- | --- |
| `text-step-4` | 40 → 84px | `h1` y título del hero |
| `text-step-3` | 32 → 52px | Títulos de sección |
| `text-step-2` | 26 → 36px | Declaración, horas de la agenda, nombre destacado |
| `text-step-1` | 20 → 24px | Subtítulos, preguntas, títulos de charla |
| `text-step-0` | 16 → 18px | Cuerpo |
| `text-step--1` | 14 → 15px | Metadatos |

Mínimo absoluto: 12px. Ya no hay etiquetas monoespaciadas ni en mayúsculas.

## Espaciado y forma

- Contenedor `WRAP`: 1240px máximo, márgenes fluidos (`px-5 sm:px-7`).
- Ritmo vertical de sección: `--space-section-y` (56 → 112px).
- Radios casi rectos (`2–4px`); el "pill" solo existe como token, sin uso.
- Líneas en vez de sombras: `border-t-2` de tinta para listas, hairline
  `border-subtle` entre filas.

## Movimiento

Sin gradientes, vidrio ni brillos. El hover cambia tinta o subrayado; el
botón baja 1px al presionarse (`active:translate-y-px`). Nada se levanta.
`prefers-reduced-motion` se respeta globalmente.

## Secciones a pantalla completa (home)

Cada sección de la home ocupa la altura visible bajo el header y su contenido
cabe sin desbordar, en laptops y escritorio (probado en 1280×720, 1366×768,
1440×900, 1536×864 y 1920×1080).

| Pieza | Regla |
| --- | --- |
| `.fit-screen` (`globals.css`) | `min-height: calc(100svh - var(--header-h))`, contenido centrado en columna |
| Unidad | `svh` (altura de viewport pequeña): nunca excede el área visible. No se usa `dvh`: cambia al hacer scroll y provoca saltos |
| `min-height`, no `height` | Si el contenido no cabe (zoom de texto, ventana baja), la sección crece en vez de pisar la siguiente |
| Snap | `scroll-snap-type: y proximity` en `html` con `scroll-padding-top: var(--header-h)`. Nunca `mandatory`: atrapa si una sección es más alta que la pantalla |
| Alcance | Solo `min-width: 64rem` y `min-height: 37.5rem`. En móvil, tablet vertical y ventanas bajas el flujo es natural |
| Unidades | Todo en `rem`, `vw` y `svh`; nada se fija en `px` ni se ajusta midiendo. Los umbrales de las media queries también van en `rem` |
| Tipografía ligada a ancho y alto | Cada `--text-step-*` es `clamp(piso rem, min(fórmula en vw, tope en svh), techo rem)`: en una ventana ancha pero baja la letra se reduce sola |
| Contenido ligado a la altura | Paddings `clamp(2.5rem, 6svh, 5rem)`, fotos con `h-[min(Nrem, Msvh)]`, escalonados en `svh`; el hero limita su foto a `calc(100svh - var(--header-h) - 0.375rem)` |
| `.hide-on-short` / `.hide-on-shorter` | Quitan la 5.ª y la 4.ª charla de la agenda en ventanas de hasta 55rem y 44rem de alto |
| `SECTION_FIT` | Constante en `SectionPrimitives.tsx` que une `.fit-screen` y el padding |

Móvil: solo el hero cabe en una pantalla (771px en 390×844). Las demás
secciones fluyen con su altura natural (1.000–1.400px), porque speakers,
agenda y equipo no caben en ~770px sin recortar contenido.

## Imágenes

- **El marco sigue la proporción de la foto, nunca al revés.** Los retratos
  (Sessionize 400×400, equipo 200–800px) son cuadrados: se muestran en
  `aspect-square`, completos, sin recorte ni deformación, con
  `object-position: 50% 20%` por si el marco cambia. Las fotos del evento
  conservan su proporción real (charla 1600×1027, `aspect-video` para las
  16:9, hero 4:3).
- **Mismo peso para todos.** Speakers y equipo: mismo tamaño, misma línea
  base, nadie destacado ni escalonado.
- **Cuando una foto sí necesita recortarse** (la sede, que ocupa media
  pantalla), el recorte es en el eje que sobra y con `position` elegido a
  mano hacia lo importante.
- **Logos:** siempre `object-contain` sobre la placa blanca; un logo jamás se
  recorta.
- **No ampliar de más.** Mostrar una foto a más de ~1,2× su tamaño real la
  vuelve borrosa y "cabezona". Hoy el caso es `public/team/william-guzman.jpg`
  (200×200 mostrada a ~220px): conviene pedir una foto más grande.
- **Alturas por `svh` solo para fotos apaisadas**; los retratos se ajustan por
  ancho de columna.

## Acciones

Lo que la persona debe hacer pesa más que lo que lee:

| Nivel | Clase (`SectionPrimitives.tsx`) | Uso |
| --- | --- | --- |
| Primario | `BTN_PRIMARY` (relleno naranja, 52px) | **Un** botón por pantalla: registrarse / reservar lugar |
| Secundario | `BTN_OUTLINE` (borde de tinta de 2px, 44px) | Proponer una charla, "Ver todos →", "Ver el equipo →" |
| Secundario sobre oscuro | `BTN_OUTLINE_ON_DARK` | Lo mismo sobre azul medianoche (hero, sede, cierre) |
| Enlace en frase | `TEXT_LINK` (subrayado rojo) | Solo dentro de una oración ("Escribinos") |

`SectionTitle` pinta su acción como botón secundario con flecha.

## Contador

El **número** es el dato: el hero lo muestra en el serif display, naranja de
acción, hasta 7,5rem (limitado por `12svh` y `18vw`), con una barra gruesa a la
izquierda y "Faltan"/"días" pequeños en la misma línea base. Las piezas son
`aria-hidden` y la frase completa se escribe una vez para lectores de pantalla.
`Countdown` tiene tres variantes: `grid`, `inline` y `display`.

## Palabras sueltas (huérfanas)

Ninguna palabra queda sola en la última línea de un bloque. Tres capas:

1. **`text-wrap: balance`** en `body` (se hereda): reparte las líneas de forma pareja en los bloques cortos.
2. **`.prose-flow`** (`text-wrap: pretty`) para textos largos, donde `balance` no aplica.
3. **`tieLast()`** (`lib/utils/typography.ts`): ata las dos últimas palabras con un espacio duro en los textos que vienen de datos (cargos, charlas, preguntas, descripciones). Solo si las dos palabras juntas suman 24 caracteres o menos: atar palabras largas cambia una huérfana por un desborde horizontal. No usarla en un título que comparte fila con un ícono en una columna angosta.

Los teléfonos, fechas y horas no se parten (`a[href^="tel:"]` y `time` en `nowrap`; el teléfono usa espacios duros). Comprobación: un escáner por Playwright recorre todas las páginas a 1366, 1024, 768, 390 y 320px.
## Accesibilidad

- Objetivos táctiles: 44px (`--size-touch`).
- Foco: anillo de 2px (`--color-focus`), invertido sobre superficies oscuras.
- Un `h1` por página; "Saltar al contenido" es el primer enlace.
- Fotos con `alt` descriptivo; el motivo `Lace` es
  `aria-hidden`.
