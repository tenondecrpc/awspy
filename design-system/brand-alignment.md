# Alineación con la marca AWS

Cuánto se parece hoy el sitio a la marca AWS, qué cambiar para acercarlo y
qué se mantiene a propósito.

> **Importante: valores de referencia aproximados.** Los colores AWS de la
> columna "Referencia AWS" provienen de las guías públicas de AWS (Squid Ink,
> Smile) y del sistema Cloudscape, tal como las conozco; **no se contrastaron
> con el kit oficial de Community Day**. Antes de publicar, pedir el kit al
> programa y reemplazar la columna con los valores exactos. Las decisiones de
> uso de logos y naming están en [Cumplimiento](#cumplimiento-con-el-programa).

## Distancia actual

**Cercanía estimada: 6 / 10.** Meta con este plan: **7–7,5 / 10**.

## Tabla de diferencias

Archivo de código: `app/globals.css`. Contrastes calculados con
[scripts/check-contrast.mjs](scripts/check-contrast.mjs).

| Elemento | Token | Hoy (claro) | Referencia AWS | Propuesta | Distancia hoy | Acción |
| --- | --- | --- | --- | --- | --- | --- |
| Acción / CTA | `action` | `#ff9900` | Smile `#FF9900` | `#ff9900` | Ninguna | Mantener |
| Texto sobre acción | `text-on-action` | `#08152f` | Navy oscuro | `#08152f` (8,47:1) | Ninguna | Mantener |
| Banda oscura (footer, sede) | `surface-inverse` | `#08152f` | Squid Ink `#232F3E` | **`#232f3e`** | **Alta** | **Cambiar** |
| Borde sobre oscuro | `border-on-inverse` | `#34415f` | Gris Squid | **`#414d5c`** | Media | Cambiar |
| Hero | `surface-hero`, `brand-primary` | `#000c2f`, `#041a53` | Squid Ink / negro | Se mantienen | Media | Mantener (identidad del evento), solo en el hero |
| Enlace / azul de interfaz | `accent` | `#0038a8` | Azul `#0972D3` (Cloudscape) | **`#075ab0`** | Media | **Cambiar** |
| Azul fuerte (hover) | `accent-strong` | `#002b7a` | Azul más oscuro | **`#054a8f`** | Media | Cambiar |
| Azul de foco | `focus` | `#0a4db8` | Mismo azul de enlace | **`#075ab0`** | Baja | Cambiar |
| Rojo nacional sobre oscuro | `national-red-on-dark` | `#ff5566` | — (no es AWS) | **`#ff6b78`** | — | Cambiar (contraste sobre Squid Ink) |
| Rojo nacional | `national-red` | `#f02f3b` | — (identidad local) | `#f02f3b` | Intencional | Mantener, solo acento |
| Superficie base oscuro | `surface` (dark) | `#010928` | Gris-azul oscuro neutro | **`#0f1b2a`** | Alta | **Cambiar** |
| Superficie fría oscuro | `surface-muted` (dark) | `#071438` | Gris-azul | **`#16202c`** | Alta | Cambiar |
| Superficie elevada oscuro | `surface-elevated` (dark) | `#0d1b46` | Gris-azul | **`#1b2838`** | Alta | Cambiar |
| Enlace oscuro | `accent` (dark) | `#74a8ff` | Azul claro `#539FE5` | **`#539fe5`** | Media | Cambiar |
| Hero | `surface-hero` (dark) | `#01051d` | Casi negro | Se mantiene | Media | Mantener |
| Tipografía | `--font-geist-sans` | Geist | Amazon Ember | Geist | Media | Mantener (Ember no es licenciable) |
| Efectos | `glass-panel`, brillos | Vidrio, brillos, gradientes | Plano, sobrio | Limitar al hero | Media | Reducir |
| Logo | — | Oficial Community Day | Oficial | Igual | Ninguna | Validar con el programa |

### Por qué estos valores

- **Squid Ink (`#232F3E`)** es el neutro oscuro de las guías AWS. El navy
  actual, `#08152f`, es mucho más azul y saturado. Cambiarlo en las bandas
  grandes (footer, sede, bandas de sección) es el cambio de mayor efecto.
- **Azul de enlace.** El `#0972D3` de Cloudscape da 4,82:1 sobre blanco pero
  **falla sobre las superficies teñidas** (4,30:1 sobre `surface-muted`,
  4,18:1 sobre `accent-soft`). Por eso se propone `#075ab0`, el mismo tono
  ligeramente más profundo (6,78:1 sobre blanco, ≥ 5,88:1 sobre todas las
  superficies).
- **Rojo sobre Squid Ink.** `#ff5566` da 4,36:1 sobre `#232f3e` y falla AA.
  `#ff6b78` da 4,93:1.
- **Modo oscuro neutro.** Las superficies pasan de azul saturado (`#010928`)
  a gris-azul (`#0f1b2a`, `#16202c`, `#1b2838`), la familia visual de las
  consolas AWS. Los textos y el naranja conservan contraste de sobra.

## Qué se mantiene a propósito

- **Rojo nacional** como acento (barra de 4px en títulos, bandera). Es la
  identidad paraguaya y lo que evita un aspecto corporativo genérico. No se
  usa nunca como color de error.
- **Hero en azul profundo** (`#000c2f`): marca el arranque del evento. Es el
  único lugar donde sobrevive ese azul; el resto pasa a Squid Ink.
- **Geist.** Amazon Ember es propietaria; Geist cubre el mismo rol
  geométrico-técnico.
- **Fotos reales** de la comunidad y el tono de eventos locales.

## Qué se reduce

- Vidrio esmerilado (`glass-panel`) y brillos (`glow-*`): solo en el hero y
  en la cuenta regresiva. En el resto, superficies planas con borde
  `border-subtle` (ver "Elevación" en [foundations.md](foundations.md)).
- Gradientes decorativos fuera del hero.

## Cumplimiento con el programa

**No verificado desde este repositorio; confirmar con el programa:**

1. **Logo.** Si el logo "AWS Community Day Paraguay" lo entregó el programa,
   se usa sin recolorear, con espacio de protección y sin elementos pegados.
   Las dos versiones (navy / blanca) deben coincidir con las del kit.
2. **Naming.** "AWS Community Day Paraguay" como forma aprobada y la forma de
   mencionar a AWS en patrocinios.
3. **Logos de sponsors.** Siempre sobre la placa blanca (`surface-logo-plate`),
   sin recolorear (ya implementado).
4. **Atribución comunitaria.** Dejar claro que es un evento organizado por la
   comunidad (ya presente: "AWS User Group Paraguay").

Si el programa entrega un kit con colores propios, **el kit manda**: se
actualiza la columna "Referencia AWS" y se vuelve a correr el script de
contraste.

## Cómo aplicarlo

1. Copiar los valores de [tokens-brand-v2.css](tokens-brand-v2.css) sobre los
   tokens existentes de `app/globals.css` (hay un mapa "antes → después").
2. Correr `node design-system/scripts/check-contrast.mjs`: debe imprimir
   "All pairs pass".
3. Revisar manualmente: footer, banda de sede, tarjetas de speakers, filtros
   de agenda, FAQ y el modo oscuro completo. Buscar texto sobre
   `surface-inverse` que tenía un valor pensado para el navy anterior.
4. Probar a 375px y a 1280px, en claro y oscuro.

Riesgo: sitios con muchos tonos azules mezclados se ven "sucios" durante la
transición. Cambiar todo el bloque a la vez, no token por token.

## Hipótesis a validar

- ¿Sigue el hero (azul profundo) viéndose coherente junto a bandas Squid Ink?
  Alternativa: llevar el hero a `#0f1b2a` y conservar el azul solo en el
  degradado del título.
- ¿Prefieren los organizadores mantener el azul de bandera `#0038a8` como
  acento de marca local? Si sí, usarlo solo en decoración, nunca en enlaces.
