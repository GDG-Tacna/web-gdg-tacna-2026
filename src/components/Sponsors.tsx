import Image from "next/image";
import { Pending } from "./Pending";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TabCard } from "./TabCard";
import { ArrowIcon } from "./icons";
import { sponsors } from "@/data/sponsors";
import { site } from "@/lib/site";

export function Sponsors() {
  return (
    <section id="sponsors" className="relative py-20 sm:py-28">
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
          <Reveal delay={120} className="mt-14">
            {/*
              Panel blanco a propósito, también en tema oscuro: los logos de los
              sponsors llegan a color y muchos llevan texto negro, que sobre el
              fondo oscuro desaparecería. Así vale un único archivo por sponsor
              en lugar de una versión por tema. Sigue la lámina de sponsors de
              la guía de marca: un panel blanco con su pestaña.
            */}
            <TabCard tab="Sponsors 2026" fill="on-color bg-white">
              {/*
                La lista es flex y no grid: con pocos sponsors la grilla los
                dejaba pegados a la izquierda con columnas vacías al lado. Así
                se centran sea cual sea la cantidad.
              */}
              <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 py-9 sm:px-10 sm:py-12">
                {sponsors.map((sponsor) => (
                  <li
                    key={sponsor.name}
                    className="w-full max-w-[280px] sm:basis-[calc(50%-1.25rem)] lg:basis-[calc(33.333%-1.7rem)]"
                  >
                    {/* `fill` evita tener que declarar las dimensiones de cada logo. */}
                    <div className="relative h-24 w-full transition-transform duration-300 hover:scale-[1.04]">
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                        className="object-contain"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </TabCard>
          </Reveal>
        )}

        {/* Invitación a patrocinar */}
        <Reveal delay={140}>
          <div className="on-color mt-6 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] border-2 border-ink bg-p-blue p-7 sm:p-9 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl leading-tight font-bold tracking-[-0.02em] text-heading sm:text-[28px]">
                ¿Quieres patrocinar el DevFest Tacna 2026?
              </h3>
              <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-body">
                Conecta tu marca con más de 300 desarrolladores del sur del
                Perú. Escríbenos y te enviamos el brochure con los paquetes de
                auspicio.
              </p>
            </div>

            <a
              href={site.whatsappSponsors}
              target="_blank"
              rel="noopener noreferrer"
              className="btn group shrink-0 px-7 py-4"
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
