import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { ReducedMotionProvider } from "@/components/providers/ReducedMotionProvider";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NameIntro } from "@/components/intro/NameIntro";
import { IntroSimple } from "@/components/intro/IntroSimple";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dheeraj Reddy | Full-stack developer & product builder",
  description:
    "Full-stack developer who ships real products, from AI-powered apps to production client websites.",
};

// Deliberately a raw <script> tag below, not next/script: next/script's
// beforeInteractive strategy serializes this as data for Next's own
// runtime to execute once it loads, which isn't the same guarantee as the
// browser's HTML parser genuinely blocking on it. A plain inline script
// tag executes synchronously as the parser reaches it, before any content
// after it paints, that's the actual mechanism dark-mode-flash-prevention
// libraries (next-themes and similar) depend on, and what's needed here:
// without it, real content is visible for however long hydration takes
// before IntroProvider's own effect hides it, on a slow connection that's
// a very noticeable flash, not the instant ink-fill Animation_system.md
// §2 calls for. Mirrors IntroProvider's own decision logic exactly, so
// the two never disagree about whether the intro should play.
const INTRO_FLASH_GUARD = `
(function() {
  try {
    var seen = sessionStorage.getItem('intro-seen') === '1';
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!seen && !reduced) {
      document.documentElement.classList.add('intro-pending');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: INTRO_FLASH_GUARD below mutates this
    // element's classList before React hydrates, which otherwise trips a
    // hydration-mismatch warning on every fresh-session load, the same
    // reason next-themes and similar libraries need this on <html> too.
    // Scoped to this element only, doesn't hide mismatches anywhere else.
    //
    // No manual <head> here: metadata above already generates one, and a
    // hand-written <head> alongside it risks Next reconciling its injected
    // tags against ours differently on the server vs the client. The guard
    // script runs just as early as the first thing in <body> instead.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="font-body antialiased">
        <script dangerouslySetInnerHTML={{ __html: INTRO_FLASH_GUARD }} />
        <ReducedMotionProvider>
          <IntroProvider>
            <SmoothScrollProvider />
            <CustomCursor />
            <NameIntro />
            <IntroSimple />
            <div id="site-shell">{children}</div>
          </IntroProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
