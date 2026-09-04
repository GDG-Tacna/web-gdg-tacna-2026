"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/lib/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Evita el scroll del fondo mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-5">
      <div className="shell">
        <nav
          aria-label="Principal"
          className={`flex items-center justify-between gap-4 rounded-full border px-3 py-2.5 transition-all duration-500 sm:px-4 ${
            scrolled
              ? "border-line bg-canvas/80 shadow-[0_10px_40px_-14px_rgb(10_12_20/0.18)] backdrop-blur-xl dark:shadow-[0_10px_40px_-12px_rgb(0_0_0/0.9)]"
              : "border-transparent bg-transparent"
          }`}
        >
          <a
            href="#top"
            className="rounded-full pl-1 transition-opacity hover:opacity-80"
            aria-label={`${site.name}, ir al inicio`}
          >
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 md:flex">
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
              href="#entradas"
              className="hidden rounded-full bg-solid px-5 py-2.5 text-sm font-semibold text-on-solid transition-transform hover:scale-[1.03] active:scale-95 sm:inline-flex"
            >
              Regístrate
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="grid size-10 place-items-center rounded-full border border-line bg-surface text-heading transition-colors hover:bg-surface-2 md:hidden"
            >
              <span className="relative block h-3.5 w-4">
                <span
                  className={`absolute left-0 block h-[1.5px] w-4 rounded bg-current transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute top-1.5 left-0 block h-[1.5px] w-4 rounded bg-current transition-all duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] w-4 rounded bg-current transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>

        {/* Menú móvil */}
        <div
          id="menu-movil"
          className={`glass mt-2 overflow-hidden rounded-3xl transition-all duration-300 md:hidden ${
            open
              ? "max-h-96 opacity-100"
              : "pointer-events-none max-h-0 border-transparent opacity-0"
          }`}
        >
          <ul className="flex flex-col p-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-body transition-colors hover:bg-surface-2 hover:text-heading"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="p-2">
              <a
                href="#entradas"
                onClick={() => setOpen(false)}
                className="block rounded-2xl bg-solid px-4 py-3 text-center text-[15px] font-semibold text-on-solid"
              >
                Regístrate
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
