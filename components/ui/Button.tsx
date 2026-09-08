import type { AnchorHTMLAttributes } from "react";
import Link from "next/link";

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
  const fullClassName = `${base} ${variants[variant]} ${className}`;
  const isExternal = /^https?:\/\//.test(href);
  const isAnchor = href.startsWith("#");

  // Hash anchors go through Locomotive's own data-scroll-to (a real <a>,
  // it needs to intercept the click itself). Internal paths go through
  // Next's Link so the route change runs through the client-side router --
  // a plain <a> would hard-reload, skipping the page-transition animation
  // entirely, not just looking abrupt.
  if (!isExternal && !isAnchor) {
    return (
      <Link href={href} className={fullClassName} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={fullClassName}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(isAnchor ? { "data-scroll-to": true, "data-scroll-to-offset": 100 } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
