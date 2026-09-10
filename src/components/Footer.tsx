import type { CSSProperties } from "react";
import { Logo } from "./Logo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-16 pb-10">
      <div
        aria-hidden
        className="aurora pointer-events-none -top-72 left-1/2 size-[52rem] -translate-x-1/2"
        style={
          { "--aurora-rgb": "66 133 244", "--aurora-a": 0.1 } as CSSProperties
        }
      />

      <div className="shell relative">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-[13.5px] leading-relaxed text-muted">
              {site.tagline}. Organizado por {site.organizer}, parte de la red
              global de Google Developer Groups.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h3 className="text-[10px] font-semibold tracking-[0.2em] text-faint uppercase">
                Evento
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-[13.5px] text-muted transition-colors hover:text-heading"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[10px] font-semibold tracking-[0.2em] text-faint uppercase">
                Comunidad
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13.5px] text-muted transition-colors hover:text-heading"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="hairline mt-14 h-px w-full" />

        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-[12px] text-faint sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.organizer}. Hecho con cariño por
            la comunidad.
          </p>
          <p>
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-body"
            >
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
