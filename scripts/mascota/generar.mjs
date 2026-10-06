// Genera la hoja de sprites de la mascota a partir de `referencia.png`.
//
//   node scripts/mascota/generar.mjs            → escribe public/mascota/*.png
//   node scripts/mascota/generar.mjs --vista d  → además deja en `d` una vista
//                                                 ampliada y el mapa en texto
//
// No es parte del build: los PNG generados se commitean. Usa el `sharp` que
// Next ya trae en node_modules, así que no añade dependencias.
//
// El proceso tiene tres pasos:
//   1. La ilustración se reduce a una rejilla de 69×96 con una paleta fija
//      (cada celda toma el color que más se repite dentro de ella).
//   2. Encima van retoques a mano (`retocar`): lo que a ese tamaño no sobrevive
//      solo, como los ojos, la boca o el dibujo del polo.
//   3. Los cuadros de animación se derivan del cuadro base moviendo partes
//      (`CUADROS`). El orden de esa lista es el que usa el CSS de la mascota
//      en globals.css: si cambia aquí, hay que cambiarlo allí.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, "..", "..");

/** Alto del personaje en píxeles de sprite. El ancho sale de la proporción. */
const ALTO = 96;
/** Celda de la hoja: el personaje más aire para el contorno y los gestos. */
export const CELDA = { ancho: 80, alto: 100 };
/** Fila del piso dentro de la celda (la última la ocupa el contorno). */
const PISO = CELDA.alto - 2;

// Paleta fija, tomada de la ilustración. La letra es la que aparece en el
// mapa de texto de --vista y la que usan los retoques.
const PALETA = {
  c: "#e3bf99", // crema: hocico, pecho, interior de las orejas
  s: "#d0a482", // crema en sombra
  p: "#ac9177", // pelaje
  m: "#8e745b", // pelaje medio
  r: "#684e36", // rayas
  o: "#382413", // café oscuro: ojos y contornos de la cara
  n: "#1e1e1e", // negro del polo
  g: "#34332f", // pliegues del polo
  v: "#25954b", // verde del pantalón
  d: "#1c7739", // verde en sombra
  b: "#ffffff", // blanco
  h: "#e6e8e3", // blanco en sombra
  x: "#c4c4c2", // gris de la suela
  a: "#1e78c9", // azul
  z: "#156aa6", // azul en sombra
  y: "#f6b109", // amarillo
  j: "#e5482b", // rojo
  k: "#f16269", // rosa: mejillas y lengua
  // Solo para retoques: la reducción automática no los usa.
  e: "#b9ab98", // aro del ojo, visto a través del lente
  q: "#a3332a", // interior de la boca
};
/** Cuántos colores de la paleta puede elegir la reducción automática. */
const AUTOMATICOS = 18;

const letras = Object.keys(PALETA);
const rgb = letras.map((l) => {
  const n = parseInt(PALETA[l].slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
});
/** Índice de paleta de una letra. -1 es transparente. */
const idx = (letra) => (letra === "." ? -1 : letras.indexOf(letra));

// --- Color ------------------------------------------------------------------

function oklab([r, g, b]) {
  const lin = (v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

const paletaLab = rgb.map(oklab);
const cache = new Map();

function masCercano(r, g, b) {
  const clave = (r << 16) | (g << 8) | b;
  let mejor = cache.get(clave);
  if (mejor !== undefined) return mejor;
  const lab = oklab([r, g, b]);
  let dist = Infinity;
  paletaLab.slice(0, AUTOMATICOS).forEach((p, i) => {
    const d = (p[0] - lab[0]) ** 2 + (p[1] - lab[1]) ** 2 + (p[2] - lab[2]) ** 2;
    if (d < dist) {
      dist = d;
      mejor = i;
    }
  });
  cache.set(clave, mejor);
  return mejor;
}

// --- Rejilla ----------------------------------------------------------------

/** Una rejilla es un Int8Array de índices de paleta con su ancho y alto. */
function crear(ancho, alto) {
  return { ancho, alto, px: new Int8Array(ancho * alto).fill(-1) };
}
const copiar = (g) => ({ ...g, px: g.px.slice() });
const dentro = (g, x, y) => x >= 0 && y >= 0 && x < g.ancho && y < g.alto;
const leer = (g, x, y) => (dentro(g, x, y) ? g.px[y * g.ancho + x] : -1);
function poner(g, x, y, v) {
  if (dentro(g, x, y)) g.px[y * g.ancho + x] = v;
}

/** Paso 1: la ilustración reducida a la rejilla, ya en colores de paleta. */
async function reducir(ruta) {
  const { data, info } = await sharp(ruta)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;

  // El fondo es el blanco conectado con los bordes. Se busca por inundación
  // para no llevarse el blanco de las zapatillas ni el brillo de los ojos.
  const fondo = new Uint8Array(W * H);
  const blanco = (i) => data[i] > 244 && data[i + 1] > 244 && data[i + 2] > 244;
  const cola = [];
  for (let x = 0; x < W; x++) cola.push(x, 0, x, H - 1);
  for (let y = 0; y < H; y++) cola.push(0, y, W - 1, y);
  while (cola.length) {
    const y = cola.pop();
    const x = cola.pop();
    if (x < 0 || y < 0 || x >= W || y >= H || fondo[y * W + x]) continue;
    if (!blanco((y * W + x) * 4)) continue;
    fondo[y * W + x] = 1;
    cola.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }

  let x0 = W;
  let y0 = H;
  let x1 = 0;
  let y1 = 0;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (!fondo[y * W + x]) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }

  const celda = (y1 - y0 + 1) / ALTO;
  const g = crear(Math.ceil((x1 - x0 + 1) / celda), ALTO);
  const votos = new Uint16Array(AUTOMATICOS);

  for (let gy = 0; gy < g.alto; gy++)
    for (let gx = 0; gx < g.ancho; gx++) {
      votos.fill(0);
      let vacios = 0;
      let total = 0;
      const yFin = Math.min(H, Math.floor(y0 + (gy + 1) * celda));
      const xFin = Math.min(W, Math.floor(x0 + (gx + 1) * celda));
      for (let y = Math.floor(y0 + gy * celda); y < yFin; y++)
        for (let x = Math.floor(x0 + gx * celda); x < xFin; x++) {
          total++;
          if (fondo[y * W + x]) {
            vacios++;
            continue;
          }
          const i = (y * W + x) * 4;
          votos[masCercano(data[i], data[i + 1], data[i + 2])]++;
        }
      if (vacios * 2 > total) continue;
      let mejor = 0;
      for (let i = 1; i < votos.length; i++) if (votos[i] > votos[mejor]) mejor = i;
      poner(g, gx, gy, mejor);
    }

  return g;
}

/** Quita píxeles sueltos: los que no comparten color con ningún vecino. */
function limpiar(g) {
  const salida = copiar(g);
  for (let y = 0; y < g.alto; y++)
    for (let x = 0; x < g.ancho; x++) {
      const v = leer(g, x, y);
      const vecinos = [leer(g, x - 1, y), leer(g, x + 1, y), leer(g, x, y - 1), leer(g, x, y + 1)];
      if (vecinos.includes(v)) continue;
      const cuenta = new Map();
      for (const n of vecinos) cuenta.set(n, (cuenta.get(n) ?? 0) + 1);
      const [ganador, veces] = [...cuenta].sort((a, b) => b[1] - a[1])[0];
      if (veces >= 2) poner(salida, x, y, ganador);
    }
  return salida;
}

// --- Retoques ----------------------------------------------------------------

/** Pinta un texto de letras de paleta desde (x, y). "." borra, " " no toca. */
function fila(g, x, y, texto) {
  [...texto].forEach((letra, i) => {
    if (letra !== " ") poner(g, x + i, y, idx(letra));
  });
}

function rect(g, x0, y0, x1, y1, letra) {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) poner(g, x, y, idx(letra));
}

/** Esquina superior izquierda de cada ojo (9×9). */
const OJOS = [
  [22, 19],
  [42, 21],
];

/**
 * Paso 2. A 69×96 la reducción deja la cara y el polo irreconocibles, así que
 * se redibujan a mano siguiendo la ilustración: montura y lentes, ojos, nariz,
 * boca, mejillas y el dibujo del polo (que a este tamaño solo puede ser una
 * versión simplificada: llaves, arco, sol y las barras de colores).
 */
function retocar(g) {
  // Restos de la reducción alrededor de la cara.
  fila(g, 16, 16, "rrmmmpp");
  fila(g, 35, 21, "ppp");
  fila(g, 35, 22, "ppp");
  fila(g, 13, 31, "rr");
  fila(g, 13, 32, "r");
  fila(g, 14, 34, "cc");
  fila(g, 16, 78, "p");
  fila(g, 54, 86, "..");
  fila(g, 54, 87, "....");

  // Hocico en crema, para dibujar encima.
  rect(g, 33, 26, 38, 28, "c");
  rect(g, 29, 29, 42, 35, "c");
  rect(g, 44, 32, 50, 34, "c");

  // Lente izquierdo: amarillo y verde. La montura es gruesa y se cierra en
  // curva hacia abajo, como en la ilustración.
  fila(g, 15, 17, "yyyyyyyyyyvvvvvvvvvvv");
  fila(g, 15, 18, "yyyyyyyyyyvvvvvvvvvvv");
  fila(g, 16, 19, "yyyyrmmmeeeeemmmvvvv");
  fila(g, 16, 20, "yyyyrmmeoooooemmvvvv");
  fila(g, 16, 21, "yyyymmeoobboooemvvvv");
  fila(g, 17, 22, "yyymmeoobboooemvvvv");
  fila(g, 17, 23, "yyyymeoooooooemvvvv");
  fila(g, 17, 24, "yyyymeoooooooemvvvv");
  fila(g, 18, 25, "yyyyeoooooboemvvvv");
  fila(g, 18, 26, "yyyymeoooooemmvvv");
  fila(g, 19, 27, "yyyymeeeeemvvvvv");
  fila(g, 20, 28, "yyyyvvvvvvvvvv");
  fila(g, 22, 29, "yyvvvvvvvv");

  // Puente.
  fila(g, 36, 18, "g");
  fila(g, 36, 19, "gg");
  fila(g, 36, 20, "gg");

  // Lente derecho: azul y rojo. Va un poco más bajo, la cabeza está ladeada.
  fila(g, 38, 19, "aaaaaaaaaajjjj");
  fila(g, 38, 20, "aaaaaaaaaajjjjjjjjj");
  fila(g, 38, 21, "aammmmeeeeemmmjjjjjjj");
  fila(g, 38, 22, "aammmeoooooemmmmjjjjj");
  fila(g, 38, 23, "aammeoobboooemmmjjjjj");
  fila(g, 38, 24, "aammeoobboooemmmjjjj.");
  fila(g, 38, 25, "aammeoooooooemmjjjj");
  fila(g, 38, 26, "aammeoooooooemmjjjj");
  fila(g, 38, 27, "aaameoooooboemjjjj");
  fila(g, 39, 28, "aaameoooooemjjjj");
  fila(g, 40, 29, "aaaaeeeeemjjjj");
  fila(g, 41, 30, "aaaaaajjjjjj");
  fila(g, 43, 31, "aaaajjjj");

  // Nariz y boca.
  fila(g, 34, 27, "oooo");
  fila(g, 35, 28, "oo");
  fila(g, 35, 29, "oo");
  fila(g, 31, 30, "o   oo   o");
  fila(g, 32, 31, "oooooooo");
  fila(g, 32, 32, "oqqqqqqo");
  fila(g, 32, 33, "oqkkkkqo");
  fila(g, 33, 34, "okkkko");
  fila(g, 34, 35, "oooo");

  // Mejillas.
  fila(g, 21, 30, "kkkk");
  fila(g, 20, 31, "kkkkkk");
  fila(g, 21, 32, "kkkk");
  fila(g, 46, 32, "kkkk");
  fila(g, 45, 33, "kkkkkk");
  fila(g, 46, 34, "kkkk");

  // Polo: "{ DevFest }", la barra de colores, el arco con la catedral, el
  // sol, las palmeras y la franja de iconos.
  rect(g, 29, 45, 46, 67, "n");
  fila(g, 30, 45, " b          b ");
  fila(g, 30, 46, " b          b ");
  fila(g, 30, 47, "b  bbb bbbb  b");
  fila(g, 30, 48, " b          b ");
  fila(g, 30, 49, " b          b ");
  fila(g, 32, 51, "aaajjyyvvv");
  fila(g, 32, 53, "    bb   yy");
  fila(g, 32, 54, "   b  b  yy");
  fila(g, 32, 55, "  b    b");
  fila(g, 32, 56, "  b    b");
  fila(g, 29, 57, "b b b      b b b");
  fila(g, 29, 58, "bbb b      b bbb");
  fila(g, 29, 59, " b  b b  b b  b ");
  fila(g, 29, 60, " b b  b  b  b b ");
  fila(g, 29, 61, " b b  bbbb  b b ");
  fila(g, 29, 62, " b b  byyb  b b ");
  fila(g, 29, 63, "bbbbbbbbbbbbbbbb");
  fila(g, 28, 65, "aaaaajjjjyyyyvvvvv");
  fila(g, 29, 67, "xx x xx xxx x x");

  return g;
}

// --- Cuadros ------------------------------------------------------------------

const pelaje = new Set(["c", "s", "p", "m", "r", "e"].map(idx));

/**
 * Quita filas enteras en un rango de columnas y junta lo que queda. Con
 * `ancla: "piso"` baja lo de arriba (el cuerpo se encoge hacia los pies); con
 * `ancla: "techo"` sube lo de abajo (un pie se levanta del suelo).
 */
function plegar(g, filas, { x0 = 0, x1 = g.ancho - 1, ancla = "piso" } = {}) {
  for (let x = x0; x <= x1; x++) {
    const columna = [];
    for (let y = 0; y < g.alto; y++) if (!filas.includes(y)) columna.push(leer(g, x, y));
    const hueco = new Array(filas.length).fill(-1);
    const nueva = ancla === "piso" ? [...hueco, ...columna] : [...columna, ...hueco];
    nueva.forEach((v, y) => poner(g, x, y, v));
  }
  return g;
}

/**
 * Mueve los píxeles que cumplen `es(x, y, color)` según `hacia(x, y)`. Con
 * `coser`, los huecos que quedarían pegados al cuerpo por la izquierda
 * conservan su color: así el brazo no se separa de la manga al inclinarse.
 */
function mover(g, es, hacia, { coser = false } = {}) {
  const piezas = [];
  for (let y = 0; y < g.alto; y++)
    for (let x = 0; x < g.ancho; x++) {
      const v = leer(g, x, y);
      if (v >= 0 && es(x, y, v)) piezas.push([x, y, v]);
    }
  for (const [x, y] of piezas) poner(g, x, y, -1);
  for (const [x, y, v] of piezas) {
    const [dx, dy] = hacia(x, y);
    poner(g, x + dx, y + dy, v);
  }
  if (coser)
    for (const [x, y, v] of piezas)
      if (leer(g, x, y) < 0 && leer(g, x - 1, y) >= 0) poner(g, x, y, v);
  return g;
}

// Partes del cuerpo, en coordenadas de la rejilla.
const CINTURA = 66;
const RODILLA = [79, 80];
const ENTREPIERNA = 35;

const esBrazo = (x, y, v) => x >= 55 && y >= 36 && y <= 55 && v !== idx("n");
const topeCola = { 57: 9, 58: 10, 59: 10, 60: 11 };
const esCola = (x, y, v) => pelaje.has(v) && y >= 57 && y <= 78 && x <= (topeCola[y] ?? 18);
const esPierna = (lado) => (x, y) => y > RODILLA[1] && (lado < 0 ? x <= ENTREPIERNA : x > ENTREPIERNA);

/** Inclina el brazo en alto: la pata se va `k` píxeles, el codo no se mueve. */
const saludar = (g, k) =>
  mover(g, esBrazo, (x, y) => [Math.round((k * (55 - y)) / 19), 0], { coser: k > 0 });
/** Sube (k < 0) o baja (k > 0) la punta de la cola; la base no se mueve. */
const colear = (g, k) => mover(g, esCola, (x) => [0, Math.round((k * (18 - x)) / 18)]);
/** Levanta un pie del suelo. */
const pisar = (g, lado) =>
  plegar(g, RODILLA, {
    x0: lado < 0 ? 0 : ENTREPIERNA + 1,
    x1: lado < 0 ? ENTREPIERNA : g.ancho - 1,
    ancla: "techo",
  });
/** Balancea una pierna hacia un lado, desde la rodilla. */
const balancear = (g, lado, k) =>
  mover(g, esPierna(lado), (x, y) => [Math.round((k * (y - RODILLA[1])) / 15), 0]);

function cerrarOjos(g) {
  for (const [x, y] of OJOS) {
    rect(g, x, y, x + 8, y + 8, "m");
    fila(g, x, y + 4, "o       o");
    fila(g, x, y + 5, " ooooooo ");
  }
  return g;
}

function cerrarBoca(g) {
  rect(g, 32, 32, 39, 35, "c");
  return g;
}

/**
 * Paso 3. Un cuadro por entrada, en el orden en que quedan en la hoja. Los
 * @keyframes de la mascota en globals.css se refieren a ellos por posición.
 */
const CUADROS = [
  /*  0 */ ["reposo", (g) => g],
  /*  1 */ ["respira", (g) => plegar(g, [CINTURA])],
  /*  2 */ ["parpadeo", (g) => cerrarOjos(g)],
  /*  3 */ ["saludo-fuera", (g) => saludar(g, 3)],
  /*  4 */ ["saludo-dentro", (g) => saludar(g, -2)],
  /*  5 */ ["paso-izquierdo", (g) => pisar(g, -1)],
  /*  6 */ ["paso-derecho", (g) => pisar(g, 1)],
  /*  7 */ ["cola-arriba", (g) => colear(g, -2)],
  /*  8 */ ["cola-abajo", (g) => colear(g, 2)],
  /*  9 */ ["agarrado-a", (g) => colear(balancear(balancear(g, -1, 3), 1, 3), 3)],
  /* 10 */ ["agarrado-b", (g) => colear(balancear(balancear(g, -1, -3), 1, -3), 2)],
  /* 11 */ ["caida-a", (g) => colear(balancear(balancear(g, -1, -3), 1, 3), -3)],
  /* 12 */ ["caida-b", (g) => colear(balancear(balancear(g, -1, -2), 1, 2), -2)],
  // Los ojos se cierran antes de plegar: después ya no están en su sitio.
  /* 13 */ ["aterrizaje", (g) => plegar(cerrarOjos(g), [CINTURA, CINTURA + 1, ...RODILLA])],
  /* 14 */ ["boca-cerrada", (g) => cerrarBoca(g)],
];

// --- Salida -----------------------------------------------------------------

/** Coloca el personaje en su celda, centrado y con los pies en el piso. */
function encuadrar(g) {
  const celda = crear(CELDA.ancho, CELDA.alto);
  const dx = Math.floor((CELDA.ancho - g.ancho) / 2);
  const dy = PISO - g.alto + 1;
  for (let y = 0; y < g.alto; y++)
    for (let x = 0; x < g.ancho; x++) poner(celda, x + dx, y + dy, leer(g, x, y));
  return celda;
}

/** RGBA de una celda con un contorno de 1px alrededor de la silueta. */
function pintar(celda, contorno) {
  const out = Buffer.alloc(celda.ancho * celda.alto * 4);
  for (let y = 0; y < celda.alto; y++)
    for (let x = 0; x < celda.ancho; x++) {
      const o = (y * celda.ancho + x) * 4;
      const v = leer(celda, x, y);
      let color = null;
      if (v >= 0) color = rgb[v];
      else if (
        contorno &&
        (leer(celda, x - 1, y) >= 0 ||
          leer(celda, x + 1, y) >= 0 ||
          leer(celda, x, y - 1) >= 0 ||
          leer(celda, x, y + 1) >= 0)
      )
        color = contorno;
      if (!color) continue;
      out[o] = color[0];
      out[o + 1] = color[1];
      out[o + 2] = color[2];
      out[o + 3] = 255;
    }
  return out;
}

async function hoja(celdas, contorno, ruta) {
  const ancho = CELDA.ancho * celdas.length;
  const lienzo = Buffer.alloc(ancho * CELDA.alto * 4);
  celdas.forEach((celda, i) => {
    const img = pintar(celda, contorno);
    for (let y = 0; y < CELDA.alto; y++)
      img.copy(
        lienzo,
        (y * ancho + i * CELDA.ancho) * 4,
        y * CELDA.ancho * 4,
        (y + 1) * CELDA.ancho * 4,
      );
  });
  await sharp(lienzo, { raw: { width: ancho, height: CELDA.alto, channels: 4 } })
    .png({ palette: true, colours: 32, dither: 0, compressionLevel: 9 })
    .toFile(ruta);
}

function mapa(g) {
  const regla = (paso) =>
    "    " + Array.from({ length: g.ancho }, (_, x) => String(x).padStart(2, "0")[paso]).join("");
  const filas = [regla(0), regla(1)];
  for (let y = 0; y < g.alto; y++) {
    let fila = String(y).padStart(2, "0") + "  ";
    for (let x = 0; x < g.ancho; x++) fila += leer(g, x, y) < 0 ? "." : letras[leer(g, x, y)];
    filas.push(fila);
  }
  return filas.join("\n");
}

const base = retocar(limpiar(await reducir(join(aqui, "referencia.png"))));
const celdas = CUADROS.map(([, hacer]) => encuadrar(hacer(copiar(base))));

const destino = join(raiz, "public", "mascota");
await mkdir(destino, { recursive: true });
await hoja(celdas, [0x1e, 0x1e, 0x1e], join(destino, "gato.png"));
await hoja(celdas, [0xf0, 0xf0, 0xf0], join(destino, "gato-oscuro.png"));
console.log(`${celdas.length} cuadros de ${CELDA.ancho}×${CELDA.alto} → public/mascota/`);

const vista = process.argv.indexOf("--vista");
if (vista > 0) {
  const dir = process.argv[vista + 1];
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "mapa.txt"), mapa(base));
  for (const [archivo, fondo] of [
    ["gato.png", "#f0f0f0"],
    ["gato-oscuro.png", "#1e1e1e"],
  ]) {
    // En filas de 5 cuadros para que la vista quepa en pantalla.
    const porFila = 5;
    const filas = Math.ceil(celdas.length / porFila);
    const piezas = [];
    for (let i = 0; i < celdas.length; i++)
      piezas.push({
        input: await sharp(join(destino, archivo))
          .extract({ left: i * CELDA.ancho, top: 0, width: CELDA.ancho, height: CELDA.alto })
          .resize(CELDA.ancho * 4, CELDA.alto * 4, { kernel: "nearest" })
          .png()
          .toBuffer(),
        left: (i % porFila) * CELDA.ancho * 4,
        top: Math.floor(i / porFila) * CELDA.alto * 4,
      });
    await sharp({
      create: {
        width: Math.min(celdas.length, porFila) * CELDA.ancho * 4,
        height: filas * CELDA.alto * 4,
        channels: 4,
        background: fondo,
      },
    })
      .composite(piezas)
      .png()
      .toFile(join(dir, "vista-" + archivo));
  }
}
