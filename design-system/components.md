# Componentes

Mapa de lo que existe en `components/` y qué cambia. Los fragmentos usan solo
tokens (sin literales de color), así que respetan `local/no-color-literals`.

## Estado de la biblioteca

| Nivel     | Existentes (resumen)                                                                  | Acción             |
| --------- | ------------------------------------------------------------------------------------- | ------------------ |
| Atoms     | Button, Badge, Heading, Link, Container, Section, IconTile, Skeleton, ThemeToggle...  | Ajustar            |
| Molecules | SpeakerCard, SponsorTile, StatTile, ScheduleSlot, SectionHeading, FAQItem, NavLink    | Ajustar            |
| Organisms | Hero, ScheduleGrid, SponsorBoard, SpeakersGrid, SiteHeader, SiteFooter, EmptyState    | Ajustar + 3 nuevos |
| Templates | Home, Schedule, Register, CFP, FAQ, Venue, Team...                                    | Recomponer         |

## Ajustes a componentes existentes

### Button (`atoms/Button.tsx`)
- **Alturas:** `sm` 40px, `md` 44px, `lg` 52px (hoy `md` mide ~40px y `sm`
  ~32px). El nuevo mínimo táctil es 44px: `md` sube a `min-h-[var(--size-touch)]`.
- **Una primaria por vista.** `primary` = naranja + texto navy. `secondary`
  = azul. Añadir `variant="outline"` (borde `border-strong`, texto
  `text-primary`) para el secundario sobre superficie clara; el actual
  "Proponer una charla" ya lo imita ad hoc.
- **Estados:** hover (`action-strong`), `active` (`scale-[0.98]`, 120ms),
  foco (anillo global), `disabled`, y `loading` con spinner que conserva el
  ancho.
- **Hover lift** solo con `@media (hover: hover)`.
- **Ancho:** en mobile los CTA del hero pasan a `w-full`; desde `sm`, auto.

### Heading (`atoms/Heading.tsx`)
- Sustituir la escala Tailwind por la escala fluida (`text-step-4` … `step-1`).
- Añadir `text-balance` y `tracking-display`.

### Eyebrow / etiquetas mono
- Unificar en un solo átomo `Eyebrow` (hoy hay variantes con `text-[10.5px]`,
  `[11px]`, `[11.5px]`). Tamaño `step--2` (12px), mayúsculas, `tracking-label`.

### StatTile / franja de estadísticas
- Mobile: cuadrícula de **2 columnas × 4 filas** en lugar de lista de 7 filas
  a una columna. Número en `step-3` con `tabular-nums`.
- Eliminar la barra vertical izquierda en mobile (se ve como borde roto).
- Franja de íconos de servicios AWS: marquee continuo (sin recorte), `aria-hidden`
  y pausa en `prefers-reduced-motion` (ya cubierta).

### SpeakerCard
- `aspect-[4/5]` fijo. En touch el scrim es visible siempre (ya soportado).
- Hover `translateY(-6px)` → solo `(hover: hover)`.
- `alt` = "Nombre, cargo".

### SponsorTile / SponsorBoard
- Mobile: **2 columnas** para Diamante/Platinum/Gold; 3 para Silver y
  Comunidad. Altura de placa `h-20` (80px) en lugar de la actual de 88px+.
- La placa blanca de logo se conserva en ambos temas.

### SiteHeader
- Barra de 64px en mobile. Botón de menú 44×44. El drawer se mantiene
  (panel derecho, `--z-drawer`), añadir `inert` en el contenido de fondo,
  cierre con `Esc` y bloqueo de scroll.
- Botón "Registrarme" visible en la barra desde `sm`; en mobile queda
  dentro del drawer **y** como barra inferior fija (ver `StickyCTA`).

### SiteFooter
- Enlaces con `min-h-[var(--size-touch-compact)]` (40px) y columnas
  colapsadas en 2.

### NavLink / enlaces "Ver todos →"
- Aplicar `.hit-area` (ver `tokens.css`) para llevar el área clicable a 44px
  sin cambiar el aspecto.

## Componentes nuevos

### 1. `FilterRail` (organism, reemplaza los chips apilados de la agenda)

Riel horizontal de chips con scroll y snap. Resuelve los 9 filtros de sala
apilados (~900px antes de la primera charla).

```tsx
// components/molecules/FilterRail.tsx
type Option = { id: string; label: string; color?: string };

export function FilterRail({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="rail py-3">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className="inline-flex min-h-[var(--size-touch)] items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] px-4 text-[length:var(--text-step--1)] font-medium text-[var(--color-text-primary)] transition-colors duration-[var(--duration-base)] aria-pressed:border-[var(--color-accent)] aria-pressed:bg-[var(--color-accent-soft)]"
        >
          {o.color && (
            <span
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ background: o.color }}
            />
          )}
          {o.label}
        </button>
      ))}
    </div>
  );
}
```

Reglas: el chip activo se distingue por **borde + fondo**, no solo color; el
riel es sticky bajo el header (`top-16`, `z-[var(--z-sticky)]`) para filtrar
sin volver arriba.

### 2. `TimeJump` (molecule)

Navegación por hora para la agenda (20.530px de alto en mobile): riel sticky
con bloques horarios (`08:00`, `09:00`...) que hacen scroll a la primera sesión
de esa hora. Mismo riel que `FilterRail`; cada elemento es un enlace ancla.

### 3. `StickyCTA` (organism)

Barra inferior fija en mobile (< `md`) con el CTA primario de la página:
"Registrarme gratis" (home, speakers, agenda) o "Enviar propuesta" (CFP).

- Altura 64px + `env(safe-area-inset-bottom)`, fondo `surface-elevated`,
  borde superior `border-subtle`, `shadow-floating`.
- Aparece al salir el CTA del hero de la vista (IntersectionObserver),
  `transform: translateY` en 200ms.
- Se oculta si el drawer está abierto o en `/register`.
- Reserva `padding-bottom` en `body` para no tapar el footer.

### 4. `AgendaPreview` (organism, home)

Reemplaza la sección "Agenda del día" vacía de la home por las 3-4 primeras
sesiones (hora, título, speaker, sala) usando `ScheduleSlot`, más el enlace a
la agenda completa. Estado vacío real si no hay sesiones (ver `EmptyState`:
"La agenda se publica pronto. Avísame cuando salga").

### 5. `Eyebrow` (atom)

Etiqueta mono de 12px (ver arriba). Un solo componente, tres tonos: `muted`,
`accent`, `on-hero`.

### 6. `Toast` (opcional)

Para confirmaciones ("Enlace copiado"). `--z-toast`, 4s, `role="status"`.

## Patrones de página

| Página     | Composición recomendada                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------- |
| Home       | Hero → estadísticas → qué es → `AgendaPreview` → speakers → sede → sponsors → CTA → FAQ           |
| Agenda     | Cabecera corta → `FilterRail` + `TimeJump` sticky → lista de sesiones                             |
| Speakers   | Cabecera corta → cuadrícula 2 col (mobile) / 4 col (escritorio)                                   |
| Registro   | Resumen del evento + botón Eventbrite **sobre** los pasos (en mobile primero la acción)           |
| CFP        | Fecha límite destacada (con cuenta regresiva) → formatos → criterios → CTA                        |
| 404        | Título `<title>` propio ("Página no encontrada"), enlaces a Agenda, Registro, Inicio              |

## Checklist de un componente nuevo

- [ ] Solo tokens; ningún literal de color (pasa `local/no-color-literals`)
- [ ] 375px sin scroll horizontal; objetivos ≥ 44px (o 40px en inline denso)
- [ ] Claro y oscuro verificados
- [ ] Foco visible y navegable por teclado
- [ ] Estados: vacío, carga (`Skeleton`), error
- [ ] Texto mínimo 12px; sin color como único portador de significado
- [ ] Movimiento solo `transform`/`opacity`, respeta `prefers-reduced-motion`
