import { BackgroundFX } from "./BackgroundFX";
import { Countdown } from "./Countdown";
import { Reveal } from "./Reveal";
import { ArrowIcon, CalendarIcon, ClockIcon, PinIcon } from "./icons";
import { site } from "@/lib/site";

const meta = [
  { icon: CalendarIcon, label: "Fecha", value: site.dateLabel },
  { icon: PinIcon, label: "Lugar", value: site.venue },
  { icon: ClockIcon, label: "Horario", value: site.timeLabel },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-32 pb-16 sm:pt-36 sm:pb-24"
    >
      <BackgroundFX />

      <div className="shell relative z-10">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <p className="font-display flex items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-muted uppercase sm:gap-4">
              <span>{site.organizer} presenta</span>
              <span aria-hidden className="h-px w-7 bg-line-2" />
              <span>{site.city}</span>
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="font-display mt-7 text-[clamp(2.75rem,10vw,6.5rem)] leading-[0.92] font-bold tracking-[-0.04em]">
              <span className="text-gradient block">DevFest</span>
              <span className="mt-1 block text-heading">
                Tacna{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">2026</span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-1 h-1.5 rounded-full bg-gradient-to-r from-g-blue via-brand-violet to-g-green sm:h-2"
                  />
                </span>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-pretty text-muted sm:text-lg">
              {site.description}
            </p>
          </Reveal>

          {/* Datos clave */}
          <Reveal delay={220}>
            <dl className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
              {meta.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="glass flex items-center gap-2.5 rounded-full px-4 py-2.5"
                >
                  <Icon className="text-faint" />
                  <div className="text-left">
                    <dt className="text-[9px] font-semibold tracking-[0.16em] text-faint uppercase">
                      {label}
                    </dt>
                    <dd className="text-[13px] font-medium text-heading">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-10 flex flex-col items-center gap-6 sm:gap-8">
              <a
                href={site.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-solid px-7 py-4 text-[15px] font-semibold text-on-solid shadow-[0_0_50px_-14px_rgb(139_92_246/0.55)] transition-transform hover:scale-[1.03] active:scale-95 dark:shadow-[0_0_50px_-12px_rgb(139_92_246/0.8)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-current/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                Regístrate gratis
                <ArrowIcon className="transition-transform group-hover:translate-x-1" />
              </a>

              <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] font-semibold tracking-[0.22em] text-faint uppercase">
                  Faltan
                </span>
                <Countdown date={site.date} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Métricas del evento */}
        <Reveal delay={340}>
          <div className="mt-16 sm:mt-20">
            <div className="hairline h-px w-full" />
            <div className="grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
              {site.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1.5 px-4 py-7 text-center"
                >
                  <span className="font-display text-3xl font-bold tracking-tight text-heading sm:text-4xl">
                    {stat.value}
                  </span>
                  <span className="text-[11px] font-medium tracking-wide text-muted">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="hairline h-px w-full" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
