import Image from "next/image";
import { Pending } from "./Pending";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Asterisk, Brace, Globe, Hash } from "./glyphs";
import { speakers, type Speaker } from "@/data/speakers";

/**
 * Color por tarjeta, asignado por posición para que la grilla recorra la
 * paleta: pastel de fondo y su halftone para las llaves del avatar.
 */
const palettes = [
  { bg: "bg-p-blue", brace: "var(--color-h-blue)" },
  { bg: "bg-p-red", brace: "var(--color-h-red)" },
  { bg: "bg-p-yellow", brace: "var(--color-h-yellow)" },
  { bg: "bg-p-green", brace: "var(--color-h-green)" },
];

/** Glifo de la muesca, también por posición. */
const notches = [Asterisk, Hash, Globe];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  const palette = palettes[index % palettes.length];
  const Notch = notches[index % notches.length];

  return (
    <article className="group flex h-full flex-col">
      {/*
        Marco con muesca, como las plantillas de speaker de la guía. La muesca
        es un recuadro del color del lienzo montado sobre la esquina: tapa el
        contorno del marco ahí y dibuja el escalón con sus propios bordes.
      */}
      <div className="relative">
        <div
          className={`piso relative aspect-4/5 overflow-hidden rounded-[1.75rem] border-2 border-ink ${palette.bg}`}
        >
          {speaker.photo ? (
            <Image
              src={speaker.photo}
              alt={speaker.name}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              style={{ objectPosition: speaker.focus }}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center gap-[0.08em] pb-6 text-[clamp(3rem,9vw,4.5rem)] font-bold text-coal transition-transform duration-500 group-hover:scale-105">
              <Brace fill={palette.brace} className="h-[1.25em] w-[0.5em]" />
              <span className="leading-none tracking-[-0.04em]">
                {initials(speaker.name)}
              </span>
              <Brace
                side="close"
                fill={palette.brace}
                className="h-[1.25em] w-[0.5em]"
              />
            </div>
          )}
        </div>

        <div
          aria-hidden
          className="absolute right-0 bottom-0 grid size-12 place-items-center rounded-tl-[1.125rem] border-t-2 border-l-2 border-ink bg-canvas sm:size-14"
        >
          <Notch className="mt-1 ml-1 size-5 sm:size-6" />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <h3 className="text-[17px] leading-tight font-bold tracking-[-0.01em] text-heading">
          {speaker.name}
        </h3>
        {speaker.role && (
          <p className="mt-1 text-[13px] leading-snug text-muted">
            {speaker.role}
          </p>
        )}
        {speaker.company && (
          <p className="mt-0.5 text-[13px] font-medium text-body">
            {speaker.company}
          </p>
        )}

        {speaker.topic && (
          <p className="mt-3 border-t-2 border-line pt-3 font-mono text-[11.5px] leading-snug text-faint">
            {speaker.topic}
          </p>
        )}
      </div>
    </article>
  );
}

export function Speakers() {
  return (
    <section id="speakers" className="relative py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="Speakers"
          title="Quienes compartirán su experiencia contigo"
          description="Expertos contando cómo usan la IA en su día a día."
        />

        {speakers.length === 0 ? (
          <Pending>
            Estamos cerrando el line-up. Anunciaremos a los speakers aquí y en
            las redes de la comunidad.
          </Pending>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3">
            {speakers.map((speaker, index) => (
              <Reveal key={index} delay={Math.min(index * 60, 300)}>
                <SpeakerCard speaker={speaker} index={index} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
