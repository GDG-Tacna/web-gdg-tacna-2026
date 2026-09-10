import type { CSSProperties } from "react";
import Image from "next/image";
import { Pending } from "./Pending";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { speakers, type Speaker } from "@/data/speakers";

/** Paleta por avatar, asignada por posición para que la grilla no salga monocroma. */
const palettes = [
  "from-g-blue/80 to-brand-violet/70",
  "from-g-green/80 to-g-blue/60",
  "from-g-red/70 to-brand-violet/70",
  "from-g-yellow/70 to-g-red/60",
  "from-brand-cyan/70 to-g-blue/70",
];

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
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-line-2 hover:bg-surface-2">
      <div className="relative aspect-4/5 overflow-hidden rounded-2xl">
        {speaker.photo ? (
          <Image
            src={speaker.photo}
            alt={speaker.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex size-full items-center justify-center bg-gradient-to-br ${
              palettes[index % palettes.length]
            }`}
          >
            <span className="font-display text-4xl font-bold text-white/90 sm:text-5xl">
              {initials(speaker.name)}
            </span>
            <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.06]" />
          </div>
        )}

        {/* El degradado va siempre oscuro: cae sobre la foto, no sobre la página */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
        />
      </div>

      <div className="flex flex-1 flex-col px-2.5 pt-4 pb-3">
        <h3 className="font-display text-[15px] leading-tight font-semibold text-heading">
          {speaker.name}
        </h3>
        <p className="mt-1 text-[12.5px] leading-snug text-muted">
          {speaker.role}
        </p>
        <p className="mt-0.5 text-[12.5px] font-medium text-body">
          {speaker.company}
        </p>

        <p className="mt-3.5 border-t border-line pt-3 text-[12px] leading-snug text-faint">
          {speaker.topic}
        </p>
      </div>
    </article>
  );
}

export function Speakers() {
  return (
    <section
      id="speakers"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="aurora pointer-events-none top-0 left-1/2 -z-10 size-[56rem] -translate-x-1/2"
        style={{ "--aurora-rgb": "139 92 246", "--aurora-a": 0.1 } as CSSProperties}
      />

      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="Speakers"
          title="Quienes compartirán su experiencia contigo"
          description="Ingenieros, GDEs y líderes técnicos contando cómo resuelven problemas reales en producción."
        />

        {speakers.length === 0 ? (
          <Pending>
            Estamos cerrando el line-up. Anunciaremos a los speakers aquí y en
            las redes de la comunidad.
          </Pending>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
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
