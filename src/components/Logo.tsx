type LogoProps = {
  className?: string;
  /** Muestra el sufijo "Tacna" junto al wordmark. */
  showCity?: boolean;
};

/**
 * Marca del evento: cuatro puntos con los colores de Google + wordmark.
 * TODO: reemplazar por el logo oficial de DevFest cuando esté disponible.
 */
export function Logo({ className = "", showCity = true }: LogoProps) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid size-8 shrink-0 grid-cols-2 gap-[3px] rounded-[10px] border border-line bg-surface-2 p-[6px]">
        <span className="rounded-full bg-g-blue" />
        <span className="rounded-full bg-g-red" />
        <span className="rounded-full bg-g-yellow" />
        <span className="rounded-full bg-g-green" />
      </span>
      <span className="font-display text-[15px] leading-none font-bold tracking-tight text-heading">
        DevFest
        {showCity && <span className="ml-1.5 font-medium text-faint">Tacna</span>}
      </span>
    </span>
  );
}
