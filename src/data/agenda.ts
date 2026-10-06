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
   * Clases tailwind del chip del track. Los pasteles siguen los stickers de
   * track de la guía de marca (Android verde, Cloud azul, AI rosa, Web
   * amarillo) y llevan el texto en `coal`, que no cambia con el tema.
   */
  chip: string;
};

export const tracks: Record<TrackId, Track> = {
  keynote: {
    id: "keynote",
    label: "Keynote",
    chip: "border-ink bg-solid text-on-solid",
  },
  ia: {
    id: "ia",
    label: "IA",
    chip: "border-coal bg-p-red text-coal",
  },
  web: {
    id: "web",
    label: "Web",
    chip: "border-coal bg-p-yellow text-coal",
  },
  mobile: {
    id: "mobile",
    label: "Mobile",
    chip: "border-coal bg-p-green text-coal",
  },
  cloud: {
    id: "cloud",
    label: "Cloud",
    chip: "border-coal bg-p-blue text-coal",
  },
  break: {
    id: "break",
    label: "Pausa",
    chip: "border-line-2 bg-transparent text-muted",
  },
  tbd: {
    id: "tbd",
    label: "Por anunciar",
    chip: "border-coal bg-h-yellow text-coal",
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
