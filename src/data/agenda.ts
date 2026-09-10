export type TrackId = "keynote" | "ia" | "web" | "mobile" | "cloud" | "break";

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
};

export type AgendaItem = {
  time: string;
  duration: string;
  title: string;
  description: string;
  track: TrackId;
  room?: string;
  speaker?: { name: string; role: string };
};

/**
 * Estructura del día con el contenido sin confirmar.
 *
 * Las horas, duraciones y tracks son la maqueta real; los títulos,
 * descripciones, speakers y salas son placeholder a propósito. Todas las
 * charlas comparten el mismo texto para que se distinga de un vistazo lo que
 * falta por completar; las pausas sí llevan su nombre real porque son bloques
 * ciertos del día. Si se vacía el array, la sección pasa sola a su estado
 * "por confirmar".
 */
const TITULO = "Lorem ipsum dolor sit amet";
const DESCRIPCION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.";

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
    duration: "20 min",
    title: TITULO,
    description: DESCRIPCION,
    track: "keynote",
    room: "TBD",
    speaker: { name: "TBD", role: "TBD" },
  },
  {
    time: "09:50",
    duration: "40 min",
    title: TITULO,
    description: DESCRIPCION,
    track: "ia",
    room: "TBD",
    speaker: { name: "TBD", role: "TBD" },
  },
  {
    time: "10:30",
    duration: "40 min",
    title: TITULO,
    description: DESCRIPCION,
    track: "web",
    room: "TBD",
    speaker: { name: "TBD", role: "TBD" },
  },
  {
    time: "11:10",
    duration: "20 min",
    title: "Pausa para el café",
    description: "Networking y stands de sponsors.",
    track: "break",
    room: "TBD",
  },
  {
    time: "11:30",
    duration: "40 min",
    title: TITULO,
    description: DESCRIPCION,
    track: "mobile",
    room: "TBD",
    speaker: { name: "TBD", role: "TBD" },
  },
  {
    time: "12:10",
    duration: "40 min",
    title: TITULO,
    description: DESCRIPCION,
    track: "cloud",
    room: "TBD",
    speaker: { name: "TBD", role: "TBD" },
  },
  {
    time: "12:50",
    duration: "60 min",
    title: "Almuerzo",
    description: "Pausa para almorzar.",
    track: "break",
    room: "TBD",
  },
  {
    time: "14:00",
    duration: "90 min",
    title: TITULO,
    description: DESCRIPCION,
    track: "ia",
    room: "TBD",
    speaker: { name: "TBD", role: "TBD" },
  },
  {
    time: "15:30",
    duration: "40 min",
    title: TITULO,
    description: DESCRIPCION,
    track: "web",
    room: "TBD",
    speaker: { name: "TBD", role: "TBD" },
  },
  {
    time: "16:10",
    duration: "20 min",
    title: "Pausa de la tarde",
    description: "Último espacio de networking antes del cierre.",
    track: "break",
    room: "TBD",
  },
  {
    time: "16:30",
    duration: "30 min",
    title: TITULO,
    description: DESCRIPCION,
    track: "mobile",
    room: "TBD",
    speaker: { name: "TBD", role: "TBD" },
  },
  {
    time: "17:00",
    duration: "30 min",
    title: TITULO,
    description: DESCRIPCION,
    track: "keynote",
    room: "TBD",
    speaker: { name: "TBD", role: "TBD" },
  },
];

export const filters: { id: TrackId | "all"; label: string }[] = [
  { id: "all", label: "Todo el día" },
  { id: "keynote", label: "Keynotes" },
  { id: "ia", label: "IA" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "cloud", label: "Cloud" },
];
