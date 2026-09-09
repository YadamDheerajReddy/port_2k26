import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { MinimalContactForm } from "@/components/contact/MinimalContactForm";

// theme-paper matches styles/tokens.css's "breather" convention -- About
// and Contact are the two paper sections that bookend the dark ones.
//
// Everything here shares one left-ragged column instead of centering the
// heading over a left-aligned form -- that mismatch (a centered label
// sitting over left-aligned input text) was the actual "alignment is
// fucked up" bug, not a one-off CSS typo.
export function Contact() {
  return (
    <section
      id="contact"
      className="theme-paper bg-[var(--bg-primary)] px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[640px]">
        <RevealGroup>
          <RevealItem>
            <SectionLabel>Contact</SectionLabel>
          </RevealItem>
          <RevealItem className="mt-6">
            <h2 className="font-display text-display-1 text-[var(--text-primary)]">
              Got something to build?
            </h2>
          </RevealItem>
          <RevealItem className="mt-14">
            <MinimalContactForm />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
