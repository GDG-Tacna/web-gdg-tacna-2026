export type Sponsor = {
  name: string;
  logo: string;
  url?: string;
};

/** TODO: datos de ejemplo. Reemplazar con los sponsors confirmados. */
export const sponsors: Sponsor[] = [
  { name: "Nubify", logo: "/sponsors/nubify.svg" },
  { name: "Kunan Labs", logo: "/sponsors/kunan.svg" },
  { name: "Sierra Cloud", logo: "/sponsors/sierra.svg" },
  { name: "Andes Software", logo: "/sponsors/andes.svg" },
  { name: "Altiplano", logo: "/sponsors/altiplano.svg" },
  { name: "Vicuña", logo: "/sponsors/vicuna.svg" },
  { name: "Tacna Data", logo: "/sponsors/tacnadata.svg" },
  { name: "Pacífico Tech", logo: "/sponsors/pacifico.svg" },
];
