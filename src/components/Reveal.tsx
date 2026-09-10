import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Retardo en ms para escalonar elementos de una misma fila. */
  delay?: number;
  className?: string;
  as?: ElementType;
};

/**
 * Marca un bloque para que aparezca al entrar en pantalla.
 *
 * Aquí solo se pintan la clase y el retardo. Quien observa y añade
 * `is-visible` es el script inline de layout.tsx, de modo que el contenido no
 * espera a que React hidrate: en móvil eso significaba ver la página vacía
 * mientras descargaba el bundle.
 *
 * `suppressHydrationWarning` es obligatorio aquí: el script ya cambió el
 * className antes de que React hidrate, y sin esta marca React no solo avisa,
 * sino que re-renderiza el boundary en cliente y descarta el `is-visible` que
 * el script había puesto. Con ella, gana el DOM.
 * Ver node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  return (
    <Tag
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      suppressHydrationWarning
    >
      {children}
    </Tag>
  );
}
