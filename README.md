# DevFest Tacna 2026 — GDG Tacna

Landing de una sola página para el DevFest Tacna 2026, construida con
**Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4**.

```bash
npm run dev
```

Luego abre http://localhost:3000

Otros comandos: `npm run build` (build de producción), `npm start` (servir el
build), `npm run lint`.

## Estructura

```
src/
├── app/
│   ├── globals.css      Tokens de tema (claro/oscuro), utilidades, animaciones
│   ├── layout.tsx       Fuentes, metadata y script anti-parpadeo del tema
│   └── page.tsx         Composición de las secciones
├── components/          Una sección por archivo
│   ├── Navbar.tsx       Nav flotante + menú móvil
│   ├── ThemeToggle.tsx  Botón claro / oscuro
│   ├── Hero.tsx         Portada, cuenta regresiva y métricas
│   ├── Agenda.tsx       Línea de tiempo con filtros por track
│   ├── Speakers.tsx     Grilla de speakers
│   ├── Tickets.tsx      Entrada general + experiencia premium
│   ├── Volunteers.tsx   Postulación de voluntarios
│   ├── Sponsors.tsx     Grilla de logos + invitación a auspiciar
│   ├── Pending.tsx      Estado "por confirmar" de las secciones vacías
│   └── Footer.tsx
├── data/                Contenido editable (agenda, speakers, sponsors, planes)
└── lib/site.ts          Fecha, sede, contacto, enlaces y navegación
```

## Cómo rellenar el contenido

**Nada de datos inventados.** Lo que no está confirmado va como TBD, lorem
ipsum o directamente vacío: es preferible un hueco evidente a un dato
verosímil que acabe publicado sin querer.

- `agenda.ts` y `speakers.ts` traen la maqueta llena para poder juzgar el
  diseño, pero el contenido es placeholder. En la agenda, horas, duraciones y
  tracks son reales; títulos, descripciones, speakers y salas no.
- `sponsors.ts` está vacío.

Cualquiera de los tres arrays, si se deja vacío, hace que su sección pase sola
al estado "por confirmar" (`components/Pending.tsx`); al añadir elementos
vuelve la maquetación completa —línea de tiempo, filtros por track, grilla—
sin tocar ningún componente.

| Qué cambiar | Dónde |
| --- | --- |

| Qué cambiar | Dónde |
| --- | --- |
| Fecha, hora, sede, correo, métricas del hero | `src/lib/site.ts` |
| Enlace de registro (Luma) y de voluntarios (Forms) | `src/lib/site.ts` |
| Charlas, horarios, tracks y salas | `src/data/agenda.ts` |
| Speakers | `src/data/speakers.ts` |
| Sponsors | `src/data/sponsors.ts` |
| Planes de entrada, precio y beneficios | `src/data/tickets.ts` |

**Fotos de speakers:** mientras no haya foto, la tarjeta genera un avatar con
las iniciales y un degradado estable derivado del nombre. Para usar una foto
real, coloca el archivo en `public/speakers/` y agrega el campo `photo` al
speaker:

```ts
{ name: "…", photo: "/speakers/nombre.jpg", /* ... */ }
```

**Logos de sponsors:** van en `public/sponsors/` y se referencian como
`/sponsors/archivo.webp`. Sirve cualquier formato (SVG, WebP o PNG) con fondo
transparente; con ~400px de ancho sobra, porque se muestran a unos 48px de alto.

Cada logo va sobre una **placa blanca, también en tema oscuro**. Es a propósito:
los logos llegan a color y muchos llevan texto negro, que sobre el fondo oscuro
desaparecería. Así basta un archivo por sponsor en vez de una versión por tema,
y se respetan los colores de marca. El `<Image>` usa `fill`, así que no hace
falta declarar las dimensiones de cada logo: cualquier proporción encaja.

**Botones de registro:** el CTA del hero, el "Regístrate" del nav y la entrada
general apuntan a Luma; la sección de voluntarios, al formulario. Todos salen
de `site.ts`, así que se cambian en un sitio. El botón de la experiencia
premium queda inerte a propósito mientras no tenga destino: basta con darle un
`href` en `src/data/tickets.ts` para activarlo.

## Tema claro y oscuro

El tema se controla con la clase `.dark` en `<html>`. Los componentes nunca
usan colores literales: solo tokens semánticos (`bg-canvas`, `text-heading`,
`text-muted`, `border-line`, `bg-solid`, `text-g-blue-ink`…) definidos una
sola vez en `globals.css`, en `:root` para claro y en `.dark` para oscuro.
**Para ajustar cualquier color del sitio, edita esas dos listas de variables.**

- Sin preferencia guardada se sigue al sistema; el botón de la nav la fija en
  `localStorage` y a partir de ahí manda la elección del usuario.
- Un script inline en `layout.tsx` aplica el tema antes del primer pintado
  para que no haya destello blanco.
- `ThemeToggle` decide qué icono mostrar por CSS (`hidden dark:block`), no con
  estado de React: así no hay desajuste de hidratación.
- Los colores de Google tienen dos versiones: la viva (`g-blue`, para puntos y
  degradados) y la legible (`g-blue-ink`, para texto y chips), que cambia de
  tono según el tema.

## Pendiente

- Los botones de ambos planes de la sección Entradas son intencionalmente
  inertes: falta conectar el formulario o el enlace de registro, y la pasarela
  de pago del Pase Pro (`src/components/Tickets.tsx`).
- Los enlaces de redes sociales del footer apuntan a `#`
  (`src/components/Footer.tsx`).

## Rendimiento en móvil (leer antes de tocar el hero o el reveal)

Dos reglas que no son obvias y que si se deshacen devuelven el problema:

**1. El contenido nunca se oculta esperando a React.** El CSS oculta los
bloques con `.js .reveal`, y tanto la clase `js` como el `IntersectionObserver`
los pone el script inline de `layout.tsx`, no un `useEffect`. Si el reveal
vuelve a depender de la hidratación, en un móvil con red lenta la página se ve
**vacía** durante todo lo que tarde en bajar y ejecutarse el bundle: el HTML ya
trae el contenido, pero está en `opacity: 0`. Con el script inline aparece en
`DOMContentLoaded`, y si el JS falla del todo nunca llega a ocultarse.

Como el script toca el DOM antes de que React hidrate, `Reveal` **debe**
llevar `suppressHydrationWarning`. Sin él React no solo avisa: re-renderiza el
boundary en cliente y descarta el `is-visible` que el script había puesto. Está
documentado en
`node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`.

Corolario: lo que React crea en caliente (las tarjetas de la agenda al
filtrar) no usa `.reveal` sino la animación `.rise`, que arranca sola con cada
elemento nuevo y no necesita que ningún observador se entere.

**2. La barra de navegación no depende de React.** Ni el desplegable ni el
fondo de la píldora. Es la parte de la página que menos puede permitirse
depender de que el bundle cargue e hidrate: si React no arranca en un
dispositivo, la página se ve pero no se puede recorrer, y el nav se queda
transparente encima del contenido.

- El menú es un `<details>`: abre, cierra y navega con HTML puro. El
  `onClick` que lo cierra al pulsar un enlace es una mejora, no un requisito.
- El fondo de la píldora lo pinta `.nav-pill::before` en CSS, siempre visible.
  Antes salía de un `useState` alimentado por un listener de scroll.

Su aspecto vive en `globals.css` (`.nav-pill`, `.menu`, `.menu-bar`,
`.menu-panel`) porque depende del estado `[open]` del propio elemento.

**3. Nada de `filter: blur()` en capas grandes.** Los halos de color son
`radial-gradient` (`.aurora` en `globals.css`), no divs con `blur-[110px]`. Un
blur de ese radio obliga al móvil a rasterizar una textura enorme en cada
composición; el degradado se ve igual y no crea capa. Por lo mismo el
`backdrop-filter` de la navbar solo se activa desde `md`, el grano
(`feTurbulence`) está apagado por debajo de 768px, y el respirado de las
auroras solo corre en pantallas grandes.

**Navegadores soportados.** Next 16 y Tailwind 4 comparten mínimo: Chrome
111+, Edge 111+, Firefox 111+ y Safari 16.4+ (iOS 16.4, marzo de 2023). Por
debajo de eso el bundle no llega a parsearse y nada interactivo funciona,
aunque el HTML y buena parte del CSS sí se vean.

Ojo con Lighthouse aquí: emula CPU y red, pero corre sobre la GPU del
escritorio, así que este tipo de coste de rasterizado no aparece en el informe.

## Notas de implementación

- Casi todo son Server Components. Solo son cliente `Navbar` (estado de
  scroll y menú), `Countdown` (reloj), `Agenda` (filtros) y `Reveal`
  (aparición al hacer scroll).
- Las animaciones respetan `prefers-reduced-motion`.
- Las capas difuminadas del hero son estáticas y solo animan su opacidad:
  moverlas o escalarlas obliga a re-rasterizar un blur de 110px en cada frame.
