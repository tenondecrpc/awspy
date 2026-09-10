# Feature Specification: AWS Community Day Paraguay visual refresh

**Feature Branch**: `002-visual-refresh`
**Created**: 2026-05-24
**Status**: Draft
**Input**: User description: "Mejorar la parte visual de la pagina (estilos y reorganizacion de secciones) sin refactorizar codigo. Adoptar la paleta y look-and-feel de los sitios de AWS Community Day Mexico (https://day.awscommunity.mx/) y Colombia (https://awscommunitydaycolombia.com/home), centralizando los colores en una unica paleta para que todas las paginas la consuman desde un solo lugar. Reservar espacios con placeholders para imagenes que se subiran luego bajo `public/assets/` (las fotos de speakers se siguen consumiendo desde la API publica de Sessionize, no se suben manualmente). Mejorar tambien los estados vacios (cuando no hay informacion cargada todavia) y los estados de carga (cuando se estan trayendo speakers, sponsors, etc.)."

## Clarifications

### Session 2026-05-24

- Coverage scan summary across the standard taxonomy (Functional, Domain, UX, Non-Functional, Integration, Edge Cases, Constraints, Terminology, Completion Signals, Misc):
  - Resolved during planning conversation and encoded in this spec: scope is visual-only (palette, layout, hero, empty states, skeleton loading, image placeholders), no behavioral or routing changes; palette must be the single source of truth for color and consumed by every page; speaker headshots continue to come from the Sessionize API; non-speaker imagery (hero pattern, sponsor logos, gallery, organizers, venue) uses placeholders with reserved aspect ratio so attendees can swap in real assets later under `public/assets/` without layout shift; the constitution's accessibility non-negotiables (AA contrast, keyboard reachability, prefers-reduced-motion, no color-only state) are enforced for the new look as they were for v1.
  - Outstanding low-impact items resolved by reasonable default (see Q-blocks below): sourcing of decorative AWS service icons, palette numerical values, empty-state visual treatment, dark mode behavior, scope of layout reorganization, motion intensity.
- Q: De donde se obtienen los iconos decorativos estilo "servicios AWS flotando" del hero (similar al patron de Mexico)? -> A: Se usan los **AWS Architecture Icons** publicados oficialmente por AWS (paquete gratuito y de uso publico). NO se descargan los SVG originales de Mexico ni Colombia, que son obra original con derechos. Mexico y Colombia se usan solo como referencia visual.
- Q: Cuales son los valores numericos exactos de la paleta? -> A: Se alinea con el "AWS branding" publico (Squid Ink #232F3E como navy de marca, Smile Orange #FF9900 como accion principal, Anchor #161E2D como inverso profundo, Hyperlink Blue #0073BB como enlace, mas neutros). El detalle vive en FR-002 y la unica copia se mantiene en `app/globals.css` via tokens `@theme` de Tailwind v4. Los tokens existentes en el repo se conservan o se renombran de forma backwards-compatible (alias) para no romper el codigo de v1.
- Q: Que aspecto deben tener los estados vacios? -> A: Cada estado vacio incluye un titulo en espanol, una descripcion breve, una ilustracion (SVG decorativo desde la paleta, sin texto en imagen), y un CTA secundario cuando aplica (escribir, enviar charla, suscribirse). El icono decorativo NO comunica informacion por si solo (constitution Principio VI).
- Q: Como se comportan los estados de carga? -> A: Cada lista (speakers, sponsors, schedule) renderiza un esqueleto con la misma forma que el contenido cargado (mismas dimensiones, misma cuadricula, animacion de pulso suave que respeta `prefers-reduced-motion`). El esqueleto tiene `aria-busy="true"` y un `role="status"` con texto accesible "Cargando ...".
- Q: Hay modo oscuro? -> A: Si. La paleta soporta dos modos (claro y oscuro) con los mismos tokens semanticos. La preferencia inicial se toma de `prefers-color-scheme`; un control sutil en el encabezado permite alternar manualmente y persiste una preferencia validada. Cada par foreground/background mantiene contraste AA en ambos modos.
- Q: Cuanta reorganizacion de secciones esta permitida sin "refactorizar codigo"? -> A: Permitido reordenar secciones existentes en los `templates/` (orden de bloques) y ajustar paddings, grids, tipografia y fondos. NO permitido cambiar contratos de datos, props publicas de componentes, rutas, ni mover archivos entre tiers de atomic design. Tambien permitido agregar atomos/moleculas decorativos nuevos (por ejemplo `DecorativePattern`, `IconTile`) bajo las reglas de atomic design.
- Q: Que intensidad tiene la animacion? -> A: Animaciones sutiles por defecto (fade/translate cortos al entrar en viewport, brillo del esqueleto). Todas se suprimen bajo `prefers-reduced-motion: reduce` por la regla global ya existente en `app/globals.css`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Look-and-feel coherente con la familia AWS Community Day (Priority: P1)

Un visitante que ya conoce los sitios de AWS Community Day Mexico o Colombia abre el sitio de Paraguay y reconoce de inmediato la familia visual: navy oscuro de marca, naranja AWS para acciones principales, jerarquia tipografica clara, hero con un patron decorativo construido con iconos de arquitectura AWS, y bloques de seccion bien separados. La paleta es la misma en toda la pagina, sin colores "sueltos" definidos en cada componente.

**Why this priority**: La principal queja del usuario es que el sitio actual no parece estar en la misma familia visual. Esto bloquea la sensacion de marca regional y la confianza del visitante. Es la base sobre la cual se montan los demas refinamientos visuales (empty/loading, placeholders).

**Independent Test**: Abrir `/` con datos minimos (solo el `event.json` actual), comparar lado a lado con `https://day.awscommunity.mx/` y verificar que el hero, los CTAs primarios, los headings y los fondos de seccion comparten el lenguaje visual (navy + naranja AWS, tipografia jerarquizada, patron decorativo). Verificar que ningun componente declara colores fuera del archivo de tokens centralizado: `grep -r '#[0-9A-Fa-f]\{3,6\}' app/ components/` retorna unicamente `app/globals.css`.

**Acceptance Scenarios**:

1. **Given** el sitio esta desplegado con la paleta refrescada, **When** un visitante abre `/`, **Then** el hero muestra fondo navy de marca con un patron decorativo (iconos de servicios AWS oficiales en SVG) en bajo contraste, el titulo en blanco con CTA naranja "Registrarme" y CTA secundario en outline, y el resto de la pagina alterna fondos `surface` y `surface-muted` consistentes.
2. **Given** una persona desarrolladora abre el repositorio, **When** ejecuta `grep -r '#[0-9A-Fa-f]\{3,6\}' app/ components/ lib/`, **Then** solo aparece la definicion de tokens en `app/globals.css`. Cualquier otro hex es un bug que el lint catchea (FR-013).
3. **Given** el visitante usa `prefers-color-scheme: dark`, **When** abre cualquier pagina, **Then** el sitio se renderiza con la variante oscura de los mismos tokens semanticos y todos los pares texto/fondo siguen cumpliendo AA.
4. **Given** el visitante revisa la pagina con un lector de pantalla, **When** navega por el hero y los CTAs, **Then** el contenido es accesible (orden logico, focus visible, no hay informacion comunicada solo por color).
5. **Given** el visitante prefiere un modo distinto al del sistema, **When** activa el control de tema del encabezado, **Then** la pagina cambia entre claro y oscuro, anuncia el estado como toggle y conserva la eleccion despues de recargar sin mostrar un flash del tema incorrecto.

---

### User Story 2 - Estados vacios atractivos (Priority: P1)

Un visitante llega a la pagina antes de que esten cargados los speakers, sponsors, organizadores u horarios. En vez de ver un panel gris monocromo "Proximamente" y nada mas, ve un bloque visual con titulo claro, descripcion breve, una ilustracion decorativa con la paleta de marca, y un CTA contextual (por ejemplo "Enviar mi charla", "Quiero ser sponsor", "Escribirnos"). El bloque se siente parte del sitio, no un placeholder de fabrica.

**Why this priority**: La primera edicion vive con secciones vacias durante semanas. Si esos estados se ven pobres, el sitio se percibe abandonado. Esta historia convierte los placeholders en piezas que comunican que el evento esta vivo y aceptando contribuciones.

**Independent Test**: Iniciar el sitio en local con `content/editions/2026/` minimo (sin sponsors, sin organizers, sin venue confirmado, Sessionize sin speakers aceptados). Verificar que en `/`, `/speakers`, `/schedule`, `/sponsors`, `/team`, `/venue` y `/faq` cada seccion vacia se ve como un bloque tematizado y no como un cuadro gris plano. Toda la copy esta en espanol y respeta accesibilidad.

**Acceptance Scenarios**:

1. **Given** Sessionize devuelve cero speakers aceptados, **When** un visitante abre `/speakers`, **Then** ve un bloque vacio con titulo "Pronto anunciamos a los speakers", una descripcion breve, una ilustracion decorativa basada en iconos de la paleta (sin texto dentro de la imagen), y un CTA "Enviar mi charla" si el CFP esta abierto, o "Escribirnos" en caso contrario.
2. **Given** no hay sponsors confirmados todavia, **When** un visitante abre `/sponsors`, **Then** ve un bloque vacio con CTA "Quiero ser sponsor" que abre el `mailto:` configurado en el `event.json`.
3. **Given** el equipo organizador no esta listado todavia, **When** un visitante abre `/team`, **Then** ve un bloque vacio explicando que el equipo se anuncia pronto y un CTA "Sumate al equipo" hacia el contacto.
4. **Given** el visitante usa lector de pantalla, **When** un estado vacio se renderiza, **Then** el bloque expone `role="status"` y `aria-live="polite"` y la ilustracion decorativa esta marcada como `aria-hidden="true"`.

---

### User Story 3 - Estados de carga que no rompen el layout (Priority: P1)

Un visitante con conexion lenta abre `/speakers` o `/schedule` y, mientras Sessionize esta respondiendo, ve un esqueleto con la misma forma del contenido final (mismas tarjetas, misma cuadricula, mismas dimensiones). Cuando los datos llegan, el contenido reemplaza al esqueleto sin que el layout salte. Si la conexion falla, cae al estado vacio de la historia 2 sin error visible.

**Why this priority**: Hoy las paginas de listas saltan de "vacio" a "con datos" sin transicion, lo que se siente brusco y produce CLS (Cumulative Layout Shift). Un esqueleto reduce CLS, mejora la percepcion de velocidad y mantiene Lighthouse Performance >= 90 (constitution Principio V).

**Independent Test**: Forzar latencia de 3-5s en la red del navegador, abrir `/speakers` y `/schedule`, verificar que aparece el esqueleto con la forma final y que cuando llegan los datos no hay salto de layout. Probar con `prefers-reduced-motion: reduce` activado: el esqueleto se muestra estatico (sin pulso animado).

**Acceptance Scenarios**:

1. **Given** Sessionize tarda en responder, **When** un visitante abre `/speakers`, **Then** ve una grid de tarjetas-esqueleto (avatar circular + dos lineas de texto) con la misma cuadricula que la lista final.
2. **Given** Sessionize tarda en responder, **When** un visitante abre `/schedule`, **Then** ve una grid esqueleto con filas por franja horaria que coincide con la grilla final.
3. **Given** la peticion termina con exito, **When** los datos llegan, **Then** el esqueleto es reemplazado por el contenido real sin reflow visible (las dimensiones del contenedor no cambian).
4. **Given** la peticion falla o devuelve vacio, **When** termina el estado de carga, **Then** se muestra el estado vacio de la historia 2 (no un mensaje de error tecnico).
5. **Given** el visitante tiene `prefers-reduced-motion: reduce`, **When** se renderiza un esqueleto, **Then** el pulso animado esta desactivado (estatico) pero el esqueleto sigue visible.

---

### User Story 4 - Placeholders de imagen con espacio reservado (Priority: P2)

Un visitante abre `/sponsors`, `/team`, `/venue` o el hero del home y, aunque las imagenes finales todavia no esten subidas a `public/assets/`, ve recuadros con la dimension correcta (mismo aspect ratio que tendra la imagen real) y un placeholder neutro con la paleta de marca. Cuando los organizadores suban la imagen real al directorio convenido, la pagina la usa sin requerir cambios de codigo y sin layout shift.

**Why this priority**: El usuario explicito que va a subir las imagenes despues. La pagina debe estar lista para recibirlas. Reservar espacio evita CLS, evita "huecos" visuales mientras tanto y separa el rol de "subir assets" del rol de "tocar codigo".

**Independent Test**: Sin agregar ninguna imagen a `public/assets/`, abrir el sitio y verificar que cada bloque que necesita imagen muestra un placeholder con la dimension final (ratio correcto), un sutil patron de marca y, cuando aplica, el nombre alternativo (ej. nombre del sponsor) como fallback de texto. Subir una imagen al path convenido y verificar que se renderiza automaticamente sin tocar codigo.

**Acceptance Scenarios**:

1. **Given** el archivo `public/assets/hero/pattern.svg` no existe, **When** se renderiza el hero, **Then** se usa un patron por defecto generado en CSS con tokens de la paleta (sin imagen rota, sin layout shift cuando luego exista el archivo).
2. **Given** el archivo `public/assets/sponsors/<id>.png` no existe, **When** se renderiza un sponsor sin logo, **Then** el `SponsorCard` reserva el mismo espacio que tendria la imagen y muestra el nombre del sponsor como fallback (comportamiento ya cubierto por v1, mantener).
3. **Given** los archivos `public/assets/team/<slug>.jpg` no existen, **When** se renderiza la grilla de organizadores, **Then** cada tarjeta muestra un placeholder de avatar con el aspect ratio definido y las iniciales del organizador.
4. **Given** el archivo `public/assets/venue/cover.jpg` no existe, **When** se renderiza `/venue`, **Then** se reserva el bloque visual (mismo ratio) con un placeholder tematizado y el contenido textual sigue legible.
5. **Given** los archivos finales se suben a `public/assets/<categoria>/<archivo>`, **When** la pagina vuelve a renderizar, **Then** las imagenes reales ocupan el mismo espacio reservado, sin layout shift y sin cambios de codigo.

---

### User Story 5 - Una unica fuente de verdad para los colores (Priority: P2)

Un colaborador o agente automatico que abre el repositorio para tocar estilos sabe exactamente donde estan los colores: en el archivo de tokens de Tailwind v4 (`app/globals.css` con `@theme`). Ningun componente declara hex o rgb en su archivo. Si alguien intenta colar un hex en un componente, el lint o un test lo bloquea.

**Why this priority**: Es la condicion previa para mantener la coherencia visual a lo largo del sitio y permitir cambios futuros (por ejemplo, ajustar el tono de naranja) en un solo lugar. Sin esta disciplina, las correcciones visuales sucesivas vuelven a fragmentar la paleta.

**Independent Test**: Ejecutar `npm run lint` con un component al que se le inyecto manualmente `#FF9900` y verificar que falla. Eliminar el hex y reemplazarlo por `var(--color-action)` y verificar que pasa.

**Acceptance Scenarios**:

1. **Given** la regla de lint esta activa, **When** un componente bajo `app/`, `components/` o `lib/` contiene un hex literal (`#aabbcc`, `#abc`) o `rgb(...)`/`rgba(...)`/`hsl(...)`/`hsla(...)`, **Then** `npm run lint` falla con un mensaje claro indicando el archivo y la linea.
2. **Given** la documentacion incluye una guia de paleta, **When** un colaborador la abre, **Then** ve la lista de tokens semanticos con el caso de uso de cada uno (background, text, border, action, etc.).
3. **Given** la paleta cambia el tono de naranja en `globals.css`, **When** se rebuild-ea el sitio, **Then** todos los CTAs primarios reflejan el nuevo tono sin requerir cambios en componentes individuales.

---

### User Story 6 - Iconografia decorativa coherente y reutilizable (Priority: P3)

Un visitante percibe un patron decorativo (iconos de arquitectura AWS flotando con baja opacidad) como parte de la identidad del hero y de bloques especiales (CTA fuerte, fin de pagina, eventos pasados). Los iconos vienen del paquete oficial de **AWS Architecture Icons**, distribuidos por AWS sin restricciones para uso comunitario. No se reusan los SVG originales de Mexico o Colombia.

**Why this priority**: Aporta personalidad y conecta con la familia AWS, pero el sitio funciona perfectamente sin esto si la US1-US5 estan completas. Es la cereza del pastel.

**Independent Test**: Inspeccionar el hero y verificar que el patron decorativo es un componente reutilizable (`DecorativePattern`) que recibe densidad, opacidad y paleta de tokens, y que los SVG vienen de un set local bajo `public/assets/icons/aws-architecture/` con la atribucion correspondiente en `public/assets/icons/aws-architecture/README.md`.

**Acceptance Scenarios**:

1. **Given** el hero esta renderizado, **When** el visitante lo observa, **Then** ve el patron decorativo de iconos AWS oficial en bajo contraste; los iconos NO comunican informacion (son `aria-hidden="true"`).
2. **Given** el patron decorativo se reusa en otra seccion, **When** se llama al componente, **Then** se le pueden pasar densidad y nivel de opacidad sin tocar su CSS interno.
3. **Given** un colaborador revisa el directorio de iconos, **When** abre `public/assets/icons/aws-architecture/README.md`, **Then** encuentra el origen de los SVG (AWS Architecture Icons) y la nota de licencia.

---

### Edge Cases

- El visitante usa una conexion muy lenta y la peticion a Sessionize tarda mas de 10 segundos: el esqueleto sigue visible, no se muestra spinner adicional, y si finalmente falla cae al estado vacio.
- El visitante usa un viewport ultra ancho (>1600px) o muy angosto (<360px): la grilla del hero, los esqueletos y los placeholders siguen siendo legibles y conservando el aspect ratio.
- Una imagen real subida a `public/assets/...` tiene un aspect ratio distinto al esperado: la imagen se recorta con `object-fit: cover` (no se distorsiona) y se loguea una advertencia en build (no error).
- El navegador no soporta `prefers-reduced-motion`: las animaciones default son lo suficientemente sutiles para que la falta de soporte no cause molestia.
- El sitio se renderiza sin JavaScript (vista de Reader o crawler basico): el hero, los empty states y los placeholders siguen siendo legibles porque son CSS puro o SVG inline.
- Una persona con baja vision usa zoom 200%: la jerarquia visual del hero y de las secciones sigue siendo clara y nada queda cortado.

## Requirements *(mandatory)*

### Functional Requirements

#### Paleta y tokens

- **FR-001**: La paleta DEBE estar centralizada en `app/globals.css` usando los tokens `@theme` de Tailwind v4. Ningun otro archivo del repositorio (bajo `app/`, `components/`, `lib/`) puede declarar valores literales de color (hex, rgb, hsl, named colors fuera de `currentColor`/`inherit`/`transparent`).
- **FR-002**: La paleta DEBE incluir, como minimo, los siguientes tokens semanticos (los valores numericos exactos se ajustan a la familia AWS publica y se eligen para cumplir AA en cada par foreground/background):
  - Acciones y marca: `--color-brand-primary` (Squid Ink navy ~ #232F3E), `--color-action` (Smile orange ~ #FF9900), `--color-action-strong` (orange darker), `--color-action-label` (orange accesible como texto pequeno), `--color-accent` (Hyperlink blue ~ #0073BB), `--color-accent-strong`, `--color-accent-soft`.
  - Superficies: `--color-surface`, `--color-surface-muted`, `--color-surface-elevated`, `--color-surface-inverse`, `--color-surface-hero` (variante usada por el hero), `--color-overlay`.
  - Texto: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-text-on-action`, `--color-text-on-accent`, `--color-text-on-inverse`, `--color-text-on-hero`, `--color-text-on-tier`.
  - Bordes y separadores: `--color-border-subtle`, `--color-border-strong`.
  - Estado: `--color-focus`, `--color-focus-on-hero`, `--color-success`, `--color-warning`, `--color-danger`.
  - Tier de sponsors (existentes en v1): se conservan sin perdida de compatibilidad.
- **FR-003**: La paleta DEBE soportar variante oscura via `@media (prefers-color-scheme: dark)` por defecto y overrides explicitos `data-theme="light|dark"` en `<html>`. El control manual DEBE persistir solo valores validados, ejecutarse antes de la hidratacion para evitar flashes y exponer nombre y estado accesibles.
- **FR-004**: Los tokens existentes en v1 (`--color-accent`, `--color-action`, `--color-surface*`, `--color-text*`, `--color-tier-*`, etc.) DEBEN seguir resolviendose para no romper componentes ya construidos. Cualquier renombrado se hace con alias en el mismo archivo.

#### Hero y secciones

- **FR-005**: El hero del home y de cada home de edicion DEBE usar como fondo `--color-surface-hero` (variante navy oscuro), texto en `--color-text-on-hero`, CTA primario con `--color-action` y CTA secundario en outline con `--color-text-on-hero`.
- **FR-006**: El hero DEBE incluir un patron decorativo de baja opacidad construido con iconos de AWS Architecture Icons. El patron es estatico (puro CSS o SVG inline), `aria-hidden="true"`, y NO comunica informacion.
- **FR-007**: Las secciones a continuacion del hero DEBEN alternar `--color-surface` y `--color-surface-muted` para crear ritmo visual; los headings de seccion DEBEN tener una linea o pill decorativa (en `--color-action`) que ayuda a marcar jerarquia.
- **FR-008**: El orden de secciones del home DEBE ser: hero -> contador regresivo -> "Que es el Community Day" -> highlights/numeros del evento (cuando existan; si no, se omite) -> preview de speakers -> preview de sponsors -> CTA final de registro/CFP. NO se eliminan secciones existentes; solo se reorganiza el orden visual y se agregan los bloques permitidos ya enumerados.

#### Estados vacios

- **FR-009**: Cada estado vacio DEBE incluir titulo en espanol, descripcion breve, una ilustracion decorativa SVG (con tokens de la paleta), y un CTA contextual cuando aplique. La ilustracion lleva `aria-hidden="true"`. El bloque expone `role="status"` y `aria-live="polite"`.
- **FR-010**: Los estados vacios DEBEN aparecer en al menos: `/speakers`, `/schedule`, `/sponsors`, `/team`, `/venue`, `/faq`, y la preview correspondiente en el home (`speakersPreview`, `sponsorsPreview`).

#### Estados de carga

- **FR-011**: Cada lista o grilla con datos remotos DEBE renderizar un esqueleto con la misma forma del contenido final mientras se resuelve la suspensión/fetch. Los componentes afectados son al menos: `SpeakersGrid`, `ScheduleGrid`, `SponsorsBoard`, `OrganizersGrid`.
- **FR-012**: Los esqueletos DEBEN exponer `role="status"`, `aria-busy="true"` y un texto accesible en espanol (por ejemplo "Cargando speakers"). El pulso animado DEBE respetar `prefers-reduced-motion: reduce`.

#### Placeholders de imagen

- **FR-013**: Cada bloque que renderiza una imagen no proveniente de Sessionize DEBE reservar espacio con aspect ratio explicito y mostrar un placeholder tematizado cuando la imagen no exista en `public/assets/`. Los archivos esperados se ubican bajo:
  - `public/assets/hero/` (patron decorativo, fondo opcional)
  - `public/assets/team/` (fotos de organizadores; nombre por slug del organizador)
  - `public/assets/venue/` (foto del venue; archivo `cover.jpg` por defecto)
  - `public/assets/sponsors/` (logos cuando se prefiera self-host; el campo `logo.light` del sponsor sigue siendo la fuente primaria)
  - `public/assets/gallery/` (galeria de ediciones pasadas, opcional)
- **FR-014**: Los placeholders DEBEN ser CSS o SVG puros, sin requerir que existan archivos extra para que la pagina renderice correctamente.
- **FR-015**: Los archivos finales subidos a `public/assets/...` DEBEN ser usados automaticamente por la pagina sin cambios de codigo. El nombre canonico de cada archivo se documenta en `public/assets/README.md`.
- **FR-016**: Los headshots de speakers DEBEN seguir consumiendose desde la URL devuelta por la API publica de Sessionize (campo `profilePicture`), con su propio fallback de iniciales (comportamiento ya cubierto en v1, mantener).

#### Iconografia decorativa

- **FR-017**: Los iconos decorativos del patron del hero DEBEN provenir de AWS Architecture Icons (paquete oficial publico distribuido por AWS). Los SVG locales se ubican bajo `public/assets/icons/aws-architecture/` y se acompanan de un `README.md` con la atribucion y la version del paquete.
- **FR-018**: NO se DEBE reusar ningun SVG, PNG o WEBP descargado de `https://day.awscommunity.mx/`, `https://awscommunitydaycolombia.com/`, ni de ningun otro sitio cuyo material sea obra original de su comunidad. Esos sitios solo se usan como referencia visual de layout y paleta.

#### Accesibilidad y rendimiento

- **FR-019**: Cada par foreground/background derivado de los tokens DEBE cumplir WCAG AA (>=4.5:1 para texto normal y >=3:1 para texto grande o limites visuales de componentes). El cumplimiento se verifica automaticamente en modo claro y oscuro.
- **FR-020**: Toda animacion introducida por esta feature (esqueletos, transiciones de seccion, fade del hero) DEBE respetar `prefers-reduced-motion: reduce`.
- **FR-021**: La feature NO DEBE bajar los objetivos Lighthouse del home: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95 en escritorio. CLS sigue por debajo de 0.1 cuando se cargan datos remotos o imagenes.
- **FR-022**: Toda imagen renderizada por `next/image` DEBE seguir teniendo `width`, `height` y `sizes` explicitos.

#### Disciplina de codigo

- **FR-023**: La feature NO DEBE cambiar contratos publicos de componentes (props, types) ni rutas; solo CSS, JSX visual y nuevos atomos/moleculas decorativos. Si un cambio de visual requiere prop nueva en un componente, la prop es opcional y mantiene comportamiento previo cuando no se pasa.
- **FR-024**: La feature NO DEBE introducir librerias de terceros (charts, animaciones, iconografia) sin pasar por una enmienda explicita; el patron decorativo y los esqueletos se construyen con CSS y SVG.
- **FR-025**: La feature NO DEBE tocar el data layer (`lib/api/*`, `lib/content/*`, esquemas Zod) ni el comportamiento de revalidacion. Si un componente necesita consumir un nuevo dato del `event.json` para una decoracion, se documenta como ampliacion de la US correspondiente y se acuerda con el usuario.
- **FR-026**: Toda copy nueva visible al visitante DEBE estar en espanol. Toda copy interna (comentarios, identificadores, commits) DEBE estar en ingles ASCII (constitution Principio VII).

#### Lint y verificacion

- **FR-027**: El lint DEBE incluir una regla que prohibe hex, rgb(a), hsl(a) y named colors (excepto `currentColor`, `inherit`, `transparent`, `none`) en archivos bajo `app/`, `components/` y `lib/`. La regla NO aplica a `app/globals.css`.
- **FR-028**: Antes de declarar la feature completa, DEBEN pasar `npm run lint`, `npm run typecheck`, `npm test`, y al menos un Playwright que verifique los empty states y los esqueletos de carga.

### Key Entities *(include if feature involves data)*

Esta feature es visual y NO introduce entidades nuevas. Reusa las entidades de la feature 001 (`Edition`, `EventInfo`, `Speaker`, `Sponsor`, etc.). Las unicas piezas conceptuales que aparecen aqui son:

- **Token semantico de paleta**: nombre logico (ej. `--color-action`) que apunta a un valor segun el modo claro/oscuro. Se ubica solo en `app/globals.css`. Los componentes lo consumen via `var(--color-action)` o las utilities de Tailwind v4 que lo derivan automaticamente.
- **Placeholder de imagen**: bloque CSS o SVG que reserva espacio con un `aspect-ratio` y muestra un patron neutro cuando el archivo final no existe en `public/assets/`.
- **Patron decorativo (`DecorativePattern`)**: atomo visual que renderiza una grilla baja-opacidad de iconos de AWS Architecture Icons. Sin estado, sin datos remotos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una busqueda regex de hex/rgb/hsl en `app/`, `components/` y `lib/` devuelve cero matches fuera de `app/globals.css`.
- **SC-002**: En cada pagina del sitio, abierta sin datos remotos, todas las secciones que normalmente listan contenido muestran un estado vacio tematizado (titulo + descripcion + ilustracion + CTA cuando aplica) en lugar de un panel gris.
- **SC-003**: En cada pagina con listas remotas, abierta con latencia simulada de 3-5 s, aparece un esqueleto de la misma forma del contenido final y la metrica CLS no supera 0.1.
- **SC-004**: Se pueden agregar archivos a `public/assets/team/`, `public/assets/venue/`, `public/assets/sponsors/`, `public/assets/hero/`, y la pagina los renderiza sin requerir cambios en el codigo.
- **SC-005**: Lighthouse en el home, en escritorio: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95.
- **SC-006**: La verificacion de contraste de cada par texto/fondo de la paleta (claro y oscuro) cumple WCAG AA, validado con un script o herramienta documentada.
- **SC-007**: Un visitante familiar con los sitios de Mexico o Colombia confirma cualitativamente, en una revision visual, que el sitio "se siente parte de la familia" (verificacion subjetiva pero documentada en una nota o screenshot incluido en el PR).
- **SC-008**: La feature no introduce librerias nuevas en `package.json` (verificable con `git diff package.json`).
- **SC-009**: La feature no modifica archivos bajo `lib/api/`, `lib/content/`, ni los schemas Zod (verificable con `git diff lib/api lib/content`).
- **SC-010**: `npm run lint`, `npm run typecheck` y `npm test` pasan en CI sin warnings nuevos.
