import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ArrowIcon } from "./icons";
import { site } from "@/lib/site";

export function Volunteers() {
  return (
    <section
      id="voluntarios"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Voluntarios"
          title="Vive el DevFest desde adentro"
          description="Buscamos voluntarios para ayudarnos el día del evento. Es la mejor forma de conocer a la comunidad y sumarte a organizar lo que viene."
        />

        <Reveal delay={140}>
          <div className="relative mx-auto mt-14 max-w-3xl rounded-4xl p-[1.5px]">
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 rounded-[4rem] bg-[radial-gradient(closest-side,rgb(52_168_83/0.2),rgb(66_133_244/0.12)_55%,transparent)] opacity-70"
            />
            <div
              aria-hidden
              className="absolute inset-0 rounded-4xl bg-gradient-to-br from-g-green via-g-blue to-brand-violet opacity-70"
            />

            <div className="relative flex flex-col items-center gap-6 rounded-[calc(2rem-1.5px)] bg-panel px-7 py-10 text-center sm:px-10 sm:py-12">
              <p className="font-display text-[11px] font-semibold tracking-[0.28em] text-g-green-ink uppercase">
                Postulaciones abiertas
              </p>

              <h3 className="font-display max-w-xl text-2xl leading-tight font-bold tracking-tight text-balance text-heading sm:text-3xl">
                ¿Te animas a ser parte del staff?
              </h3>

              <p className="max-w-xl text-[14.5px] leading-relaxed text-pretty text-muted">
                Cuéntanos en qué te gustaría ayudar y nos ponemos en contacto
                contigo. No necesitas experiencia previa organizando eventos,
                solo ganas de sumar.
              </p>

              <a
                href={site.volunteerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full bg-solid px-7 py-4 text-[15px] font-semibold text-on-solid transition-transform hover:scale-[1.03] active:scale-95"
              >
                Quiero ser voluntario
                <ArrowIcon className="transition-transform group-hover:translate-x-1" />
              </a>

              <p className="text-[12px] text-faint">
                Se abre el formulario de postulación.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
