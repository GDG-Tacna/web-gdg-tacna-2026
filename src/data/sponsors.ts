export type Sponsor = {
  name: string;
  logo: string;
  url?: string;
};

/**
 * Sponsors confirmados. Mientras esté vacío, la sección muestra un estado "por
 * confirmar" y mantiene la invitación a patrocinar.
 */
export const sponsors: Sponsor[] = [];
