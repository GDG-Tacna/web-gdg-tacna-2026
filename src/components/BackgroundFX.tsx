import { Constellation } from "./Constellation";

/**
 * Capas decorativas del hero: auroras en los colores de Google, red de nodos,
 * grano y un desvanecido hacia el fondo de la página.
 *
 * En claro las auroras van mucho más tenues: sobre blanco los mismos tonos
 * saturan enseguida y se comen el contraste del texto.
 */
export function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-canvas" />

      {/* Auroras */}
      <div className="absolute -top-40 -left-32 size-[34rem] animate-aurora rounded-full bg-g-blue/12 blur-[110px] dark:bg-g-blue/25" />
      <div className="absolute -top-24 right-[-10rem] size-[32rem] animate-aurora-slow rounded-full bg-brand-violet/14 blur-[110px] [animation-delay:-6s] dark:bg-brand-violet/30" />
      <div className="absolute bottom-[-14rem] left-1/3 size-[30rem] animate-aurora rounded-full bg-g-green/10 blur-[120px] [animation-delay:-4s] dark:bg-g-green/16" />
      <div className="absolute top-1/3 left-1/2 size-[20rem] -translate-x-1/2 animate-aurora-slow rounded-full bg-g-red/8 blur-[110px] [animation-delay:-11s] dark:bg-g-red/12" />

      {/* Red de nodos + grano */}
      <Constellation />
      <div className="absolute inset-0 bg-noise opacity-[0.02] dark:opacity-[0.03]" />

      {/* Halo superior y desvanecido inferior */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-line-2 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-canvas" />
    </div>
  );
}
