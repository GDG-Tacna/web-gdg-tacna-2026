import type { Metadata, Viewport } from "next";
import { Google_Sans, Google_Sans_Code } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Las tipografías de la guía de marca DevFest 2026: Google Sans para todo y
// una monoespaciada para etiquetas y horas.
//
// Next avisa al compilar de que no tiene métricas para generar la fuente de
// respaldo de estas dos familias ("Failed to find font override values"). Es
// inofensivo: solo significa que el respaldo no va ajustado al ancho real.
const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  display: "swap",
});

const googleSansCode = Google_Sans_Code({
  variable: "--font-google-sans-code",
  subsets: ["latin"],
  display: "swap",
});

const titulo = `${site.name}`;

export const metadata: Metadata = {
  // Sin metadataBase, Next no puede convertir en absolutas las URLs de las
  // etiquetas Open Graph, y WhatsApp o Telegram no resuelven rutas relativas.
  metadataBase: new URL(site.url),
  title: titulo,
  description: site.description,
  keywords: [
    "DevFest",
    "GDG Tacna",
    "Tacna",
    "Perú",
    "Google Developer Groups",
    "conferencia tech",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: titulo,
    description: site.description,
    url: "/",
    siteName: site.name,
    locale: "es_PE",
    type: "website",
    // La imagen la aporta app/opengraph-image.tsx; Next la añade sola.
  },
  twitter: {
    card: "summary_large_image",
    title: titulo,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0f0f0" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1e1e" },
  ],
};

/**
 * Se ejecuta antes de pintar. Hace tres cosas:
 *
 * 1. Aplica el tema guardado (o el del sistema) para que la página no aparezca
 *    en claro y salte a oscuro.
 * 2. Si la mascota se ocultó en esta sesión, marca <html class="sin-mascota">
 *    para que no llegue a pintarse (ver components/Mascota.tsx).
 * 3. Marca <html class="js"> y monta el observador del reveal. Va aquí y no en
 *    React a propósito: el CSS oculta los bloques con `.js .reveal`, así que si
 *    esperáramos a la hidratación, en un móvil con red lenta la página se vería
 *    vacía durante segundos. Así aparecen en cuanto se parsea el HTML, y si el
 *    JS falla del todo el contenido nunca llega a ocultarse.
 */
const bootScript = `
try {
  var stored = localStorage.getItem('theme');
  var dark = stored ? stored === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
} catch (e) {}

try {
  if (sessionStorage.getItem('mascota') === 'oculta') {
    document.documentElement.classList.add('sin-mascota');
  }
} catch (e) {}

document.documentElement.classList.add('js');

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null;

  function show(el) { el.classList.add('is-visible'); }

  function track(root) {
    var nodes = root.querySelectorAll('.reveal');
    for (var i = 0; i < nodes.length; i++) {
      if (io) io.observe(nodes[i]); else show(nodes[i]);
    }
  }

  function start() {
    if (!reduce && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            show(entries[i].target);
            io.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    }
    track(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${googleSans.variable} ${googleSansCode.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
