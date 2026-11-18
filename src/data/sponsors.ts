export type SponsorFrame = "plain" | "square" | "circle";

export type Sponsor = {
  name: string;
  /** Ruta dentro de /public. Ver README para el formato recomendado. */
  logo: string;
  /** Estilo del contenedor según la geometría del logo ("plain" por defecto). */
  frame?: SponsorFrame;
  url?: string;
};

/** Sponsors confirmados. Vacío ⇒ la sección muestra su estado "por confirmar". */
export const sponsors: Sponsor[] = [
  { name: "Universidad Tecnológica del Perú", logo: "/sponsors/utp.webp" },
  { name: "JetBrains", logo: "/sponsors/jetbrains.svg" },
  { name: "Blu Café", logo: "/sponsors/blu-cafe.jpeg", frame: "circle" },
  { name: "Bub-ble Tea", logo: "/sponsors/bub-ble-tea.jpeg", frame: "square" },
  {
    name: "The Dome Scoop Store",
    logo: "/sponsors/dome-scoop-store.jpeg",
    frame: "square",
  },
  { name: "HERZ", logo: "/sponsors/herz.jpeg", frame: "square" },
  { name: "MUSO", logo: "/sponsors/muso.jpeg", frame: "square" },
  { name: "Louis3D", logo: "/sponsors/louis-3d.jpeg", frame: "square" },
  { name: "Mijo Store", logo: "/sponsors/logo-mijo-store.png", frame: "square" },
];
