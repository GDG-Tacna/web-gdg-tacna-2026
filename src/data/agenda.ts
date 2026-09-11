export type TrackId =
  | "keynote"
  | "ia"
  | "web"
  | "mobile"
  | "cloud"
  | "break"
  | "tbd";

export type Track = {
  id: TrackId;
  label: string;
  /**
   * Clases tailwind para el punto de la línea de tiempo, el chip y el borde
   * al pasar el cursor. Los tokens `*-ink` cambian de tono según el tema.
   */
  dot: string;
  chip: string;
  hover: string;
};

export const tracks: Record<TrackId, Track> = {
  keynote: {
    id: "keynote",
    label: "Keynote",
    dot: "bg-brand-violet",
    chip: "border-violet-ink/30 bg-violet-ink/10 text-violet-ink",
    hover: "group-hover:border-violet-ink/40",
  },
  ia: {
    id: "ia",
    label: "IA",
    dot: "bg-g-green",
    chip: "border-g-green-ink/30 bg-g-green-ink/10 text-g-green-ink",
    hover: "group-hover:border-g-green-ink/40",
  },
  web: {
    id: "web",
    label: "Web",
    dot: "bg-g-blue",
    chip: "border-g-blue-ink/30 bg-g-blue-ink/10 text-g-blue-ink",
    hover: "group-hover:border-g-blue-ink/40",
  },
  mobile: {
    id: "mobile",
    label: "Mobile",
    dot: "bg-g-red",
    chip: "border-g-red-ink/30 bg-g-red-ink/10 text-g-red-ink",
    hover: "group-hover:border-g-red-ink/40",
  },
  cloud: {
    id: "cloud",
    label: "Cloud",
    dot: "bg-g-yellow",
    chip: "border-g-yellow-ink/30 bg-g-yellow-ink/10 text-g-yellow-ink",
    hover: "group-hover:border-g-yellow-ink/40",
  },
  break: {
    id: "break",
    label: "Pausa",
    dot: "bg-line-2",
    chip: "border-line bg-surface-2 text-faint",
    hover: "",
  },
  tbd: {
    id: "tbd",
    label: "Por anunciar",
    dot: "bg-g-yellow",
    chip: "border-g-yellow-ink/30 bg-g-yellow-ink/10 text-g-yellow-ink",
    hover: "group-hover:border-g-yellow-ink/40",
  },
};

export type AgendaItem = {
  time: string;
  duration?: string;
  title: string;
  description: string;
  track: TrackId;
  room?: string;
  speaker?: { name: string; role: string };
};

/**
 * Adelanto de la agenda. Mientras el programa no esté cerrado solo se muestran
 * la acreditación y un bloque que invita a registrarse. Al añadir charlas
 * reales vuelven solos los filtros por track (ver components/Agenda.tsx).
 */
export const agenda: AgendaItem[] = [
  {
    time: "09:00",
    duration: "30 min",
    title: "Registro y bienvenida",
    description: "Acreditación de asistentes.",
    track: "break",
    room: "TBD",
  },
  {
    time: "09:30",
    title: "Muy pronto revelaremos la agenda",
    description:
      "Estamos cerrando las charlas y los talleres del día. Mientras tanto, ya puedes registrarte y asegurar tu lugar.",
    track: "tbd",
  },
];

/** Tracks que no son charlas y por tanto no merecen un filtro propio. */
const sinFiltro: TrackId[] = ["break", "tbd"];

/**
 * Filtros derivados de la agenda: solo aparecen los tracks que realmente
 * tienen charlas, así la fila no se llena de opciones que no devuelven nada.
 */
export const filters: { id: TrackId | "all"; label: string }[] = [
  { id: "all", label: "Todo el día" },
  ...(Object.keys(tracks) as TrackId[])
    .filter(
      (id) => !sinFiltro.includes(id) && agenda.some((item) => item.track === id),
    )
    .map((id) => ({ id, label: tracks[id].label })),
];
