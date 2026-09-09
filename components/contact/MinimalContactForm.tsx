"use client";

import { useState } from "react";
import { profile } from "@/lib/content";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "sent";

/**
 * Selected concept: "Minimal Editorial." No card, no simulated device --
 * three lines in the same display type as the rest of the site, sitting
 * directly on the page, and a text link instead of a button. Deliberately
 * plain: after building (and un-building) a much busier receipt-tear
 * concept, the brief that stuck was "stop performing the sending."
 */
export function MinimalContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot, never shown to real visitors

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function validate() {
    if (name.trim().length < 2) return "Your name needs at least 2 characters.";
    if (!EMAIL_RE.test(email)) return "That email address doesn't look right.";
    if (message.trim().length < 10)
      return "A few more words would help -- at least 10 characters.";
    if (message.length > 5000)
      return "That message is a little long -- keep it under 5000 characters.";
    return null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "sending") return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const json = await res.json().catch(() => ({}) as { error?: string });

      if (!res.ok) {
        setStatus("idle");
        setError(
          json.error ??
            "Could not send your message right now. Please try again shortly.",
        );
        return;
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("idle");
      setError("Could not reach the server. Check your connection and try again.");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="mb-7">
          <label
            htmlFor="contact-name"
            className="text-label-caps font-ui text-label mb-2.5 block text-[var(--text-secondary)]"
          >
            Name
          </label>
          <input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === "sending"}
            placeholder="Your name"
            className="font-display focus:border-ember-dim w-full border-b border-[var(--border-subtle)] bg-transparent pb-2 text-[28px] leading-tight text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] outline-none disabled:opacity-50 md:text-[36px]"
          />
        </div>

        <div className="mb-7">
          <label
            htmlFor="contact-email"
            className="text-label-caps font-ui text-label mb-2.5 block text-[var(--text-secondary)]"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "sending"}
            placeholder="you@example.com"
            className="font-display focus:border-ember-dim w-full border-b border-[var(--border-subtle)] bg-transparent pb-2 text-[28px] leading-tight text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] outline-none disabled:opacity-50 md:text-[36px]"
          />
        </div>

        <div className="mb-9">
          <label
            htmlFor="contact-message"
            className="text-label-caps font-ui text-label mb-2.5 block text-[var(--text-secondary)]"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === "sending"}
            placeholder="What are you building?"
            className="font-display focus:border-ember-dim w-full resize-none border-b border-[var(--border-subtle)] bg-transparent pb-2 text-[28px] leading-tight text-[var(--text-primary)] transition-colors duration-[var(--dur-fast)] outline-none disabled:opacity-50 md:text-[36px]"
          />
        </div>

        {error ? (
          <p role="alert" className="font-ui text-ui text-rust mb-4">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "sending"}
          className="font-display group text-ember-dim hover:text-ember mt-2 inline-flex items-center gap-3 text-[26px] transition-colors duration-[var(--dur-fast)] disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send it"}
          <svg
            width="24"
            height="16"
            viewBox="0 0 20 14"
            fill="none"
            className="transition-transform duration-300 ease-[var(--ease-signature)] group-hover:translate-x-2"
          >
            <path
              d="M1 7H19M19 7L13 1M19 7L13 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <p
          role="status"
          className={`font-body text-body mt-3 text-[var(--text-secondary)] transition-opacity duration-300 ${
            status === "sent" ? "opacity-100" : "opacity-0"
          }`}
        >
          Got it -- I&apos;ll reply soon.
        </p>
      </form>

      <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-[var(--border-subtle)] pt-8">
        <a
          href={`mailto:${profile.email}`}
          className="text-label-caps font-ui text-label hover:text-ember-dim text-[var(--text-secondary)] transition-colors duration-[var(--dur-fast)]"
        >
          Email
        </a>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-label-caps font-ui text-label hover:text-ember-dim text-[var(--text-secondary)] transition-colors duration-[var(--dur-fast)]"
        >
          GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-label-caps font-ui text-label hover:text-ember-dim text-[var(--text-secondary)] transition-colors duration-[var(--dur-fast)]"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
