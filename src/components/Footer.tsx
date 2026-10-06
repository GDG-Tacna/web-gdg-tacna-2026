import { Logo } from "./Logo";
import { ArrowBold, Asterisk, GdgMark } from "./glyphs";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative border-t-2 border-ink pt-14 pb-10 sm:pt-20">
      <div className="shell">
        {/* Key art horizontal de la guía: flecha, wordmark, año, asterisco y GDG. */}
        <div
          aria-hidden
          className="flex flex-wrap items-center gap-x-[0.22em] gap-y-4 text-[clamp(2.25rem,9.6vw,8.25rem)] font-bold text-heading"
        >
          <ArrowBold
            fill="var(--color-p-blue)"
            className="sticker h-[0.62em] w-auto"
          />
          <span className="leading-[0.9] tracking-[-0.045em]">DevFest</span>
          <span className="rounded-full border-2 border-ink bg-panel px-[0.7em] py-[0.3em] text-[0.3em] leading-none font-medium tracking-normal">
            2026
          </span>
          <Asterisk className="turn-slow size-[0.55em]" />
          <GdgMark className="sticker h-[0.5em] w-auto" />
        </div>

        <div className="mt-14 flex flex-col gap-12 border-t-2 border-line pt-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-[14px] leading-relaxed text-muted">
              {site.tagline}. Organizado por {site.organizer}, parte de la red
              global de Google Developer Groups.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h3 className="font-mono text-[11px] font-semibold tracking-[0.12em] text-faint uppercase">
                Evento
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-[14px] text-body underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-heading hover:decoration-g-yellow"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-[11px] font-semibold tracking-[0.12em] text-faint uppercase">
                Comunidad
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] text-body underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:text-heading hover:decoration-g-yellow"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t-2 border-line pt-6 font-mono text-[11.5px] text-faint sm:flex-row">
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
