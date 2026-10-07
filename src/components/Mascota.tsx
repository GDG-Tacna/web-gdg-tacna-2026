"use client";

import { useEffect, useRef, useState } from "react";
import { datosMascota, type Dato } from "@/data/mascota";

/**
 * Los estados son los valores de `data-estado`: el CSS de globals.css elige
 * con ellos qué cuadros de la hoja de sprites se ven.
 */
type Estado =
  | "reposo"
  | "saludo"
  | "cola"
  | "salto"
  | "caminar"
  | "habla"
  | "agarrado"
  | "caida"
  | "aterrizaje";

type Globo = {
  dato: Dato;
  /** Posición del globo respecto a la mascota, para que no se salga de pantalla. */
  izquierda: number;
  ancho: number;
  /** Dónde cae el pico, medido desde el borde izquierdo del globo. */
  pico: number;
  /** Sin sitio por encima (está parada cerca del borde superior), sale por debajo. */
  abajo: boolean;
};

/** Por dónde se pisa un piso, en coordenadas de la ventana. */
type Caja = { tope: number; izquierda: number; derecha: number };
type Hallado = { piso: Element; tope: number };

/** Cuánto hay que mover el puntero para que un toque cuente como arrastre. */
const UMBRAL = 6;
// La caída es lenta a propósito: acelera poco y tiene tope, como si planeara.
const GRAVEDAD = 420;
const VELOCIDAD_CAIDA = 200;
const VAIVEN = 10;
const GLOBO_ANCHO = 288;
const GLOBO_MARGEN = 8;
const GLOBO_DURACION = 9000;
/** Alto que se le reserva al globo para decidir si cabe encima. */
const GLOBO_ALTO = 200;
const CLAVE = "mascota";
/** Cada cuánto avanza una mirada al girar la cabeza hacia el puntero. */
const PASO_MIRADA = 70;
/** Con el puntero más cerca que esto (en anchos de mascota), mira de frente. */
const MIRADA_CERCA = 0.6;
// Cortes sobre la dirección hacia el puntero, de -1 a 1 en cada eje: dos
// niveles en horizontal (solo los ojos, la cabeza entera) y uno en vertical.
const MIRADA_LADO = [0.25, 0.7];
const MIRADA_ALTO = [0.4];
/** Margen alrededor de un corte dentro del cual la mirada no cambia. */
const MIRADA_HOLGURA = 0.07;
/** Estados en los que sigue al puntero; en el resto mira de frente. */
const ATENTA: ReadonlySet<string> = new Set(["reposo", "saludo", "cola", "salto", "habla"]);

/**
 * Dónde puede pararse: los títulos, las dos piezas de una TabCard (así el
 * escalón de la pestaña funciona solo), el borde del footer y cualquier bloque
 * marcado con la clase `piso`. La navbar queda fuera: es fija y no se mueve
 * con la página.
 */
const PISOS =
  ":is(main, footer) :is(h1, h2, h3, .tab-card-tab, .tab-card-body, .piso), footer";
const TITULOS = "h1, h2, h3";
// Las medidas que siguen son fracciones del tamaño de la mascota, que cambia
// con la escala.
/** Lo más estrecho que puede ser un piso. */
const ANCHO_MINIMO = 0.75;
/** Cuánto piso tiene que quedarle a cada lado del centro. */
const APOYO = 0.25;
/** Hasta dónde pueden hundirse los pies al soltarla y que aun así se quede. */
const AGARRE = 0.3;
/** Cuánto cuerpo puede esconderse tras la navbar antes de dejar su piso. */
const ASOMO = 0.5;
/** Hasta qué altura brinca para subirse a un piso. */
const ALCANCE = 1.5;

const limitar = (valor: number, min: number, max: number) =>
  Math.min(Math.max(valor, min), Math.max(min, max));

/**
 * En qué escalón cae un valor con signo según sus cortes. Se queda en el
 * escalón previo mientras el valor siga a menos de la holgura de él, para que
 * la mirada no tiemble cuando el puntero ronda un corte.
 */
const escalon = (valor: number, cortes: number[], previo: number) => {
  const nivel = (v: number) => Math.sign(v) * cortes.filter((corte) => Math.abs(v) > corte).length;
  const a = nivel(valor - MIRADA_HOLGURA);
  const b = nivel(valor + MIRADA_HOLGURA);
  return previo >= Math.min(a, b) && previo <= Math.max(a, b) ? previo : nivel(valor);
};

const huecos = new Map<string, number>();
let lienzo: CanvasRenderingContext2D | null | undefined;

/**
 * Hueco entre el borde superior de una línea de texto y la cima de sus
 * mayúsculas. La caja de la línea mide el ascendente completo de la fuente, así
 * que sin restarlo la mascota quedaría flotando sobre el título.
 */
const hueco = (estilo: CSSStyleDeclaration) => {
  const fuente = `${estilo.fontStyle} ${estilo.fontWeight} ${estilo.fontSize} ${estilo.fontFamily}`;
  let valor = huecos.get(fuente);
  if (valor === undefined) {
    if (lienzo === undefined) lienzo = document.createElement("canvas").getContext("2d");
    if (!lienzo) return 0;
    lienzo.font = fuente;
    const medida = lienzo.measureText("H");
    const resto = medida.fontBoundingBoxAscent - medida.actualBoundingBoxAscent;
    valor = resto > 0 ? resto : 0;
    huecos.set(fuente, valor);
  }
  return valor;
};

/**
 * Por dónde se pisa un elemento, o null si no se ve. Un título no se pisa en
 * su caja, que ocupa todo el ancho de la columna, sino en su primera línea de
 * texto.
 */
const medir = (piso: Element): Caja | null => {
  if (!piso.matches(TITULOS)) {
    const marco = piso.getBoundingClientRect();
    return marco.width > 0
      ? { tope: marco.top, izquierda: marco.left, derecha: marco.right }
      : null;
  }
  const textos = document.createTreeWalker(piso, NodeFilter.SHOW_TEXT);
  for (let nodo = textos.nextNode(); nodo; nodo = textos.nextNode()) {
    if (!nodo.nodeValue?.trim() || !nodo.parentElement) continue;
    const tramo = document.createRange();
    tramo.selectNodeContents(nodo);
    const linea = tramo.getClientRects()[0];
    if (!linea || linea.width < 2) continue;
    return {
      tope: linea.top + hueco(getComputedStyle(nodo.parentElement)),
      izquierda: linea.left,
      derecha: linea.right,
    };
  }
  return null;
};

/**
 * Un bloque que todavía está entrando (`.reveal` sin revelar o a media
 * transición, `.rise` recién creado) no sirve de piso: o no se ve, o se
 * movería bajo sus pies.
 */
const asentado = (piso: Element) => {
  const marco = piso.closest(".reveal, .rise");
  return !marco || getComputedStyle(marco).transform === "none";
};

/**
 * La mascota del DevFest: se para encima de lo que haya en pantalla (un
 * título, una tarjeta, el borde inferior de la ventana si no hay otra cosa),
 * da un dato del evento al pulsarla y se puede arrastrar y soltar.
 *
 * El servidor ya la pinta en su esquina con la animación de reposo, que es
 * CSS puro, así que se ve y se mueve antes de hidratar. Lo que añade este
 * componente son los gestos, el arrastre, los pisos y el globo.
 *
 * Parada en un piso deja de ser fija y se ancla al documento
 * (`data-anclada`), así el scroll la mueve con su piso sin que el JS tenga que
 * recolocarla en cada cuadro. Suelta, cayendo o en el borde de la ventana
 * vuelve a ser fija.
 *
 * Con ratón, además sigue al puntero con la mirada: la hoja de sprites tiene
 * una fila por dirección y aquí solo se elige cuál (`--mirada`).
 *
 * El movimiento no pasa por estado de React: la posición, la mirada y el
 * estado viven en variables del efecto y se escriben directo en el elemento,
 * para no renderizar en cada cuadro. React solo se entera de qué dice el globo.
 */
export function Mascota() {
  const raiz = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const [globo, setGlobo] = useState<Globo | null>(null);
  const [oculta, setOculta] = useState(false);

  useEffect(() => {
    const el = raiz.current;
    const cuerpo = boton.current;
    // Oculta en esta sesión: o se acaba de ocultar, o la clase ya la traía
    // puesta el script de layout.tsx.
    if (oculta || !el || !cuerpo) return;
    if (document.documentElement.classList.contains("sin-mascota")) return;

    const calma = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let estado: Estado = "reposo";
    // x desde el borde izquierdo. Fija, se mide por su altura sobre el borde
    // inferior de la ventana; anclada a un piso, por la y de sus pies en la
    // página (`suelo`).
    let x = 0;
    let altura = 0;
    let piso: Element | null = null;
    let suelo = 0;
    let velocidad = 0;
    let fase = 0;
    let ancla = 0;
    let destino = 0;
    let cuadro = 0;
    let revision = 0;
    let previo = 0;
    let espera = 0;
    let gesto = 0;
    let silencio = 0;
    let hablando = false;
    let ignorarClic = false;
    let puntero: {
      id: number;
      dx: number;
      dy: number;
      x0: number;
      y0: number;
      movido: boolean;
    } | null = null;
    let baraja: number[] = [];
    let ultimo = -1;
    // La mirada es [horizontal de -2 a 2, vertical de -1 a 1]: la que se ve y
    // aquella hacia la que va girando.
    let raton: { x: number; y: number } | null = null;
    let mirada = [0, 0];
    let objetivo = [0, 0];
    let giro = 0;
    let vistazo = 0;

    const maxX = () => document.documentElement.clientWidth - el.offsetWidth;
    const maxAltura = () => window.innerHeight - el.offsetHeight;

    const pintar = () => {
      const y = piso ? suelo - el.offsetHeight : -altura;
      el.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
    };

    const anclar = ({ piso: nuevo, tope }: Hallado) => {
      piso = nuevo;
      suelo = tope + window.scrollY;
      el.dataset.anclada = "";
      pintar();
    };

    /** Vuelve a ser fija, en el mismo sitio de la ventana donde estaba. */
    const desanclar = () => {
      if (!piso) return;
      altura = Math.max(0, window.innerHeight - el.getBoundingClientRect().bottom);
      piso = null;
      delete el.dataset.anclada;
      pintar();
    };

    const sostiene = (caja: Caja, ancho: number) => {
      const centro = x + ancho / 2;
      return (
        caja.derecha - caja.izquierda >= ancho * ANCHO_MINIMO &&
        centro >= caja.izquierda + ancho * APOYO &&
        centro <= caja.derecha - ancho * APOYO
      );
    };

    /** Hasta dónde tapa la navbar. */
    const techo = () => document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;

    /** Un piso más arriba que esto la dejaría escondida tras la navbar. */
    const minimo = () => techo() + el.offsetHeight * ASOMO;

    /**
     * El piso visible más alto de los que quedan bajo sus pies, contando desde
     * `desde`. Sin resultado, el piso es el borde inferior de la ventana.
     */
    const buscar = (desde: number): Hallado | null => {
      const ancho = el.offsetWidth;
      const centro = x + ancho / 2;
      const fondo = window.innerHeight;
      const limite = Math.max(desde, minimo());
      let mejor: Hallado | null = null;
      for (const candidato of document.querySelectorAll(PISOS)) {
        // Descarte barato con la caja del elemento antes de medir su texto.
        const marco = candidato.getBoundingClientRect();
        if (
          marco.bottom < limite ||
          marco.top >= fondo ||
          marco.left > centro ||
          marco.right < centro
        ) {
          continue;
        }
        const caja = medir(candidato);
        if (!caja || caja.tope < limite || caja.tope >= fondo) continue;
        if (mejor && caja.tope >= mejor.tope) continue;
        if (!sostiene(caja, ancho) || !asentado(candidato)) continue;
        mejor = { piso: candidato, tope: caja.tope };
      }
      return mejor;
    };

    /** Avanza una mirada hacia el objetivo, y sigue hasta alcanzarlo. */
    const girar = () => {
      giro = 0;
      const [mx, my] = mirada;
      if (mx === objetivo[0] && my === objetivo[1]) return;
      mirada = [mx + Math.sign(objetivo[0] - mx), my + Math.sign(objetivo[1] - my)];
      // El orden de las filas de la hoja: ver MIRADAS en generar.mjs.
      el.style.setProperty("--mirada", String((mirada[1] + 1) * 5 + mirada[0] + 2));
      giro = window.setTimeout(girar, PASO_MIRADA);
    };

    /** Decide hacia dónde mirar según dónde esté el puntero respecto a la cabeza. */
    const mirar = () => {
      vistazo = 0;
      let hacia = [0, 0];
      if (raton && !puntero && ATENTA.has(estado)) {
        const caja = el.getBoundingClientRect();
        const dx = raton.x - (caja.left + caja.width * 0.5);
        const dy = raton.y - (caja.top + caja.height * 0.25);
        const lejos = Math.hypot(dx, dy);
        // Para dejar de mirar de frente hay que alejarse un poco más de lo
        // que hay que acercarse para que vuelva.
        const mirando = objetivo[0] !== 0 || objetivo[1] !== 0;
        if (lejos > caja.width * (MIRADA_CERCA + (mirando ? 0 : 0.15))) {
          hacia = [
            escalon(dx / lejos, MIRADA_LADO, objetivo[0]),
            escalon(dy / lejos, MIRADA_ALTO, objetivo[1]),
          ];
        }
      }
      objetivo = hacia;
      if (!giro) girar();
    };

    /** Pide un vistazo, como mucho uno por cuadro. Sin ratón no hay nada que mirar. */
    const ojear = () => {
      if (!vistazo && (raton || objetivo[0] !== 0 || objetivo[1] !== 0)) {
        vistazo = requestAnimationFrame(mirar);
      }
    };

    const pasarA = (siguiente: Estado) => {
      estado = siguiente;
      el.dataset.estado = siguiente;
      ojear();
      // Solo va espejada mientras camina; al parar vuelve a mirar de frente,
      // con los colores de los lentes y del polo en su orden.
      if (siguiente !== "caminar") delete el.dataset.mira;
    };

    // Hasta aquí la colocaba el CSS (esquina inferior derecha). Desde ahora la
    // posición es esta x más el translate.
    x = el.getBoundingClientRect().left;
    el.style.left = "0";
    el.style.right = "auto";
    pintar();

    const frenar = () => {
      cancelAnimationFrame(cuadro);
      cuadro = 0;
    };

    const interrumpir = () => {
      clearTimeout(espera);
      clearTimeout(gesto);
      frenar();
    };

    /** Vuelve al reposo y deja programado el siguiente gesto. */
    const descansar = () => {
      pasarA("reposo");
      clearTimeout(espera);
      if (calma) return;
      espera = window.setTimeout(actuar, 2500 + Math.random() * 4000);
    };

    const gesticular = (cual: Estado, duracion: number) => {
      pasarA(cual);
      gesto = window.setTimeout(descansar, duracion);
    };

    const aterrizar = (hallado: Hallado | null) => {
      if (hallado) {
        anclar(hallado);
      } else {
        altura = 0;
        pintar();
      }
      gesticular("aterrizaje", 320);
    };

    const bucle = (ahora: number) => {
      const dt = limitar((ahora - previo) / 1000, 0, 0.05);
      previo = ahora;
      cuadro = 0;

      if (estado === "caida") {
        const antes = window.innerHeight - altura;
        velocidad = Math.min(VELOCIDAD_CAIDA, velocidad + GRAVEDAD * dt);
        altura -= velocidad * dt;
        fase += dt;
        x = limitar(ancla + Math.sin(fase * 2.4) * VAIVEN, 0, maxX());
        // Solo aterriza bajando, y solo en lo que tenía debajo antes de este
        // paso: así un brinco atraviesa los pisos al subir, y un piso que el
        // scroll le pasa por encima no la sube de golpe.
        if (velocidad > 0) {
          const hallado = buscar(antes - 1);
          if (hallado && hallado.tope <= window.innerHeight - altura) {
            aterrizar(hallado);
            return;
          }
          if (altura <= 0) {
            aterrizar(null);
            return;
          }
        }
      } else if (estado === "caminar") {
        const paso = el.offsetWidth * 0.4 * dt;
        if (Math.abs(destino - x) <= paso) {
          x = destino;
          pintar();
          descansar();
          return;
        }
        x += Math.sign(destino - x) * paso;
      } else {
        return;
      }

      pintar();
      cuadro = requestAnimationFrame(bucle);
    };

    const arrancar = () => {
      if (cuadro) return;
      previo = performance.now();
      cuadro = requestAnimationFrame(bucle);
    };

    /** Empieza a caer desde donde esté; con impulso, primero sube. */
    const lanzar = (impulso = 0) => {
      velocidad = -impulso;
      fase = 0;
      ancla = x;
      pasarA("caida");
      arrancar();
    };

    /** Se quedó sin piso: cae hasta el siguiente que tenga debajo. */
    const caer = () => {
      callar();
      interrumpir();
      desanclar();
      if (calma) aterrizar(buscar(window.innerHeight - altura));
      else lanzar();
    };

    /** Desde el borde de la ventana, brinca al piso que tenga encima y a su alcance. */
    const brincar = () => {
      const alto = el.offsetHeight;
      const hallado = buscar(window.innerHeight - alto * ALCANCE);
      if (!hallado) return false;
      // El impulso justo para pasarlo un poco y caerle desde arriba.
      const subida = window.innerHeight - hallado.tope + alto * 0.15;
      lanzar(Math.sqrt(2 * GRAVEDAD * subida));
      return true;
    };

    const caminar = () => {
      let inicio = 0;
      let tope = maxX();
      // Parada en un piso, no se sale de él.
      const caja = piso && medir(piso);
      if (caja) {
        const ancho = el.offsetWidth;
        const holgura = ancho * (0.5 - APOYO) - 1;
        inicio = Math.max(inicio, caja.izquierda - holgura);
        tope = Math.min(tope, caja.derecha - ancho + holgura);
      }
      const tramo = (60 + Math.random() * 200) * (Math.random() < 0.5 ? -1 : 1);
      // Si el tramo la sacaría de su piso, camina hacia el otro lado.
      const hacia = x + tramo < inicio || x + tramo > tope ? x - tramo : x + tramo;
      destino = limitar(hacia, inicio, tope);
      if (Math.abs(destino - x) < 24) {
        gesticular("saludo", 1600);
        return;
      }
      el.dataset.mira = destino < x ? "izquierda" : "derecha";
      pasarA("caminar");
      arrancar();
    };

    function actuar() {
      if (estado !== "reposo" || document.hidden) {
        descansar();
        return;
      }
      // En el borde de la ventana, lo primero es buscar dónde subirse.
      if (!piso && brincar()) return;
      const azar = Math.random();
      if (azar < 0.28) gesticular("saludo", 1600);
      else if (azar < 0.48) gesticular("cola", 1500);
      else if (azar < 0.62) gesticular("salto", 700);
      else caminar();
    }

    const callar = () => {
      if (!hablando) return;
      hablando = false;
      clearTimeout(silencio);
      setGlobo(null);
      if (estado === "habla") descansar();
    };

    const hablar = () => {
      const datos = datosMascota(Date.now());
      if (baraja.length === 0) {
        baraja = datos.map((_, i) => i).sort(() => Math.random() - 0.5);
        // Que el primero de la nueva vuelta no repita el último de la anterior.
        if (baraja.length > 1 && baraja[baraja.length - 1] === ultimo) baraja.reverse();
      }
      ultimo = baraja.pop() ?? 0;
      const dato = datos[ultimo] ?? datos[0];

      const pantalla = document.documentElement.clientWidth;
      const ancho = Math.min(GLOBO_ANCHO, pantalla - GLOBO_MARGEN * 2);
      const centro = x + el.offsetWidth / 2;
      const borde = limitar(centro - ancho / 2, GLOBO_MARGEN, pantalla - ancho - GLOBO_MARGEN);
      const caja = el.getBoundingClientRect();
      const arriba = caja.top - techo();

      interrumpir();
      pasarA("habla");
      hablando = true;
      setGlobo({
        dato,
        izquierda: borde - x,
        ancho,
        pico: limitar(centro - borde, 24, ancho - 24),
        abajo: arriba < GLOBO_ALTO && window.innerHeight - caja.bottom > arriba,
      });
      clearTimeout(silencio);
      silencio = window.setTimeout(callar, GLOBO_DURACION);
    };

    const agarrar = () => {
      callar();
      interrumpir();
      desanclar();
      pasarA("agarrado");
    };

    const soltar = () => {
      if (altura <= 0) {
        altura = 0;
        pintar();
        descansar();
        return;
      }
      const pies = window.innerHeight - altura;
      // Soltada con los pies un poco hundidos en un piso, se queda en él.
      const hallado = buscar(pies - el.offsetHeight * AGARRE);
      if (calma || (hallado && hallado.tope <= pies)) aterrizar(hallado);
      else lanzar();
    };

    /**
     * Comprueba que su piso sigue bajo sus pies. El scroll la mueve con él sin
     * ayuda, pero también puede sacarlo de la vista; y la página puede cambiar
     * de forma (un filtro de la agenda, una fuente que termina de cargar).
     */
    const revisar = () => {
      revision = 0;
      if (!piso) return;
      const caja = medir(piso);
      if (!caja || !sostiene(caja, el.offsetWidth) || caja.tope < minimo()) {
        caer();
      } else if (caja.tope >= window.innerHeight) {
        // Su piso se fue por abajo: se queda en el borde de la ventana.
        callar();
        desanclar();
      } else if (Math.abs(caja.tope + window.scrollY - suelo) >= 1) {
        suelo = caja.tope + window.scrollY;
        pintar();
      }
    };

    const avisar = () => {
      if (piso && !revision) revision = requestAnimationFrame(revisar);
      // Anclada, el scroll la mueve bajo un puntero que sigue quieto.
      ojear();
    };

    const alApuntar = (evento: PointerEvent) => {
      if (evento.pointerType === "touch") return;
      raton = { x: evento.clientX, y: evento.clientY };
      ojear();
    };

    const alSalir = () => {
      raton = null;
      ojear();
    };

    const alPulsar = (evento: PointerEvent) => {
      if (evento.pointerType === "mouse" && evento.button !== 0) return;
      const caja = el.getBoundingClientRect();
      puntero = {
        id: evento.pointerId,
        dx: evento.clientX - caja.left,
        dy: evento.clientY - caja.top,
        x0: evento.clientX,
        y0: evento.clientY,
        movido: false,
      };
      cuerpo.setPointerCapture(evento.pointerId);

      // Que no se escape caminando justo cuando van a pulsarla, y si iba
      // cayendo, se la atrapa en el aire.
      if (estado === "caminar") {
        interrumpir();
        descansar();
      } else if (estado === "caida") {
        puntero.movido = true;
        agarrar();
      }
    };

    const alMover = (evento: PointerEvent) => {
      if (!puntero || evento.pointerId !== puntero.id) return;
      if (!puntero.movido) {
        const recorrido = Math.hypot(evento.clientX - puntero.x0, evento.clientY - puntero.y0);
        if (recorrido < UMBRAL) return;
        puntero.movido = true;
        agarrar();
      }
      x = limitar(evento.clientX - puntero.dx, 0, maxX());
      altura = limitar(window.innerHeight - el.offsetHeight - (evento.clientY - puntero.dy), 0, maxAltura());
      pintar();
    };

    const alLevantar = (evento: PointerEvent) => {
      if (!puntero || evento.pointerId !== puntero.id) return;
      const arrastro = puntero.movido;
      puntero = null;
      if (!arrastro) return;
      // El clic que el navegador dispara tras soltar no es una pulsación.
      ignorarClic = true;
      window.setTimeout(() => {
        ignorarClic = false;
      }, 0);
      soltar();
    };

    const alClic = () => {
      if (ignorarClic || estado === "agarrado" || estado === "caida") return;
      hablar();
    };

    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") callar();
    };

    const alPulsarFuera = (evento: PointerEvent) => {
      if (!el.contains(evento.target as Node)) callar();
    };

    const alRedimensionar = () => {
      callar();
      x = limitar(x, 0, maxX());
      altura = limitar(altura, 0, maxAltura());
      pintar();
      revisar();
    };

    const vigia = new ResizeObserver(avisar);
    vigia.observe(document.body);
    // Si una fuente llegó tarde, los huecos medidos eran los de la de respaldo.
    document.fonts?.ready.then(() => huecos.clear());

    cuerpo.addEventListener("pointerdown", alPulsar);
    cuerpo.addEventListener("pointermove", alMover);
    cuerpo.addEventListener("pointerup", alLevantar);
    cuerpo.addEventListener("pointercancel", alLevantar);
    cuerpo.addEventListener("click", alClic);
    document.addEventListener("keydown", alTeclear);
    document.addEventListener("pointerdown", alPulsarFuera);
    window.addEventListener("resize", alRedimensionar);
    window.addEventListener("scroll", avisar, { passive: true });
    // Sin gestos tampoco hay seguimiento: mira siempre de frente.
    if (!calma) {
      window.addEventListener("pointermove", alApuntar, { passive: true });
      document.documentElement.addEventListener("pointerleave", alSalir);
    }

    // Saluda al llegar.
    if (!calma) espera = window.setTimeout(() => gesticular("saludo", 1600), 900);

    return () => {
      interrumpir();
      cancelAnimationFrame(revision);
      cancelAnimationFrame(vistazo);
      clearTimeout(giro);
      clearTimeout(silencio);
      vigia.disconnect();
      delete el.dataset.anclada;
      el.style.removeProperty("--mirada");
      cuerpo.removeEventListener("pointerdown", alPulsar);
      cuerpo.removeEventListener("pointermove", alMover);
      cuerpo.removeEventListener("pointerup", alLevantar);
      cuerpo.removeEventListener("pointercancel", alLevantar);
      cuerpo.removeEventListener("click", alClic);
      document.removeEventListener("keydown", alTeclear);
      document.removeEventListener("pointerdown", alPulsarFuera);
      window.removeEventListener("resize", alRedimensionar);
      window.removeEventListener("scroll", avisar);
      window.removeEventListener("pointermove", alApuntar);
      document.documentElement.removeEventListener("pointerleave", alSalir);
    };
  }, [oculta]);

  const ocultar = () => {
    // La clase es la que la esconde (y la que el script de layout.tsx repone
    // al recargar); el estado solo sirve para desmontarla ya.
    document.documentElement.classList.add("sin-mascota");
    try {
      sessionStorage.setItem(CLAVE, "oculta");
    } catch {
      // Almacenamiento bloqueado: queda oculta hasta la próxima recarga.
    }
    setGlobo(null);
    setOculta(true);
  };

  if (oculta) return null;

  const enlace = globo?.dato.enlace;
  const externo = enlace?.href.startsWith("http");

  return (
    <div ref={raiz} className="mascota" data-estado="reposo">
      <button
        ref={boton}
        type="button"
        className="mascota-cuerpo"
        aria-label="Mascota del DevFest. Púlsala para conocer un dato del evento."
      >
        <span aria-hidden className="mascota-tira" />
      </button>

      {/* La región viva existe siempre, vacía: así los lectores de pantalla
          anuncian el dato cuando aparece. */}
      <div aria-live="polite">
        {globo && (
          <div
            // La clave reinicia la animación de entrada con cada dato nuevo.
            key={globo.dato.texto}
            className={`on-color rise absolute rounded-2xl border-2 border-ink bg-p-yellow px-4 pt-3.5 pb-3 text-left ${
              globo.abajo ? "top-full mt-1.5" : "bottom-full mb-1.5"
            }`}
            style={{ left: globo.izquierda, width: globo.ancho }}
          >
            <p className="text-[12px] leading-none text-heading">
              Dato<span className="font-bold">@DevFest</span>
            </p>
            <p className="mt-2 text-[14px] leading-snug text-pretty text-heading">
              {globo.dato.texto}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[11px]">
              {enlace ? (
                <a
                  href={enlace.href}
                  {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
                  className="font-semibold text-heading underline decoration-2 underline-offset-4"
                >
                  {enlace.label}
                </a>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={ocultar}
                className="cursor-pointer text-muted underline underline-offset-4 transition-colors hover:text-heading"
              >
                Ocultar mascota
              </button>
            </div>
            <span
              aria-hidden
              className={`absolute size-3 -translate-x-1/2 rotate-45 border-ink bg-p-yellow ${
                globo.abajo
                  ? "-top-[7px] border-t-2 border-l-2"
                  : "-bottom-[7px] border-r-2 border-b-2"
              }`}
              style={{ left: globo.pico }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
