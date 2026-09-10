import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} · ${site.organizer}`,
  description: site.description,
  keywords: [
    "DevFest",
    "GDG Tacna",
    "Tacna",
    "Perú",
    "Google Developer Groups",
    "conferencia tech",
  ],
  openGraph: {
    title: `${site.name} · ${site.organizer}`,
    description: site.description,
    locale: "es_PE",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#05060b" },
  ],
};

/**
 * Se ejecuta antes de pintar. Hace dos cosas:
 *
 * 1. Aplica el tema guardado (o el del sistema) para que la página no aparezca
 *    en claro y salte a oscuro.
 * 2. Marca <html class="js"> y monta el observador del reveal. Va aquí y no en
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
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
