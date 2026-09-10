"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Pending } from "./Pending";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { MicIcon, PinIcon } from "./icons";
import { agenda, filters, tracks, type TrackId } from "@/data/agenda";

export function Agenda() {
  const [active, setActive] = useState<TrackId | "all">("all");

  // Las pausas solo tienen sentido en la vista completa del día.
  const items = useMemo(
    () => (active === "all" ? agenda : agenda.filter((i) => i.track === active)),
    [active],
  );

  const sinAgenda = agenda.length === 0;

  return (
    <section id="agenda" className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          index="01"
          eyebrow="Agenda"
          title="Un día completo de aprendizaje, código y comunidad"
          description={
            sinAgenda
              ? "Estamos cerrando el programa del día. Aquí aparecerá la línea de tiempo completa con charlas, workshops y pausas."
              : "Filtra por el track que más te interese."
          }
        />

        {sinAgenda ? (
          <Pending>
            Publicaremos la agenda en cuanto estén confirmados los horarios y
            las charlas.
          </Pending>
        ) : (
          <>
            {/* Filtros por track */}
            <Reveal delay={160}>
              <div
                role="tablist"
                aria-label="Filtrar agenda por track"
                className="mt-10 flex flex-wrap justify-center gap-2"
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
                      className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                        selected
                          ? "border-transparent bg-solid text-on-solid"
                          : "border-line bg-surface text-muted hover:border-line-2 hover:text-heading"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* Línea de tiempo */}
            <div className="relative mx-auto mt-12 max-w-4xl">
              <div
                aria-hidden
                className="absolute top-2 bottom-2 left-[7px] w-px bg-gradient-to-b from-transparent via-line-2 to-transparent sm:left-[calc(5.5rem+7px)]"
              />

              <ol className="flex flex-col gap-3">
                {items.map((item, index) => {
                  const track = tracks[item.track];
                  const isBreak = item.track === "break";

                  return (
                    <li
                      key={`${item.time}-${item.title}`}
                      className="rise relative flex gap-5 sm:gap-6"
                      style={
                        {
                          "--rise-delay": `${Math.min(index * 45, 260)}ms`,
                        } as CSSProperties
                      }
                    >
                      {/* Hora (columna izquierda en desktop) */}
                      <div className="hidden w-22 shrink-0 pt-4 text-right sm:block">
                        <div className="font-display text-[15px] font-semibold tabular-nums text-heading">
                          {item.time}
                        </div>
                        <div className="mt-0.5 text-[11px] text-faint">
                          {item.duration}
                        </div>
                      </div>

                      {/* Punto de la línea */}
                      <span
                        aria-hidden
                        className={`mt-5 size-[15px] shrink-0 rounded-full border-4 border-canvas ${track.dot}`}
                      />

                      {/* Tarjeta */}
                      <div
                        className={`group flex-1 rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
                          isBreak
                            ? "border-dashed border-line bg-transparent"
                            : `border-line bg-surface hover:-translate-y-0.5 hover:bg-surface-2 ${track.hover}`
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-display text-[13px] font-semibold tabular-nums text-body sm:hidden">
                            {item.time}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.1em] uppercase ${track.chip}`}
                          >
                            {track.label}
                          </span>
                          <span className="text-[11px] text-faint sm:hidden">
                            {item.duration}
                          </span>
                        </div>

                        <h3
                          className={`mt-2.5 font-display text-[15px] leading-snug font-semibold text-balance sm:text-base ${
                            isBreak ? "text-muted" : "text-heading"
                          }`}
                        >
                          {item.title}
                        </h3>

                        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                          {item.description}
                        </p>

                        <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted">
                          {item.speaker && (
                            <span className="flex items-center gap-1.5">
                              <MicIcon className="size-3.5 text-faint" />
                              <span className="font-medium text-body">
                                {item.speaker.name}
                              </span>
                              <span className="hidden text-faint sm:inline">
                                · {item.speaker.role}
                              </span>
                            </span>
                          )}
                          {item.room && (
                            <span className="flex items-center gap-1.5">
                              <PinIcon className="size-3.5 text-faint" />
                              {item.room}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <Reveal>
              <p className="mt-10 text-center text-[12px] text-faint">
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
