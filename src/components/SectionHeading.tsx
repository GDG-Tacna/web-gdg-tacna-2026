import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  /** Número de sección ("01", "02"…). Ordena la lectura y da el color del acento. */
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
};

/** Acento por sección, rotando los colores de la marca. */
const acentos = [
  "text-g-blue-ink",
  "text-g-red-ink",
  "text-g-yellow-ink",
  "text-g-green-ink",
  "text-violet-ink",
];

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center";
  const acento = acentos[(Number(index) - 1 + acentos.length) % acentos.length];

  return (
    <div
      className={`flex flex-col gap-5 ${
        centered ? "items-center text-center" : "items-start text-left"
      }`}
    >
      <Reveal>
        <p className="font-display flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] uppercase">
          <span className={acento}>{index}</span>
          <span aria-hidden className="h-px w-7 bg-line-2" />
          <span className="text-muted">{eyebrow}</span>
        </p>
      </Reveal>

      <Reveal delay={80}>
        <h2 className="font-display max-w-3xl text-3xl leading-[1.1] font-bold tracking-tight text-balance text-heading sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={140}>
          <p
            className={`max-w-2xl text-[15px] leading-relaxed text-pretty text-muted sm:text-base ${
              centered ? "mx-auto" : ""
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
