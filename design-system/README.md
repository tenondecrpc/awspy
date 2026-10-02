# Design system: AWS Community Day Paraguay

Sistema de diseño para evolucionar el sitio sin romperlo. Parte de lo que ya
existe (`app/globals.css`, atoms/molecules/organisms) y lo alinea con la marca
AWS. No reemplaza el código: lo ordena y define qué mejorar.

## Contenido

| Archivo                                  | Para qué                                                              |
| ---------------------------------------- | --------------------------------------------------------------------- |
| [foundations.md](foundations.md)         | Color, tipografía, espaciado, elevación, movimiento, accesibilidad    |
| [components.md](components.md)           | Especificación de componentes (existentes y nuevos) con anatomía y API |
| [mobile-patterns.md](mobile-patterns.md) | Patrones mobile-first para agenda, sponsors, hero y estadísticas      |
| [roadmap.md](roadmap.md)                 | Orden de adopción, cada paso con el problema que resuelve             |
| [brand-alignment.md](brand-alignment.md) | Tabla de diferencias con la marca AWS y el cambio de navy a Squid Ink |
| [tokens-brand-v2.css](tokens-brand-v2.css) | Valores "antes → después" de color para `app/globals.css`            |
| [scripts/check-contrast.mjs](scripts/check-contrast.mjs) | Verifica contraste AA de la propuesta (`node design-system/scripts/check-contrast.mjs`) |
| [tokens.css](tokens.css)                 | Tokens nuevos (tipografía fluida, espaciado, touch, sombras, motion)  |
| [preview.html](preview.html)             | Muestrario visual (claro/oscuro) con interruptor "Marca: actual / AWS v2" |

## Principios

1. **Mobile primero.** La mayoría llega desde redes sociales en un teléfono.
   Se diseña a 375px y se amplía.
2. **Azul navega, naranja actúa, rojo es identidad.** El naranja AWS es solo
   para la acción principal de la pantalla (una por vista). El rojo nacional
   nunca comunica error.
3. **Comunidad real antes que decoración.** Fotos reales, personas y nombres
   por encima de ilustración. Lo decorativo nunca carga significado.
4. **Una pantalla, una decisión.** Cada vista tiene una acción primaria
   (registrarme, proponer charla, ver agenda). Lo secundario es visualmente
   secundario.
5. **Denso pero respirable.** Páginas largas son aceptables en escritorio;
   en mobile se usan rieles, cuadrículas de 2 columnas y acordeones.
6. **Accesible por defecto.** AA mínimo, objetivos táctiles de 44px, foco
   visible, movimiento reducido respetado.

## Marca AWS: qué tomamos y qué no

- **Sí:** el naranja "Smile" `#FF9900` como acción, el "Squid Ink" como
  referencia de navy oscuro, la sobriedad técnica, el logo oficial de
  Community Day sin alterar.
- **No:** Amazon Ember (tipografía propietaria, no licenciable para terceros).
  Se mantiene **Geist** + **Geist Mono**, que tiene el mismo carácter
  geométrico y técnico y ya está cargada.
- **No tocar:** logotipos de AWS y de sponsors (no recolorear, respetar el
  espacio de protección). Siempre sobre la placa blanca `surface-logo-plate`.
- Las reglas oficiales del programa Community Day prevalecen sobre este
  documento si hay conflicto.

## Reglas del repositorio que este sistema respeta

- Los colores solo viven en `app/globals.css` (regla ESLint
  `local/no-color-literals`). `tokens.css` no define colores.
- Estructura atómica: `components/{atoms,molecules,organisms,templates}`.
- Tailwind v4 con tokens en `@theme`.
- Los textos de interfaz están en español de Paraguay (voseo).

## Estado

Versión 0.1, creada a partir de la revisión UX/UI de la home y las páginas
internas (nota global 5,8/7). Ver [roadmap.md](roadmap.md).
