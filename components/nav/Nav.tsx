"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { profile } from "@/lib/content";
import { NavMark } from "@/components/nav/NavMark";
import { NavLink } from "@/components/nav/NavLink";
import { ChamferButton } from "@/components/nav/ChamferButton";

// Order matters here: it's page.tsx's actual section order (Hero, About,
// Work, Skills, Process, Contact), used below to resolve ties when more
// than one section is intersecting the trigger band at once. "process" has
// no nav link of its own but still needs to be observed, otherwise the
// scroll spy sees a gap between Skills and Contact where nothing is
// intersecting and just keeps showing whichever link went active last.
const SECTION_IDS = ["top", "about", "work", "skills", "process", "contact"];
const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [activeHref, setActiveHref] = useState<string>("#top");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    // A callback batch only carries entries whose intersection state just
    // changed, not the full current picture, and isn't guaranteed to list
    // them in page order. Taking the first isIntersecting entry in an
    // arbitrary-order batch is what let a section like Work outrank About:
    // whichever one happened to arrive first in that particular batch won,
    // regardless of which was actually on screen. Tracking every currently-
    // intersecting id ourselves and always resolving to the first one in
    // true page order (SECTION_IDS) fixes that regardless of batch order.
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id);
          } else {
            intersecting.delete(entry.target.id);
          }
        }

        const current = SECTION_IDS.find((id) => intersecting.has(id));
        if (current) setActiveHref(`#${current}`);
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header id="site-nav" className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="bg-ink/70 grid w-full max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-6 rounded-full border border-[var(--border-subtle)] px-6 py-3 shadow-[inset_0_1px_0_rgba(247,242,233,0.07)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="col-start-1 flex items-center justify-self-start">
          {/*
            Always rendered: this is the exact element NameIntro measures
            and lands the animated "DR" monogram on -- same letters, same
            font (Clash Display), so the handoff reads as continuous.
          */}
          <a
            id="nav-logo"
            href="#top"
            aria-label="Home"
            className="nav-logo-idle-glow flex items-center"
            data-scroll-to
            data-scroll-to-offset={100}
          >
            <NavMark />
          </a>
        </div>

        {/* grid-cols-[1fr_auto_1fr]: this middle column sizes to its own
            content and sits exactly centered in the bar, unlike the
            previous flex justify-between, which only centered it when the
            logo and resume/CTA sections happened to be the same width.
            col-start-2 is pinned explicitly: a `hidden` sibling is removed
            from grid item generation entirely, so without an explicit
            column, auto-placement shifts the next item (the hamburger)
            into this now-vacant middle slot on mobile instead of column 3. */}
        <div className="col-start-2 hidden items-center gap-8 justify-self-center lg:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={activeHref === link.href}
            />
          ))}
        </div>

        <div className="col-start-3 flex items-center gap-6 justify-self-end">
          <div className="hidden items-center gap-6 lg:flex">
            <div className="h-6 w-px bg-[var(--border-subtle)]" />
            <a
              href={profile.resume}
              download
              className="text-label-caps font-ui text-label text-bone hover:text-paper transition-colors duration-[var(--dur-fast)]"
            >
              Resume
            </a>
            <ChamferButton href="#contact">Get in touch</ChamferButton>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="text-paper flex h-8 w-8 items-center justify-center lg:hidden"
          >
            <span className="relative flex h-3.5 w-4 flex-col justify-between">
              <span
                className={`bg-paper h-px w-full transition-transform duration-200 ${mobileOpen ? "translate-y-[6.5px] rotate-45" : ""}`}
              />
              <span
                className={`bg-paper h-px w-full transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`bg-paper h-px w-full transition-transform duration-200 ${mobileOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-ink/75 absolute top-20 right-4 left-4 flex flex-col gap-1 rounded-2xl border border-[var(--border-subtle)] p-3 shadow-[inset_0_1px_0_rgba(247,242,233,0.07)] backdrop-blur-2xl backdrop-saturate-150 lg:hidden"
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                data-scroll-to
                data-scroll-to-offset={100}
                className={`text-label-caps font-ui text-label rounded-xl px-4 py-3 transition-colors duration-[var(--dur-fast)] ${
                  activeHref === link.href
                    ? "bg-ember/15 text-[var(--accent-primary)]"
                    : "text-bone hover:text-paper"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-1 flex items-center justify-between border-t border-[var(--border-subtle)] px-4 pt-3">
              <a
                href={profile.resume}
                download
                className="text-label-caps font-ui text-label text-bone hover:text-paper"
              >
                Resume
              </a>
              <ChamferButton href="#contact">Get in touch</ChamferButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
