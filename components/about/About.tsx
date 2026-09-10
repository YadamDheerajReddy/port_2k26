import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { AboutContent } from "@/components/about/AboutContent";

export function About() {
  return (
    <section
      id="about"
      className="theme-paper bg-[var(--bg-primary)] px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <RevealGroup className="mx-auto max-w-[720px] text-center">
          <RevealItem>
            <SectionLabel as="h2">About</SectionLabel>
          </RevealItem>
          <RevealItem className="mt-10">
            <AboutContent />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
