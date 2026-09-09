import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Work } from "@/components/work/Work";
import { Skills } from "@/components/skills/Skills";
import { Process } from "@/components/process/Process";
import { Contact } from "@/components/contact/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Skills />
      <Process />
      <Contact />
    </main>
  );
}
