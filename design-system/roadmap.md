# Hoja de ruta de adopción

Orden pensado para que cada paso se pueda revisar y desplegar solo. Los
esfuerzos son estimaciones de orden de magnitud.

| # | Paso | Resuelve | Esfuerzo |
| - | ---- | -------- | -------- |
| 1 | Copiar los tokens de [tokens.css](tokens.css) al `@theme` de `app/globals.css` | Base para todo lo demás; sin cambio visual | 0,5 h |
| 1b | Aplicar [tokens-brand-v2.css](tokens-brand-v2.css) a `globals.css` (navy → Squid Ink, azul de enlace, modo oscuro neutro) y correr `check-contrast.mjs` | Cercanía a la marca AWS 6 → 7+ | 2 h + revisión visual |
| 2 | Subir etiquetas mono a 12px (`Eyebrow`) | Texto de 10,5-11,5px ilegible | 1 h |
| 3 | `.hit-area` en enlaces "Ver todos →", footer y chips | Objetivos de 18-20px | 1 h |
| 4 | `FilterRail` + `TimeJump` en la agenda | Agenda de 20.530px y 900px de filtros | 4 h |
| 5 | Rejilla de 2 columnas en sponsors y estadísticas | Sponsors de 9.177px, lista de 7 cifras | 2 h |
| 6 | Hero mobile: datos compactos, CTA `w-full`, foto 4:3 | CTA fuera del primer pliegue | 3 h |
| 7 | `AgendaPreview` en la home | Sección "Agenda del día" vacía | 2 h |
| 8 | `StickyCTA` en mobile | CTA lejos del inicio en páginas largas | 3 h |
| 9 | Crear `/privacy` (o quitar el enlace) y `<title>` propio en 404 | 404 enlazada desde el footer | 1 h |
| 10 | Hover solo con `(hover: hover)`; `Button` con alturas de 44px | Hover pegado en touch | 1 h |
| 11 | Escala fluida (`Heading` con `step-*`) | Escalera de breakpoints en títulos | 2 h |

## Orden recomendado

**Sprint 1 (rápido, bajo riesgo):** 1, 2, 3, 9, 10. El paso 1b va **después** de confirmar el kit de marca con el programa, y se aplica de una sola vez.
**Sprint 2 (mayor impacto en mobile):** 4, 5, 6.
**Sprint 3 (conversión y contenido):** 7, 8, 11.

## Métricas de éxito

Medir antes y después con el mismo viewport (375×812):

| Métrica                           | Hoy      | Meta      |
| --------------------------------- | -------- | --------- |
| Alto de `/schedule` en mobile     | 20.530px | < 12.000px |
| Alto de `/sponsors` en mobile     | 9.177px  | < 4.000px |
| Distancia hasta la 1ª sesión      | ~900px   | < 450px   |
| CTA primario del hero sin scroll  | no       | sí        |
| Controles principales < 44px      | ≥ 20     | 0         |
| Texto < 12px                      | 4+ clases | 0        |
| Nota global UX/UI                 | 5,8 / 7  | ≥ 6,5     |
| Cercanía a la marca AWS (estimada)| 6 / 10   | 7–7,5 / 10 |

## Decisiones abiertas

- **¿Conservar voseo?** Hoy es consistente (es-PY). Si se mantiene, documentar
  el glosario ("Proponé", "Reservá", "Escribinos") para futuros textos.
- **¿Barra inferior fija?** Reduce fricción pero ocupa 64px de pantalla.
  Probar A/B en la página de registro.
- **¿Tipografía de marca?** Amazon Ember no es licenciable; Geist cubre el rol.
- **Cumplimiento de marca AWS:** validar uso de logos y colores con el
  programa Community Day antes de publicar cambios de identidad.
