import { Button } from "@/components/ui/Button";
import { MagneticWrap } from "@/components/ui/MagneticWrap";
import { IntroRevealGroup, IntroRevealItem } from "@/components/intro/IntroReveal";

const PROOF = [
  "TCS Workforce Software Consultant",
  "IEEE-published ML research",
  "Founder, YDR Digital",
  "President, HACK SIST",
];

/**
 * Big, bold typography, minimal: no 3D, no competing visual, the headline
 * itself carries the hero. Design_System.md §1 "clarity before spectacle"
 * pushed further than the previous version, restraint as the whole idea
 * rather than restraint alongside a 3D centerpiece.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center px-6 pt-24"
    >
      <IntroRevealGroup className="relative mx-auto w-full max-w-[1440px]">
        <IntroRevealItem>
          <p className="text-label-caps font-ui text-label text-[var(--accent-primary)]">
            Full-Stack Developer & Product Builder
          </p>
        </IntroRevealItem>

        <IntroRevealItem>
          <h1 className="font-display mt-6 max-w-5xl text-[clamp(2.75rem,8vw,7.5rem)] leading-[0.95] tracking-[-0.02em] text-[var(--text-primary)]">
            Full-stack developer who{" "}
            <span className="font-signature text-[var(--accent-primary)] italic">
              ships
            </span>{" "}
            real products.
          </h1>
        </IntroRevealItem>

        <IntroRevealItem>
          <p className="font-body text-body-lg mt-8 max-w-lg text-[var(--text-secondary)]">
            From AI-powered apps to production client websites, I build things that work
            and put them in front of real users.
          </p>
        </IntroRevealItem>

        <IntroRevealItem className="mt-10 flex flex-wrap gap-4">
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

        <IntroRevealItem className="text-mono mt-24 flex flex-wrap gap-x-8 gap-y-3 border-t border-[var(--border-subtle)] pt-6 font-mono text-[var(--text-secondary)]">
          {PROOF.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </IntroRevealItem>
      </IntroRevealGroup>
    </section>
  );
}
