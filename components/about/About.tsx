import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const LINES = ["I like building things", "that quietly make", "someone's day easier."];

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
        </RevealGroup>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_320px] lg:items-end">
          <RevealGroup stagger={0.15}>
            {LINES.map((line) => (
              <RevealItem key={line}>
                <p className="font-display text-display-1 text-[var(--text-primary)]">
                  {line}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealGroup className="flex flex-col gap-6 border-l border-[var(--border-subtle)] pl-6 lg:pb-2">
            <RevealItem>
              <p className="font-body text-body text-[var(--text-secondary)]">
                My work spans the full stack, from how data moves in the background to
                what a person sees and clicks on screen. I care about how something works
                underneath, not just how it looks, because that is what keeps it fast and
                easy to change later.
              </p>
            </RevealItem>
            <RevealItem>
              <p className="font-body text-body text-[var(--text-secondary)]">
                The real difference good software makes is time. A slow process turned
                automatic, a confusing step turned obvious, a manual task that no longer
                needs a person. That is what I try to build every time I sit down to code.
              </p>
            </RevealItem>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
