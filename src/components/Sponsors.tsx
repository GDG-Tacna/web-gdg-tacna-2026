import Image from "next/image";
import { Pending } from "./Pending";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ArrowIcon } from "./icons";
import { sponsors } from "@/data/sponsors";
import { site } from "@/lib/site";

export function Sponsors() {
  return (
    <section
      id="sponsors"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div className="shell">
        <SectionHeading
          index="05"
          eyebrow="Sponsors"
          title="Las empresas que hacen posible el DevFest"
          description="Gracias a ellas la entrada general es gratuita. Si tu empresa quiere sumarse a la edición 2026, hay espacio para ti."
        />

        {sponsors.length === 0 ? (
          <Pending>
            Estamos cerrando los acuerdos de patrocinio. Aquí aparecerán las
            empresas que hagan posible esta edición.
          </Pending>
        ) : (
        <ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sponsors.map((sponsor, index) => (
            <Reveal as="li" key={sponsor.name} delay={Math.min(index * 55, 280)}>
              <div className="group flex h-24 items-center justify-center rounded-2xl border border-line bg-surface px-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-2 hover:bg-surface-2 sm:h-28">
                {/* Los logos de ejemplo son SVG blancos: en tema claro se
                    invierten. Al poner logos reales a color, quita
                    `invert dark:invert-0`. */}
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={220}
                  height={48}
                  className="h-8 w-auto opacity-70 invert transition-opacity duration-300 group-hover:opacity-100 sm:h-9 dark:opacity-55 dark:invert-0"
                />
              </div>
            </Reveal>
          ))}
        </ul>
        )}

        {/* Invitación a patrocinar */}
        <Reveal delay={140}>
          <div className="glass mt-10 flex flex-col items-start justify-between gap-6 rounded-4xl p-7 sm:p-9 md:flex-row md:items-center">
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight text-heading sm:text-2xl">
                ¿Quieres patrocinar el DevFest Tacna 2026?
              </h3>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted">
                Conecta tu marca con más de 300 desarrolladores del sur del Perú.
                Escríbenos y te enviamos el brochure con los paquetes de
                auspicio.
              </p>
            </div>

            <a
              href={site.whatsappSponsors}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-line-2 bg-transparent px-6 py-3.5 text-[14px] font-semibold text-heading transition-colors hover:bg-solid hover:text-on-solid"
            >
              Quiero auspiciar
              <ArrowIcon className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
