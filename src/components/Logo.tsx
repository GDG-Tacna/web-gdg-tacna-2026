import { GdgMark } from "./glyphs";

type LogoProps = {
  className?: string;
  /** Muestra la píldora con la ciudad junto al wordmark. */
  showCity?: boolean;
};

/**
 * Lockup compacto del evento según la guía de marca: logo de GDG, wordmark
 * "DevFest" en Google Sans Bold y la píldora de ubicación.
 */
export function Logo({ className = "", showCity = true }: LogoProps) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <GdgMark className="h-[18px] w-auto" />
      <span className="text-[17px] leading-none font-bold tracking-[-0.03em] text-heading">
        DevFest
      </span>
      {showCity && (
        <span className="rounded-full border-[1.5px] border-ink px-2 py-[3px] text-[11px] leading-none font-medium text-heading">
          Tacna
        </span>
      )}
    </span>
  );
}
