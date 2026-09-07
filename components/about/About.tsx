import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function About() {
  return (
    <section
      id="about"
      className="theme-paper bg-[var(--bg-primary)] px-6 py-24 md:py-32"
    >
      <RevealGroup className="mx-auto max-w-[1440px]">
        <RevealItem>
          <SectionLabel>About</SectionLabel>
        </RevealItem>

        <RevealItem>
          <p className="font-display text-display-2 mt-6 max-w-4xl text-[var(--text-primary)]">
            I like building things that quietly make someone&apos;s day easier.
          </p>
        </RevealItem>

        <RevealItem className="mt-12 grid gap-8 md:grid-cols-2">
          <p className="font-body text-body-lg text-[var(--text-secondary)]">
            My work spans the full stack, from how data moves in the background to what a
            person sees and clicks on screen. I care about how something works underneath,
            not just how it looks, because that is what keeps it fast and easy to change
            later.
          </p>
          <p className="font-body text-body-lg text-[var(--text-secondary)]">
            The real difference good software makes is time. A slow process turned
            automatic, a confusing step turned obvious, a manual task that no longer needs
            a person. That is what I try to build every time I sit down to code.
          </p>
        </RevealItem>
      </RevealGroup>
    </section>
  );
}
