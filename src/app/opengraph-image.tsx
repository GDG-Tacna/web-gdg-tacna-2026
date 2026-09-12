import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Imagen que aparece al compartir el enlace en WhatsApp, Telegram, X, LinkedIn
 * o Discord. Se genera en el build a partir de este JSX, así que cambia sola si
 * cambian la fecha o la sede en site.ts.
 *
 * Ojo: esto lo renderiza Satori, no un navegador. Solo entiende un subconjunto
 * de CSS: nada de grid, y todo elemento con más de un hijo necesita
 * `display: flex` explícito.
 */
export const alt = `${site.name} · ${site.organizer}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const puntos = ["#4285f4", "#ea4335", "#fbbc04", "#34a853"];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#05060b",
          backgroundImage:
            "radial-gradient(circle at 15% 12%, rgba(66,133,244,0.38), transparent 45%), radial-gradient(circle at 88% 10%, rgba(139,92,246,0.42), transparent 45%), radial-gradient(circle at 65% 105%, rgba(52,168,83,0.30), transparent 50%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {puntos.map((color) => (
              <div
                key={color}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 22,
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 7,
              color: "rgba(255,255,255,0.62)",
            }}
          >
            {`${site.organizer.toUpperCase()} PRESENTA`}
          </div>
        </div>

        {/* Título */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 1.02,
            }}
          >
            DevFest
          </div>
          <div
            style={{
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -5,
              lineHeight: 1.02,
            }}
          >
            Tacna 2026
          </div>
          <div
            style={{
              width: 420,
              height: 12,
              marginTop: 22,
              borderRadius: 12,
              backgroundImage:
                "linear-gradient(90deg, #4285f4, #8b5cf6 55%, #34a853)",
            }}
          />
        </div>

        {/* Cuándo y dónde */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 30,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          <div style={{ display: "flex" }}>{site.dateLabel}</div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.3)" }}>
            ·
          </div>
          <div style={{ display: "flex" }}>{site.venue}</div>
        </div>
      </div>
    ),
    size,
  );
}
