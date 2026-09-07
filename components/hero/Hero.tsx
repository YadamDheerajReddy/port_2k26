import { Button } from "@/components/ui/Button";
import { MagneticWrap } from "@/components/ui/MagneticWrap";
import { IntroRevealGroup, IntroRevealItem } from "@/components/intro/IntroReveal";
import { HeroCanvasLoader } from "@/components/three/HeroCanvasLoader";

const PROOF = [
  "TCS Workforce Software Consultant",
  "IEEE-published ML research",
  "Founder, YDR Digital",
  "President, HACK SIST",
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/2 opacity-40"
        style={{ background: "var(--gradient-ember-glow)" }}
      />

      {/*
        Animation_system.md §6: sits behind and to the side, never over the
        text block. Hidden below 1024px (UI_UX_Brief.md §4) rather than
        resized into the text's way. Fixed size reserved up front so
        swapping in the canvas, or falling back to Tier 3, never shifts
        layout (TRD.md §4.3).
      */}
      <div
        aria-hidden
        className="absolute top-1/2 right-[-5%] hidden h-[500px] w-[500px] -translate-y-1/2 opacity-90 lg:block"
      >
        <HeroCanvasLoader />
      </div>

      <IntroRevealGroup className="relative mx-auto w-full max-w-[1440px]">
        <div className="max-w-3xl">
          <IntroRevealItem>
            <p className="text-label-caps font-ui text-label text-[var(--accent-primary)]">
              Full-Stack Developer & Product Builder
            </p>
          </IntroRevealItem>

          <IntroRevealItem>
            <h1 className="font-display text-display-1 mt-4 text-[var(--text-primary)]">
              Full-stack developer who{" "}
              <span className="font-signature italic">ships</span> real products.
            </h1>
          </IntroRevealItem>

          <IntroRevealItem>
            <p className="font-body text-body-lg mt-6 max-w-xl text-[var(--text-secondary)]">
              From AI-powered apps to production client websites, I build things that work
              and put them in front of real users.
            </p>
          </IntroRevealItem>

          <IntroRevealItem className="mt-8 flex flex-wrap gap-4">
            <MagneticWrap>
              <Button href="#work" variant="primary">
                See my work
              </Button>
            </MagneticWrap>
            <MagneticWrap>
              <Button href="#contact" variant="secondary">
                Get in touch
              </Button>
            </MagneticWrap>
          </IntroRevealItem>
        </div>

        <IntroRevealItem className="text-mono mt-20 flex flex-wrap gap-x-8 gap-y-3 border-t border-[var(--border-subtle)] pt-6 font-mono text-[var(--text-secondary)]">
          {PROOF.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </IntroRevealItem>
      </IntroRevealGroup>
    </section>
  );
}
