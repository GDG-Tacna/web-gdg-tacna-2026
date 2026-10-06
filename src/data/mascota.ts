import { agenda } from "./agenda";
import { speakers } from "./speakers";
import { sponsors } from "./sponsors";
import { plans } from "./tickets";
import { site } from "@/lib/site";

export type Dato = {
  texto: string;
  /** Enlace opcional bajo el dato, para quien quiera actuar en el momento. */
  enlace?: { label: string; href: string };
};

const formato = new Intl.ListFormat("es", { type: "conjunction" });
const lista = (items: readonly string[]) => formato.format(items);
/** Para meter un rótulo ("Almuerzo") en mitad de una frase. */
const minuscula = (texto: string) => texto.charAt(0).toLowerCase() + texto.slice(1);

function trozos<T>(items: readonly T[], tamano: number): T[][] {
  const salida: T[][] = [];
  for (let i = 0; i < items.length; i += tamano) {
    salida.push(items.slice(i, i + tamano));
  }
  return salida;
}

const DIA = 86_400_000;

/**
 * Lo que cuenta la mascota al pulsarla. Todo sale de `site.ts` y de los demás
 * archivos de datos: aquí no se escribe ningún dato del evento, solo la frase
 * que lo envuelve. Así la mascota no puede quedarse diciendo algo distinto de
 * lo que dice la página, y lo que sigue sin confirmar (TBD, lorem) no aparece
 * hasta que se rellene.
 *
 * Recibe el instante actual porque la cuenta regresiva depende de él: se llama
 * al pulsar, nunca durante el render.
 */
export function datosMascota(ahora: number): Dato[] {
  const datos: Dato[] = [];

  const falta = new Date(site.date).getTime() - ahora;
  if (falta > 0) {
    const dias = Math.ceil(falta / DIA);
    datos.push({
      texto:
        dias > 1
          ? `Faltan ${dias} días para el ${site.name}.`
          : `Falta menos de un día para el ${site.name}.`,
      enlace: { label: "Regístrate", href: site.registerUrl },
    });
  }

  datos.push(
    { texto: `Nos vemos el ${minuscula(site.dateLabel)}.` },
    { texto: `Horario: ${site.timeLabel}` },
    { texto: `Sede: ${site.venue}. ${site.venueDetail}.` },
    { texto: `${site.name}: ${minuscula(site.tagline)}.` },
  );

  const general = plans.find((plan) => plan.id === "general");
  if (general) {
    datos.push({
      texto: `${general.badge}: ${general.price}. ${general.priceNote}.`,
      enlace: general.href ? { label: general.cta, href: general.href } : undefined,
    });
  }

  // De la premium solo lo que incluye. El precio y la fecha de preventa se
  // quedan en la tarjeta de entradas, que es donde se mantienen al día.
  const premium = plans.find((plan) => plan.id === "premium");
  if (premium) {
    for (const grupo of trozos(premium.includes, 3)) {
      datos.push({
        texto: `La ${minuscula(premium.badge)} incluye ${lista(grupo.map(minuscula))}.`,
        enlace: premium.href ? { label: premium.cta, href: premium.href } : undefined,
      });
    }
  }

  const cifras = site.stats.filter((stat) => /\d/.test(stat.value));
  if (cifras.length > 0) {
    datos.push({
      texto: `En números: ${lista(cifras.map((stat) => `${stat.value} ${minuscula(stat.label)}`))}.`,
    });
  }

  const charlas = agenda.filter((item) => item.track !== "break" && item.track !== "tbd");
  for (const charla of charlas) {
    datos.push({ texto: `A las ${charla.time}: ${charla.title}.` });
  }

  const confirmados = speakers.filter((speaker) => speaker.name !== "TBD");
  for (const speaker of confirmados) {
    datos.push({ texto: `${speaker.name} (${speaker.company}) viene con: ${speaker.topic}.` });
  }

  if (sponsors.length > 0) {
    datos.push({
      texto: `Gracias a ${lista(sponsors.map((sponsor) => sponsor.name))} por sumarse como sponsors.`,
    });
  }

  datos.push(
    {
      texto: "Buscamos voluntarios para el día del evento. No necesitas experiencia previa.",
      enlace: { label: "Quiero ser voluntario", href: site.volunteerUrl },
    },
    {
      texto: "¿Tu empresa quiere patrocinar el DevFest? Escríbenos.",
      enlace: { label: "Abrir WhatsApp", href: site.whatsappSponsors },
    },
    { texto: `Sigue a ${site.organizer} en ${lista(site.socials.map((social) => social.label))}.` },
    {
      texto: `¿Dudas? Escríbenos a ${site.email}.`,
      enlace: { label: "Enviar correo", href: `mailto:${site.email}` },
    },
  );

  return datos;
}
