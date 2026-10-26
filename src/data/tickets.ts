export type Plan = {
  id: string;
  badge: string;
  name: string;
  description: string;
  price: string;
  /** Precio anterior, tachado al lado. Para mostrar el descuento de preventa. */
  compareAt?: string;
  /** Opcional: aclaración bajo el precio, si hace falta alguna. */
  priceNote?: string;
  /** Etiqueta destacada sobre la tarjeta (ej. "Recomendado"). */
  highlight?: string;
  featured?: boolean;
  /**
   * Relleno de la tarjeta. Si es un color de la paleta (y no un token de
   * superficie), añadir `on-color`. Por defecto, la superficie del tema.
   */
  fill?: string;
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
    ],
    cta: "Regístrate gratis",
    ctaNote: "El registro se completa en Luma.",
    href: site.registerUrl,
  },
  {
    id: "pro",
    badge: "Entrada PRO",
    name: "Certifica tu participación",
    description:
      "La entrada general con certificado de participación, bolsa de regalos y sorteos. Para llevarte algo más que las charlas.",
    price: "S/ 19",
    priceNote: "Pago único · inscripción por WhatsApp",
    fill: "on-color bg-p-blue",
    includesTitle: "Qué incluye:",
    includes: [
      "Acceso a todas las charlas del día",
      "Zona de sponsors y espacios de networking",
      "Bolsa de regalos",
      "Obsequios y sorteos en el evento",
      "Certificado de participación",
    ],
    cta: "Contáctanos",
    ctaNote: "Se abre un chat de WhatsApp.",
    href: site.whatsappPro,
  },
  {
    id: "premium",
    badge: "Experiencia premium",
    name: "Llévate el merch del DevFest",
    description:
      "Un extra sobre la entrada general para quienes quieran llevarse un recuerdo del evento.",
    price: "S/ 59",
    priceNote: "Pago único · inscripción por WhatsApp",
    featured: true,
    fill: "on-color bg-p-yellow",
    includesTitle: "Qué incluye:",
    includes: [
      "Acceso a conferencias y talleres",
      "Desayuno y pausas para el café",
      "Almuerzo",
      "Polo del DevFest Tacna 2026",
      "Bolsa de regalos",
      "Obsequios y sorteos en el evento",
      "Certificado de participación",
    ],
    cta: "Contáctanos",
    ctaNote: "Se abre un chat de WhatsApp.",
    href: site.whatsappTickets,
  },
];
