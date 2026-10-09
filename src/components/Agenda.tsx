"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Pending } from "./Pending";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TabCard } from "./TabCard";
import { MicIcon, PinIcon } from "./icons";
import { agenda, filters, tracks, type TrackId } from "@/data/agenda";
import { site } from "@/lib/site";

export function Agenda() {
  const [active, setActive] = useState<TrackId | "all">("all");

  // Las pausas solo tienen sentido en la vista completa del día.
  const items = useMemo(
    () =>
      active === "all" ? agenda : agenda.filter((i) => i.track === active),
    [active],
  );

  const sinAgenda = agenda.length === 0;
  // filters solo trae "Todo el día" mientras no haya charlas con track propio.
  const hayFiltros = filters.length > 1;

  // Sin filtros no tiene sentido invitar a filtrar; y con el adelanto puesto,
  // el propio bloque de la agenda ya explica que el programa llega después.
  const descripcion = sinAgenda
    ? "Estamos cerrando el programa del día. Aquí aparecerá la línea de tiempo completa con charlas, workshops y pausas."
    : hayFiltros
      ? "Filtra por el track que más te interese."
      : undefined;

  return (
    <section id="agenda" className="relative py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow="Agenda"
          title="Un día completo de aprendizaje, código y comunidad"
          description={descripcion}
        />

        {sinAgenda ? (
          <Pending>
            Publicaremos la agenda en cuanto estén confirmados los horarios y
            las charlas.
          </Pending>
        ) : (
          <>
            {/* Filtros por track */}
            {hayFiltros && (
              <Reveal delay={160}>
                <div
                  role="tablist"
                  aria-label="Filtrar agenda por track"
                  className="mt-10 flex flex-wrap gap-2"
                >
                  {filters.map((filter) => {
                    const selected = active === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setActive(filter.id)}
                        className={`rounded-full border-2 border-ink px-4 py-2 text-[13px] font-medium transition-colors duration-200 ${
                          selected
                            ? "bg-solid text-on-solid"
                            : "bg-panel text-heading hover:bg-p-blue hover:text-coal"
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </Reveal>
            )}

            {/* Programa, con la silueta de las plantillas de agenda de la guía */}
            <Reveal delay={120} className="mt-12">
              <TabCard tab={`Agenda · ${site.dateShort}`}>
                <ol>
                  {items.map((item, index) => {
                    const track = tracks[item.track];
                    const isBreak = item.track === "break";

                    return (
                      <li
                        key={`${item.time}-${item.title}`}
                        className="rise grid gap-x-8 gap-y-3 border-t-2 border-line px-5 py-6 first:border-t-0 sm:grid-cols-[6.5rem_1fr] sm:px-8 sm:py-7"
                        style={
                          {
                            "--rise-delay": `${Math.min(index * 45, 260)}ms`,
                          } as CSSProperties
                        }
                      >
                        {/* Hora: en monoespaciada y amarillo, como en la guía */}
                        <div className="flex items-baseline gap-3 sm:flex-col sm:gap-1 sm:pt-0.5">
                          <span className="font-mono text-base font-bold tabular-nums text-g-yellow-ink sm:text-lg">
                            {item.time}
                          </span>
                          {item.duration && (
                            <span className="font-mono text-[11px] text-faint">
                              {item.duration}
                            </span>
                          )}
                        </div>

                        <div>
                          <span
                            className={`inline-block rounded-full border-[1.5px] px-2.5 py-0.5 text-[11px] font-semibold ${track.chip}`}
                          >
                            {track.label}
                          </span>

                          <h3
                            className={`mt-3 text-lg leading-snug font-bold tracking-[-0.01em] text-balance sm:text-xl ${
                              isBreak ? "text-muted" : "text-heading"
                            }`}
                          >
                            {item.title}
                          </h3>

                          {item.description && (
                            <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted sm:text-[15px]">
                              {item.description}
                            </p>
                          )}

                          {(item.speaker || item.room) && (
                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
                              {item.speaker && (
                                <span className="flex items-center gap-1.5">
                                  <MicIcon className="size-3.5 text-faint" />
                                  <span className="font-medium text-body">
                                    {item.speaker.name}
                                  </span>
                                  {item.speaker.role && (
                                    <span className="hidden text-faint sm:inline">
                                      · {item.speaker.role}
                                    </span>
                                  )}
                                </span>
                              )}
                              {item.room && (
                                <span className="flex items-center gap-1.5">
                                  <PinIcon className="size-3.5 text-faint" />
                                  {item.room}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </TabCard>
            </Reveal>

            <Reveal>
              <p className="mt-6 font-mono text-[11.5px] text-faint">
                El horario es referencial y puede sufrir cambios hasta la fecha
                del evento.
              </p>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
