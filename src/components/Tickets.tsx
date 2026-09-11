import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ArrowIcon, CheckIcon } from "./icons";
import { plans, type Plan } from "@/data/tickets";
import { site } from "@/lib/site";

function PlanCard({ plan }: { plan: Plan }) {
  const body = (
    <div
      className={`relative flex h-full flex-col p-7 sm:p-9 ${
        plan.featured
          ? "rounded-[calc(2rem-1.5px)] bg-panel"
          : "glass rounded-4xl"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-line bg-surface-2 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
          {plan.badge}
        </span>
        {plan.highlight && (
          <span className="rounded-full border border-violet-ink/30 bg-violet-ink/10 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-violet-ink uppercase">
            {plan.highlight}
          </span>
        )}
      </div>

      <h3 className="font-display mt-5 text-2xl font-bold tracking-tight text-balance text-heading">
        {plan.name}
      </h3>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted">
        {plan.description}
      </p>

      <div className="mt-7 flex flex-wrap items-end gap-3">
        <span className="font-display bg-gradient-to-br from-heading to-muted bg-clip-text text-5xl leading-none font-bold tracking-tight text-transparent sm:text-6xl">
          {plan.price}
        </span>
        {plan.compareAt && (
          <span className="mb-1.5 text-[15px] text-faint line-through">
            {plan.compareAt}
          </span>
        )}
      </div>
      <p className="mt-2 text-[12.5px] text-faint">{plan.priceNote}</p>

      <p className="mt-8 text-[12px] font-semibold tracking-[0.12em] text-faint uppercase">
        {plan.includesTitle}
      </p>
      <ul className="mt-4 flex flex-col gap-3.5">
        {plan.includes.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-g-green-ink/15 text-g-green-ink">
              <CheckIcon className="size-3" />
            </span>
            <span className="text-[14px] leading-snug text-body">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3 pt-9">
        {plan.href ? (
          <a
            href={plan.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group/cta inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 text-[15px] font-semibold transition-transform hover:scale-[1.01] active:scale-[0.99] ${
              plan.featured
                ? "bg-solid text-on-solid"
                : "border border-line-2 text-heading hover:bg-surface-2"
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
            className={`w-full rounded-full px-6 py-4 text-[15px] font-semibold ${
              plan.featured
                ? "bg-surface-2 text-muted"
                : "border border-line text-muted"
            }`}
          >
            {plan.cta}
          </button>
        )}

        <p className="text-center text-[12px] text-faint">{plan.ctaNote}</p>
      </div>
    </div>
  );

  if (!plan.featured) {
    return <div className="h-full">{body}</div>;
  }

  // La tarjeta destacada lleva un anillo degradado de 1.5px y un halo detrás.
  return (
    <div className="group relative h-full rounded-4xl p-[1.5px]">
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-[4rem] bg-[radial-gradient(closest-side,rgb(139_92_246/0.22),rgb(66_133_244/0.12)_55%,transparent)] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div
        aria-hidden
        className="absolute inset-0 rounded-4xl bg-gradient-to-br from-g-blue via-brand-violet to-g-green opacity-80 transition-opacity duration-500 group-hover:opacity-100"
      />
      {body}
    </div>
  );
}

export function Tickets() {
  return (
    <section
      id="entradas"
      className="relative overflow-hidden py-24 sm:py-32"
    >
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
          <p className="mt-10 text-center text-[13px] text-muted">
            ¿Tienes dudas sobre el evento? Escríbenos a{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-heading underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-heading"
            >
              {site.email}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
