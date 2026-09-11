import Image from "next/image";
import { Pending } from "./Pending";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ArrowIcon } from "./icons";
import { sponsors } from "@/data/sponsors";
import { site } from "@/lib/site";

export function Sponsors() {
  return (
    <section id="sponsors" className="relative overflow-hidden py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          index="05"
          eyebrow="Sponsors"
          title="Las empresas que hacen posible el DevFest"
          description="Gracias a ellas la entrada general es gratuita. Si tu empresa quiere sumarse a la edición 2026, hay espacio para ti."
        />

        {/*
          La lista es flex y no grid: con pocos sponsors la grilla los dejaba
          pegados a la izquierda con columnas vacías al lado. Así se centran sea
          cual sea la cantidad, y al llenarse se comportan igual que una grilla.
        */}
        {sponsors.length === 0 ? (
          <Pending>
            Estamos cerrando los acuerdos de patrocinio. Aquí aparecerán las
            empresas que hagan posible esta edición.
          </Pending>
        ) : (
          <ul className="mt-14 flex flex-wrap justify-center gap-3">
            {sponsors.map((sponsor, index) => (
              <Reveal
                as="li"
                key={sponsor.name}
                delay={Math.min(index * 55, 280)}
                className="w-full max-w-[340px] sm:max-w-none sm:basis-[calc(50%-0.375rem)] lg:basis-[calc(33.333%-0.5rem)]"
              >
                <div className="group flex h-32 items-center justify-center rounded-2xl border border-line bg-white px-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-2">
                  {/*
                  Placa blanca a propósito, también en tema oscuro: los logos de
                  los sponsors llegan a color y muchos llevan texto negro, que
                  sobre el fondo oscuro desaparecería. Así vale un único archivo
                  por sponsor en lugar de una versión por tema.
                  `fill` evita tener que declarar las dimensiones de cada logo.
                */}
                  <div className="relative h-24 w-full">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                      className="object-contain"
                    />
                  </div>
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
                Conecta tu marca con más de 300 desarrolladores del sur del
                Perú. Escríbenos y te enviamos el brochure con los paquetes de
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
