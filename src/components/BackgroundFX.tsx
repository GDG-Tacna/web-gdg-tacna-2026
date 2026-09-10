import type { CSSProperties } from "react";
import { Constellation } from "./Constellation";

/**
 * Capas decorativas del hero: auroras en los colores de Google, red de nodos,
 * grano y un desvanecido hacia el fondo de la página.
 *
 * Las auroras son radial-gradients, no divs con `filter: blur()`. Un blur de
 * 110px sobre una capa de ~500px obliga al móvil a rasterizarla en una textura
 * enorme; el degradado da el mismo halo sin capa de composición. La intensidad
 * por tema sale de `--aurora-strength` (globals.css): sobre blanco estos tonos
 * saturan enseguida y se comen el contraste del texto.
 */
const auroras: {
  className: string;
  rgb: string;
  alpha: number;
}[] = [
  {
    className: "-top-72 -left-60 size-[48rem] animate-aurora",
    rgb: "66 133 244",
    alpha: 0.26,
  },
  {
    className:
      "-top-56 right-[-18rem] size-[48rem] animate-aurora-slow [animation-delay:-6s]",
    rgb: "139 92 246",
    alpha: 0.3,
  },
  {
    className:
      "bottom-[-24rem] left-1/4 size-[44rem] animate-aurora [animation-delay:-4s]",
    rgb: "52 168 83",
    alpha: 0.17,
  },
  {
    className:
      "top-1/4 left-1/2 size-[32rem] -translate-x-1/2 animate-aurora-slow [animation-delay:-11s]",
    rgb: "234 67 53",
    alpha: 0.12,
  },
];

export function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-canvas" />

      {auroras.map(({ className, rgb, alpha }) => (
        <div
          key={rgb}
          className={`aurora ${className}`}
          style={
            { "--aurora-rgb": rgb, "--aurora-a": alpha } as CSSProperties
          }
        />
      ))}

      {/* Red de nodos + grano */}
      <Constellation />
      <div className="absolute inset-0 bg-noise opacity-[0.03]" />

      {/* Halo superior y desvanecido inferior */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-2 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  );
}
