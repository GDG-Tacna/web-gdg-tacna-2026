/**
 * Datos centrales del evento. Lo que aún no está confirmado se deja como TBD
 * a propósito: es preferible un hueco visible a un dato inventado que se
 * publique sin querer.
 */
/** wa.me quiere el número sin "+" ni espacios: código de país pegado. */
const whatsapp = (numero: string, mensaje: string) =>
  `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

export const site = {
  name: "DevFest Tacna 2026",
  organizer: "GDG Tacna",
  tagline: "El festival de tecnología más grande del sur del Perú",
  description:
    "Un día completo de charlas, workshops y networking con la comunidad de desarrolladores de Tacna. Aprende de expertos de la industria y lleva tus habilidades al siguiente nivel.",
  // TODO: confirmar fecha y hora oficiales
  date: "2026-11-21T09:00:00-05:00",
  dateLabel: "Sábado 21 de noviembre, 2026",
  dateShort: "21 NOV 2026",
  timeLabel: "09:00 a. m. — 05:00 p. m.",
  venue: "Universidad Tecnológica del Perú",
  venueDetail: "Campus Tacna · Auditorio principal",
  city: "Tacna, Perú",
  email: "gdgtkn@gmail.com",

  /** Registro de asistentes. */
  registerUrl: "https://luma.com/obkfa9kb",
  /** Postulación para voluntarios del evento. */
  volunteerUrl: "https://forms.gle/axZJUhvVZXLK9T1JA",
  /** Consultas sobre la experiencia premium. */
  whatsappTickets: whatsapp(
    "51952719643",
    "Hola, quiero información sobre la experiencia premium del DevFest Tacna 2026.",
  ),
  /** Consultas de empresas que quieran patrocinar. */
  whatsappSponsors: whatsapp(
    "51970200083",
    "Hola, quiero información para patrocinar el DevFest Tacna 2026.",
  ),

  /** Redes de la comunidad. Añadir aquí las que falten. */
  socials: [
    { label: "TikTok", href: "https://www.tiktok.com/@gdgtacna" },
    { label: "Instagram", href: "https://www.instagram.com/gdgtacna" },
    { label: "YouTube", href: "https://www.youtube.com/@gdgtacna" },
  ],
  stats: [
    { value: "250+", label: "Asistentes esperados" },
    { value: "TBD", label: "Charlas y talleres" },
    { value: "TBD", label: "Speakers invitados" },
    { value: "Gratis", label: "Entrada general" },
  ],
  nav: [
    { href: "#agenda", label: "Agenda" },
    { href: "#speakers", label: "Speakers" },
    { href: "#entradas", label: "Entradas" },
    { href: "#voluntarios", label: "Voluntarios" },
    { href: "#sponsors", label: "Sponsors" },
  ],
} as const;
