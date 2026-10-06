import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { ArrowBold, Blob, Dots, Plus, Slashes } from "./glyphs";

type SectionHeadingProps = {
  /** Número de sección ("01", "02"…). Ordena la lectura y elige color y glifo. */
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
};

/**
 * Acento por sección, rotando los cuatro colores de la marca más uno: el
 * relleno de la píldora del número y el glifo que acompaña al título.
 */
const acentos: { pill: string; glyph: ReactNode }[] = [
  { pill: "bg-p-blue", glyph: <Slashes className="h-24 w-auto lg:h-28" /> },
  {
    pill: "bg-p-red",
    glyph: <Blob fill="var(--color-h-red)" className="h-16 w-auto lg:h-20" />,
  },
  { pill: "bg-p-yellow", glyph: <ArrowBold className="h-20 w-auto lg:h-24" /> },
  {
    pill: "bg-p-green",
    glyph: <Plus fill="var(--color-g-green)" className="h-24 w-auto lg:h-28" />,
  },
  {
    pill: "bg-p-red",
    glyph: <Dots fill="var(--color-g-red)" className="h-10 w-auto lg:h-12" />,
  },
];

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  const acento = acentos[(Number(index) - 1 + acentos.length) % acentos.length];

  return (
    <div className="flex items-end justify-between gap-10">
      <div className="flex flex-col items-start gap-5">
        {/* Etiqueta al estilo de los lockups "Web@DevFest" de la guía. */}
        <Reveal>
          <p className="flex items-center gap-3 text-[15px] leading-none text-heading">
            <span
              className={`rounded-full border-[1.5px] border-ink px-2.5 py-1 font-mono text-[11px] font-semibold text-coal ${acento.pill}`}
            >
              {index}
            </span>
            <span>
              {eyebrow}
              <span className="font-bold">@DevFest</span>
            </span>
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="max-w-3xl text-[clamp(2rem,5.2vw,3.75rem)] leading-[1.04] font-medium tracking-[-0.035em] text-balance text-heading">
            {title}
          </h2>
        </Reveal>

        {description && (
          <Reveal delay={140}>
            <p className="max-w-2xl text-[15px] leading-relaxed text-pretty text-muted sm:text-[17px]">
              {description}
            </p>
          </Reveal>
        )}
      </div>

      <Reveal delay={200} className="hidden shrink-0 pb-2 md:block">
        <span aria-hidden className="sticker block">
          {acento.glyph}
        </span>
      </Reveal>
    </div>
  );
}
