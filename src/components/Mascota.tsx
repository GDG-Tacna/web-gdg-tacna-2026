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
};

/** Cuánto hay que mover el puntero para que un toque cuente como arrastre. */
const UMBRAL = 6;
// La caída es lenta a propósito: acelera poco y tiene tope, como si planeara.
const GRAVEDAD = 420;
const VELOCIDAD_CAIDA = 200;
const VAIVEN = 10;
const GLOBO_ANCHO = 288;
const GLOBO_MARGEN = 8;
const GLOBO_DURACION = 9000;
const CLAVE = "mascota";

const limitar = (valor: number, min: number, max: number) =>
  Math.min(Math.max(valor, min), Math.max(min, max));

/**
 * La mascota del DevFest: vive pegada al borde inferior de la ventana, da un
 * dato del evento al pulsarla y se puede arrastrar y soltar.
 *
 * El servidor ya la pinta en su esquina con la animación de reposo, que es
 * CSS puro, así que se ve y se mueve antes de hidratar. Lo que añade este
 * componente son los gestos, el arrastre y el globo.
 *
 * El movimiento no pasa por estado de React: la posición y el estado viven en
 * variables del efecto y se escriben directo en el elemento, para no renderizar
 * en cada cuadro. React solo se entera de qué dice el globo.
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
    // x desde el borde izquierdo; altura sobre el piso, que es el borde inferior.
    let x = 0;
    let altura = 0;
    let velocidad = 0;
    let fase = 0;
    let ancla = 0;
    let destino = 0;
    let cuadro = 0;
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

    const maxX = () => document.documentElement.clientWidth - el.offsetWidth;
    const maxAltura = () => window.innerHeight - el.offsetHeight;

    const pintar = () => {
      el.style.translate = `${Math.round(x)}px ${Math.round(-altura)}px`;
    };

    const pasarA = (siguiente: Estado) => {
      estado = siguiente;
      el.dataset.estado = siguiente;
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

    const aterrizar = () => {
      altura = 0;
      pintar();
      gesticular("aterrizaje", 320);
    };

    const bucle = (ahora: number) => {
      const dt = Math.min(0.05, (ahora - previo) / 1000);
      previo = ahora;
      cuadro = 0;

      if (estado === "caida") {
        velocidad = Math.min(VELOCIDAD_CAIDA, velocidad + GRAVEDAD * dt);
        altura -= velocidad * dt;
        fase += dt;
        x = limitar(ancla + Math.sin(fase * 2.4) * VAIVEN, 0, maxX());
        if (altura <= 0) {
          aterrizar();
          return;
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

    const caminar = () => {
      const tope = maxX();
      const tramo = (60 + Math.random() * 200) * (Math.random() < 0.5 ? -1 : 1);
      // Si el tramo la sacaría de la pantalla, camina hacia el otro lado.
      const hacia = x + tramo < 0 || x + tramo > tope ? x - tramo : x + tramo;
      destino = limitar(hacia, 0, tope);
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

      interrumpir();
      pasarA("habla");
      hablando = true;
      setGlobo({
        dato,
        izquierda: borde - x,
        ancho,
        pico: limitar(centro - borde, 24, ancho - 24),
      });
      clearTimeout(silencio);
      silencio = window.setTimeout(callar, GLOBO_DURACION);
    };

    const agarrar = () => {
      callar();
      interrumpir();
      pasarA("agarrado");
    };

    const soltar = () => {
      if (altura <= 0) {
        altura = 0;
        pintar();
        descansar();
      } else if (calma) {
        aterrizar();
      } else {
        velocidad = 0;
        fase = 0;
        ancla = x;
        pasarA("caida");
        arrancar();
      }
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
    };

    cuerpo.addEventListener("pointerdown", alPulsar);
    cuerpo.addEventListener("pointermove", alMover);
    cuerpo.addEventListener("pointerup", alLevantar);
    cuerpo.addEventListener("pointercancel", alLevantar);
    cuerpo.addEventListener("click", alClic);
    document.addEventListener("keydown", alTeclear);
    document.addEventListener("pointerdown", alPulsarFuera);
    window.addEventListener("resize", alRedimensionar);

    // Saluda al llegar.
    if (!calma) espera = window.setTimeout(() => gesticular("saludo", 1600), 900);

    return () => {
      interrumpir();
      clearTimeout(silencio);
      cuerpo.removeEventListener("pointerdown", alPulsar);
      cuerpo.removeEventListener("pointermove", alMover);
      cuerpo.removeEventListener("pointerup", alLevantar);
      cuerpo.removeEventListener("pointercancel", alLevantar);
      cuerpo.removeEventListener("click", alClic);
      document.removeEventListener("keydown", alTeclear);
      document.removeEventListener("pointerdown", alPulsarFuera);
      window.removeEventListener("resize", alRedimensionar);
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
            className="on-color rise absolute bottom-full mb-1.5 rounded-2xl border-2 border-ink bg-p-yellow px-4 pt-3.5 pb-3 text-left"
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
              className="absolute -bottom-[7px] size-3 -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-ink bg-p-yellow"
              style={{ left: globo.pico }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
