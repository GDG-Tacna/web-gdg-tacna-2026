import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TabCard } from "./TabCard";
import { ArrowIcon, CheckIcon } from "./icons";
import { plans, type Plan } from "@/data/tickets";
import { site } from "@/lib/site";

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <TabCard
      tab={plan.badge}
      // El plan destacado va sobre amarillo pastel, como un sticker de la
      // guía; el general, sobre la superficie del tema.
      fill={plan.featured ? "on-color bg-p-yellow" : "bg-panel"}
      className="h-full"
      bodyClassName="flex flex-col p-6 sm:p-9"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="max-w-sm text-2xl leading-tight font-bold tracking-[-0.02em] text-balance text-heading sm:text-[28px]">
          {plan.name}
        </h3>
        {plan.highlight && (
          <span className="rounded-full border-2 border-ink bg-h-red px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.08em] text-coal uppercase">
            {plan.highlight}
          </span>
        )}
      </div>
      <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-muted">
        {plan.description}
      </p>

      <div className="mt-8 flex flex-wrap items-end gap-3">
        <span className="text-6xl leading-[0.9] font-bold tracking-[-0.045em] text-heading sm:text-7xl">
          {plan.price}
        </span>
        {plan.compareAt && (
          <span className="mb-1 text-lg font-medium text-faint line-through">
            {plan.compareAt}
          </span>
        )}
      </div>
      <p className="mt-3 font-mono text-[12px] text-faint">{plan.priceNote}</p>

      <p className="mt-8 border-t-2 border-line pt-6 font-mono text-[11px] font-semibold tracking-[0.12em] text-faint uppercase">
        {plan.includesTitle}
      </p>
      <ul className="mt-4 flex flex-col gap-3">
        {plan.includes.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-px grid size-[22px] shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-h-green text-coal">
              <CheckIcon className="size-3" />
            </span>
            <span className="text-[15px] leading-snug text-body">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-9">
        {plan.href ? (
          <a
            href={plan.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn group/cta w-full py-4 ${
              plan.featured ? "" : "btn-ghost"
            }`}
          >
            {plan.cta}
            <ArrowIcon className="transition-transform group-hover/cta:translate-x-1" />
          </a>
        ) : (
          // Sin destino todavía: el botón queda inerte a propósito.
          <button
            type="button"
            aria-disabled="true"
            className="w-full rounded-full border-2 border-dashed border-line-2 px-6 py-4 text-[15px] font-semibold text-muted"
          >
            {plan.cta}
          </button>
        )}

        <p className="text-center font-mono text-[11.5px] text-faint">
          {plan.ctaNote}
        </p>
      </div>
    </TabCard>
  );
}

export function Tickets() {
  return (
    <section id="entradas" className="relative py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Entradas"
          title="Elige tu experiencia DevFest"
          description="La conferencia es gratuita. Si quieres llevarte el merch del evento, suma la experiencia premium."
        />

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 120} className="h-full">
              <PlanCard plan={plan} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <p className="mt-10 text-[14px] text-muted">
            ¿Tienes dudas sobre el evento? Escríbenos a{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-heading underline decoration-line-2 decoration-2 underline-offset-4 transition-colors hover:decoration-g-yellow"
            >
              {site.email}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
