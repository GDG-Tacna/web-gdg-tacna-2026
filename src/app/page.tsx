import { Agenda } from "@/components/Agenda";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Speakers } from "@/components/Speakers";
import { Sponsors } from "@/components/Sponsors";
import { Tickets } from "@/components/Tickets";
import { Volunteers } from "@/components/Volunteers";

function Divider() {
  return (
    <div className="shell" aria-hidden>
      <div className="hairline h-px w-full" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
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
    </>
  );
}
