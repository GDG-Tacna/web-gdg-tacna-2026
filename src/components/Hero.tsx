import type { CSSProperties } from "react";
import { Countdown } from "./Countdown";
import { Reveal } from "./Reveal";
import { TabCard } from "./TabCard";
import { Asterisk, Brace, GdgMark, Hash, Scallops } from "./glyphs";
import { ArrowIcon, CalendarIcon, ClockIcon, PinIcon } from "./icons";
import { site } from "@/lib/site";

const meta = [
  { icon: CalendarIcon, label: "Fecha", value: site.dateLabel },
  { icon: PinIcon, label: "Lugar", value: site.venue },
  { icon: ClockIcon, label: "Horario", value: site.timeLabel },
];

/** Un pastel por métrica, en el orden de la paleta de la guía. */
const statFills = ["bg-p-blue", "bg-p-red", "bg-p-yellow", "bg-p-green"];

const pop = (ms: number) => ({ "--pop-delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section id="top" className="relative pt-28 pb-14 sm:pt-36 sm:pb-20">
      <div className="shell">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-[12px] font-medium tracking-[0.1em] text-muted uppercase">
            <GdgMark className="h-5 w-auto" />
            {site.organizer} presenta
          </p>
        </Reveal>

        {/*
          Lockup de la guía: { DevFest } con la píldora de ubicación debajo. Todo
          se mide en `em` sobre el tamaño del h1, así llaves, wordmark y píldora
          escalan juntos con el ancho de pantalla.
        */}
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-6 sm:mt-8 xl:gap-x-12">
          <h1 className="flex items-center gap-[0.1em] text-[17.5vw] font-bold text-heading md:text-[12.5vw] xl:text-[10.5rem]">
            <span className="pop flex" style={pop(60)}>
              <Brace className="h-[1.3em] w-[0.52em]" />
            </span>
            <span className="flex flex-col gap-[0.08em]">
              <span className="leading-[0.86] tracking-[-0.045em]">DevFest</span>
              <span className="rounded-full border-2 border-ink bg-panel py-[0.32em] text-center text-[max(0.19em,0.8125rem)] leading-none font-medium tracking-normal">
                {site.city}
              </span>
            </span>
            <span className="pop flex" style={pop(140)}>
              <Brace side="close" className="h-[1.3em] w-[0.52em]" />
            </span>
            <span className="sr-only"> 2026</span>
          </h1>

          <div
            aria-hidden
            className="flex items-center gap-4 sm:gap-5 md:flex-col md:items-start md:gap-6"
          >
            <span
              className="pop sticker rounded-full border-2 border-ink bg-g-yellow px-[0.75em] py-[0.18em] text-[clamp(1.75rem,5.4vw,3.75rem)] leading-none font-medium text-coal"
              style={pop(240)}
            >
              2026
            </span>
            <span className="flex items-center gap-4 sm:gap-5">
              <span className="pop flex" style={pop(320)}>
                <Hash className="sticker size-11 sm:size-14 xl:size-16" />
              </span>
              <span className="pop flex" style={pop(400)}>
                <Asterisk className="turn-slow size-11 sm:size-14 xl:size-16" />
              </span>
              <span className="pop hidden min-[380px]:flex md:hidden" style={pop(480)}>
                <Scallops className="h-3 w-auto" />
              </span>
            </span>
          </div>
        </div>

        <div className="mt-12 grid items-start gap-x-12 gap-y-10 sm:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <p className="text-[clamp(1.375rem,2.6vw,2rem)] leading-[1.18] font-medium tracking-[-0.02em] text-balance text-heading">
                {site.tagline}.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted sm:text-[17px]">
                {site.description}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={site.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn group px-5 py-4 text-[15px] sm:px-7 sm:text-base"
                >
                  Regístrate gratis
                  <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                </a>
                <a href="#agenda" className="btn btn-ghost px-5 py-4 text-[15px] sm:px-7 sm:text-base">
                  Ver agenda
                </a>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <Scallops className="mt-10 hidden h-4 w-auto md:block" />
            </Reveal>
          </div>

          {/* Datos clave y cuenta regresiva */}
          <Reveal delay={200} className="lg:col-span-5">
            <TabCard tab={site.dateShort}>
              <div className="p-5 sm:p-7">
                <dl className="flex flex-col gap-3.5 text-[15px]">
                  {meta.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      {/* El icono ya dice qué dato es; la etiqueta se mantiene
                          solo para lectores de pantalla. */}
                      <dt className="sr-only">{label}</dt>
                      <span className="grid size-8 shrink-0 place-items-center rounded-full border-[1.5px] border-ink text-heading">
                        <Icon className="size-4" />
                      </span>
                      <dd className="font-medium text-heading">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-6 border-t-2 border-line pt-5">
                  <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">
                    Faltan
                  </span>
                  <div className="mt-3">
                    <Countdown date={site.date} />
                  </div>
                </div>
              </div>
            </TabCard>
          </Reveal>
        </div>

        {/* Métricas del evento */}
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:mt-16 md:grid-cols-4 md:gap-4">
          {site.stats.map((stat, index) => (
            <Reveal
              as="li"
              key={stat.label}
              delay={Math.min(index * 70, 280)}
              className={`on-color flex flex-col gap-1.5 rounded-3xl border-2 border-ink px-5 py-5 sm:px-6 sm:py-6 ${
                statFills[index % statFills.length]
              }`}
            >
              <span className="text-4xl leading-none font-bold tracking-[-0.03em] text-heading sm:text-5xl">
                {stat.value}
              </span>
              <span className="text-[13px] leading-snug font-medium text-body">
                {stat.label}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
