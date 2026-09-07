import type { AnchorHTMLAttributes } from "react";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: "primary" | "secondary";
};

/** Design_System.md §7. Magnetic hover pull and border-brighten are Phase 2. */
export function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-button px-6 py-3 font-ui text-ui transition-colors duration-[var(--dur-fast)]";
  const variants = {
    primary: "bg-ember text-ink hover:bg-ember-dim",
    secondary:
      "border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-ember",
  };
  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
