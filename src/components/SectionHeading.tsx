import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-4 ${
        centered ? "items-center text-center" : "items-start text-left"
      }`}
    >
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
          <span className="size-1.5 rounded-full bg-g-green" />
          {eyebrow}
        </span>
      </Reveal>

      <Reveal delay={80}>
        <h2 className="font-display max-w-3xl text-3xl leading-[1.1] font-bold tracking-tight text-balance text-heading sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={140}>
          <p
            className={`max-w-2xl text-[15px] leading-relaxed text-pretty text-muted sm:text-base ${
              centered ? "mx-auto" : ""
            }`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
