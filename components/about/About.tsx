import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { AnnotatedParagraph } from "@/components/about/AnnotatedParagraph";

export function About() {
  return (
    <section
      id="about"
      className="theme-paper bg-[var(--bg-primary)] px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <RevealGroup>
          <RevealItem>
            <SectionLabel>About</SectionLabel>
          </RevealItem>
          <RevealItem className="mt-10">
            <AnnotatedParagraph />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
