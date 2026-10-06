"use client";

import { useSyncExternalStore } from "react";

type Parts = { dias: number; horas: number; min: number; seg: number };

function diff(target: number): Parts {
  const total = Math.max(0, target - Date.now());
  return {
    dias: Math.floor(total / 86_400_000),
    horas: Math.floor((total / 3_600_000) % 24),
    min: Math.floor((total / 60_000) % 60),
    seg: Math.floor((total / 1000) % 60),
  };
}

/** Reloj compartido: un único intervalo alimenta a todos los suscriptores. */
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

const getSnapshot = () => Math.floor(Date.now() / 1000);
// En el servidor no existe un "ahora" estable, así que se pinta un placeholder
// y el valor real aparece tras la hidratación.
const getServerSnapshot = () => null;

const labels: Record<keyof Parts, string> = {
  dias: "Días",
  horas: "Horas",
  min: "Min",
  seg: "Seg",
};

export function Countdown({ date }: { date: string }) {
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const parts = tick === null ? null : diff(new Date(date).getTime());

  return (
    <div
      className="flex items-center gap-1.5 sm:gap-2"
      role="timer"
      aria-live="off"
      aria-label="Cuenta regresiva para el evento"
    >
      {(Object.keys(labels) as (keyof Parts)[]).map((key, index) => (
        <div key={key} className="flex flex-1 items-center gap-1.5 sm:gap-2">
          <div className="flex-1 rounded-2xl border-2 border-ink bg-canvas px-2 py-2.5 text-center sm:py-3">
            <div className="text-2xl leading-none font-bold tabular-nums text-heading sm:text-[28px]">
              {parts ? String(parts[key]).padStart(2, "0") : "--"}
            </div>
            <div className="mt-1.5 font-mono text-[9px] font-semibold tracking-[0.12em] text-faint uppercase sm:text-[10px]">
              {labels[key]}
            </div>
          </div>
          {index < 3 && (
            <span aria-hidden className="text-lg font-bold text-heading">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
