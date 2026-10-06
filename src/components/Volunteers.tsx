import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TabCard } from "./TabCard";
import { GdgMark, Hash } from "./glyphs";
import { ArrowIcon } from "./icons";
import { site } from "@/lib/site";

export function Volunteers() {
  return (
    <section id="voluntarios" className="relative py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Voluntarios"
          title="Vive el DevFest desde adentro"
          description="Buscamos voluntarios para ayudarnos el día del evento. Es la mejor forma de conocer a la comunidad y sumarte a organizar lo que viene."
        />

        {/* Un sticker de rol de la guía ("I am a…") a tamaño de sección. */}
        <Reveal delay={140} className="mt-14">
          <TabCard
            tab="Postulaciones abiertas"
            fill="on-color bg-p-green"
            bodyClassName="grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12"
          >
            <div className="flex flex-col items-start gap-5">
              <h3 className="max-w-xl text-3xl leading-[1.05] font-bold tracking-[-0.03em] text-balance text-heading sm:text-[2.5rem]">
                ¿Te animas a ser parte del staff?
              </h3>

              <p className="max-w-xl text-[15px] leading-relaxed text-pretty text-body sm:text-base">
                Cuéntanos en qué te gustaría ayudar y nos ponemos en contacto
                contigo. No necesitas experiencia previa organizando eventos,
                solo ganas de sumar.
              </p>

              <a
                href={site.volunteerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn group mt-2 px-7 py-4"
              >
                Quiero ser voluntario
                <ArrowIcon className="transition-transform group-hover:translate-x-1" />
              </a>

              <p className="font-mono text-[11.5px] text-faint">
                Se abre el formulario de postulación.
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
