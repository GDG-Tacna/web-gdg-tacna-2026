/**
 * Estado "por confirmar" de las secciones cuyo contenido todavía no está
 * cerrado. Es preferible un hueco explícito a rellenarlas con datos de ejemplo
 * que puedan acabar publicados.
 */
import { Reveal } from "./Reveal";
import { Asterisk } from "./glyphs";

export function Pending({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <div className="mt-12 flex flex-col items-start gap-5 rounded-[1.75rem] border-2 border-dashed border-line-2 px-6 py-12 sm:px-10 sm:py-14">
        <p className="flex items-center gap-2.5 rounded-full border-2 border-ink bg-h-yellow px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.1em] text-coal uppercase">
          <span className="on-color flex">
            <Asterisk className="size-3.5" />
          </span>
          Por confirmar
        </p>
        <p className="max-w-lg text-[17px] leading-relaxed text-pretty text-muted">
          {children}
        </p>
      </div>
    </Reveal>
  );
}
