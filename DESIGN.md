# Sistema visual — Obsidiana editorial

Lo que hay construido en `index.html`, descrito tal como quedó (no como se pensó).
Rediseño del 2026-08-08. Dirección fijada por el usuario: negro + neón premium,
fusionando "obsidiana" (negro plano, una sola luz) y "tinta y neón" (reglas
finísimas, aire, cifras enormes).

## Idea

Una app de dinero que se lee como una publicación, no como un panel de control.
Rechaza la cuadrícula de tarjetas iguales y el azul de banca. **La luz solo se
enciende donde hay un dato**: las cifras, los gráficos, la acción principal y la
pestaña donde estás. Todo lo demás es negro, gris frío y líneas de un píxel.

## Color

| Papel | Valor | Dónde |
|---|---|---|
| `--bg` | `#050506` | la página |
| `--panel` | `#0C0D10` | tarjetas y listas |
| `--panel2` | `#15171C` | campos, chips, subtotales |
| `--panel3` | `#1D2027` | estado pulsado, pestaña activa del selector |
| `--line` | `rgba(255,255,255,.075)` | **toda** separación es un píxel a este valor |
| `--line2` | `rgba(255,255,255,.15)` | borde de control |
| `--txt` | `#F4F5F7` | texto principal |
| `--muted` | `#9096A5` | secundario · 6,9:1 |
| `--faint` | `#7B8291` | etiquetas y fechas · 5,1:1 (no bajarlo más) |
| `--accent` / `--green` | `#4FF5A7` | **la luz**: dinero que entra, acción, foco, activo |
| `--accent2` | `#0E7A52` | la misma luz apagada (botón Foto, cabeceras del PDF) |
| `--red` | `#FF4E76` | dinero que sale |
| `--on-accent` | `#03150B` | texto sobre la luz |

Fondo de los dos gráficos: **negro puro `#000`**, a propósito. El neón solo es
neón sobre negro.

Paleta de las categorías, `PIE_PAL` (por puesto en la lista, nunca por gasto):
`#4FF5A7 #56E1FF #A97BFF #FF5FA9 #FFD84F #FF8A4F #5C8CFF #63FFE0 #FF6B6B #B6F24F`.
Barras: ingresos `#4FF5A7→#0C9A5E`, gastos `#FF4E76→#8E0B32` (rojo neón, el
mismo `--red` de "sale dinero" arriba y sangre oscura abajo; antes eran azules,
pero el azul no decía nada en una app donde el rosa ya significa gasto).

**Una sola barra por periodo**: mide lo mayor de los dos y lleva su color; la
sub-barra de dentro, pegada al suelo, mide lo menor y lleva el otro. El trozo
de color que queda a la vista es la diferencia.

## Tipografía

Las dos van **incrustadas en base64** dentro del HTML (90 KB). Nada de enlaces a
CDN: la app tiene que funcionar sin internet.

- **Clash Display 600** (`--f-disp`) — solo cifras y títulos de pantalla.
  Tracking de −.02 a −.035em. Cuanto más grande, más apretada.
- **Satoshi 400/500/700** (`--f-text`) — todo lo demás. 700 casi no se usa:
  la jerarquía la hacen el tamaño y el color, no el peso.
- `font-variant-numeric: tabular-nums` en el `body`: las columnas de euros
  tienen que alinearse.

Etiquetas de sección: 10,5 px, mayúsculas, `letter-spacing:.15em`, `--faint`,
y **más aire encima que debajo** (`margin:28px 0 11px`).

## Materiales

- **Nada de cristales ni desenfoques decorativos.** Solo hay `backdrop-filter`
  en la cabecera, la barra de pestañas y la píldora de la frase motivadora,
  porque ahí sí se solapan con contenido que se mueve.
- Profundidad: `--sh` = contacto + caída (`0 1px 2px` + `0 14px 34px -20px`).
  Nunca un halo de color haciendo de sombra.
- **Resplandor neón**: permitido y limitado a cuatro sitios — la marca de la
  pestaña activa, los dos botones de registrar, la casilla al tacharse y la
  barra de progreso. Siempre con desplazamiento, nunca a cero.
- Radios: 16 px tarjetas, 12 px controles, 999 px chips.
- **Iconos dibujados**, trazo 1,8 (2 en los pequeños), remates redondos. Cero
  emojis: se ven distintos en cada móvil. Las flechas `›` y el `✓` van como
  máscara SVG (`--ico-chev`, `--ico-check`) sobre `currentColor`.

## Lo que ya no se usa

Fondo azul marino (`#0b1120`), bordes `#233149`, verde azulado `#14b8a6`,
tipografía del sistema, emojis como iconos, `.card` como caja individual
(ahora las tres cifras son un bloque con separadores).

## Superficies del navegador

Selección, cursor de escritura, barra de desplazamiento y aro de foco están
tematizados con la paleta. Es lo más barato que distingue una página construida
de una montada.
