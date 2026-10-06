import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Imagen que aparece al compartir el enlace en WhatsApp, Telegram, X, LinkedIn
 * o Discord. Se genera en el build a partir de este JSX, así que cambia sola si
 * cambian la fecha o la sede en site.ts. Sigue el key art de la guía de marca
 * DevFest 2026: fondo off-white, lockup { DevFest } y píldoras con contorno.
 *
 * Ojo: esto lo renderiza Satori, no un navegador. Solo entiende un subconjunto
 * de CSS: nada de grid, y todo elemento con más de un hijo necesita
 * `display: flex` explícito. Tampoco resuelve variables CSS, así que los
 * colores van literales.
 *
 * Tampoco ve las fuentes de next/font: Google Sans se carga aquí desde
 * src/assets/fonts (recortes latinos de los TTF de Google Fonts, licencia
 * OFL). Solo hay dos pesos, 500 y 700; cualquier otro cae en el más cercano.
 */
export const alt = `${site.name} · ${site.organizer}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fuente = (archivo: string) =>
  readFile(join(process.cwd(), "src/assets/fonts", archivo));

const INK = "#1e1e1e";
const PAPER = "#f0f0f0";

/** Misma silueta que `Brace` en components/glyphs.tsx. */
const BRACE =
  "M36 2H27.5Q14.5 2 14.5 14.5V37Q14.5 44.5 8 44.5H6.5Q4 44.5 4 47V53Q4 55.5 6.5 55.5H8Q14.5 55.5 14.5 63V85.5Q14.5 98 27.5 98H36V87H29.5Q25.5 87 25.5 83V17Q25.5 13 29.5 13H36Z";

function Brace({ close = false }: { close?: boolean }) {
  return (
    <svg width="92" height="230" viewBox="0 0 40 100">
      <path
        d={BRACE}
        fill="#c3ecf6"
        stroke={INK}
        strokeWidth="1.3"
        strokeLinejoin="round"
        transform={close ? "matrix(-1 0 0 1 40 0)" : undefined}
      />
    </svg>
  );
}

function GdgMark() {
  const bar = { y: 10, width: 30, height: 12, rx: 6, stroke: INK, strokeWidth: 1.2 };
  return (
    <svg width="99" height="44" viewBox="0 0 72 32">
      <rect {...bar} x={3} fill="#ea4335" transform="rotate(-32 9 16)" />
      <rect {...bar} x={3} fill="#4285f4" transform="rotate(32 9 16)" />
      <rect {...bar} x={39} fill="#f9ab00" transform="rotate(-32 63 16)" />
      <rect {...bar} x={39} fill="#34a853" transform="rotate(32 63 16)" />
    </svg>
  );
}

export default async function OpenGraphImage() {
  const [medium, bold] = await Promise.all([
    fuente("GoogleSans-Medium.ttf"),
    fuente("GoogleSans-Bold.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          backgroundColor: PAPER,
          color: INK,
          fontFamily: "Google Sans",
          fontWeight: 500,
        }}
      >
        {/* Marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <GdgMark />
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 5 }}>
            {`${site.organizer.toUpperCase()} PRESENTA`}
          </div>
        </div>

        {/* Lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Brace />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                display: "flex",
                fontSize: 158,
                fontWeight: 700,
                letterSpacing: -7,
                lineHeight: 0.92,
              }}
            >
              DevFest
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "12px 0",
                border: `4px solid ${INK}`,
                borderRadius: 60,
                backgroundColor: "#ffffff",
                fontSize: 36,
              }}
            >
              {site.city}
            </div>
          </div>
          <Brace close />
          <div
            style={{
              display: "flex",
              flexShrink: 0,
              marginLeft: 20,
              padding: "12px 32px",
              border: `4px solid ${INK}`,
              borderRadius: 80,
              backgroundColor: "#f9ab00",
              fontSize: 56,
            }}
          >
            2026
          </div>
        </div>

        {/* Cuándo y dónde */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 30,
          }}
        >
          <div style={{ display: "flex" }}>{site.dateLabel}</div>
          <div style={{ display: "flex", color: "rgba(30,30,30,0.4)" }}>·</div>
          <div style={{ display: "flex" }}>{site.venue}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Google Sans", data: medium, style: "normal", weight: 500 },
        { name: "Google Sans", data: bold, style: "normal", weight: 700 },
      ],
    },
  );
}
