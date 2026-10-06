import { ArrowBold, Blob, Dots, GdgMark, Plus, Slashes } from "./glyphs";
import { site } from "@/lib/site";

/** Palabras y glifos que se alternan en la cinta. */
function Sequence() {
  const word =
    "text-[2rem] leading-none font-bold tracking-[-0.03em] whitespace-nowrap text-heading sm:text-[2.75rem]";
  const glyph = "h-8 w-auto sm:h-11";

  return (
    <div className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
      <span className={word}>DevFest</span>
      <Slashes className={glyph} />
      <span className={`${word} font-normal`}>{site.city}</span>
      <Blob className={glyph} />
      <span className={word}>2026</span>
      <ArrowBold className={glyph} />
      <span className={`${word} font-normal`}>{site.organizer}</span>
      <Plus className={glyph} />
      <span className={word}>#DevFest</span>
      <Dots className="h-5 w-auto sm:h-7" />
      <GdgMark className={glyph} />
    </div>
  );
}

/**
 * Cinta de stickers entre el hero y la agenda. Es decorativa: todo su texto ya
 * está en el hero. La secuencia va dos veces para que el bucle no tenga
 * costura (ver `.marquee-track` en globals.css).
 */
export function StickerStrip() {
  return (
    <div
      aria-hidden
      className="overflow-hidden border-y-2 border-ink bg-panel py-5 sm:py-6"
    >
      <div className="marquee-track">
        <Sequence />
        <Sequence />
      </div>
    </div>
  );
}
