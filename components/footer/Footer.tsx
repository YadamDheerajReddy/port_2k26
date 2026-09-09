import { profile } from "@/lib/content";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { FooterSignature } from "@/components/footer/FooterSignature";
import { FooterLink } from "@/components/footer/FooterLink";
import { FooterBounce } from "@/components/footer/FooterBounce";

/**
 * Selected concept: "Giant Sign-off." Hero opens the page at full volume
 * (Hero.tsx); this closes it the same size with a line that only makes
 * sense to someone who's actually run this site locally. Dark ink
 * background is deliberate too -- About and Contact are the two paper
 * "breather" sections per Design_System.md's convention, everything else
 * (including this) stays on the default dark tokens, so the page ends on
 * the same register it opened on.
 */
export function Footer() {
  return (
    <FooterBounce>
      <div className="mx-auto max-w-[1440px]">
        <RevealGroup>
          <RevealItem>
            <FooterSignature />
          </RevealItem>
          <RevealItem className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-6 border-t border-[var(--border-subtle)] pt-6">
              <div className="flex flex-wrap gap-6">
                <FooterLink href={`mailto:${profile.email}`}>Email</FooterLink>
                <FooterLink
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </FooterLink>
                <FooterLink
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </FooterLink>
                <FooterLink href={profile.resume} download>
                  Resume
                </FooterLink>
              </div>
              <p className="text-graphite font-mono text-[11px]">
                &copy; {new Date().getFullYear()} Dheeraj Reddy
              </p>
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </FooterBounce>
  );
}
