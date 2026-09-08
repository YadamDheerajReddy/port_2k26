import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Work } from "@/components/work/Work";
import { Process } from "@/components/process/Process";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Work />
      <Process />
    </main>
  );
}
