"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { MoonIcon, SunIcon } from "./icons";

/**
 * El icono visible se decide por CSS a partir de la clase .dark, no por estado
 * de React: así no hay desajuste de hidratación ni parpadeo en el primer pintado.
 *
 * El cambio manual se propaga como una onda desde el punto del clic (View
 * Transitions API). Aquí solo se lanza la transición y se le pasa el origen; la
 * animación entera vive en globals.css, bajo `.theme-wave`.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  // La última onda lanzada. Con un doble clic rápido la primera termina cuando
  // la segunda ya corre, y no debe llevarse la clase que esta necesita.
  const onda = useRef<ViewTransition | null>(null);

  // Mientras el usuario no elija manualmente, seguimos el tema del sistema.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem("theme")) return;
      document.documentElement.classList.toggle("dark", event.matches);
      document.documentElement.style.colorScheme = event.matches
        ? "dark"
        : "light";
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const cambiar = () => {
      const dark = root.classList.toggle("dark");
      root.style.colorScheme = dark ? "dark" : "light";
      try {
        localStorage.setItem("theme", dark ? "dark" : "light");
      } catch {
        // Modo privado o almacenamiento bloqueado: el tema dura la sesión.
      }
    };

    // Sin la API, o si el usuario pide menos movimiento, el cambio es directo.
    if (
      !("startViewTransition" in document) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      cambiar();
      return;
    }

    // Con teclado el clic llega sin coordenadas: la onda sale del centro del
    // botón.
    const caja = event.currentTarget.getBoundingClientRect();
    const conPuntero = event.detail > 0;
    const x = conPuntero ? event.clientX : caja.left + caja.width / 2;
    const y = conPuntero ? event.clientY : caja.top + caja.height / 2;
    // Hasta la esquina más lejana, para que la onda cubra toda la ventana.
    const lejos = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    root.style.setProperty("--wave-x", `${x}px`);
    root.style.setProperty("--wave-y", `${y}px`);
    root.style.setProperty("--wave-far", `${lejos}px`);
    root.classList.add("theme-wave");

    const transicion = document.startViewTransition(cambiar);
    onda.current = transicion;
    const limpiar = () => {
      if (onda.current !== transicion) return;
      onda.current = null;
      root.classList.remove("theme-wave");
    };
    // `finished` se rechaza si `cambiar` lanza; la limpieza va en ambos casos.
    transicion.finished.then(limpiar, limpiar);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title="Cambiar entre tema claro y oscuro"
      aria-label="Cambiar entre tema claro y oscuro"
      className={`grid size-10 place-items-center rounded-full border-2 border-ink bg-panel text-heading transition-colors hover:bg-p-blue hover:text-coal ${className}`}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="block dark:hidden" />
    </button>
  );
}
