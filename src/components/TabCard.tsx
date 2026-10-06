import type { ReactNode } from "react";

type TabCardProps = {
  /** Contenido de la pestaña: una etiqueta corta. */
  tab: ReactNode;
  children: ReactNode;
  /**
   * Relleno compartido por la pestaña y el cuerpo. Tienen que coincidir para
   * que lean como una sola silueta. Si es un color de la paleta (y no un token
   * de superficie), añadir `on-color` para fijar el texto en tinta oscura.
   */
  fill?: string;
  className?: string;
  bodyClassName?: string;
};

/**
 * Tarjeta escalonada de la guía de marca: una pestaña arriba a la izquierda
 * pegada al cuerpo. La geometría vive en globals.css (`.tab-card*`).
 */
export function TabCard({
  tab,
  children,
  fill = "bg-panel",
  className = "",
  bodyClassName = "",
}: TabCardProps) {
  return (
    <div className={`tab-card ${className}`}>
      <div
        className={`tab-card-tab font-mono text-[11px] font-semibold tracking-[0.1em] text-heading uppercase ${fill}`}
      >
        {tab}
      </div>
      <div className={`tab-card-body ${fill} ${bodyClassName}`}>{children}</div>
    </div>
  );
}
