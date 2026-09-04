export type Plan = {
  id: string;
  badge: string;
  name: string;
  description: string;
  price: string;
  /** Precio tachado al lado, para mostrar el descuento de preventa. */
  compareAt?: string;
  priceNote: string;
  /** Etiqueta destacada sobre la tarjeta (ej. "Recomendado"). */
  highlight?: string;
  featured?: boolean;
  includesTitle: string;
  includes: string[];
  cta: string;
};

/** TODO: datos de ejemplo. Confirmar precio, cupos y beneficios reales. */
export const plans: Plan[] = [
  {
    id: "general",
    badge: "Entrada general",
    name: "Acceso a la conferencia",
    description:
      "Todo el track principal del día, sin costo. Es la entrada con la que la mayoría vive el DevFest.",
    price: "Gratis",
    priceNote: "Cupos por orden de registro",
    includesTitle: "Qué incluye:",
    includes: [
      "Acceso a todas las charlas del día",
      "Zona de sponsors y espacios de networking",
      "Kit de bienvenida y stickers de la comunidad",
      "Coffee break de la mañana",
      "Certificado digital de participación",
    ],
    cta: "Reserva tu lugar",
  },
  {
    id: "pro",
    badge: "Pase Pro",
    name: "Conferencia + workshop garantizado",
    description:
      "Para quienes vienen por el taller práctico y quieren el día resuelto de principio a fin.",
    price: "S/ 89",
    compareAt: "S/ 140",
    priceNote: "Precio de preventa hasta el 31 de octubre",
    highlight: "Recomendado",
    featured: true,
    includesTitle: "Todo lo de la entrada general, más:",
    includes: [
      "Cupo garantizado en el workshop práctico",
      "Almuerzo y coffee breaks incluidos",
      "Asiento preferente en el auditorio",
      "Polo de edición limitada DevFest Tacna 2026",
      "Afterparty con speakers y organizadores",
      "Certificado con horas acreditadas",
    ],
    cta: "Quiero el Pase Pro",
  },
];
