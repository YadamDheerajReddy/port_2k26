import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

// Placeholder: real form (Resend-backed, app/api/contact/route.ts is
// untouched and ready) still to be designed. theme-paper matches
// styles/tokens.css's "breather" convention -- About and Contact are the
// two paper sections that bookend the dark ones.
export function Contact() {
  return (
    <section
      id="contact"
      className="theme-paper bg-[var(--bg-primary)] px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px] text-center">
        <RevealGroup>
          <RevealItem>
            <SectionLabel>Contact</SectionLabel>
          </RevealItem>
          <RevealItem className="mt-6">
            <p className="text-mono font-mono text-[var(--text-secondary)]">
              Coming soon.
            </p>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
