export type Speaker = {
  name: string;
  /** Opcionales: la tarjeta omite los que falten en vez de pintar un hueco. */
  role?: string;
  company?: string;
  topic?: string;
  /** Ruta a la foto en /public. Si falta se genera un avatar con iniciales. */
  photo?: string;
  /**
   * `object-position` del recorte. Las fotos llegan con encuadres muy distintos
   * y la tarjeta es 4:5, así que en las apaisadas un recorte centrado parte la
   * cara. Se deja vacío cuando el centro funciona.
   */
  focus?: string;
};

/**
 * Line-up. Falta por confirmar el cargo y el tema de cada uno: esos campos se
 * quedan fuera hasta tenerlos, en vez de rellenarlos con texto de ejemplo.
 */
export const speakers: Speaker[] = [
  { name: "Jefferson Vargas", photo: "/speakers/invitado-01.png" },
  { name: "Luis Eduardo", photo: "/speakers/invitado-02.png" },
  { name: "Jimy Dolores", photo: "/speakers/invitado-03.png" },
  {
    name: "Eduardo Ormeño",
    photo: "/speakers/invitado-04.jpeg",
    // Foto 16:9 con el ponente a la izquierda del atril.
    focus: "32% center",
  },
  { name: "Homer López", photo: "/speakers/invitado-05.jpeg" },
  {
    name: "Rafael Gonzalez",
    photo: "/speakers/invitado-06.jpeg",
    // Selfie 4:3 con la cara pegada al borde derecho.
    focus: "85% center",
  },
];
