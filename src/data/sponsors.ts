export type Sponsor = {
  name: string;
  /** Ruta dentro de /public. Ver README para el formato recomendado. */
  logo: string;
  url?: string;
};

/** Sponsors confirmados. Vacío ⇒ la sección muestra su estado "por confirmar". */
export const sponsors: Sponsor[] = [
  { name: "Universidad Tecnológica del Perú", logo: "/sponsors/utp.webp" },
];
