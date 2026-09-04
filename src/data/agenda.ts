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

/** TODO: datos de ejemplo. Reemplazar con la agenda oficial. */
export const agenda: AgendaItem[] = [
  {
    time: "09:00",
    duration: "30 min",
    title: "Registro y bienvenida",
    description: "Acreditación, café de cortesía y networking de apertura.",
    track: "break",
    room: "Hall principal",
  },
  {
    time: "09:30",
    duration: "20 min",
    title: "Apertura: la comunidad tech de Tacna",
    description:
      "Bienvenida al DevFest Tacna 2026 y un vistazo a lo que viene para la comunidad este año.",
    track: "keynote",
    room: "Auditorio A",
    speaker: { name: "Equipo GDG Tacna", role: "Organizadores" },
  },
  {
    time: "09:50",
    duration: "40 min",
    title: "Agentes de IA en producción: del prototipo al usuario real",
    description:
      "Arquitecturas, costos y guardrails para llevar un agente LLM de la demo al día a día de tu producto.",
    track: "ia",
    room: "Auditorio A",
    speaker: { name: "Valeria Quispe", role: "ML Engineer · Nubify" },
  },
  {
    time: "10:30",
    duration: "40 min",
    title: "React Server Components sin dolor",
    description:
      "Qué cambia realmente en tu arquitectura front-end y cómo migrar una app existente por partes.",
    track: "web",
    room: "Auditorio A",
    speaker: { name: "Diego Mamani", role: "GDE Web · Kunan Labs" },
  },
  {
    time: "11:10",
    duration: "20 min",
    title: "Pausa para el café",
    description: "Networking, stands de sponsors y fotos con la comunidad.",
    track: "break",
    room: "Hall principal",
  },
  {
    time: "11:30",
    duration: "40 min",
    title: "Flutter multiplataforma: una base de código, cinco pantallas",
    description:
      "Estrategias de diseño adaptativo para móvil, tablet, web y escritorio sin duplicar trabajo.",
    track: "mobile",
    room: "Auditorio A",
    speaker: { name: "Camila Rojas", role: "Lead Mobile · Andes Software" },
  },
  {
    time: "12:10",
    duration: "40 min",
    title: "Cloud Run + Firebase: infra que escala mientras duermes",
    description:
      "Un backend serverless completo, con observabilidad y despliegue continuo, explicado paso a paso.",
    track: "cloud",
    room: "Auditorio A",
    speaker: { name: "Renzo Ticona", role: "Cloud Architect · Sierra Cloud" },
  },
  {
    time: "12:50",
    duration: "60 min",
    title: "Almuerzo libre",
    description: "Recomendaciones de la organización y mapa de la zona.",
    track: "break",
    room: "Campus UTP",
  },
  {
    time: "14:00",
    duration: "90 min",
    title: "Workshop: construye tu primer agente con Gemini",
    description:
      "Taller práctico. Trae tu laptop: saldrás con un agente funcionando y desplegado.",
    track: "ia",
    room: "Laboratorio 2",
    speaker: { name: "Ana Lucía Flores", role: "AI Advocate · Tacna Data" },
  },
  {
    time: "15:30",
    duration: "40 min",
    title: "Core Web Vitals: performance que el usuario sí nota",
    description:
      "Cómo medir, priorizar y arreglar lo que realmente mueve la aguja en tu producto web.",
    track: "web",
    room: "Auditorio A",
    speaker: { name: "Sofía Cárdenas", role: "Frontend Lead · Altiplano" },
  },
  {
    time: "16:10",
    duration: "20 min",
    title: "Pausa de la tarde",
    description: "Último round de networking antes del cierre.",
    track: "break",
    room: "Hall principal",
  },
  {
    time: "16:30",
    duration: "30 min",
    title: "Kotlin Multiplatform en equipos pequeños",
    description:
      "Cómo un equipo de tres personas mantiene apps Android e iOS compartiendo el 70% del código.",
    track: "mobile",
    room: "Auditorio A",
    speaker: { name: "Jorge Huanca", role: "Android Engineer · Vicuña" },
  },
  {
    time: "17:00",
    duration: "30 min",
    title: "Keynote de clausura, premios y cierre",
    description:
      "Resumen del día, sorteos con los sponsors y foto oficial de la comunidad.",
    track: "keynote",
    room: "Auditorio A",
    speaker: { name: "Equipo GDG Tacna", role: "Organizadores" },
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
