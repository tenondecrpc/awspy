# Estado y hoja de ruta

## Hecho (v0.2)

| Área | Cambio |
| --- | --- |
| Fundamentos | Papel cálido, Young Serif + Atkinson Hyperlegible Next, escala fluida, radios casi rectos, tokens de toque (`globals.css`) |
| Motivos | `Lace` (encaje procedural), solo en el hero |
| Shell | Header con hilo fino, drawer y un pie liviano en una franja de papel |
| Home | Hero con foto y bloque sólido, declaración + collage, agenda real con las primeras charlas, speakers asimétricos, sede, FAQ tipográfica, equipo escalonado, cierre con una invitación |
| Agenda | Carril sticky de salas y de horas, descripciones plegables en mobile (20.530px → ~8.900px) |
| Speakers | Composición asimétrica, título de la charla siempre visible (17.000px → ~8.800px) |
| Sponsors | 2 columnas, paquetes en acordeón (9.177px → ~4.800px) |
| Páginas | Registro, CFP, sede, equipo, voluntariado, FAQ, conducta, ediciones, 404, error y `/privacy` (nueva) |
| Limpieza | Kiro, mascota, shaders, marquee, estadísticas, vidrio y brillos, 13 componentes sin uso, 2 dependencias |
| Marca | Colores AWS revertidos; estatus comunitario documentado |

## Pendiente

1. **Tests.** Varias pruebas de `tests/components/` y `e2e/` afirman marcado
   o textos anteriores (clases `media-card`, `Badge`, "Tu logo aquí",
   etiquetas numeradas, `EmptyStateIllustration`). Ejecutar la suite y
   actualizar las que fallen.
2. **Contenido real.** Fotos en alta resolución y galería (hoy vacía); datos
   de la sede (transporte, accesibilidad); fotos de patrocinadores.
3. **Kit de marca** del programa (ver [brand-alignment.md](brand-alignment.md)).
4. **Documentación del repo.** `docs/adr/0009` y `docs/status/DEPENDENCIES.md`
   siguen describiendo las dependencias eliminadas; `specs/002-visual-refresh`
   describe la paleta anterior.
5. **Navegación de escritorio**: los enlaces del menú miden 36px de alto.
6. **Revisión humana** de cada página y prueba con personas reales.

## Métricas (375px de ancho)

| Página | Antes | Ahora |
| --- | --- | --- |
| `/schedule` | 20.530px | ~8.900px |
| `/speakers` | ~17.200px | ~8.800px |
| `/sponsors` | 9.177px | ~4.800px |
| `/` | ~12.900px | ~10.000px |
| Contraste AA (texto renderizado) | 0 fallos | 0 fallos, claro y oscuro |
