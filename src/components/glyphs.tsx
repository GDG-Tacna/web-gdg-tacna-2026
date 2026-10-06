/**
 * Glifos de la guía de marca DevFest 2026 (hojas "Bold Glyphs" y "Monoline").
 *
 * Dos familias, igual que en la guía:
 * - Rellenos: un color plano de la paleta y contorno en tinta.
 * - Monolínea: solo trazo fino en tinta.
 *
 * Todos son decorativos (`aria-hidden`). El trazo usa
 * `vectorEffect="non-scaling-stroke"` para que el contorno mida lo mismo sea
 * cual sea el tamaño al que se pinte el glifo, como en las piezas de la marca.
 */
type GlyphProps = { className?: string };
type FilledProps = GlyphProps & {
  /** Color de relleno, normalmente un token: "var(--color-p-blue)". */
  fill?: string;
};

const outline = {
  stroke: "var(--ink)",
  strokeWidth: 2,
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

const mono = {
  fill: "none",
  stroke: "var(--ink)",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke",
} as const;

/** Logo de Google Developer Groups con el contorno que lleva en DevFest 2026. */
export function GdgMark({ className = "" }: GlyphProps) {
  const bar = { ...outline, strokeWidth: 1.5, y: 10, width: 30, height: 12, rx: 6 };
  return (
    <svg
      viewBox="0 0 72 32"
      aria-hidden
      className={`shrink-0 overflow-visible ${className}`}
    >
      <rect {...bar} x={3} fill="var(--color-g-red)" transform="rotate(-32 9 16)" />
      <rect {...bar} x={3} fill="var(--color-g-blue)" transform="rotate(32 9 16)" />
      <rect {...bar} x={39} fill="var(--color-g-yellow)" transform="rotate(-32 63 16)" />
      <rect {...bar} x={39} fill="var(--color-g-green)" transform="rotate(32 63 16)" />
    </svg>
  );
}

const BRACE =
  "M36 2H27.5Q14.5 2 14.5 14.5V37Q14.5 44.5 8 44.5H6.5Q4 44.5 4 47V53Q4 55.5 6.5 55.5H8Q14.5 55.5 14.5 63V85.5Q14.5 98 27.5 98H36V87H29.5Q25.5 87 25.5 83V17Q25.5 13 29.5 13H36Z";

/** Llave del lockup `{ DevFest }`. Proporción 2:5, pensada para dimensionarse por alto. */
export function Brace({
  side = "open",
  fill = "var(--color-p-blue)",
  className = "",
}: FilledProps & { side?: "open" | "close" }) {
  return (
    <svg
      viewBox="0 0 40 100"
      aria-hidden
      className={`shrink-0 overflow-visible ${className}`}
    >
      {/* El espejo va dentro del SVG: un `transform` CSS lo pisaría la
          animación de entrada. */}
      <path
        d={BRACE}
        fill={fill}
        transform={side === "close" ? "matrix(-1 0 0 1 40 0)" : undefined}
        {...outline}
      />
    </svg>
  );
}

export function Slashes({ fill = "var(--color-g-blue)", className = "" }: FilledProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={`shrink-0 overflow-visible ${className}`}>
      <path d="M20 2H34L16 62H2Z" fill={fill} {...outline} />
      <path d="M48 2H62L44 62H30Z" fill={fill} {...outline} />
    </svg>
  );
}

export function ArrowBold({ fill = "var(--color-g-yellow)", className = "" }: FilledProps) {
  return (
    <svg viewBox="0 0 72 48" aria-hidden className={`shrink-0 overflow-visible ${className}`}>
      <path d="M2 17H40V4L69 24L40 44V31H2Z" fill={fill} {...outline} />
    </svg>
  );
}

export function Plus({ fill = "var(--color-g-red)", className = "" }: FilledProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={`shrink-0 overflow-visible ${className}`}>
      <path d="M17 2H31V17H46V31H31V46H17V31H2V17H17Z" fill={fill} {...outline} />
    </svg>
  );
}

export function Dots({ fill = "var(--color-h-green)", className = "" }: FilledProps) {
  return (
    <svg viewBox="0 0 84 24" aria-hidden className={`shrink-0 overflow-visible ${className}`}>
      {[12, 42, 72].map((cx) => (
        <circle key={cx} cx={cx} cy={12} r={10} fill={fill} {...outline} />
      ))}
    </svg>
  );
}

/**
 * Tres círculos fundidos. Primero van los tres trazos y encima los tres
 * rellenos: así el contorno solo sobrevive en el borde exterior de la unión.
 */
export function Blob({ fill = "var(--color-p-red)", className = "" }: FilledProps) {
  const centers = [24, 66, 108];
  return (
    <svg viewBox="0 0 132 48" aria-hidden className={`shrink-0 overflow-visible ${className}`}>
      {centers.map((cx) => (
        <circle key={cx} cx={cx} cy={24} r={22} fill="none" {...outline} strokeWidth={4} />
      ))}
      {centers.map((cx) => (
        <circle key={cx} cx={cx} cy={24} r={22} fill={fill} />
      ))}
    </svg>
  );
}

export function Asterisk({ className = "" }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={`shrink-0 overflow-visible ${className}`}>
      <path d="M24 2V46M2 24H46M8.4 8.4L39.6 39.6M39.6 8.4L8.4 39.6" {...mono} />
    </svg>
  );
}

export function Hash({ className = "" }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={`shrink-0 overflow-visible ${className}`}>
      <path d="M19 4L15 44M35 4L31 44M6 17H44M4 31H42" {...mono} />
    </svg>
  );
}

export function Globe({ className = "" }: GlyphProps) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={`shrink-0 overflow-visible ${className}`}>
      <circle cx={24} cy={24} r={21} {...mono} />
      <ellipse cx={24} cy={24} rx={9.5} ry={21} {...mono} />
      <path d="M3 24H45M24 3V45M6.5 13H41.5M6.5 35H41.5" {...mono} />
    </svg>
  );
}

export function ArrowLine({ className = "" }: GlyphProps) {
  return (
    <svg viewBox="0 0 64 24" aria-hidden className={`shrink-0 overflow-visible ${className}`}>
      <path d="M2 12H61M51 3L61 12L51 21" {...mono} />
    </svg>
  );
}

/** Fila de ondas: el remate que la guía usa bajo los lockups. */
export function Scallops({ className = "" }: GlyphProps) {
  return (
    <svg viewBox="0 0 120 16" aria-hidden className={`shrink-0 overflow-visible ${className}`}>
      <path
        d="M2 2a11.6 11.6 0 0 0 23.2 0a11.6 11.6 0 0 0 23.2 0a11.6 11.6 0 0 0 23.2 0a11.6 11.6 0 0 0 23.2 0a11.6 11.6 0 0 0 23.2 0"
        {...mono}
      />
    </svg>
  );
}
