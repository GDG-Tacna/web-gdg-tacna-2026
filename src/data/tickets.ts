export type Plan = {
  id: string;
  badge: string;
  name: string;
  description: string;
  price: string;
  priceNote: string;
  /** Etiqueta destacada sobre la tarjeta (ej. "Recomendado"). */
  highlight?: string;
  featured?: boolean;
  includesTitle: string;
  includes: string[];
  cta: string;
  /** Aclaración bajo el botón: adónde lleva o por qué no lleva a ningún lado. */
  ctaNote: string;
  /**
   * Destino del botón. Si falta, el botón queda inerte: todavía no hay dónde
   * registrarse para ese plan.
   */
  href?: string;
};

import { site } from "@/lib/site";

export const plans: Plan[] = [
  {
    id: "general",
    badge: "Entrada general",
    name: "Acceso a la conferencia",
    description:
      "Todo el track principal del día, sin costo. Es la entrada con la que la mayoría vive el DevFest.",
    price: "Gratis",
    priceNote: "Registro por Luma · cupos por orden de llegada",
    includesTitle: "Qué incluye:",
    includes: [
      "Acceso a todas las charlas del día",
      "Zona de sponsors y espacios de networking",
      // TODO: añadir el resto de beneficios cuando estén confirmados
      "Resto de beneficios por confirmar",
    ],
    cta: "Regístrate gratis",
    ctaNote: "El registro se completa en Luma.",
    href: site.registerUrl,
  },
  {
    id: "premium",
    badge: "Experiencia premium",
    name: "Llévate el merch del DevFest",
    description:
      "Un extra sobre la entrada general para quienes quieran llevarse un recuerdo del evento.",
    // TODO: definir precio y disponibilidad
    price: "TBD",
    priceNote: "Precio y disponibilidad por confirmar",
    highlight: "En preparación",
    featured: true,
    includesTitle: "Todo lo de la entrada general, más:",
    includes: [
      "Polo del DevFest Tacna 2026",
      "Bolsa de regalos de los sponsors",
      "Beneficios adicionales por confirmar",
    ],
    cta: "Contáctanos",
    ctaNote: "Se abre un chat de WhatsApp.",
    href: site.whatsappTickets,
  },
];
