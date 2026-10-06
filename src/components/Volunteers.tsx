import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TabCard } from "./TabCard";
import { GdgMark, Hash } from "./glyphs";

export function Volunteers() {
  return (
    <section id="voluntarios" className="relative py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Voluntarios"
          title="El staff del DevFest ya está completo"
          description="Se completó el registro de voluntarios para el día del evento. Gracias a todas las personas que postularon para sumarse."
        />

        {/* Un sticker de rol de la guía ("I am a…") a tamaño de sección. */}
        <Reveal delay={140} className="mt-14">
          <TabCard
            tab="Postulaciones cerradas"
            fill="on-color bg-p-green"
            bodyClassName="grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12"
          >
            {/* Registro cerrado: sin botón, no hay adónde postular. */}
            <div className="flex flex-col items-start gap-5">
              <h3 className="max-w-xl text-3xl leading-[1.05] font-bold tracking-[-0.03em] text-balance text-heading sm:text-[2.5rem]">
                Ya no aceptamos más voluntarios
              </h3>

              <p className="max-w-xl text-[15px] leading-relaxed text-pretty text-body sm:text-base">
                Cerramos el formulario porque el equipo que nos ayudará el día
                del evento ya está completo. Gracias por las ganas de sumar.
              </p>

              <p className="font-mono text-[11.5px] text-faint">
                El formulario de postulación ya está cerrado.
              </p>
            </div>

            <div aria-hidden className="hidden items-center gap-6 lg:flex">
              <GdgMark className="sticker h-24 w-auto" />
              <Hash className="sticker size-24" />
            </div>
          </TabCard>
        </Reveal>
      </div>
    </section>
  );
}
