"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded-button border border-[var(--border-subtle)] bg-transparent px-4 py-3 font-body text-body text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(json.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("sent");
      form.reset();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="font-body text-body-lg text-[var(--text-primary)]">
        Thanks, your message is on its way. I&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Honeypot, hidden from real visitors */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px]"
      />

      <input
        type="text"
        name="name"
        placeholder="Your name"
        required
        minLength={2}
        className={inputClass}
      />
      <input
        type="email"
        name="email"
        placeholder="Your email"
        required
        className={inputClass}
      />
      <textarea
        name="message"
        placeholder="What are you building?"
        required
        minLength={10}
        rows={5}
        className={inputClass}
      />

      {status === "error" ? (
        <p className="font-body text-body text-ember">{errorMessage}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-button bg-ember font-ui text-ui text-ink hover:bg-ember-dim inline-flex items-center justify-center px-6 py-3 transition-colors duration-[var(--dur-fast)] disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
