import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { ReducedMotionProvider } from "@/components/providers/ReducedMotionProvider";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollGlow } from "@/components/ui/ScrollGlow";
import { NameIntro } from "@/components/intro/NameIntro";
import { IntroSimple } from "@/components/intro/IntroSimple";
import { Nav } from "@/components/nav/Nav";
import { PersonJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const SITE_URL = "https://dheerajdev.space";
const SITE_NAME = "Dheeraj Reddy";
const SITE_DESCRIPTION =
  "Full-stack developer who ships real products, from AI-powered apps to production client websites. See case studies, skills, and how to get in touch.";

// metadataBase turns every relative URL used below (and in each page's own
// openGraph/alternates) into an absolute one at build time, so a case
// study's `alternates.canonical: "/work/strata-browser"` resolves against
// the real domain instead of shipping a bare path into <link rel="canonical">.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Full-stack developer & product builder`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Dheeraj Reddy",
    "full-stack developer",
    "product builder",
    "web developer portfolio",
    "React developer",
    "Next.js developer",
    "AI applications developer",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Full-stack developer & product builder`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Full-stack developer & product builder`,
    description: SITE_DESCRIPTION,
  },
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
// §2 calls for.
//
// The sessionStorage READ *and* WRITE both happen here, once, rather than
// in IntroProvider's effect -- that used to be split across both places,
// which is exactly what let React 18/19 Strict Mode's dev-only double
// effect invocation corrupt the decision: the first invocation would
// mark the session "seen" and write it, the (simulated unmount +) second
// invocation would then read its own write back and decide the intro
// had already played, skipping it and leaving real content visible with
// no intro at all. window.__introMode below is the single source of
// truth IntroProvider reads from; it never touches sessionStorage itself.
const INTRO_FLASH_GUARD = `
(function() {
  try {
    var seen = sessionStorage.getItem('intro-seen') === '1';
    if (!seen) sessionStorage.setItem('intro-seen', '1');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.__introMode = seen ? 'settled' : (reduced ? 'simple' : 'full');
    if (window.__introMode !== 'settled') {
      document.documentElement.classList.add('intro-pending');
    }
  } catch (e) {
    window.__introMode = 'settled';
  }
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
        <PersonJsonLd />
        <ReducedMotionProvider>
          <IntroProvider>
            <SmoothScrollProvider />
            <ScrollGlow />
            <CustomCursor />
            <NameIntro />
            <IntroSimple />
            <a
              href="#top"
              className="focus:rounded-button focus:bg-ember focus:text-ink sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2"
            >
              Skip to content
            </a>
            <Nav />
            <div id="site-shell">{children}</div>
          </IntroProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
