import Image from "next/image";
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
 * Single h1 (line-broken, not two separate headings, TRD.md §8's
 * single-H1 rule) with the portrait absolutely centered over its
 * midpoint: with two equal-height lines that midpoint falls exactly on
 * the boundary between "Dheeraj" and "Reddy". Transparent-background
 * cutout, so the letterforms show through around the silhouette rather
 * than behind a hard rectangle. Tagline overlaid on the photo itself.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24"
    >
      <IntroRevealGroup className="relative flex w-full max-w-4xl flex-col items-center text-center">
        <IntroRevealItem className="relative flex w-full flex-col items-center pb-36">
          <h1
            aria-label="Dheeraj Reddy"
            className="font-display text-[clamp(3rem,13vw,10rem)] leading-[0.82] tracking-[-0.02em] text-[var(--text-primary)] uppercase select-none"
          >
            {/* aria-label above carries the accessible name: the <br/> between
                these collapses to no space in the text content otherwise
                ("DheerajReddy" run together for screen readers). */}
            <span aria-hidden="true">
              Dheeraj
              <br />
              Reddy
            </span>
          </h1>

          {/*
            Photo width and h1 font-size each clamp independently (different
            vw coefficients and floors), so their heights don't scale in
            proportion to each other. Rather than chase an exact match, the
            wrapper above reserves a flat pb-36, generous enough to clear the
            photo's overflow past the h1's bottom edge at every width from
            mobile floor to desktop max (measured directly via
            getBoundingClientRect at both extremes, not just calculated).
          */}
          <div className="absolute top-1/2 left-1/2 z-10 w-[clamp(180px,24vw,320px)] -translate-x-1/2 -translate-y-1/2">
            <Image
              src="/images/me.png"
              alt="Dheeraj Reddy"
              width={1145}
              height={1374}
              priority
              className="h-auto w-full"
            />
            <p className="font-body absolute inset-x-4 bottom-2 text-xs text-[var(--text-secondary)] opacity-90 sm:inset-x-6 sm:bottom-[10%] sm:text-base">
              A full-stack developer crafting elegant solutions to complex problems.
            </p>
          </div>
        </IntroRevealItem>

        <IntroRevealItem className="flex flex-wrap justify-center gap-4">
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

        <IntroRevealItem className="text-mono mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-[var(--border-subtle)] pt-6 font-mono text-[var(--text-secondary)]">
          {PROOF.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </IntroRevealItem>
      </IntroRevealGroup>
    </section>
  );
}
