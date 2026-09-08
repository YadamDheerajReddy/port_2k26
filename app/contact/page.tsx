import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Dheeraj Reddy",
};

// Placeholder: the Contact section moved off the home page to live here as
// its own route. Design still to come -- app/api/contact/route.ts (the
// Resend-backed submit handler) is untouched and ready for whatever form
// ends up here.
export default function ContactPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <p className="text-mono font-mono text-[var(--text-secondary)]">
        Contact — coming soon.
      </p>
    </main>
  );
}
