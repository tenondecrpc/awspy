# Patrones mobile

Referencia: viewport de 375×812. Cada patrón cita el problema medido en la
revisión del sitio y el criterio de éxito.

> **Estado (v0.2).** Hero, estadísticas (eliminadas), agenda, sponsors,
> registro y navegación ya siguen estos patrones; los componentes mencionados
> como `FilterRail` y `TimeJump` viven dentro de `ScheduleTemplate`, y
> `StickyCTA` y `AgendaPreview` como componentes aparte no se crearon (la home
> usa su propia sección de agenda). Las alturas actuales están en
> [roadmap.md](roadmap.md). Donde este documento menciona etiquetas mono,
> chips redondeados o "Eyebrow", el criterio vigente es el de
> [foundations.md](foundations.md).

## 1. Hero

**Problema:** el botón de registro queda debajo del primer pliegue (el bloque
de 4 datos ocupa casi una pantalla) y la foto mide casi otra pantalla.

**Patrón:**

1. Eyebrow + estado ("Primera edición · Registro abierto")
2. H1 (`step-4`)
3. Bajada de 2 líneas máximo
4. **Fila de datos compacta:** fecha y hora en una línea ("Sáb 17 oct · 08:00–18:00"), sede abreviada ("SNPP, San Lorenzo"), entrada ("Gratis"), en una rejilla de 2×2 con etiquetas de 12px
5. **CTA primario** `w-full` + secundario `w-full`
6. Cuenta regresiva ("Faltan 15 días") como chip legible (`step--1`, peso 600)
7. Foto: `aspect-[4/3]`, `object-cover`, debajo de los CTA

**Éxito:** el CTA primario es visible sin scroll en 375×667.

## 2. Estadísticas

**Problema:** 7 cifras apiladas a una columna con barra lateral rota.

**Patrón:** rejilla 2 columnas, `gap-x-4 gap-y-6`, número `step-3` en
`tabular-nums`, etiqueta `step--1` `text-muted`. Cuatro cifras como máximo
en mobile (Asistentes, Speakers, Sponsors, Horas); el resto se muestra desde
`md`.

**Éxito:** la sección ocupa menos de 400px de alto.

## 3. Agenda (`/schedule`)

**Problema:** 20.530px de alto; 9 filtros de sala en una columna (~900px
antes de la primera charla); sin salto por hora.

**Patrón:**

- Cabecera de 120px de alto (título + una línea)
- **Barra sticky** bajo el header (`top-16`) con dos rieles: `TimeJump` y
  `FilterRail` de salas (chips con punto de color + nombre corto: "Principal",
  "Ciudad del Este"...)
- Tarjeta de sesión: hora (mono) · duración en una línea; título `step-1`;
  speaker con avatar 32px; chip de sala. Resumen recortado a 3 líneas con
  "Ver más"
- Agrupar por franja horaria con encabezado sticky ("09:00")
- Botón "Volver arriba" flotante tras 2 pantallas de scroll

**Éxito:** la primera sesión aparece antes de 450px; cambiar de sala no
requiere volver al inicio.

## 4. Sponsors (`/sponsors`)

**Problema:** 9.177px de alto; logos de uno en uno.

**Patrón:** niveles en orden (Diamante → Comunidad). Rejilla de 2 columnas
(Diamante, Platinum, Gold) y 3 columnas (Silver, Comunidad). Placa blanca de
80px. Etiqueta de nivel como `Eyebrow`. La tabla de paquetes de patrocinio
pasa a acordeón por paquete.

**Éxito:** menos de 4.000px de alto con 20 sponsors.

## 5. Registro y CFP

- Resumen del evento y botón Eventbrite **antes** de los pasos
- Los pasos numerados (1-4) se mantienen; el número en círculo de 32px
- CFP: la fecha límite ("hasta el sábado 10 de octubre") en un chip de
  advertencia (`warning-soft`) arriba del CTA
- `StickyCTA` con el botón principal

## 6. Navegación

- Header 64px: logo (izquierda), toggle de tema 44×44, menú 44×44
- Drawer de 85% del ancho (`min(22rem, 85vw)`), enlaces con `min-h-14`,
  CTA al final, cierre con `Esc`, toque en el velo o botón
- Pie de página: columnas colapsadas en 2, enlaces de 40px de alto

## 7. Objetivos táctiles

| Elemento                         | Hoy          | Meta              |
| -------------------------------- | ------------ | ----------------- |
| Enlaces "Ver todos →"            | ~20px        | 44px (`.hit-area`) |
| Enlaces del footer               | 18px         | 40px              |
| Enlace "Saltar al contenido"     | 41px         | 44px              |
| Botones del hero                 | ~44px        | 44-52px           |
| Chips de filtro                  | ~36px        | 44px              |

## 8. Rendimiento percibido

- Imágenes del hero con `priority` y `sizes` correctos; el resto `loading="lazy"`
- `Skeleton` para agenda y speakers (ya existe)
- Las páginas largas muestran el primer bloque en < 1 s en 4G; el orden del
  DOM coincide con el orden visual

## 9. Pruebas de aceptación

- [ ] Sin scroll horizontal a 360, 375, 390, 414px
- [ ] Todo control principal ≥ 44px; ningún control < 24px
- [ ] Zoom del 200 % sin pérdida de contenido
- [ ] Claro y oscuro sin texto ilegible
- [ ] Navegación por teclado y lector de pantalla en filtros y drawer
