export type Speaker = {
  name: string;
  role: string;
  company: string;
  topic: string;
  /** Ruta a la foto en /public. Si está vacía se genera un avatar con iniciales. */
  photo?: string;
};

/**
 * Line-up sin confirmar. Cada entrada va escrita por separado para poder ir
 * reemplazándolas de una en una según se confirmen. Si se vacía el array, la
 * sección pasa sola a su estado "por confirmar".
 */
export const speakers: Speaker[] = [
  { name: "TBD", role: "Lorem Ipsum", company: "TBD", topic: "Lorem Ipsum" },
  { name: "TBD", role: "Lorem Ipsum", company: "TBD", topic: "Lorem Ipsum" },
  { name: "TBD", role: "Lorem Ipsum", company: "TBD", topic: "Lorem Ipsum" },
  { name: "TBD", role: "Lorem Ipsum", company: "TBD", topic: "Lorem Ipsum" },
  { name: "TBD", role: "Lorem Ipsum", company: "TBD", topic: "Lorem Ipsum" },
  { name: "TBD", role: "Lorem Ipsum", company: "TBD", topic: "Lorem Ipsum" },
  { name: "TBD", role: "Lorem Ipsum", company: "TBD", topic: "Lorem Ipsum" },
  { name: "TBD", role: "Lorem Ipsum", company: "TBD", topic: "Lorem Ipsum" },
];
