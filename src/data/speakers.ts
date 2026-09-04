export type Speaker = {
  name: string;
  role: string;
  company: string;
  topic: string;
  /** Ruta a la foto en /public. Si está vacía se genera un avatar con iniciales. */
  photo?: string;
};

/** TODO: datos de ejemplo. Reemplazar con los speakers confirmados. */
export const speakers: Speaker[] = [
  {
    name: "Valeria Quispe",
    role: "Machine Learning Engineer",
    company: "Nubify",
    topic: "Agentes de IA en producción",
  },
  {
    name: "Diego Mamani",
    role: "Google Developer Expert · Web",
    company: "Kunan Labs",
    topic: "React Server Components",
  },
  {
    name: "Camila Rojas",
    role: "Lead Mobile Engineer",
    company: "Andes Software",
    topic: "Flutter multiplataforma",
  },
  {
    name: "Renzo Ticona",
    role: "Cloud Architect",
    company: "Sierra Cloud",
    topic: "Cloud Run + Firebase",
  },
  {
    name: "Ana Lucía Flores",
    role: "AI Developer Advocate",
    company: "Tacna Data",
    topic: "Workshop: agentes con Gemini",
  },
  {
    name: "Sofía Cárdenas",
    role: "Frontend Lead",
    company: "Altiplano",
    topic: "Core Web Vitals",
  },
  {
    name: "Jorge Huanca",
    role: "Android Engineer",
    company: "Vicuña",
    topic: "Kotlin Multiplatform",
  },
  {
    name: "Mateo Villanueva",
    role: "Developer Relations",
    company: "Pacífico Tech",
    topic: "Comunidad y open source",
  },
];
