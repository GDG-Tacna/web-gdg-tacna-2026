/**
 * Datos centrales del evento. Todo lo que hoy es placeholder está marcado con
 * TODO para reemplazarlo cuando tengamos la información oficial.
 */
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
  email: "team@gdgtacna.com",
  stats: [
    { value: "250+", label: "Asistentes esperados" },
    { value: "12", label: "Charlas y talleres" },
    { value: "10+", label: "Speakers invitados" },
    { value: "Gratis", label: "Entrada general" },
  ],
  nav: [
    { href: "#agenda", label: "Agenda" },
    { href: "#speakers", label: "Speakers" },
    { href: "#entradas", label: "Entradas" },
    { href: "#sponsors", label: "Sponsors" },
  ],
} as const;
