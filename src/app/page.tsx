import { Agenda } from "@/components/Agenda";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Mascota } from "@/components/Mascota";
import { Navbar } from "@/components/Navbar";
import { Speakers } from "@/components/Speakers";
import { Sponsors } from "@/components/Sponsors";
import { StickerStrip } from "@/components/StickerStrip";
import { Tickets } from "@/components/Tickets";
import { Volunteers } from "@/components/Volunteers";

function Divider() {
  return (
    <div className="shell" aria-hidden>
      <div className="piso h-0.5 w-full bg-line" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StickerStrip />
        <Agenda />
        <Divider />
        <Speakers />
        <Divider />
        <Tickets />
        <Divider />
        <Volunteers />
        <Divider />
        <Sponsors />
      </main>
      <Footer />
      <Mascota />
    </>
  );
}
