export type TrackId = "keynote" | "charla" | "break" | "cierre";

export type Track = {
  id: TrackId;
  label: string;
  /**
   * Clases tailwind del chip del track. Los pasteles siguen los stickers de
   * track de la guía de marca y llevan el texto en `coal`, que no cambia con
   * el tema.
   */
  chip: string;
};

export const tracks: Record<TrackId, Track> = {
  keynote: {
    id: "keynote",
    label: "Keynote",
    chip: "border-ink bg-solid text-on-solid",
  },
  charla: {
    id: "charla",
    label: "Charla",
    chip: "border-coal bg-p-blue text-coal",
  },
  break: {
    id: "break",
    label: "Pausa",
    chip: "border-line-2 bg-transparent text-muted",
  },
  cierre: {
    id: "cierre",
    label: "Cierre",
    chip: "border-coal bg-p-green text-coal",
  },
};

export type AgendaItem = {
  time: string;
  duration?: string;
  title: string;
  /** Opcional: el programa oficial no trae resumen de cada charla. */
  description?: string;
  track: TrackId;
  room?: string;
  speaker?: { name: string; role?: string };
};

/** Programa oficial del día. */
export const agenda: AgendaItem[] = [
  {
    time: "09:00",
    duration: "15 min",
    title: "Keynote de apertura",
    track: "keynote",
    room: "Auditorio principal",
    speaker: { name: "Equipo GDG Tacna" },
  },
  {
    time: "09:15",
    duration: "40 min",
    title: "Construya su primer agente de IA con Genkit",
    track: "charla",
    room: "Auditorio principal",
    speaker: { name: "Luis Eduardo", role: "GDE Firebase" },
  },
  {
    time: "10:00",
    duration: "40 min",
    title: "Desarrollo de videojuegos y financiamiento de proyectos",
    track: "charla",
    room: "Auditorio principal",
    speaker: { name: "Rafael Gonzalez-Otoya B." },
  },
  {
    time: "10:40",
    duration: "15 min",
    title: "Pausa para el café",
    track: "break",
    room: "Vestíbulo principal",
    speaker: { name: "Equipo GDG Tacna" },
  },
  {
    time: "10:55",
    duration: "40 min",
    title: "¿Y si la AI dibujara la pantalla?",
    track: "charla",
    room: "Auditorio principal",
    speaker: { name: "Jimy Huacho Dolores", role: "GDE Angular" },
  },
  {
    time: "11:40",
    duration: "40 min",
    title: "Automatización inteligente: GitHub Actions + Firebase",
    track: "charla",
    room: "Auditorio principal",
    speaker: { name: "Eduardo Ormeño Meneses" },
  },
  {
    time: "12:20",
    duration: "90 min",
    title: "Almuerzo / networking",
    track: "break",
    room: "Área de networking",
    speaker: { name: "Equipo GDG Tacna" },
  },
  {
    time: "13:50",
    duration: "40 min",
    title:
      "Del Vibe Coding al SDD: Cómo construir Web Apps robustas con Firebase Genkit, Gemini y Devin",
    track: "charla",
    room: "Auditorio principal",
    speaker: { name: "Homer López Vidal" },
  },
  {
    time: "14:35",
    duration: "40 min",
    title:
      "¿Podemos construir JARVIS hoy? Voz con Gemini Live, decisiones con JEV y Computer Use",
    track: "charla",
    room: "Auditorio principal",
    speaker: { name: "Jefferson Alfonso Vargas Espinoza" },
  },
  {
    time: "15:20",
    duration: "40 min",
    title: "Agentic Software",
    track: "charla",
    room: "Auditorio principal",
    speaker: { name: "Juan Carlos Romaina" },
  },
  {
    time: "16:00",
    duration: "60 min",
    title: "Cierre y networking final",
    track: "cierre",
    room: "Auditorio principal / vestíbulo",
  },
];

/**
 * Tracks que no generan filtro propio: ahora mismo, todos. El evento es de una
 * sola sala y estos tipos describen el formato del bloque (keynote, charla,
 * pausa), no su temática, así que filtrar por ellos no ayudaría a elegir.
 * Si algún día se clasifican las charlas por tema —IA, web, cloud…—, basta con
 * añadir esos tracks y dejarlos fuera de esta lista: la fila de filtros, el
 * estado activo y el filtrado vuelven solos.
 */
const sinFiltro: TrackId[] = ["keynote", "charla", "break", "cierre"];

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
