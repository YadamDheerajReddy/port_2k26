"use client";

import { useState } from "react";
import { profile } from "@/lib/content";
import { Button } from "@/components/ui/Button";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-ink/80 fixed inset-x-0 top-0 z-50 border-b border-[var(--border-subtle)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
        <a href="#top" className="font-signature text-paper text-2xl italic">
          D
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-ui text-ui text-[var(--text-secondary)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--text-primary)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={profile.resume}
            download
            className="font-ui text-ui text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Resume
          </a>
          <Button href="#contact" variant="primary" className="!px-4 !py-2">
            Get in touch
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-[var(--text-primary)] md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav className="bg-ink flex flex-col gap-6 border-t border-[var(--border-subtle)] px-6 py-8 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-display-3 text-[var(--text-primary)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href={profile.resume}
            download
            className="font-ui text-ui text-[var(--text-secondary)]"
          >
            Download resume
          </a>
        </nav>
      ) : null}
    </header>
  );
}
