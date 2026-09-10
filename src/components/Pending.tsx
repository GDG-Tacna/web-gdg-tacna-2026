/**
 * Estado "por confirmar" de las secciones cuyo contenido todavía no está
 * cerrado. Es preferible un hueco explícito a rellenarlas con datos de ejemplo
 * que puedan acabar publicados.
 */
import { Reveal } from "./Reveal";

export function Pending({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="mt-12 flex flex-col items-center gap-4 rounded-4xl border border-dashed border-line-2 px-6 py-16 text-center">
        <p className="font-display text-[11px] font-semibold tracking-[0.28em] text-g-yellow-ink uppercase">
          Por confirmar
        </p>
        <p className="max-w-md text-[14px] leading-relaxed text-pretty text-muted">
          {children}
        </p>
      </div>
    </Reveal>
  );
}
