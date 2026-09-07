import { Nav } from "@/components/nav/Nav";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Work } from "@/components/work/Work";
import { Skills } from "@/components/skills/Skills";
import { Process } from "@/components/process/Process";
import { Contact } from "@/components/contact/Contact";

export default function Home() {
  return (
    <>
      <a
        href="#top"
        className="focus:rounded-button focus:bg-ember focus:text-ink sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <About />
        <Work />
        <Skills />
        <Process />
        <Contact />
      </main>
    </>
  );
}
