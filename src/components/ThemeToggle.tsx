"use client";

import { useEffect } from "react";
import { MoonIcon, SunIcon } from "./icons";

/**
 * El icono visible se decide por CSS a partir de la clase .dark, no por estado
 * de React: así no hay desajuste de hidratación ni parpadeo en el primer pintado.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
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

  const toggle = () => {
    const root = document.documentElement;
    const dark = root.classList.toggle("dark");
    root.style.colorScheme = dark ? "dark" : "light";
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // Modo privado o almacenamiento bloqueado: el tema dura la sesión.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title="Cambiar entre tema claro y oscuro"
      aria-label="Cambiar entre tema claro y oscuro"
      className={`grid size-10 place-items-center rounded-full border border-line bg-surface text-heading transition-colors hover:bg-surface-2 ${className}`}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="block dark:hidden" />
    </button>
  );
}
