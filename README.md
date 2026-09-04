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
│   ├── Tickets.tsx      Entrada general + Pase Pro
│   ├── Sponsors.tsx     Grilla de logos + invitación a auspiciar
│   └── Footer.tsx
├── data/                Contenido editable (agenda, speakers, sponsors, planes)
└── lib/site.ts          Fecha, sede, contacto, navegación y métricas
```

## Cómo reemplazar los datos de ejemplo

Todo el contenido provisional está marcado con `TODO` en el código. Nada de
esto exige tocar componentes:

| Qué cambiar | Dónde |
| --- | --- |
| Fecha, hora, sede, correo, métricas del hero | `src/lib/site.ts` |
| Charlas, horarios, tracks y salas | `src/data/agenda.ts` |
| Speakers | `src/data/speakers.ts` |
| Sponsors | `src/data/sponsors.ts` |
| Planes de entrada, precio y beneficios | `src/data/tickets.ts` |

**Fotos de speakers:** mientras no haya foto, la tarjeta genera un avatar con
las iniciales y un degradado estable derivado del nombre. Para usar una foto
real, coloca el archivo en `public/speakers/` y agrega el campo `photo` al
speaker:

```ts
{ name: "Valeria Quispe", photo: "/speakers/valeria.jpg", /* ... */ }
```

**Logos de sponsors:** los SVG en `public/sponsors/` son marcadores de
posición en blanco sobre fondo transparente, y la sección los invierte en tema
claro. Al poner logos reales a color, quita `invert dark:invert-0` de
`src/components/Sponsors.tsx` y provee una versión que se lea en ambos temas.

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

## Notas de implementación

- Casi todo son Server Components. Solo son cliente `Navbar` (estado de
  scroll y menú), `Countdown` (reloj), `Agenda` (filtros) y `Reveal`
  (aparición al hacer scroll).
- Las animaciones respetan `prefers-reduced-motion`.
- Las capas difuminadas del hero son estáticas y solo animan su opacidad:
  moverlas o escalarlas obliga a re-rasterizar un blur de 110px en cada frame.
