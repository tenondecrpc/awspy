# Componentes

Inventario de lo que define la identidad. Todos usan solo tokens (sin
literales de color) y respetan el diseño atómico.

## Motivos

| Componente | Ruta | Uso |
| --- | --- | --- |
| `Lace` | `components/atoms/Lace.tsx` | Encaje radial procedural en `currentColor`. Props: `size`, `rings` (3–7), `className`. Va grande, recortado en el borde de un bloque con `overflow-hidden` y en un tono de baja intensidad (`border-subtle` sobre papel, `border-on-inverse` sobre oscuro). Siempre `aria-hidden` |

## Primitivos de página (`components/molecules/SectionPrimitives.tsx`)

- `WRAP`, `SECTION_Y`, `SECTION_BORDER`: contenedor, ritmo vertical, línea
  entre secciones.
- `SectionTitle({ title, action?, onDark?, size? })`: el
  título en serif y un enlace subrayado a la derecha. Sin números.
- `PageHeader({ eyebrow, title, description?, children? })`: papel profundo,
  título modesto (`step-2`) y la descripción al lado, sobre el mismo papel y cerrado por un hilo; ya no es una banda.
- `KICKER`: línea breve de contexto en sans, minúscula, rojo `-label`.
- `Frame`: marco de imagen sin borde; con `next/image`, blur y `sizes`.

## Piezas con comportamiento específico

- **Hero (home).** Foto a todo el ancho; el título va en un bloque sólido
  azul medianoche (`surface-hero`) con `Lace` en la esquina. En mobile la foto
  va arriba y el bloque la solapa. El único botón naranja es "Registrarme".
- **Agenda.** Lista con regla de tinta, hora en serif y color rojo `-label`,
  sala como texto. En `/schedule`: carril sticky de salas (enlaces, 44px) y
  carril de saltos por hora; en mobile las descripciones se pliegan en
  `<details>`.
- **Speakers.** Composición asimétrica (5/4/3 columnas en escritorio, dos
  columnas escalonadas en mobile). El título de la charla es siempre visible.
- **Sponsors.** Placa blanca `surface-logo-plate` intacta; 2 columnas en
  mobile; paquetes en acordeón. Sin marcos vacíos.
- **Botón (`atoms/Button.tsx`).** Altura 44px, cambio de tinta al hover,
  `active:translate-y-px`; nunca levanta.
- **Heading (`atoms/Heading.tsx`).** Escala fluida; niveles 5–6 en sans.

## Eliminado a propósito

`Hero`, `SectionHeading`, `StatTile`, `EyebrowPill`, `Mascot`,
`MeshGradientSVG`, `KiroMascot`, `DecorativePattern`, `EmptyStateIllustration`,
`IconTile`, `Badge`, `Section`, `EditionPill`, `FlagRule` (la franja tricolor); las clases `glass-panel`,
`media-card`, `kiro-chat-scroll`, el marquee y los tokens `glass`/`glow`.
También se quitaron `framer-motion` y `@paper-design/shaders-react`.

## Checklist de un componente nuevo

- [ ] Solo tokens; ningún literal de color (`local/no-color-literals`)
- [ ] Sin `font-bold` en `h1`–`h4` ni fuentes monoespaciadas
- [ ] 375px sin scroll horizontal; objetivos ≥ 44px
- [ ] Claro y oscuro verificados; contraste AA
- [ ] Foco visible, teclado, `prefers-reduced-motion`
- [ ] Estados: vacío, carga, error
- [ ] Sin numeración decorativa, pills en mayúsculas, vidrio ni hover que flote
