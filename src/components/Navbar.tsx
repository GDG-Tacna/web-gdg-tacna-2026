"use client";

import type { MouseEvent } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/lib/site";

/**
 * Cierra el desplegable tras pulsar un enlace. Es una mejora, no un requisito:
 * si el JS no corre, el <details> sigue abriéndose y los enlaces siguen
 * navegando; simplemente hay que cerrarlo con la X.
 */
function cerrarMenu(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-5">
      <div className="shell relative">
        {/* El fondo lo pinta .nav-pill::before, no una clase condicional: ver
            globals.css. Así no depende de que React hidrate. */}
        <nav
          aria-label="Principal"
          className="nav-pill flex items-center justify-between gap-4 rounded-full px-3 py-2.5 sm:px-4"
        >
          <a
            href="#top"
            className="rounded-full pl-1 transition-opacity hover:opacity-80"
            aria-label={`${site.name}, ir al inicio`}
          >
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-heading"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <a
              href={site.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-solid px-5 py-2.5 text-sm font-semibold text-on-solid transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
            >
              Regístrate
            </a>

            {/*
              Es un <details> y no estado de React a propósito: la navegación es
              lo último que puede permitirse depender de que el bundle cargue e
              hidrate. Así abre, cierra y navega con HTML puro.
            */}
            <details className="menu lg:hidden">
              <summary
                aria-label="Menú de navegación"
                className="grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-surface text-heading transition-colors hover:bg-surface-2"
              >
                <span aria-hidden className="relative block h-3.5 w-4">
                  <span className="menu-bar menu-bar-top" />
                  <span className="menu-bar menu-bar-mid" />
                  <span className="menu-bar menu-bar-bottom" />
                </span>
              </summary>

              <div className="menu-panel absolute inset-x-5 top-full mt-2 md:inset-x-8 overflow-hidden rounded-3xl border border-line bg-panel shadow-[0_16px_40px_-16px_rgb(10_12_20/0.35)] dark:shadow-[0_16px_40px_-12px_rgb(0_0_0/0.85)]">
                <ul className="flex flex-col p-2">
                  {site.nav.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={cerrarMenu}
                        className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-body transition-colors hover:bg-surface-2 hover:text-heading"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                  <li className="p-2">
                    <a
                      href={site.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={cerrarMenu}
                      className="block rounded-2xl bg-solid px-4 py-3 text-center text-[15px] font-semibold text-on-solid"
                    >
                      Regístrate
                    </a>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </nav>
      </div>
    </header>
  );
}
