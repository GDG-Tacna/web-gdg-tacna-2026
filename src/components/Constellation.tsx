/**
 * Red de nodos del hero. Los puntos están colocados a mano sobre un lienzo de
 * 1440x900 dejando libre la franja central, que es donde va el título; las
 * aristas se derivan de la distancia entre nodos, así que basta mover un punto
 * para que la red se recalcule sola.
 */
const NODES: [number, number][] = [
  // Costado izquierdo
  [60, 120], [150, 240], [55, 380], [170, 470], [90, 620],
  [210, 720], [40, 830], [280, 140], [300, 330], [250, 600],
  // Costado derecho
  [1380, 110], [1290, 230], [1400, 390], [1250, 470], [1350, 610],
  [1230, 730], [1405, 835], [1160, 150], [1140, 340], [1190, 615],
  // Franja superior, por encima del título
  [470, 70], [640, 135], [820, 60], [980, 125], [560, 215], [900, 205],
  // Franja inferior, por debajo del CTA
  [380, 850], [520, 835], [700, 780], [880, 855], [1040, 790],
  [620, 690], [960, 700], [1080, 862],
];

/** Distancia máxima (en unidades del viewBox) para unir dos nodos. */
const MAX_DIST = 235;

const EDGES = NODES.flatMap(([x1, y1], i) =>
  NODES.slice(i + 1)
    .map((node, j) => ({ node, index: i + 1 + j }))
    .filter(({ node: [x2, y2] }) => Math.hypot(x2 - x1, y2 - y1) <= MAX_DIST)
    .map(({ node: [x2, y2], index }) => ({ x1, y1, x2, y2, key: `${i}-${index}` })),
);

/** Unos pocos nodos con los colores de Google, para que la red no sea plana. */
const ACCENTS: Record<number, string> = {
  8: "var(--color-g-blue)",
  13: "var(--color-g-red)",
  24: "var(--color-g-yellow)",
  31: "var(--color-g-green)",
};

export function Constellation() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="mask-constellation absolute inset-0 size-full"
    >
      <g stroke="var(--net-line)" strokeWidth="1">
        {EDGES.map(({ key, ...line }) => (
          <line key={key} {...line} />
        ))}
      </g>

      {NODES.map(([cx, cy], index) => {
        const accent = ACCENTS[index];
        return accent ? (
          <g key={index}>
            <circle cx={cx} cy={cy} r="11" fill={accent} opacity="0.16" />
            <circle cx={cx} cy={cy} r="3.5" fill={accent} opacity="0.9" />
          </g>
        ) : (
          <circle key={index} cx={cx} cy={cy} r="2.5" fill="var(--net-node)" />
        );
      })}
    </svg>
  );
}
